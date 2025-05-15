function showTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(tab => tab.style.display = "none");
  document.getElementById(tabId).style.display = "block";

  document.querySelectorAll(".tab-buttons button").forEach(btn => btn.classList.remove("active"));
  document.querySelector(`.tab-buttons button[onclick="showTab('${tabId}')"]`).classList.add("active");
}

function convertCode() {
  const code = document.getElementById("js-input").value;

  fetch('http://localhost:3000/tokenize', {
    method: 'POST',
    headers: { "Content-Type": 'application/json' },
    body: JSON.stringify({ code })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // fixed template literal here
        const tokenOutput = data.tokens
          .map(tok => `${tok.type}: '${tok.value}'`)
          .join("<br>");
        document.getElementById("token").innerHTML = tokenOutput;
      } else {
        document.getElementById("token").innerHTML = "Error: " + data.error;
      }
      showTab("token");   // always call this after the fetch
    })
    .catch(error => {
      console.error("Error:", error);
      document.getElementById("token").innerHTML = "Request failed.";
      showTab("token");   // ensure the user sees the error pane
    });
}


function clearEditors() {
  document.getElementById("js-input").value = "";
  document.querySelectorAll(".tab-content").forEach(tab => tab.innerHTML = "");
}

function copyOutput() {
  const activeTab = document.querySelector(".tab-content:not([style*='display: none'])");
  const text = activeTab.textContent || activeTab.innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert("Output copied to clipboard!");
  });
}

function downloadOutput() {
  const activeTab = document.querySelector(".tab-content:not([style*='display: none'])");
  const text = activeTab.textContent || activeTab.innerText;
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "output.txt";
  a.click();
  URL.revokeObjectURL(url);
}