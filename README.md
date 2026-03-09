# neverlost

[![Discord chat](https://img.shields.io/discord/359930650330923008?logo=discord)](https://discord.gg/exPsSYpQfJ?utm_source=catswords)

A universal user tracking tool that can be used across various customer support scenarios.

[English](README.md) | [한국어](README_KO.md)

## Background

Originally implemented in 2020 and ported to Cloudflare Workers in February 2026, it has been expanded into a more versatile and broadly compatible user tracking tool. The following technologies are used:

* Cloudflare Workers (Serverless)
* Cloudflare D1 (Database)
* Cloudflare R2 (Object Storage)

The service is already deployed, so you can test it immediately using the `client.py` file without any additional installation process.

## How to Use

### Installation

Copy the tag below and paste it anywhere inside your HTML document.

```html
<div style="margin: 10px auto; width: 32px; height: 32px; background: url(https://neverlost.catswords.org/marker/anonymous.png) no-repeat;" />
```

The filename without the extension (e.g., `anonymous`) becomes the tracking code.

You may replace it with other tags such as `img` if preferred.

---

### Checking Results

Run the `client.py` file and enter the tracking code (e.g., `anonymous`) to retrieve the results.

```cmd
>python client.py
Enter code (required): anonymous

=== Log Count ===
{
  "ok": true,
  "code": "anonymous",
  "count": 1
}

=== Recent Logs ===
{
  "ok": true,
  "code": "anonymous",
  "limit": 100,
  "offset": 0,
  "count": 1,
  "items": [
    {
      "id": 16,
      "ts_iso": "<deducted>",
      "ts_ms": "<deducted>",
      "method": "GET",
      "url": "https://neverlost.catswords.org/marker/anonymous.png",
      "pathname": "/marker/anonymous.png",
      "code": "anonymous",
      "ext": "png",
      "client_ip": "<deducted>",
      "client_ip_hash": "<deducted>",
      "country": "KR",
      "colo": "NRT",
      "asn": 9318,
      "city": "Seoul",
      "region": "Seoul",
      "timezone": "Asia/Seoul",
      "http_protocol": "HTTP/3",
      "tls_version": "TLSv1.3",
      "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0",
      "accept_language": "ko,en;q=0.9,en-US;q=0.8",
      "referer": null,
      "cf_json": "{\"httpProtocol\":\"HTTP/3\",\"clientAcceptEncoding\":\"gzip, deflate, br\",\"requestPriority\":\"\",\"edgeRequestKeepAliveStatus\":1,\"requestHeaderNames\":{},\"clientTcpRtt\":0,\"colo\":\"NRT\",\"asn\":9318,\"asOrganization\":\"<deducted>\",\"country\":\"KR\",\"isEUCountry\":false,\"city\":\"Seoul\",\"continent\":\"AS\",\"region\":\"Seoul\",\"regionCode\":\"11\",\"timezone\":\"Asia/Seoul\",\"longitude\":\"<deducted>\",\"latitude\":\"<deducted>\",\"postalCode\":\"<deducted>\",\"tlsVersion\":\"TLSv1.3\",\"tlsCipher\":\"AEAD-AES128-GCM-SHA256\",\"tlsClientRandom\":\"RZ6UiO0URug6YOABWyoxmU2Pq7xYrXTrKmoeOy2gT2A=\",\"tlsClientCiphersSha1\":\"3HTt3+R/6BL3zeALJDSq0pR1yOQ=\",\"tlsClientExtensionsSha1\":\"qtcZWa2tbiHlVolyrp1/rLClHAU=\",\"tlsClientExtensionsSha1Le\":\"\",\"tlsClientHelloLength\":\"1755\",\"tlsClientAuth\":{\"certPresented\":\"0\",\"certVerified\":\"NONE\",\"certRevoked\":\"0\",\"certIssuerDN\":\"\",\"certSubjectDN\":\"\",\"certIssuerDNRFC2253\":\"\",\"certSubjectDNRFC2253\":\"\",\"certIssuerDNLegacy\":\"\",\"certSubjectDNLegacy\":\"\",\"certSerial\":\"\",\"certIssuerSerial\":\"\",\"certSKI\":\"\",\"certIssuerSKI\":\"\",\"certFingerprintSHA1\":\"\",\"certFingerprintSHA256\":\"\",\"certNotBefore\":\"\",\"certNotAfter\":\"\"},\"verifiedBotCategory\":\"\"}",
      "upstream_url": "<deducted>",
      "upstream_ok": 1,
      "upstream_status": 200,
      "upstream_error": null
    }
  ]
}
```

## Using It on the blogs

### Using the Custom Widget

You can insert the tracking code using the custom widget.

<img width="1090" height="963" alt="image" src="https://github.com/user-attachments/assets/d4dc5156-6019-4b49-8f3a-7047d7eb55ac" />

---

After installation, a stamp-style image will appear as shown below, allowing you to track the visitor’s real external IP and web browser information.

<img width="234" height="161" alt="image" src="https://github.com/user-attachments/assets/ae0f6262-875a-493f-ab76-c9f6a31120fa" />

## Using It on the forums

### Using the WYSIWYG editor

You can insert the tracking code using the HTML editing feature of the WYSIWYG editor.

<img width="978" height="772" alt="image" src="https://github.com/user-attachments/assets/1fff3b03-527e-4cd6-91ca-1f674e8b5769" />

---

After installation, a stamp-style image will appear as shown below, allowing you to track the visitor’s real external IP and web browser information.

<img width="761" height="159" alt="image" src="https://github.com/user-attachments/assets/dfe30cac-c484-470e-b0c2-c8f70f5261c9" />

## Notes

This content does not involve exploiting any vulnerabilities.
In cases used as examples, the related service providers have confirmed that the behavior is a feature, not a bug.

## Contact
* oss@catswords.re.kr
* https://discord.com/invite/exPsSYpQfJ
