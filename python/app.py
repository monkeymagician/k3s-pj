from flask import Flask, request, jsonify
import sys
import traceback

app = Flask(__name__)

@app.route("/run", methods=["POST"])
def run_code():
    data = request.json
    code = data.get("code")
    test_cases = data.get("test_cases", [])

    results = []

    for idx, tc in enumerate(test_cases):
        local_vars = {}
        try:
            # 실행할 코드 정의
            exec(code, {}, local_vars)

            # test case 입력값 실행
            func_name = tc.get("function")  # 호출할 함수 이름
            func_args = tc.get("input", [])
            expected = tc.get("expected")

            if func_name not in local_vars:
                results.append({
                    "test_case": idx,
                    "status": "error",
                    "message": f"Function {func_name} not defined"
                })
                continue

            output = local_vars[func_name](*func_args)
            status = "pass" if output == expected else "fail"
            results.append({
                "test_case": idx,
                "status": status,
                "output": output,
                "expected": expected
            })
        except Exception:
            results.append({
                "test_case": idx,
                "status": "error",
                "message": traceback.format_exc()
            })

    return jsonify(results)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
