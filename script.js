// --- ЗВУКИ И ГРОМКОСТЬ ---
const audioPay = new Audio('assets/pay.mp3');
audioPay.volume = 1.0; 

const audioSpin = new Audio('assets/spin.mp3');
audioSpin.volume = 0.25; 
audioSpin.loop = false; 

const audioWin = new Audio('assets/win.mp3');
audioWin.volume = 0.35; 

const audioLose = new Audio('assets/lose.mp3');
audioLose.volume = 0.25; 

// --- ПЕРЕМЕННЫЕ И ЭЛЕМЕНТЫ ---
// Берем балик и историю из памяти телефона, если их нет — ставим 0 и пустой список
let currentBalance = parseInt(localStorage.getItem('kaziksBalance')) || 0;
let gameHistory = JSON.parse(localStorage.getItem('kaziksHistory')) ||[];

// Экраны
const depositScreen = document.getElementById('deposit-screen');
const rouletteScreen = document.getElementById('roulette-screen');
const withdrawScreen = document.getElementById('withdraw-screen');

// Депозит
const btnSber = document.getElementById('btn-sber');
const inputSection = document.getElementById('input-section');
const depositAmountInput = document.getElementById('deposit-amount');
const btnPay = document.getElementById('btn-pay');
const loadingText = document.getElementById('loading');
const banksContainer = document.querySelector('.banks-container');

// Рулетка
const balanceDisplay = document.getElementById('balance');
const rouletteResult = document.getElementById('roulette-result');
const btnSpin = document.getElementById('btn-spin');
const btnBack = document.getElementById('btn-back');
const btnWithdraw = document.getElementById('btn-withdraw');

// История
const historyBox = document.getElementById('history-box');
const historyList = document.getElementById('history-list');

// KYC / Камера
const withdrawBalanceDisplay = document.getElementById('withdraw-balance');
const btnStartCam = document.getElementById('btn-start-cam');
const camSection = document.getElementById('cam-section');
const videoStream = document.getElementById('camera-stream');
const kycStatus = document.getElementById('kyc-status');
const kycErrorBox = document.getElementById('kyc-error-box');
const kycErrorText = document.getElementById('kyc-error-text');
const btnRetryKyc = document.getElementById('btn-retry-kyc');
const btnExitKyc = document.getElementById('btn-exit-kyc');
const btnCancelWithdraw = document.getElementById('btn-cancel-withdraw');

let kycTimer = null;
let stream = null;

// --- ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ---
updateBalance();
renderHistory();

// --- ЛОГИКА ИСТОРИИ ---
function addHistoryRecord(amount) {
    gameHistory.unshift(amount); // Добавляем в начало
    if (gameHistory.length > 15) gameHistory.pop(); // Храним только последние 15 круток
    localStorage.setItem('kaziksHistory', JSON.stringify(gameHistory));
    renderHistory();
}

function renderHistory() {
    if (gameHistory.length === 0) {
        historyBox.style.display = 'none';
        return;
    }
    historyBox.style.display = 'block';
    historyList.innerHTML = '';
    
    gameHistory.forEach(val => {
        let div = document.createElement('div');
        div.classList.add('history-item');
        if (val > 0) {
            div.innerHTML = `<span class="hist-win">+${val} ₽</span>`;
        } else if (val < 0) {
            div.innerHTML = `<span class="hist-lose">${val} ₽</span>`;
        } else {
            div.innerHTML = `<span class="hist-zero">0 ₽ (лох)</span>`;
        }
        historyList.appendChild(div);
    });
}

// --- ЛОГИКА ДЕПОЗИТА ---
btnSber.addEventListener('click', () => {
    btnSber.classList.add('selected'); 
    inputSection.style.display = 'block'; 
});

btnPay.addEventListener('click', () => {
    const amount = parseInt(depositAmountInput.value);
    
    if (isNaN(amount) || amount <= 0) {
        alert("Братик, введи нормальную сумму, мы тут не в бирюльки играем!");
        return;
    }

    banksContainer.style.display = 'none';
    inputSection.style.display = 'none';
    loadingText.classList.remove('hidden');

    setTimeout(() => {
        audioPay.currentTime = 0;
        audioPay.play().catch(e => console.log('Звук не сработал:', e));
        
        currentBalance += amount;
        updateBalance();

        depositScreen.classList.remove('active');
        rouletteScreen.classList.remove('hidden');
        rouletteScreen.classList.add('active');

        loadingText.classList.add('hidden');
        banksContainer.style.display = 'flex';
        depositAmountInput.value = '';
        btnSber.classList.remove('selected');
        
    }, 2000);
});

// --- ДИНАМИЧЕСКАЯ МАТЕМАТИКА РУЛЕТКИ ---
function updateBalance() {
    balanceDisplay.innerText = currentBalance;
    localStorage.setItem('kaziksBalance', currentBalance); // Сохраняем балик намертво
}

function getDynamicOutcomes(bal) {
    // Генерим варианты в зависимости от балика
    if (bal <= 0) return [0];
    return[
        Math.round(bal * 0.1),      // +10%
        -Math.round(bal * 0.25),    // -25%
        Math.round(bal * 0.5),      // +50%
        -Math.round(bal * 0.5),     // -50%
        bal,                        // х2 балика (удвоил)
        -bal,                       // СЛИЛ ВСЕ НАХУЙ
        0,                          // Зеро
        Math.round(bal * 1.5),      // Жирный плюс
        -Math.round(bal * 0.1),     // Мелкий минус
        500, -200, 1000             // Парочка случайных статических для массовки
    ];
}

let isSpinning = false;

btnSpin.addEventListener('click', () => {
    if (currentBalance <= 0) {
        alert("Балик по нулям! Закинь лавэ, чтобы крутить дальше.");
        return;
    }
    if (isSpinning) return;
    isSpinning = true;

    audioSpin.currentTime = 0;
    audioSpin.play().catch(e => console.log('Звук не сработал:', e));

    let spins = 0;
    const maxSpins = 78; 
    const spinInterval = 100; 
    
    // Получаем свежий массив вариков под текущий балик
    const outcomes = getDynamicOutcomes(currentBalance);

    const rouletteTimer = setInterval(() => {
        rouletteResult.innerText = outcomes[Math.floor(Math.random() * outcomes.length)];
        rouletteResult.style.color = '#fff';
        spins++;

        if (spins >= maxSpins) {
            clearInterval(rouletteTimer);

            // Финальный бросок тоже из динамического массива (чистый рандом без подкрутки)
            const finalResult = outcomes[Math.floor(Math.random() * outcomes.length)];
            
            rouletteResult.innerText = finalResult > 0 ? `+${finalResult}` : finalResult;

            currentBalance += finalResult;
            if (currentBalance < 0) currentBalance = 0; 
            updateBalance();
            addHistoryRecord(finalResult); // Пишем в историю

            if (finalResult > 0) {
                audioWin.currentTime = 0;
                audioWin.play().catch(e => console.log('Звук не сработал:', e));
                rouletteResult.style.color = '#2ecc71'; 
            } else if (finalResult < 0) {
                audioLose.currentTime = 0;
                audioLose.play().catch(e => console.log('Звук не сработал:', e));
                rouletteResult.style.color = '#e74c3c'; 
            } else {
                rouletteResult.style.color = '#fff'; 
            }

            isSpinning = false;
        }
    }, spinInterval);
});

btnBack.addEventListener('click', () => {
    rouletteScreen.classList.remove('active');
    rouletteScreen.classList.add('hidden');
    depositScreen.classList.remove('hidden');
    depositScreen.classList.add('active');
    inputSection.style.display = 'none'; 
});

// --- ЛОГИКА ВЫВОДА И КАМЕРЫ (KYC) ---

// Издевательские ошибки для дрочилы
const kycErrors =[
    "ОШИБКА: Слишком вяло! Ускорьте темп фрикций!",
    "ОШИБКА: Куда гонишь, сотрешь! Снизьте темп!",
    "ОШИБКА: Амплитуда не по ГОСТу. Работай всей кистью!",
    "ОШИБКА: Не вижу страсти в глазах! Добавь эмоций!",
    "ОШИБКА: Обнаружен пинцетный хват. Возьми нормально!"
];

function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop()); // Вырубаем лампочку камеры
        stream = null;
    }
    clearTimeout(kycTimer);
}

btnWithdraw.addEventListener('click', () => {
    rouletteScreen.classList.remove('active');
    rouletteScreen.classList.add('hidden');
    withdrawScreen.classList.remove('hidden');
    withdrawScreen.classList.add('active');
    
    withdrawBalanceDisplay.innerText = currentBalance;
    camSection.classList.add('hidden');
    btnStartCam.style.display = 'inline-block';
});

// Начать "верификацию" (запрашиваем камеру)
btnStartCam.addEventListener('click', async () => {
    try {
        // Просим фронталку
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        videoStream.srcObject = stream;
        
        btnStartCam.style.display = 'none';
        camSection.classList.remove('hidden');
        startFakeKycAnalysis();
    } catch (err) {
        alert("Братик, разреши доступ к камере! Иначе мы не поверим, что ты дрочишь!");
    }
});

function startFakeKycAnalysis() {
    kycErrorBox.classList.add('hidden');
    kycStatus.innerText = "Сканирование биометрии... ⏳";
    kycStatus.classList.remove('hidden');
    
    // Через 5 секунд выдаем пиздец
    kycTimer = setTimeout(() => {
        kycStatus.classList.add('hidden');
        // Выбираем рандомную фразу
        kycErrorText.innerText = kycErrors[Math.floor(Math.random() * kycErrors.length)];
        kycErrorBox.classList.remove('hidden');
    }, 5000);
}

btnRetryKyc.addEventListener('click', () => {
    startFakeKycAnalysis(); // Перезапускаем таймер страха
});

// Кнопка "Выход" из-под камеры
btnExitKyc.addEventListener('click', () => {
    stopCamera();
    withdrawScreen.classList.remove('active');
    withdrawScreen.classList.add('hidden');
    rouletteScreen.classList.remove('hidden');
    rouletteScreen.classList.add('active');
});

// Кнопка возврата в казик (нижняя)
btnCancelWithdraw.addEventListener('click', () => {
    stopCamera();
    withdrawScreen.classList.remove('active');
    withdrawScreen.classList.add('hidden');
    rouletteScreen.classList.remove('hidden');
    rouletteScreen.classList.add('active');
});