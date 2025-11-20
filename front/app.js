function initEditor() {
    const editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/python");

    editor.session.on("change", function(delta) {
        const lineCount = editor.session.getLength();
        if (lineCount > 1000) {
            // 추가된 입력 되돌림
            editor.session.undo();
            alert("코드는 최대 1000줄까지 입력할 수 있습니다.");
        }
    });

    return editor;
}


// Problem-specific test cases
const TEST_CASES = {
    1: [
      {"function": "main", "input": ["like"], "expected": "I LIKE pcm"},
      {"function": "main", "input": ["likee"], "expected": "I LIKEE pcm"},
      {"function": "main", "input": ["Love"], "expected": "I LOVE pcm"},
      {"function": "main", "input": ["Love2"], "expected": "I LOVE2 pcm"},
      {"function": "main", "input": ["love"], "expected": "I LOVE pcm"}
    ],
    2: [
      {"function": "main", "input": [2, 3], "expected": 5},
      {"function": "main", "input": [10, 5], "expected": 15},
    ],
    3: [
      { "function": "main", "input": ["racecar"], "expected": 1 },
      { "function": "main", "input": ["hello"], "expected": 0 }
    ],
    4: [
      {"function": "main", "input": [[10,9,2,5,3,7,101,18]], "expected": 4},
      {"function": "main", "input": [[0,1,0,3,2,3]], "expected": 4},
      {"function": "main", "input": [[7,7,7,7]], "expected": 1},
      {"function": "main", "input": [[4,10,4,3,8,9]], "expected": 3},
      {"function": "main", "input": [[1,2,3,4,5]], "expected": 5}
    ],
    5: [
      {"function": "main", "input": ["()"], "expected": 1},
      {"function": "main", "input": ["([{}])"], "expected": 1},
      {"function": "main", "input": ["(]"], "expected": 0},
      {"function": "main", "input": ["((()))"], "expected": 1},
      {"function": "main", "input": ["({[)]}"], "expected": 0}
    ],
};


let currentProblem = 1;


function loadProblem(num) {
    currentProblem = num;
    window.editor = initEditor();

    document.getElementById("language-select").addEventListener("change", function () {
        const lang = this.value;
        window.editor.session.setMode(`ace/mode/${lang}`);
    });


    document.getElementById("run-btn").addEventListener("click", async function () {
        const runBtn = document.getElementById("run-btn");
        const code = window.editor.getValue();
        const lang = document.getElementById("language-select").value;

        const resource = lang === "python" ? "/run/python/" : "/run/java/";
        console.log("Backend URL:", resource);

        const payload = {
            code,
            test_cases: TEST_CASES[currentProblem]
        };

        runBtn.disabled = true;
        runBtn.textContent = "Running...";

        try {
            const res = await fetch(resource, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const result = await res.text();
            const testResults = analyzeTestResults(JSON.parse(result));
            const message = `전체 결과: ${testResults.overallStatus} (테스트 케이스: ${testResults.ratio}) ${testResults.errorMessages.length > 0 ? '| 에러: ' + testResults.errorMessages[0] : ''}`;

            document.getElementById("result").textContent = message;
        } catch (error) {
            const message = `에러 발생: ${error.message}`;
            console.error("Error during fetch:", error);
            document.getElementById("result").textContent = message;
        }

        runBtn.disabled = false;
        runBtn.textContent = "Run Code";
    });
}

function analyzeTestResults(resultsList) {
    const totalCount = resultsList.length;
    let passCount = 0;
    let errorMessages = [];
    resultsList.forEach(result => {
        if (result && result.status === 'pass') {
            passCount++;
        } else if (result && result.status === 'error') {
            errorMessages.push(result.message);
        }
    });

    const ratioString = `${passCount}/${totalCount}`;
    const overallStatus = passCount===totalCount ? "성공" : "실패";

    return {
        overallStatus: overallStatus,
        ratio: ratioString,
        errorMessages: errorMessages
    };
}