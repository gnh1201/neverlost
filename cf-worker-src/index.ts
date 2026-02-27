// Universial tracker
// Namhyeon Go <gnh1201@catswords.re.kr>
// https://github.com/gnh1201/neverlost
// 
export interface Env {
  DB?: D1Database;

  IMAGE_URL?: string;
  FONT_URL?: string;
  ARCHIVE_URL?: string;
  DOCUMENT_URL?: string;

  UPSTREAM_TIMEOUT_MS?: string; // default "5000"
  CODE_MAX_LEN?: string;        // default "128"

  LOG_API_KEY?: string;         // Authorization: Bearer <key>

  CACHE_TTL?: string;           // default "3600" (seconds)
}

const IMAGE_EXT = new Set(["png", "jpg", "jpeg", "webp", "gif", "svg", "avif", "ico"]);
const FONT_EXT = new Set(["woff", "woff2", "ttf", "otf", "eot"]);
const ARCHIVE_EXT = new Set(["zip", "7z", "gz", "tar", "tar.gz"]);
const DOC_EXT = new Set(["doc","docx","xls","xlsx","ppt","pptx","hwp","hwpx","pdf","odt","ods","odp"]);

const SCRIPT_EXT = new Set(["js", "mjs"]);
const STYLE_EXT = new Set(["css"]);
const DATA_EXT = new Set(["json", "txt", "xml", "yml"]);

function json(status: number, data: any) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function tooManyRequests(message: string) {
  return json(429, { ok: false, error: "too many requests", message });
}

function requireLogAuth(request: Request, env: Env): Response | null {
  const key = (env.LOG_API_KEY || "").trim();
  if (!key) return null;
  const auth = request.headers.get("authorization") || "";
  if (auth === `Bearer ${key}`) return null;
  return json(401, { ok: false, message: "Unauthorized" });
}

function clampInt(n: number, min: number, max: number, fallback: number) {
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

function normalizeCode(raw: string | null, maxLen: number): string | null {
  if (!raw) return null;
  const v = raw.trim();
  if (!v) return null;
  return v.length > maxLen ? v.slice(0, maxLen) : v;
}

function extractFromPath(pathname: string): { code: string; ext: string } | null {
  const m = pathname.match(/^\/marker\/([^\/]+)\.([a-z0-9\.]+)$/i);
  if (!m) return null;

  let code = m[1];
  try { code = decodeURIComponent(code); } catch {}

  const ext = m[2].toLowerCase();

  if (
    IMAGE_EXT.has(ext) ||
    FONT_EXT.has(ext) ||
    ARCHIVE_EXT.has(ext) ||
    DOC_EXT.has(ext) ||
    SCRIPT_EXT.has(ext) ||
    STYLE_EXT.has(ext) ||
    DATA_EXT.has(ext)
  ) return { code, ext };

  return null;
}

function contentTypeFromExt(ext: string): string {
  switch (ext) {
    case "png": return "image/png";
    case "jpg":
    case "jpeg": return "image/jpeg";
    case "webp": return "image/webp";
    case "gif": return "image/gif";
    case "svg": return "image/svg+xml";
    case "avif": return "image/avif";
    case "ico": return "image/x-icon";

    case "woff": return "font/woff";
    case "woff2": return "font/woff2";
    case "ttf": return "font/ttf";
    case "otf": return "font/otf";
    case "eot": return "application/vnd.ms-fontobject";

    case "zip": return "application/zip";
    case "7z": return "application/x-7z-compressed";
    case "gz": return "application/gzip";
    case "tar": return "application/x-tar";
    case "tar.gz": return "application/gzip";

    case "css": return "text/css; charset=utf-8";
    case "js":
    case "mjs": return "application/javascript; charset=utf-8";
    case "json": return "application/json; charset=utf-8";
    case "txt": return "text/plain; charset=utf-8";
    case "xml": return "application/xml; charset=utf-8";
    case "yml": return "text/yaml; charset=utf-8";

    case "pdf": return "application/pdf";
    case "doc": return "application/msword";
    case "docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "xls": return "application/vnd.ms-excel";
    case "xlsx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "ppt": return "application/vnd.ms-powerpoint";
    case "pptx": return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    case "odt": return "application/vnd.oasis.opendocument.text";
    case "ods": return "application/vnd.oasis.opendocument.spreadsheet";
    case "odp": return "application/vnd.oasis.opendocument.presentation";
    case "hwp": return "application/x-hwp";
    case "hwpx": return "application/vnd.hancom.hwpx";

    default: return "application/octet-stream";
  }
}

function makeHeaders(ext: string): Headers {
  return new Headers({
    "Content-Type": contentTypeFromExt(ext),
    "Cache-Control": "no-store",
    "Pragma": "no-cache",
    "X-Content-Type-Options": "nosniff",
  });
}

function getClientIP(request: Request): string | null {
  return (
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    null
  );
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function ensureSchema(env: Env) {
  if (!env.DB) return;

  try {
    await env.DB.exec(`
      DROP TABLE IF EXISTS access_logs;

      CREATE TABLE access_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,

        ts_iso TEXT NOT NULL,
        ts_ms INTEGER NOT NULL,

        method TEXT NOT NULL,
        url TEXT NOT NULL,
        pathname TEXT,
        code TEXT,
        ext TEXT,

        client_ip TEXT,
        client_ip_hash TEXT,

        country TEXT,
        colo TEXT,
        asn INTEGER,
        city TEXT,
        region TEXT,
        timezone TEXT,
        http_protocol TEXT,
        tls_version TEXT,

        user_agent TEXT,
        accept_language TEXT,
        referer TEXT,

        cf_json TEXT,

        upstream_url TEXT,
        upstream_ok INTEGER,
        upstream_status INTEGER,
        upstream_error TEXT
      );

      CREATE INDEX idx_access_logs_ts_ms ON access_logs(ts_ms);
      CREATE INDEX idx_access_logs_code ON access_logs(code);
      CREATE INDEX idx_access_logs_ext ON access_logs(ext);
    `);
  } catch {
    // ignore
  }
}

function safeHeaderSubset(h: Headers) {
  const pick = (k: string) => h.get(k) || null;
  return {
    "user-agent": pick("user-agent"),
    "accept-language": pick("accept-language"),
    "referer": pick("referer"),
  };
}

async function writeLog(
  env: Env,
  request: Request,
  code: string,
  ext: string,
  upstreamUrl: string | null,
  upstreamOk: number,
  upstreamStatus: number | null,
  upstreamError: string | null
) {
  if (!env.DB) return;

  const now = new Date();
  const tsIso = now.toISOString();
  const tsMs = now.getTime();

  const u = new URL(request.url);
  const cf: any = (request as any).cf || {};
  const h = request.headers;

  const clientIP = getClientIP(request);
  const ipHash = clientIP ? await sha256Hex(clientIP) : null;

  const hdrs = safeHeaderSubset(h);

  try {
    await env.DB.prepare(`
      INSERT INTO access_logs (
        ts_iso, ts_ms,
        method, url, pathname, code, ext,
        client_ip, client_ip_hash,
        country, colo, asn, city, region, timezone,
        http_protocol, tls_version,
        user_agent, accept_language, referer,
        cf_json,
        upstream_url, upstream_ok, upstream_status, upstream_error
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `)
      .bind(
        tsIso, tsMs,
        request.method,
        request.url,
        u.pathname,
        code,
        ext,
        clientIP,
        ipHash,
        cf.country ?? null,
        cf.colo ?? null,
        cf.asn ?? null,
        cf.city ?? null,
        cf.region ?? null,
        cf.timezone ?? null,
        cf.httpProtocol ?? null,
        cf.tlsVersion ?? null,
        hdrs["user-agent"],
        hdrs["accept-language"],
        hdrs["referer"],
        JSON.stringify(cf),
        upstreamUrl,
        upstreamOk,
        upstreamStatus,
        upstreamError
      )
      .run();
  } catch {
    // ignore
  }
}

async function fetchProbe(
  url: string,
  timeoutMs: number,
  cacheTtlSeconds: number
): Promise<{ ok: boolean; status: number | null; error: string | null; res: Response | null }> {
  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort("timeout"), timeoutMs);

    const res = await fetch(url, {
      signal: ac.signal,
      cf: {
        cacheEverything: true,
        cacheTtl: cacheTtlSeconds,
        cacheKey: url,
      },
    });

    clearTimeout(t);
    return { ok: res.ok, status: res.status, error: null, res };
  } catch (e: any) {
    return { ok: false, status: null, error: String(e?.message || e), res: null };
  }
}

function upstreamUrlForExt(env: Env, ext: string): string | null {
  if (IMAGE_EXT.has(ext)) return (env.IMAGE_URL || "").trim() || null;
  if (FONT_EXT.has(ext)) return (env.FONT_URL || "").trim() || null;
  if (ARCHIVE_EXT.has(ext)) return (env.ARCHIVE_URL || "").trim() || null;
  if (DOC_EXT.has(ext)) return (env.DOCUMENT_URL || "").trim() || null;
  return null;
}

function isAlwaysEmptyExt(ext: string): boolean {
  return SCRIPT_EXT.has(ext) || STYLE_EXT.has(ext) || DATA_EXT.has(ext);
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // ===== Log APIs (auth) =====
    if (request.method === "GET" && (url.pathname === "/api/v1/logs/recent" || url.pathname === "/api/v1/logs/count")) {
      const authRes = requireLogAuth(request, env);
      if (authRes) return authRes;

      if (!env.DB) return json(503, { ok: false, message: "DB binding not configured" });

      await ensureSchema(env);

      if (url.pathname === "/api/v1/logs/recent") {
        const limit = clampInt(Number(url.searchParams.get("limit") || "50"), 1, 200, 50);
        const offset = clampInt(Number(url.searchParams.get("offset") || "0"), 0, 1_000_000, 0);
        const maxLen = clampInt(Number(env.CODE_MAX_LEN || "128"), 16, 2048, 128);
        const code = normalizeCode(url.searchParams.get("code"), maxLen);

        let stmt: D1PreparedStatement;
        if (code) {
          stmt = env.DB.prepare(`
            SELECT id, ts_iso, ts_ms, method, url, pathname, code, ext,
                   client_ip, client_ip_hash,
                   country, colo, asn, city, region, timezone,
                   http_protocol, tls_version,
                   user_agent, accept_language, referer,
                   cf_json,
                   upstream_url, upstream_ok, upstream_status, upstream_error
            FROM access_logs
            WHERE code = ?
            ORDER BY id DESC
            LIMIT ? OFFSET ?
          `).bind(code, limit, offset);
        } else {
          stmt = env.DB.prepare(`
            SELECT id, ts_iso, ts_ms, method, url, pathname, code, ext,
                   client_ip, client_ip_hash,
                   country, colo, asn, city, region, timezone,
                   http_protocol, tls_version,
                   user_agent, accept_language, referer,
                   cf_json,
                   upstream_url, upstream_ok, upstream_status, upstream_error
            FROM access_logs
            ORDER BY id DESC
            LIMIT ? OFFSET ?
          `).bind(limit, offset);
        }

        const rows = await stmt.all();
        return json(200, {
          ok: true,
          code: code || null,
          limit,
          offset,
          count: rows.results?.length || 0,
          items: rows.results || [],
        });
      }

      // /api/v1/logs/count
      {
        const maxLen = clampInt(Number(env.CODE_MAX_LEN || "128"), 16, 2048, 128);
        const code = normalizeCode(url.searchParams.get("code"), maxLen);
        if (!code) return json(400, { ok: false, message: "code is required" });

        const r = await env.DB.prepare(`SELECT COUNT(1) AS cnt FROM access_logs WHERE code = ?`)
          .bind(code)
          .first<{ cnt: number }>();

        return json(200, { ok: true, code, count: Number((r as any)?.cnt || 0) });
      }
    }

    // ===== Marker endpoint =====
    if (request.method === "GET" || request.method === "HEAD") {
      const parsed = extractFromPath(url.pathname);
      if (parsed) {
        const maxLen = clampInt(Number(env.CODE_MAX_LEN || "128"), 16, 2048, 128);
        const code = normalizeCode(parsed.code, maxLen);
        if (!code) return new Response("", { status: 200 });

        const ext = parsed.ext;
        const headers = makeHeaders(ext);
        const upstreamUrl = upstreamUrlForExt(env, ext);

        const timeoutMs = clampInt(Number(env.UPSTREAM_TIMEOUT_MS || "5000"), 1000, 60000, 5000);
        const ttl = clampInt(Number(env.CACHE_TTL || "3600"), 60, 86400, 3600);

        // text 계열: 항상 빈 내용 + 로그
        if (isAlwaysEmptyExt(ext)) {
          ctx.waitUntil((async () => {
            await ensureSchema(env);
            await writeLog(env, request, code, ext, upstreamUrl, 1, 200, null);
          })());
          return new Response("", { status: 200, headers });
        }

        // URL 미설정: 반드시 로그 + 429
        if (!upstreamUrl) {
          ctx.waitUntil((async () => {
            await ensureSchema(env);
            await writeLog(env, request, code, ext, null, 0, null, "upstream_url_not_configured");
          })());
          return tooManyRequests("Upstream resource not available");
        }

        // upstream probe (cached) + 반드시 로그
        const probe = await fetchProbe(upstreamUrl, timeoutMs, ttl);

        ctx.waitUntil((async () => {
          await ensureSchema(env);
          await writeLog(
            env,
            request,
            code,
            ext,
            upstreamUrl,
            probe.ok ? 1 : 0,
            probe.status,
            probe.ok ? null : (probe.error || `http_status_${probe.status}`)
          );
        })());

        if (!probe.ok || !probe.res) {
          return tooManyRequests("Upstream temporarily unavailable");
        }

        if (request.method === "HEAD") return new Response(null, { status: 200, headers });
        return new Response(probe.res.body, { status: 200, headers });
      }
    }

    return new Response("", { status: 200 });
  },
} satisfies ExportedHandler<Env>;
