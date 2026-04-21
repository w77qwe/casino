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
let currentBalance = parseInt(localStorage.getItem('kaziksBalance')) || 0;
let gameHistory = JSON.parse(localStorage.getItem('kaziksHistory')) ||[];

// Экраны и Навигация
const topNav = document.getElementById('top-nav');
const tabRoulette = document.getElementById('tab-roulette');
const tabCrash = document.getElementById('tab-crash');
const depositScreen = document.getElementById('deposit-screen');
const rouletteScreen = document.getElementById('roulette-screen');
const crashScreen = document.getElementById('crash-screen');

// Депозит
const bankCards = document.querySelectorAll('.bank-card');
const inputSection = document.getElementById('input-section');
const depositAmountInput = document.getElementById('deposit-amount');
const btnPay = document.getElementById('btn-pay');
const loadingText = document.getElementById('loading');
const banksContainer = document.querySelector('.banks-container');
const bonusAlert = document.getElementById('bonus-alert');
let selectedBank = ''; // Запоминаем, какой банк выбрали

// Общие элементы
const balanceDisplays = document.querySelectorAll('#balance, #crash-balance');
const btnGoDeposits = document.querySelectorAll('.btn-go-deposit');

// Рулетка
const rouletteResult = document.getElementById('roulette-result');
const btnSpin = document.getElementById('btn-spin');

// Краш
const crashMultiplier = document.getElementById('crash-multiplier');
const crashMessage = document.getElementById('crash-message');
const crashBetInput = document.getElementById('crash-bet');
const btnCrashStart = document.getElementById('btn-crash-start');
const btnCrashCashout = document.getElementById('btn-crash-cashout');

// История
const historyBox = document.getElementById('history-box');
const historyList = document.getElementById('history-list');

// Тултипы
const infoIcons = document.querySelectorAll('.info-icon');


// --- ИНИЦИАЛИЗАЦИЯ ---
updateBalance();
renderHistory();

// --- ЛОГИКА ИСТОРИИ ---
function addHistoryRecord(amount, gameName = '') {
    const text = gameName ? `[${gameName}] ` : '';
    gameHistory.unshift({ val: amount, label: text }); 
    if (gameHistory.length > 15) gameHistory.pop(); // Храним 15 штук
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
    
    gameHistory.forEach(item => {
        let div = document.createElement('div');
        div.classList.add('history-item');
        if (item.val > 0) {
            div.innerHTML = `<span>${item.label}</span><span class="hist-win">+${item.val} ₽</span>`;
        } else if (item.val < 0) {
            div.innerHTML = `<span>${item.label}</span><span class="hist-lose">${item.val} ₽</span>`;
        } else {
            div.innerHTML = `<span>${item.label}</span><span class="hist-zero">0 ₽ (лох)</span>`;
        }
        historyList.appendChild(div);
    });
}

function updateBalance() {
    balanceDisplays.forEach(el => el.innerText = currentBalance);
    localStorage.setItem('kaziksBalance', currentBalance);
}

// --- НАВИГАЦИЯ (ВКЛАДКИ) ---
tabRoulette.addEventListener('click', () => {
    if (isSpinning || isCrashing) return; // Блокируем переключение во время игры
    tabCrash.classList.remove('active-tab');
    tabRoulette.classList.add('active-tab');
    crashScreen.classList.remove('active');
    crashScreen.classList.add('hidden');
    rouletteScreen.classList.remove('hidden');
    rouletteScreen.classList.add('active');
});

tabCrash.addEventListener('click', () => {
    if (isSpinning || isCrashing) return;
    tabRoulette.classList.remove('active-tab');
    tabCrash.classList.add('active-tab');
    rouletteScreen.classList.remove('active');
    rouletteScreen.classList.add('hidden');
    crashScreen.classList.remove('hidden');
    crashScreen.classList.add('active');
});

// Кнопки "Депнуть еще"
btnGoDeposits.forEach(btn => {
    btn.addEventListener('click', () => {
        if (isSpinning || isCrashing) return;
        rouletteScreen.classList.remove('active');
        rouletteScreen.classList.add('hidden');
        crashScreen.classList.remove('active');
        crashScreen.classList.add('hidden');
        topNav.classList.add('hidden');
        
        depositScreen.classList.remove('hidden');
        depositScreen.classList.add('active');
        inputSection.style.display = 'none'; 
        bankCards.forEach(b => b.classList.remove('selected'));
    });
});

// --- ЛОГИКА ДЕПОЗИТА ---
bankCards.forEach(card => {
    card.addEventListener('click', () => {
        bankCards.forEach(b => b.classList.remove('selected'));
        card.classList.add('selected');
        selectedBank = card.id;
        
        inputSection.style.display = 'block';
        
        // Врубаем замануху если это наш банк
        if (selectedBank === 'btn-sayokin') {
            bonusAlert.classList.remove('hidden');
        } else {
            bonusAlert.classList.add('hidden');
        }
    });
});

btnPay.addEventListener('click', () => {
    let amount = parseInt(depositAmountInput.value);
    
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
        
        // Накидываем +30% если Сайокин Банк
        if (selectedBank === 'btn-sayokin') {
            amount = Math.round(amount * 1.3);
        }

        currentBalance += amount;
        updateBalance();

        depositScreen.classList.remove('active');
        depositScreen.classList.add('hidden');
        
        // Показываем меню и кидаем на рулетку
        topNav.classList.remove('hidden');
        rouletteScreen.classList.remove('hidden');
        rouletteScreen.classList.add('active');
        tabRoulette.click(); // Форсируем активную вкладку рулетки

        loadingText.classList.add('hidden');
        banksContainer.style.display = 'flex';
        depositAmountInput.value = '';
        
    }, 2000);
});

// --- ЛОГИКА РУЛЕТКИ ---
let isSpinning = false;
function getDynamicOutcomes(bal) {
    if (bal <= 0) return [0];
    return[
        Math.round(bal * 0.1), -Math.round(bal * 0.25), 
        Math.round(bal * 0.5), -Math.round(bal * 0.5), 
        bal, -bal, 0, Math.round(bal * 1.5), 
        -Math.round(bal * 0.1), 500, -200, 1000
    ];
}

btnSpin.addEventListener('click', () => {
    if (currentBalance <= 0) {
        alert("Балик по нулям! Закинь лавэ.");
        return;
    }
    if (isSpinning || isCrashing) return;
    isSpinning = true;

    audioSpin.currentTime = 0;
    audioSpin.play().catch(e => console.log('Звук не сработал:', e));

    let spins = 0;
    const outcomes = getDynamicOutcomes(currentBalance);

    const rouletteTimer = setInterval(() => {
        rouletteResult.innerText = outcomes[Math.floor(Math.random() * outcomes.length)];
        rouletteResult.style.color = '#fff';
        spins++;

        if (spins >= 78) { // 7.8 сек
            clearInterval(rouletteTimer);

            const finalResult = outcomes[Math.floor(Math.random() * outcomes.length)];
            rouletteResult.innerText = finalResult > 0 ? `+${finalResult}` : finalResult;

            currentBalance += finalResult;
            if (currentBalance < 0) currentBalance = 0; 
            updateBalance();
            addHistoryRecord(finalResult, 'Рулетка'); 

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
    }, 100);
});

// --- ЛОГИКА КРАША ---
let isCrashing = false;
let crashTimer = null;
let currentMultiplier = 1.00;
let currentBet = 0;

btnCrashStart.addEventListener('click', () => {
    currentBet = parseInt(crashBetInput.value);
    
    if (isNaN(currentBet) || currentBet <= 0 || currentBet > currentBalance) {
        alert("Эй, введи нормальную ставку! У тебя нет столько бабок.");
        return;
    }
    
    if (isSpinning || isCrashing) return;
    isCrashing = true;

    // Списываем ставку на старте
    currentBalance -= currentBet;
    updateBalance();

    btnCrashStart.classList.add('hidden');
    btnCrashCashout.classList.remove('hidden');
    crashMessage.classList.add('hidden');
    crashMultiplier.style.color = '#fff';
    crashMultiplier.innerText = '1.00x';
    currentMultiplier = 1.00;

    // Подлая математика краша
    let targetCrashPoint = 1.00;
    const r = Math.random();
    if (r < 0.20) targetCrashPoint = 1.00; // 20% шанс слить нахуй прям на старте
    else if (r < 0.60) targetCrashPoint = 1.01 + Math.random() * 1.5; // до 2.5x
    else if (r < 0.85) targetCrashPoint = 2.00 + Math.random() * 5.0; // до 7x
    else targetCrashPoint = 5.00 + Math.random() * 25.0; // до 30x (замануха)

    // Погнали ракету
    crashTimer = setInterval(() => {
        // Скорость роста зависит от величины
        if (currentMultiplier < 3.00) currentMultiplier += 0.01;
        else if (currentMultiplier < 10.00) currentMultiplier += 0.05;
        else currentMultiplier += 0.15;

        // Если долетели до точки краша
        if (currentMultiplier >= targetCrashPoint) {
            currentMultiplier = targetCrashPoint; // фиксируем
            endCrash(false); // Проеб
        } else {
            crashMultiplier.innerText = currentMultiplier.toFixed(2) + 'x';
        }
    }, 50); // каждые 50мс тик
});

btnCrashCashout.addEventListener('click', () => {
    if (!isCrashing) return;
    endCrash(true); // Успел вывести
});

function endCrash(win) {
    clearInterval(crashTimer);
    isCrashing = false;
    
    btnCrashCashout.classList.add('hidden');
    btnCrashStart.classList.remove('hidden');

    crashMultiplier.innerText = currentMultiplier.toFixed(2) + 'x';

    if (win) {
        // Вывел бабки
        const winAmount = Math.round(currentBet * currentMultiplier);
        const pureProfit = winAmount - currentBet;
        currentBalance += winAmount;
        updateBalance();
        addHistoryRecord(pureProfit, 'Краш'); // Пишем только чистый плюс

        crashMultiplier.style.color = '#2ecc71';
        audioWin.currentTime = 0;
        audioWin.play().catch(e => console.log('Звук не сработал:', e));
        
    } else {
        // Ракета взорвалась
        crashMessage.classList.remove('hidden');
        crashMultiplier.style.color = '#e74c3c';
        
        // Пишем минус ставка в историю
        addHistoryRecord(-currentBet, 'Краш'); 
        
        audioLose.currentTime = 0;
        audioLose.play().catch(e => console.log('Звук не сработал:', e));
    }
}

// --- ЛОГИКА ТУЛТИПА НА ТЕЛЕФОНЕ ---
infoIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
        // Убираем у всех, чтобы не висело по 100 подсказок
        infoIcons.forEach(i => { if (i !== icon) i.classList.remove('show-tooltip'); });
        // Тогглим класс на кликнутом
        icon.classList.toggle('show-tooltip');
        // Чтобы клик не срабатывал куда не надо
        e.stopPropagation();
    });
});

// Если кликаем по пустому месту — прячем подсказку
document.addEventListener('click', () => {
    infoIcons.forEach(icon => icon.classList.remove('show-tooltip'));
});
