// Tab switching
function showTab(tab) {
  document.querySelectorAll('.tab-content').forEach(
    el => el.style.display = 'none'
  );
  document.getElementById(tab).style.display = 'block';
  document.querySelectorAll('.tab-buttons button').forEach(
    btn => btn.classList.remove('active')
  );
  document.querySelector(`.tab-buttons button[onclick="showTab('${tab}')"]`).classList.add('active');
}

// Basic JS to Python conversion (expand this for real use)
function convertCode() {
  const jsCode = document.getElementById('js-input').value;
  // Tokenization (very basic)
  document.getElementById('token').textContent = jsCode.split(/\s+/).join('');
  // Syntax analysis (placeholder)
  document.getElementById('syntax').textContent = 'Syntax OK (demo)';
  // AST (placeholder)
  document.getElementById('ast').textContent = '[AST output placeholder]';
  // Simple conversion: replace console.log with print
  let pyCode = jsCode.replace(/console\.log/g, 'print');
  document.getElementById('python').textContent = pyCode;
  showTab('python');
}

// Clear editors
function clearEditors() {
  document.getElementById('js-input').value = '';
  document.querySelectorAll('.tab-content').forEach(
    el => el.textContent = ''
  );
}

// Copy output
function copyOutput() {
  const output = document.getElementById('python').textContent;
  navigator.clipboard.writeText(output);
  alert('Output copied!');
}

// Download output
function downloadOutput() {
  const output = document.getElementById('python').textContent;
  const blob = new Blob([output], {type: 'text/plain'});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'output.py';
  link.click();
}