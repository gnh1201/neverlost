# neverlost

[![Discord chat](https://img.shields.io/discord/359930650330923008?logo=discord)](https://discord.gg/exPsSYpQfJ?utm_source=catswords)

다양한 고객 지원 시나리오에서 사용할 수 있는 범용 이용자 추적 도구

## 배경

2020년 구현을 2026년 2월 Cloudflare Workers로 포팅하면서, 기존보다 더 지원 폭이 큰 범용 이용자 추적 도구로 확장함. 다음과 같은 기술을 사용:

  * Cloudflare Workers (Serverless)
  * Cloudflare D1 (Database)
  * Cloudflare R2 (Object Storage)
  
이미 배포가 된 상태라 `client.py` 파일을 통해 별도의 설치 과정 없이 바로 테스트하실 수 있습니다.

## 사용 방법

### 설치 방법

아래 태그를 HTML 문서 내 임의의 위치에 복사하세요.

```html
<div style="margin: 10px auto; width: 32px; height: 32px; background: url(https://odd-paper-807c.gnh1201.workers.dev/marker/anonymous.png) no-repeat;" />
```

확장자를 제외한 파일 이름(예: anonymous)가 추적 코드가 됩니다.

`img` 등 다른 태그로 대체하여도 됩니다.

### 결과 확인

`client.py` 파일을 실행하고, 추적 코드(예: anonymous)를 입력하여 결과를 조회합니다.

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
      "url": "https://odd-paper-807c.gnh1201.workers.dev/marker/anonymous.png",
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

## 인터넷 블로그에 활용하기

### 사용자 위젯 추가 기능 활용

사용자 위젯 추가 기능 활용하여 추적 코드를 삽입할 수 있습니다.

<img width="1090" height="963" alt="image" src="https://github.com/user-attachments/assets/d4dc5156-6019-4b49-8f3a-7047d7eb55ac" />

---

설치가 완료되면 다음과 같이 우표 이미지가 나오며, 방문자의 실제 외부 IP와 웹 브라우저를 추적할 수 있습니다.

<img width="234" height="161" alt="image" src="https://github.com/user-attachments/assets/ae0f6262-875a-493f-ab76-c9f6a31120fa" />

## 인터넷 카페에 활용하기

### 대문 편집기 (스마트에디터) 활용

대문 편집기 (스마트에디터)의 HTML 편집 기능을 활용하여 추적 코드를 삽입할 수 있습니다.

<img width="978" height="772" alt="image" src="https://github.com/user-attachments/assets/1fff3b03-527e-4cd6-91ca-1f674e8b5769" />

---

설치가 완료되면 다음과 같이 우표 이미지가 나오며, 방문자의 실제 외부 IP와 웹 브라우저를 추적할 수 있습니다.

<img width="761" height="159" alt="image" src="https://github.com/user-attachments/assets/dfe30cac-c484-470e-b0c2-c8f70f5261c9" />

## 참고사항
이 내용은 취약점을 이용하는 내용이 들어있지 않습니다. 일부 예시로 든 경우도 관련 업체에서도 버그가 아닌 기능이라고 답을 받았습니다.

## 문의
* oss@catswords.re.kr
* https://discord.com/invite/exPsSYpQfJ
