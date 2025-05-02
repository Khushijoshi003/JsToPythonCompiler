// Get the form and input elements
const loginForm = document.querySelector("form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

// Handle form submission
loginForm.addEventListener("submit", function(event) {
  // Prevent the default form submission
  event.preventDefault();

  // Clear any previous error messages
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach(message => message.remove());

  // Check if both username and password are filled
  if (usernameInput.value.trim() === "") {
    displayError(usernameInput, "Username is required.");
    return;
  }

  if (passwordInput.value.trim() === "") {
    displayError(passwordInput, "Password is required.");
    return;
  }

  // If everything is valid, you can submit the form (or make an AJAX request)
  // For now, we'll just log the inputs to the console
  console.log("Form Submitted:");
  console.log("Username:", usernameInput.value);
  console.log("Password:", passwordInput.value);

  // Clear the form (optional)
  loginForm.reset();
});

// Function to display error messages
function displayError(inputElement, message) {
  const errorMessage = document.createElement("div");
  errorMessage.classList.add("error-message");
  errorMessage.textContent = message;

  inputElement.classList.add("input-error");
  inputElement.insertAdjacentElement("afterend", errorMessage);
}
