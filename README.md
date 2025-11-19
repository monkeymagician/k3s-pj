## Knative-code-test-tool
쿠버네티스 Knative를 활용한 코딩테스트 임시 구현입니다.

---
## How to use

### knative 환경 설정
1. 쿠버네티스 클러스터 및 Knative 셋팅
2. 테스트 환경:
```
Kubernetes Server Version: v1.30.3
Knative Version: v1.14.0
Istio  Version: v1.28.0
```

### python-code-runner 실행
```
kubectl apply -f python/code-runner.yaml
```
주의: 도커 허브 사용시, 이미지 풀링 제한 걸릴 수 있음.

### kservice 작동 확인
예시:
```
root@master:/k8s/knative/mf# kubectl get ksvc

NAME            URL                                                  LATESTCREATED         LATESTREADY           READY   REASON
py-code-run     http://py-code-run.default.172.16.101.151.nip.io     py-code-run-00001     py-code-run-00001     True    
```
테스트 ( 요청 URL : ksvc URL + /run )
```
root@master:/k8s/knative/mf# curl -X POST http://py-code-run.default.172.16.101.151.nip.io/run \
  -H "Content-Type: application/json" \
  -d '{
        "code": "def add(a, b): return a + b",
        "test_cases": [
          {"function": "add", "input": [2, 3], "expected": 5},
          {"function": "add", "input": [10, 5], "expected": 15}
        ]
      }'

# result
[{"expected":5,"output":5,"status":"pass","test_case":0},{"expected":15,"output":15,"status":"pass","test_case":1}]
```

### Nginx 설정
nginx.conf \
필요시 proxy_pass 수정
```
...
    # -----------------------------
    # Python backend proxy
    # -----------------------------
    location /run/python/ {
        proxy_pass http://py-code-run.default.172.16.101.151.nip.io/run;  # Kubernetes ClusterIP Service 이름, 뒤에 / 붙어있으면 라우팅 안됨 -> python 백엔드 수정 필요
        proxy_http_version 1.1;
        proxy_set_header Host py-code-run.default.172.16.101.151.nip.io;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_connect_timeout 10s;
        proxy_read_timeout 120s;
    }
...
```

Nginx root path 접속 시 사이트 접근 가능