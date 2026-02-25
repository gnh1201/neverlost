import requests
import json
from typing import Optional, Dict, Any


class LogApiClient:
    def __init__(self, base_url: str, token: str, timeout: int = 10):
        self.base_url = base_url.rstrip("/")
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {token}",
            "Accept": "application/json"
        })
        self.timeout = timeout

    def get_recent_logs(
        self,
        limit: int = 50,
        offset: int = 0,
        code: Optional[str] = None
    ) -> Dict[str, Any]:

        url = f"{self.base_url}/api/v1/logs/recent"

        params = {
            "limit": limit,
            "offset": offset
        }

        if code:
            params["code"] = code

        resp = self.session.get(url, params=params, timeout=self.timeout)
        resp.raise_for_status()
        return resp.json()

    def get_log_count(self, code: str) -> Dict[str, Any]:

        url = f"{self.base_url}/api/v1/logs/count"
        params = {"code": code}

        resp = self.session.get(url, params=params, timeout=self.timeout)
        resp.raise_for_status()
        return resp.json()


# ===============================
# 실행부
# ===============================
if __name__ == "__main__":

    BASE_URL = "https://odd-paper-807c.gnh1201.workers.dev"
    TOKEN = "helloworld"

    client = LogApiClient(BASE_URL, TOKEN)

    code = input("Enter code (required): ").strip()

    if not code:
        print("Code is required.")
        exit(1)

    try:
        # 로그 개수
        count = client.get_log_count(code)
        print("\n=== Log Count ===")
        print(json.dumps(count, indent=2, ensure_ascii=False))

        # 최근 로그 (limit=100, offset=0 고정)
        recent = client.get_recent_logs(limit=100, offset=0, code=code)
        print("\n=== Recent Logs ===")
        print(json.dumps(recent, indent=2, ensure_ascii=False))

    except requests.HTTPError as e:
        print("HTTP Error:", e.response.status_code)
        print(e.response.text)

    except Exception as e:
        print("Error:", str(e))