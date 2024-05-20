document.addEventListener('DOMContentLoaded', () => {
  // Wybór języka na podstawie ustawień przeglądarki
  const userLang = navigator.language || navigator.userLanguage;
  const langElements = document.querySelectorAll('[data-lang]');
  
  function setLanguage(lang) {
    langElements.forEach(el => {
      if (el.dataset.lang === lang) {
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    });
  }
  
  if (userLang.startsWith('pl')) {
    setLanguage('pl');
  } else {
    setLanguage('en');
  }

  // Obsługa przycisku upload
  document.getElementById('upload-btn').addEventListener('click', () => {
    document.getElementById('ocr-upload').click();
  });

  // Obsługa wyboru pliku
  document.getElementById('ocr-upload').addEventListener('change', handleFileSelect);
  
  // Obsługa drag and drop
  const dropArea = document.getElementById('drop-area');
  
  dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('drag-over');
  });

  dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('drag-over');
  });

  dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      readFile(files[0]);
    }
  });

  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
      readFile(file);
    }
  }

  function readFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      processImage(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  function processImage(image) {
    const progressBar = document.getElementById('progress-bar');
    const lang = document.getElementById('ocr-lang').value;
    progressBar.style.width = '0%';
    Tesseract.recognize(
      image,
      lang,
      {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            const progress = Math.round(m.progress * 100);
            progressBar.style.width = `${progress}%`;
          }
        },
      }
    ).then(({ data: { text } }) => {
      document.getElementById('ocr-text').value = text;
      progressBar.style.width = '100%';
      showPopup('Konwersja zakończona pomyślnie', 'success');
    }).catch((error) => {
      showPopup('Wystąpił błąd podczas przetwarzania obrazu', 'error');
      console.error(error);
    });
  }

  document.getElementById('ocr-reset').addEventListener('click', () => {
    document.getElementById('ocr-text').value = '';
    document.getElementById('progress-bar').style.width = '0%';
    showPopup('Pole zostało zresetowane', 'success');
  });

  document.getElementById('ocr-copy').addEventListener('click', () => {
    const text = document.getElementById('ocr-text').value;
    navigator.clipboard.writeText(text).then(() => {
      showPopup('Tekst skopiowany do schowka', 'success');
    }).catch(() => {
      showPopup('Nie udało się skopiować tekstu', 'error');
    });
  });

  function showPopup(message, type) {
    const popup = document.getElementById('popup');
    popup.textContent = message;
    popup.className = `popup show ${type}`;
    setTimeout(() => {
      popup.classList.remove('show');
    }, 3000);
  }
});
