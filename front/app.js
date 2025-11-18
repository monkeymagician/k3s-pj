// Simple frontend logic separated into this file
} catch (err) {
appendLog('❌ Network or CORS error: ' + err.message);
showError('Network error or CORS blocked. Check console.');
}
}


function renderResults(results) {
resultArea.innerHTML = '';
const allPass = results.every(r => r.status === 'pass');


const summary = document.createElement('div');
summary.className = 'card ' + (allPass ? 'case-pass' : 'case-fail');
summary.innerHTML = `<strong>${allPass ? 'All tests passed ✅' : 'Some tests failed ❌'}</strong>`;
resultArea.appendChild(summary);


results.forEach((r, idx) => {
const div = document.createElement('div');
div.className = r.status === 'pass' ? 'case-pass' : 'case-fail';
const msg = `
<div style="font-weight:600">Test #${idx + 1}: ${r.status.toUpperCase()}</div>
<div><small>Output:</small> <pre>${safeStringify(r.output)}</pre></div>
<div><small>Expected:</small> <pre>${safeStringify(r.expected)}</pre></div>
${r.message ? `<pre style="color:#b91c1c">Error:\n${escapeHtml(r.message)}</pre>` : ''}
`;
div.innerHTML = msg;
resultArea.appendChild(div);
});
}


function clearResult() {
resultArea.innerHTML = '<div class="placeholder">Running... please wait</div>';
}


function showError(msg) {
resultArea.innerHTML = `<div class="card case-fail"><strong>Error</strong><div>${escapeHtml(msg)}</div></div>`;
}


function appendLog(text) {
const now = new Date().toLocaleTimeString();
logArea.innerHTML = `[${now}] ${escapeHtml(text)}\n` + logArea.innerHTML;
}


function safeStringify(v) {
try { return JSON.stringify(v, null, 2); } catch (e) { return String(v); }
}


function escapeHtml(s){
if(!s) return '';
return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
