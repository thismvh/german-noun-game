const formSuccess = document.getElementById("form-success");
const formError = document.getElementById("form-error");
const form = document.getElementById("noun-form");
const correctAnswersCounter = document.getElementById("correct-answers-counter");

var correctAnswers = new Set();
const maxCorrectAnswers = Object.keys(cases).length;

function onFormSubmit(e) {
  e.preventDefault();
  
  console.log("Form submitted!")
  console.log("correctAnswers: " + correctAnswers.size + " maxCorrect: " + maxCorrectAnswers)

  let formConfirm;
  if(e.target.innerText.toLowerCase() === e.target.getAttribute(CORRECT_GENDER_ATTRIBUTE_NAME)) {
    correctAnswers.add(e.target.id);
    getNextNoun();
    formConfirm = formSuccess;
  } else {
    formConfirm = formError
  }

  // if(correctAnswers.size === maxCorrectAnswers || correctAnswers.size === 1) {
  //   getNextNoun();
  //   formConfirm = formSuccess;
  // } else {
  //   formConfirm = formError
  // }

  formConfirm.classList.remove("display-none");
  setTimeout(() => { formConfirm.classList.add("fade-in") }, 10);
  new Promise((resolve) => {
    setTimeout(() => { formConfirm.classList.remove("fade-in"); resolve() }, 5000)
  }).then(() =>
      setTimeout(() => formConfirm.classList.add("display-none"), 400)
    )
}

// const resetEvent = new Event("reset");
// const inputFields = Object.values(cases)
// inputFields.forEach(field => {
//   field.addEventListener("invalid", setErrorMessage);
//   field.addEventListener("blur", setErrorMessage);
//   field.addEventListener("input", resetErrorMessage);
//   field.addEventListener("reset", resetErrorMessage);
// })

// function resetErrorMessage(event) {
//   let target = event.target;

//   let targetId = target.id;
//   let errorMessageId = targetId + "-error";

//   // Reset error label for accessibility
//   let errorMessage = document.getElementById(errorMessageId);
//   errorMessage.innerHTML = "";

//   target.parentNode.classList.remove("input-error");
//   target.parentNode.classList.remove("input-success");
// }

// function setErrorMessage(event) {
//   event.preventDefault();

//   let target = event.target;
//   let errorMessages = target.dataset;

//   let targetId = target.id;
//   let errorMessageId = targetId + "-error";

//   // Set error label for accessibility
//   let errorMessage = document.getElementById(errorMessageId);

//   if(target.validity.valid) {
//     target.parentNode.classList.remove("input-error");

//     if(target.value !== "") {
//       target.parentNode.classList.add("input-success");
//       correctAnswers.add(target.id)
//     }

//     return;
//   }

//   target.parentNode.classList.add("input-error");
//   if (target.validity.patternMismatch) {
//     errorMessage.innerHTML = errorMessages.mismatch;
//     correctAnswers.delete(target.id)
//   };
// }

form.addEventListener("submit", onFormSubmit)

function getNextNoun() {
    document.body.scrollTop = 0;
    form.reset();
    correctAnswersCounter.textContent = parseInt(correctAnswersCounter.textContent) + correctAnswers.size;
    correctAnswers.clear();
    // inputFields.forEach(field => field.dispatchEvent(resetEvent))
    displayNewNoun();
    return true
}

const passBtns = document.querySelectorAll(".noun-pass");
const submitBtns = document.querySelectorAll(".noun-submit");
passBtns.forEach(btn => btn.addEventListener("click", getNextNoun));
submitBtns.forEach(btn => btn.addEventListener("click", onFormSubmit));

const passBtn = document.querySelector("#random-noun");
passBtn.addEventListener("click", getNextNoun);