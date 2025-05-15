document.querySelector("form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  // Email validation
  const emailPattern = /\S+@\S+\.\S+/;
  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  // Check if password matches
  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  // Password strength check (at least 6 characters for simplicity)
  if (password.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Registration successful! Redirecting to login...");
      window.location.href = "login.html"; // Redirect to login page after successful registration
    } else {
      alert(data.message); // Show any server-side error message
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Something went wrong. Please try again later.");
  }
});
