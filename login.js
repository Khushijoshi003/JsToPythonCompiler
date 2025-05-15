document.querySelector("form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const response = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();

  if (response.ok) {
    alert("Login successful!");
    localStorage.setItem("token", data.token); // Save JWT token
    window.location.href = "compiler.html"; // Redirect to protected page
  } else {
    alert(data.message); // Show error message
  }
});
