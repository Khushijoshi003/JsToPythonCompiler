// Get the form and input elements
const registerForm = document.querySelector("form");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");

// Handle form submission
registerForm.addEventListener("submit", function(event) {
  // Prevent the default form submission
  event.preventDefault();

  // Clear any previous error messages
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach(message => message.remove());

  // Check if all fields are filled
  if (usernameInput.value.trim() === "") {
    displayError(usernameInput, "Username is required.");
    return;
  }

  if (emailInput.value.trim() === "") {
    displayError(emailInput, "Email is required.");
    return;
  }

  if (passwordInput.value.trim() === "") {
    displayError(passwordInput, "Password is required.");
    return;
  }

  if (confirmPasswordInput.value.trim() === "") {
    displayError(confirmPasswordInput, "Please confirm your password.");
    return;
  }

  // Check if password and confirm password match
  if (passwordInput.value !== confirmPasswordInput.value) {
    displayError(confirmPasswordInput, "Passwords do not match.");
    return;
  }

  // If everything is valid, you can submit the form (or make an AJAX request)
  // For now, we'll just log the inputs to the console
  console.log("Form Submitted:");
  console.log("Username:", usernameInput.value);
  console.log("Email:", emailInput.value);
  console.log("Password:", passwordInput.value);

  // Clear the form (optional)
  registerForm.reset();
});

// Function to display error messages
function displayError(inputElement, message) {
  const errorMessage = document.createElement("div");
  errorMessage.classList.add("error-message");
  errorMessage.textContent = message;

  inputElement.classList.add("input-error");
  inputElement.insertAdjacentElement("afterend", errorMessage);
}
