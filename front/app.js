// Hidden backend URLs
function initEditor() {
const editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/python");
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
{ input: "'racecar'", expected: "true" },
{ input: "'hello'", expected: "false" }
]
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
    const code = window.editor.getValue();
    const lang = document.getElementById("language-select").value;


    const resource = lang === "python" ? "/run/python" : "/run/java";
    console.log("Backend URL:", resource);

    const payload = {
    code,
    tests: TEST_CASES[currentProblem]
    };
    try {
      const res = await fetch(resource, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
      });


      const result = await res.text();
      const testResults = analyzeTestResults(JSON.parse(result));
      const message = `전체 결과: ${testResults.overallStatus} (${testResults.ratio})`;

      document.getElementById("result").textContent = message;
    } catch (error) {
      const message = `에러 발생: ${error.message}`;
      console.error("Error during fetch:", error);
      document.getElementById("result").textContent = message;
    }
  });
}

function analyzeTestResults(resultsList) {
    const totalCount = resultsList.length;
    let passCount = 0;

    resultsList.forEach(result => {
        if (result && result.status === 'pass') {
            passCount++;
        }
    });

    const ratioString = `${passCount}/${totalCount}`;
    const overallStatus = passCount===totalCount ? "성공" : "실패";

    return {
        overallStatus: overallStatus,
        ratio: ratioString
    };
}