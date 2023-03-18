document.addEventListener("DOMContentLoaded", () => {
  const fileUpload = document.getElementById("file-upload");
  const fileUploadLabelText = document.querySelector(".label-text");
  const submitButton = document.getElementById("submit");
  const languageSelect = document.getElementById("language");
  const outputTextArea = document.getElementById("output");

  fileUpload.addEventListener("change", () => {
    if (fileUpload.files.length > 0) {
      fileUploadLabelText.textContent = fileUpload.files[0].name;
    } else {
      fileUploadLabelText.textContent = "Załącz plik";
    }
  });

  submitButton.addEventListener("click", async () => {
    if (fileUpload.files.length === 0) {
      alert("Proszę wybrać plik do przetworzenia.");
      return;
    }

    const file = fileUpload.files[0];
    const language = languageSelect.value;

    try {
      submitButton.disabled = true;
      outputTextArea.value = "Przetwarzanie...";

      const result = await Tesseract.recognize(file, language);
      outputTextArea.value = result.data.text;
    } catch (error) {
      alert("Błąd przetwarzania obrazu: " + error.message);
      outputTextArea.value = "";
    } finally {
      submitButton.disabled = false;
    }
  });
});
