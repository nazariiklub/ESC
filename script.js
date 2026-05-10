function renderScoreboard(data, title = "First Semi-Final") {
  const board = document.getElementById("scoreboard");
  board.innerHTML = "";

  let html = `
    <h1 class="title"><span class="first">First</span> Semi-Final</h1>
    
    <div class="name-box">

      <input type="text" id="userName" placeholder="Введіть ваше ім'я" />
    </div>


    <div class="table">
      <div class="header">
        <div></div>
        <div>Country & Song</div>
        <div>Stage 0/12</div>
        <div>Vocal 0/12</div>
        <div>Total 0/12</div>
      </div>

  `;

  data.forEach(item => {
    html += `
      <div class="row">
        <div class="country-cell">
          <span class="heart">❤️</span>
          <span class="song">${item.song}</span>
        </div>
        <div class="stage">
          <input type="number" class="score-input" min="0" max="12" />
        </div>
        <div class="vocal">
          <input type="number" class="score-input" min="0" max="12" />
        </div>
        <div class="total">0</div>
      </div>
    `;
  });

  html += `</div>`;
  board.innerHTML = html;

  addListeners();
}

function addListeners() {
  const rows = document.querySelectorAll('.row');
  
  rows.forEach(row => {
    const stageInput = row.querySelector('.stage input');
    const vocalInput = row.querySelector('.vocal input');
    const totalCell = row.querySelector('.total');

    function validateAndUpdate() {
      let stage = parseInt(stageInput.value) || 0;
      let vocal = parseInt(vocalInput.value) || 0;

      // Жорстке обмеження 0-12
      if (stage > 12) {
        stage = 12;
        stageInput.value = 12;
      }
      if (stage < 0) {
        stage = 0;
        stageInput.value = 0;
      }
      if (vocal > 12) {
        vocal = 12;
        vocalInput.value = 12;
      }
      if (vocal < 0) {
        vocal = 0;
        vocalInput.value = 0;
      }

      // Підрахунок Total
      totalCell.textContent = stage + vocal;
    }

    // Слухаємо зміни
    stageInput.addEventListener('input', validateAndUpdate);
    vocalInput.addEventListener('input', validateAndUpdate);
    stageInput.addEventListener('change', validateAndUpdate);
    vocalInput.addEventListener('change', validateAndUpdate);

    // Заборона вводити не цифри
    stageInput.addEventListener('keypress', (e) => {
      if (!/[0-9]/.test(e.key)) e.preventDefault();
    });
    vocalInput.addEventListener('keypress', (e) => {
      if (!/[0-9]/.test(e.key)) e.preventDefault();
    });
  });
}

// Запуск
document.addEventListener('DOMContentLoaded', () => {
  renderScoreboard(semiFinal1, "First Semi-Final");
});

// === DOWNLOAD PDF — фінальна версія ===
document.getElementById('downloadBtn').addEventListener('click', async () => {
  const app = document.querySelector('.app');

  // Тимчасово готуємо сторінку для скріншоту
  const originalBodyBg = document.body.style.background;
  const originalAppBg = app.style.background;

  try {
    // Примусово ставимо фон
    document.body.style.background = 'linear-gradient(135deg, #2a0066, #d1008f)';
    app.style.background = 'linear-gradient(135deg, #2a0066, #d1008f)';
    app.style.padding = '40px 30px'; // додаємо трохи повітря

    const canvas = await html2canvas(app, {
      scale: 2.2,           // трохи вище якість
      useCORS: true,
      backgroundColor: null,
      logging: false,
      allowTaint: true,
      scrollX: 0,
      scrollY: 0,
      width: app.scrollWidth,
      height: app.scrollHeight
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.93);

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Якщо таблиця дуже висока — масштабуємо
    if (pdfHeight > pdf.internal.pageSize.getHeight()) {
      const ratio = pdf.internal.pageSize.getHeight() / pdfHeight;
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth * ratio, pdfHeight * ratio);
    } else {
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }

    pdf.save(`Eurovision_SemiFinal1.pdf`);

  } catch (error) {
    console.error(error);
    alert("Помилка створення PDF");
  } finally {
    // Повертаємо все назад
    document.body.style.background = originalBodyBg;
    app.style.background = originalAppBg;
    app.style.padding = '30px';
  }
});