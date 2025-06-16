'use strict'

// Enable the submit button when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  const submitButton = document.querySelector("input[type='submit']");
  if (submitButton) {
    submitButton.removeAttribute("disabled");
  }
});
