const CORRECT_CODE = "891314";

const form = document.getElementById("code-form");
const codeInput = document.getElementById("code");
const message = document.getElementById("message");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const enteredCode = codeInput.value.trim();

  if (!/^\d{6}$/.test(enteredCode)) {
    message.textContent = "Gib sechs Ziffern ein, um fortzufahren.";
    return;
  }

  if (enteredCode === CORRECT_CODE) {
    window.location.href = "second.html";
    return;
  }

  message.textContent = "Der Code ist nicht korrekt. Versuche es erneut.";
});
