document.addEventListener("DOMContentLoaded", () => {
  const fileUpload = document.getElementById("file-upload");
  const fileUploadLabelText = document.querySelector(".label-text");
  const submitButton = document.getElementById("submit");
  const languageSelect = document.getElementById("language");
  const outputTextArea = document.getElementById("output");
  const darkmodeToggle = document.getElementById("darkmode-toggle");
  const body = document.body;
  const container = document.querySelector(".container");

  fileUpload.addEventListener("change", () => {
    fileUploadLabelText.innerText = fileUpload.files[0].name;
  });

  submitButton.addEventListener("click", () => {
    performOCR(fileUpload.files[0]);
  });

  darkmodeToggle.addEventListener("change", () => {
    body.classList.toggle("darkmode");
    container.classList.toggle("darkmode");
  });

  const performOCR = (imageFile) => {
    Tesseract.recognize(
      imageFile,
      languageSelect.value,
      { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
      outputTextArea.value = text;
    });
  };
});
