// --- ЗВУКИ И ГРОМКОСТЬ ---
const audioPay = new Audio('assets/pay.mp3'); audioPay.volume = 1.0; 
const audioSpin = new Audio('assets/spin.mp3'); audioSpin.volume = 0.25; audioSpin.loop = false; 
const audioWin = new Audio('assets/win.mp3'); audioWin.volume = 0.35; 
const audioPizdec = new Audio('assets/pizdec.mp3'); audioPizdec.volume = 0.30; 
const audioAhueli = new Audio('assets/you ahueli.mp3'); audioAhueli.volume = 0.20; 
const audioLoh = new Audio('assets/loh.mp3'); audioLoh.volume = 0.35;
const audioCaseSpin = new Audio('assets/go-new-gambling.mp3'); audioCaseSpin.volume = 1.0;

// --- ПЕРЕМЕННЫЕ И ЭЛЕМЕНТЫ ---
let currentBalance = parseInt(localStorage.getItem('kaziksBalance')) || 0;
let gameHistory = JSON.parse(localStorage.getItem('kaziksHistory')) ||[];

const topNav = document.getElementById('top-nav');
const tabRoulette = document.getElementById('tab-roulette');
const tabCrash = document.getElementById('tab-crash');
const tabMines = document.getElementById('tab-mines');
const tabCases = document.getElementById('tab-cases');
const depositScreen = document.getElementById('deposit-screen');
const rouletteScreen = document.getElementById('roulette-screen');
const crashScreen = document.getElementById('crash-screen');
const minesScreen = document.getElementById('mines-screen');
const casesScreen = document.getElementById('cases-screen');
const withdrawScreen = document.getElementById('withdraw-screen');
const loanScreen = document.getElementById('loan-screen');

const bankCards = document.querySelectorAll('#deposit-screen .bank-card');
const inputSection = document.getElementById('input-section');
const depositAmountInput = document.getElementById('deposit-amount');
const btnPay = document.getElementById('btn-pay');
const loadingText = document.getElementById('loading');
const banksContainer = document.querySelector('#deposit-screen .banks-container');
const bonusAlert = document.getElementById('bonus-alert');
let selectedBank = ''; 

const btnGoWithdraws = document.querySelectorAll('.btn-go-withdraw');
const withdrawBankCards = document.querySelectorAll('.withdraw-bank');
const withdrawInputSection = document.getElementById('withdraw-input-section');
const withdrawAmountInput = document.getElementById('withdraw-amount');
const btnSubmitWithdraw = document.getElementById('btn-submit-withdraw');
const withdrawLoading = document.getElementById('withdraw-loading');
const withdrawBanksContainer = document.getElementById('withdraw-banks-container');
const btnCancelWithdraw = document.getElementById('btn-cancel-withdraw');
let selectedWithdrawBank = '';

const loanAmountDisplay = document.getElementById('loan-amount-display');
const btnAcceptLoan = document.getElementById('btn-accept-loan');

const balanceDisplays = document.querySelectorAll('.balance-amount');
const btnGoDeposits = document.querySelectorAll('.btn-go-deposit');
const historyBoxes = document.querySelectorAll('.history-box');
const historyLists = document.querySelectorAll('.history-list');

const rouletteResult = document.getElementById('roulette-result');
const btnSpin = document.getElementById('btn-spin');

const crashMultiplier = document.getElementById('crash-multiplier');
const crashMessage = document.getElementById('crash-message');
const crashBetInput = document.getElementById('crash-bet');
const btnCrashStart = document.getElementById('btn-crash-start');
const btnCrashCashout = document.getElementById('btn-crash-cashout');
const rocket = document.getElementById('rocket');

const minesGrid = document.getElementById('mines-grid');
const minesBetInput = document.getElementById('mines-bet');
const minesCountSelect = document.getElementById('mines-count');
const btnMinesStart = document.getElementById('btn-mines-start');
const btnMinesCashout = document.getElementById('btn-mines-cashout');
const minesStatusBar = document.getElementById('mines-status-bar');
const minesMultText = document.getElementById('mines-multiplier-text');

const casesRibbon = document.getElementById('cases-ribbon');
const closedCaseImg = document.getElementById('closed-case-img');
const casesArea = document.getElementById('cases-area');
const casesResult = document.getElementById('cases-result');
const casesBetInput = document.getElementById('cases-bet');
const btnCasesStart = document.getElementById('btn-cases-start');

let isSpinning = false;
let isCrashing = false;
let isMinesPlaying = false;
let isCaseOpening = false;

// --- ИНИЦИАЛИЗАЦИЯ ---
updateBalance();
renderHistory();
initMinesGridEmpty();

// --- ИСТОРИЯ И БАЛАНС ---
function addHistoryRecord(amount, gameName = '') {
    const text = gameName ? `[${gameName}] ` : '';
    gameHistory.unshift({ val: amount, label: text }); 
    if (gameHistory.length > 15) gameHistory.pop(); 
    localStorage.setItem('kaziksHistory', JSON.stringify(gameHistory));
    renderHistory();
}

function renderHistory() {
    if (gameHistory.length === 0) {
        historyBoxes.forEach(box => box.style.display = 'none');
        return;
    }
    historyBoxes.forEach(box => box.style.display = 'block');
    historyLists.forEach(list => {
        list.innerHTML = '';
        gameHistory.forEach(item => {
            let div = document.createElement('div');
            div.classList.add('history-item');
            if (item.val > 0) div.innerHTML = `<span>${item.label}</span><span class="hist-win">+${item.val} ₽</span>`;
            else if (item.val < 0) div.innerHTML = `<span>${item.label}</span><span class="hist-lose">${item.val} ₽</span>`;
            else div.innerHTML = `<span>${item.label}</span><span class="hist-zero">0 ₽ (лох)</span>`;
            list.appendChild(div);
        });
    });
}

function updateBalance() {
    balanceDisplays.forEach(el => el.innerText = currentBalance);
    localStorage.setItem('kaziksBalance', currentBalance);
}

// --- НАВИГАЦИЯ ---
function hideAllScreens() {[depositScreen, rouletteScreen, crashScreen, minesScreen, casesScreen, withdrawScreen, loanScreen].forEach(s => {
        s.classList.remove('active'); s.classList.add('hidden');
    });[tabRoulette, tabCrash, tabMines, tabCases].forEach(t => t.classList.remove('active-tab'));
}

tabRoulette.addEventListener('click', () => {
    if (isSpinning || isCrashing || isMinesPlaying || isCaseOpening) return; 
    hideAllScreens(); tabRoulette.classList.add('active-tab');
    rouletteScreen.classList.remove('hidden'); rouletteScreen.classList.add('active');
});

tabCrash.addEventListener('click', () => {
    if (isSpinning || isCrashing || isMinesPlaying || isCaseOpening) return;
    hideAllScreens(); tabCrash.classList.add('active-tab');
    crashScreen.classList.remove('hidden'); crashScreen.classList.add('active');
});

tabMines.addEventListener('click', () => {
    if (isSpinning || isCrashing || isMinesPlaying || isCaseOpening) return;
    hideAllScreens(); tabMines.classList.add('active-tab');
    minesScreen.classList.remove('hidden'); minesScreen.classList.add('active');
});

tabCases.addEventListener('click', () => {
    if (isSpinning || isCrashing || isMinesPlaying || isCaseOpening) return;
    hideAllScreens(); tabCases.classList.add('active-tab');
    casesScreen.classList.remove('hidden'); casesScreen.classList.add('active');
});

btnGoDeposits.forEach(btn => {
    btn.addEventListener('click', () => {
        if (isSpinning || isCrashing || isMinesPlaying || isCaseOpening) return;
        hideAllScreens(); topNav.classList.add('hidden');
        depositScreen.classList.remove('hidden'); depositScreen.classList.add('active');
        inputSection.style.display = 'none'; bankCards.forEach(b => b.classList.remove('selected'));
    });
});

// --- ДЕПОЗИТ ---
bankCards.forEach(card => {
    card.addEventListener('click', () => {
        bankCards.forEach(b => b.classList.remove('selected'));
        card.classList.add('selected'); selectedBank = card.id;
        inputSection.style.display = 'block';
        if (selectedBank === 'btn-sayokin') bonusAlert.classList.remove('hidden');
        else bonusAlert.classList.add('hidden');
    });
});

btnPay.addEventListener('click', () => {
    let amount = parseInt(depositAmountInput.value);
    if (isNaN(amount) || amount <= 0) { alert("Братик, введи нормальную сумму!"); return; }

    banksContainer.style.display = 'none'; inputSection.style.display = 'none';
    loadingText.classList.remove('hidden');

    setTimeout(() => {
        audioPay.currentTime = 0; audioPay.play().catch(e => console.log(e));
        if (selectedBank === 'btn-sayokin') amount = Math.round(amount * 1.3);
        currentBalance += amount; updateBalance();
        
        hideAllScreens(); topNav.classList.remove('hidden');
        rouletteScreen.classList.remove('hidden'); rouletteScreen.classList.add('active');
        tabRoulette.classList.add('active-tab');
        
        loadingText.classList.add('hidden'); banksContainer.style.display = 'flex'; depositAmountInput.value = '';
    }, 2000);
});

// --- ВЫВОД И КРЕДИТНЫЙ ПРИКОЛ ---
btnGoWithdraws.forEach(btn => {
    btn.addEventListener('click', () => {
        if (isSpinning || isCrashing || isMinesPlaying || isCaseOpening) return;
        if (currentBalance <= 0) { alert("Выводить нехуй, балик по нулям. Иди депай!"); return; }
        
        hideAllScreens(); topNav.classList.add('hidden');
        withdrawScreen.classList.remove('hidden'); withdrawScreen.classList.add('active');
        withdrawInputSection.style.display = 'none'; 
        withdrawBankCards.forEach(b => b.classList.remove('selected'));
    });
});

withdrawBankCards.forEach(card => {
    card.addEventListener('click', () => {
        withdrawBankCards.forEach(b => b.classList.remove('selected'));
        card.classList.add('selected'); selectedWithdrawBank = card.id;
        withdrawInputSection.style.display = 'block';
    });
});

btnCancelWithdraw.addEventListener('click', () => {
    hideAllScreens(); topNav.classList.remove('hidden');
    rouletteScreen.classList.remove('hidden'); rouletteScreen.classList.add('active');
    tabRoulette.classList.add('active-tab');
});

btnSubmitWithdraw.addEventListener('click', () => {
    let amount = parseInt(withdrawAmountInput.value);
    if (isNaN(amount) || amount <= 0 || amount > currentBalance) { alert("Введи нормальную сумму! У тебя столько нет на балике."); return; }

    withdrawBanksContainer.style.display = 'none'; withdrawInputSection.style.display = 'none';
    btnCancelWithdraw.classList.add('hidden'); withdrawLoading.classList.remove('hidden');

    setTimeout(() => {
        currentBalance -= amount; updateBalance(); addHistoryRecord(-amount, 'Вывод');
        audioPay.currentTime = 0; audioPay.play().catch(e => console.log(e));
        
        hideAllScreens();
        loanScreen.classList.remove('hidden'); loanScreen.classList.add('active');
        loanAmountDisplay.innerText = amount; 
        
        withdrawLoading.classList.add('hidden'); withdrawBanksContainer.style.display = 'flex';
        btnCancelWithdraw.classList.remove('hidden'); withdrawAmountInput.value = '';
    }, 2000);
});

btnAcceptLoan.addEventListener('click', () => {
    hideAllScreens(); topNav.classList.remove('hidden');
    rouletteScreen.classList.remove('hidden'); rouletteScreen.classList.add('active');
    tabRoulette.classList.add('active-tab');
});

// --- ЛОГИКА РУЛЕТКИ ---
function getDynamicOutcomes(bal) {
    if (bal <= 0) return [0];
    return[ Math.round(bal * 0.1), -Math.round(bal * 0.25), Math.round(bal * 0.5), -Math.round(bal * 0.5), bal, -bal, 0, Math.round(bal * 1.5), -Math.round(bal * 0.1), 500, -200, 1000 ];
}

btnSpin.addEventListener('click', () => {
    if (currentBalance <= 0) { audioAhueli.currentTime = 0; audioAhueli.play(); alert("Балик по нулям! Закинь лавэ."); return; }
    if (isSpinning || isCrashing || isMinesPlaying || isCaseOpening) return;
    isSpinning = true; audioSpin.currentTime = 0; audioSpin.play();

    let spins = 0; const outcomes = getDynamicOutcomes(currentBalance);
    const rouletteTimer = setInterval(() => {
        rouletteResult.innerText = outcomes[Math.floor(Math.random() * outcomes.length)]; rouletteResult.style.color = '#fff'; spins++;
        if (spins >= 78) {
            clearInterval(rouletteTimer);
            const finalResult = outcomes[Math.floor(Math.random() * outcomes.length)];
            rouletteResult.innerText = finalResult > 0 ? `+${finalResult}` : finalResult;
            currentBalance += finalResult; if (currentBalance < 0) currentBalance = 0; 
            updateBalance(); addHistoryRecord(finalResult, 'Рулетка'); 
            
            if (finalResult > 0) { 
                audioWin.currentTime = 0; audioWin.play(); 
                rouletteResult.style.color = '#2ecc71'; 
            } else if (finalResult < 0) {
                if (currentBalance <= 0) { audioAhueli.currentTime = 0; audioAhueli.play(); } else { audioPizdec.currentTime = 0; audioPizdec.play(); }
                rouletteResult.style.color = '#e74c3c'; 
            } else { 
                audioLoh.currentTime = 0; audioLoh.play().catch(e=>console.log(e));
                rouletteResult.style.color = '#fff'; 
            }
            isSpinning = false;
        }
    }, 100);
});

// --- ЛОГИКА КРАША ---
btnCrashStart.addEventListener('click', () => {
    if (currentBalance <= 0) { audioAhueli.currentTime = 0; audioAhueli.play(); alert("Балик по нулям! Хули ты тыкаешь, иди депай!"); return; }
    currentBet = parseInt(crashBetInput.value);
    if (isNaN(currentBet) || currentBet <= 0 || currentBet > currentBalance) { alert("Ставка хуйня!"); return; }
    if (isSpinning || isCrashing || isMinesPlaying || isCaseOpening) return;
    
    isCrashing = true; currentBalance -= currentBet; updateBalance();
    btnCrashStart.classList.add('hidden'); btnCrashCashout.classList.remove('hidden');
    crashMessage.classList.add('hidden'); crashMultiplier.style.color = '#fff'; crashMultiplier.innerText = '1.00x'; currentMultiplier = 1.00;

    rocket.classList.remove('rocket-crashed'); rocket.classList.add('rocket-flying');
    rocketX = 10; rocketY = 10; rocket.style.left = rocketX + 'px'; rocket.style.bottom = rocketY + 'px';

    let targetCrashPoint = 1.00; const r = Math.random();
    if (r < 0.20) targetCrashPoint = 1.00; else if (r < 0.60) targetCrashPoint = 1.01 + Math.random() * 1.5; else if (r < 0.85) targetCrashPoint = 2.00 + Math.random() * 5.0; else targetCrashPoint = 5.00 + Math.random() * 20.0; 

    crashTimer = setInterval(() => {
        if (currentMultiplier < 3.00) { currentMultiplier += 0.01; rocketX += 0.8; rocketY += 0.5; }
        else if (currentMultiplier < 10.00) { currentMultiplier += 0.05; rocketX += 1.5; rocketY += 1.0; }
        else { currentMultiplier += 0.15; rocketX += 2; rocketY += 1.5; }

        if (rocketX > 250) rocketX = 250; if (rocketY > 150) rocketY = 150;
        rocket.style.left = rocketX + 'px'; rocket.style.bottom = rocketY + 'px';

        if (currentMultiplier >= targetCrashPoint) { currentMultiplier = targetCrashPoint; endCrash(false); }
        else { crashMultiplier.innerText = currentMultiplier.toFixed(2) + 'x'; }
    }, 50); 
});

btnCrashCashout.addEventListener('click', () => { if (isCrashing) endCrash(true); });

function endCrash(win) {
    clearInterval(crashTimer); isCrashing = false;
    btnCrashCashout.classList.add('hidden'); btnCrashStart.classList.remove('hidden');
    crashMultiplier.innerText = currentMultiplier.toFixed(2) + 'x'; rocket.classList.remove('rocket-flying');

    if (win) {
        const winAmount = Math.round(currentBet * currentMultiplier); const pureProfit = winAmount - currentBet;
        currentBalance += winAmount; updateBalance(); addHistoryRecord(pureProfit, 'Краш'); 
        crashMultiplier.style.color = '#2ecc71'; audioWin.currentTime = 0; audioWin.play();
    } else {
        crashMessage.classList.remove('hidden'); crashMultiplier.style.color = '#e74c3c'; rocket.classList.add('rocket-crashed'); 
        addHistoryRecord(-currentBet, 'Краш'); 
        if (currentBalance <= 0) { audioAhueli.currentTime = 0; audioAhueli.play(); } else { audioPizdec.currentTime = 0; audioPizdec.play(); }
    }
}

// --- ЛОГИКА МИН ---
function initMinesGridEmpty() {
    minesGrid.innerHTML = '';
    for(let i=0; i<25; i++) {
        let cell = document.createElement('div'); cell.classList.add('mine-cell'); minesGrid.appendChild(cell);
    }
}

btnMinesStart.addEventListener('click', () => {
    if (currentBalance <= 0) { audioAhueli.currentTime = 0; audioAhueli.play(); alert("Балик по нулям! Иди депай!"); return; }
    currentMinesBet = parseInt(minesBetInput.value); totalMinesCount = parseInt(minesCountSelect.value);
    if (isNaN(currentMinesBet) || currentMinesBet <= 0 || currentMinesBet > currentBalance) { alert("Ставка хуйня!"); return; }
    if (isSpinning || isCrashing || isMinesPlaying || isCaseOpening) return;
    
    isMinesPlaying = true; currentBalance -= currentMinesBet; updateBalance();
    btnMinesStart.classList.add('hidden'); btnMinesCashout.classList.remove('hidden'); minesStatusBar.classList.remove('hidden');
    
    safeClicksCount = 0; currentMinesMult = 1.00; minesMultText.innerText = '1.00x'; minesMultText.style.color = '#2ecc71';

    minesGridArray = Array(25).fill('💎');
    for(let i=0; i<totalMinesCount; i++) minesGridArray[i] = '💣';
    minesGridArray.sort(() => Math.random() - 0.5);

    minesGrid.innerHTML = '';
    for(let i=0; i<25; i++) {
        let cell = document.createElement('div'); cell.classList.add('mine-cell'); cell.dataset.index = i;
        cell.addEventListener('click', handleMineClick); minesGrid.appendChild(cell);
    }
});

function handleMineClick(e) {
    if (!isMinesPlaying) return; let cell = e.target; if (cell.classList.contains('revealed')) return;
    let index = cell.dataset.index; let item = minesGridArray[index]; cell.classList.add('revealed');

    if (item === '💣') {
        cell.classList.add('boom'); cell.innerText = '💣'; endMinesGame(false);
    } else {
        cell.classList.add('safe'); cell.innerText = '💎'; safeClicksCount++;
        let remainingTotal = 25 - (safeClicksCount - 1); let remainingSafe = (25 - totalMinesCount) - (safeClicksCount - 1);
        currentMinesMult *= (remainingTotal / remainingSafe); minesMultText.innerText = currentMinesMult.toFixed(2) + 'x';
        audioPay.currentTime = 0; audioPay.volume = 0.5; audioPay.play().catch(e=>{});

        if (safeClicksCount === 25 - totalMinesCount) endMinesGame(true);
    }
}

btnMinesCashout.addEventListener('click', () => { if (isMinesPlaying && safeClicksCount > 0) endMinesGame(true); });

function endMinesGame(win) {
    isMinesPlaying = false; btnMinesCashout.classList.add('hidden'); btnMinesStart.classList.remove('hidden');
    const cells = minesGrid.querySelectorAll('.mine-cell');
    cells.forEach(cell => {
        if (!cell.classList.contains('revealed')) { cell.classList.add('revealed', 'dim'); cell.innerText = minesGridArray[cell.dataset.index]; }
    });

    if (win) {
        const winAmount = Math.round(currentMinesBet * currentMinesMult); const pureProfit = winAmount - currentMinesBet;
        currentBalance += winAmount; updateBalance(); addHistoryRecord(pureProfit, 'Мины');
        audioWin.currentTime = 0; audioWin.play().catch(e=>{});
    } else {
        minesMultText.style.color = '#e74c3c'; addHistoryRecord(-currentMinesBet, 'Мины');
        if (currentBalance <= 0) { audioAhueli.currentTime = 0; audioAhueli.play(); } else { audioPizdec.currentTime = 0; audioPizdec.play(); }
    }
    audioPay.volume = 1.0;
}

// --- ЛОГИКА КЕЙСОВ (ЧЕСТНЫЙ РАНДОМ) ---
function getRandomCaseItem() {
    const r = Math.random();
    if (r < 0.10) return 'item_gold.webp'; // 10% шанс на голду
    if (r < 0.25) return 'item_iphone.webp'; // 15% шанс на айфон
    if (r < 0.50) return 'item_minus.webp'; // 25% минус
    if (r < 0.75) return 'wtf.webp'; // 25% троллфейс
    return 'item_shit.webp'; // 25% говно
}

btnCasesStart.addEventListener('click', () => {
    if (currentBalance <= 0) { audioAhueli.currentTime = 0; audioAhueli.play(); alert("Балик по нулям! Депай!"); return; }
    
    let currentBet = parseInt(casesBetInput.value);
    if (isNaN(currentBet) || currentBet <= 0 || currentBet > currentBalance) { alert("Ставка хуйня!"); return; }
    
    if (isSpinning || isCrashing || isMinesPlaying || isCaseOpening) return;
    isCaseOpening = true;

    currentBalance -= currentBet;
    updateBalance();

    audioCaseSpin.currentTime = 0;
    audioCaseSpin.play();

    closedCaseImg.classList.add('hidden');
    casesArea.classList.remove('hidden');
    casesResult.classList.add('hidden');

    let itemsHTML = '';
    let itemsArray =[];
    // Генерим 70 элементов на лету
    for(let i=0; i<70; i++) {
        let img = getRandomCaseItem();
        itemsArray.push(img);
        itemsHTML += `<div class="case-item"><img src="assets/${img}" alt="Приз"></div>`;
    }
    casesRibbon.innerHTML = itemsHTML;
    
    casesRibbon.style.transition = 'none';
    casesRibbon.style.transform = 'translateX(0px)';
    casesRibbon.offsetHeight; // Форсируем браузер обновить кадр

    // Выбираем честный индекс победителя (от 50 до 54)
    const targetIndex = 50 + Math.floor(Math.random() * 5); 
    const winningItem = itemsArray[targetIndex];

    // Вычисляем пиксели так, чтобы лента остановилась прямо на нем + мелкая случайная тряска (jitter)
    const jitter = Math.floor(Math.random() * 80) - 40; 
    const finalOffset = (targetIndex * 100) - 100 + jitter;

    // Анимация 9.4 секунды (идеально под длину трека)
    casesRibbon.style.transition = 'transform 9.4s cubic-bezier(0.1, 0.85, 0.1, 1)';
    casesRibbon.style.transform = `translateX(-${finalOffset}px)`;

    setTimeout(() => {
        isCaseOpening = false;
        
        let multiplier = 0;
        if (winningItem === 'item_gold.webp') multiplier = 5;
        else if (winningItem === 'item_iphone.webp') multiplier = 10;
        
        casesResult.classList.remove('hidden');

        if (multiplier > 0) {
            const winAmount = currentBet * multiplier;
            const pureProfit = winAmount - currentBet;
            currentBalance += winAmount;
            updateBalance();
            addHistoryRecord(pureProfit, 'Кейсы');
            
            casesResult.innerText = `Выпал ТОП! Выигрыш: ${winAmount} ₽`;
            casesResult.style.color = '#2ecc71';
            audioWin.currentTime = 0; audioWin.play();
        } else {
            addHistoryRecord(-currentBet, 'Кейсы');
            casesResult.innerText = "Выпало говно! ЛОХ!";
            casesResult.style.color = '#e74c3c';
            
            audioLoh.currentTime = 0; audioLoh.play();
            if (currentBalance <= 0) { 
                setTimeout(() => { audioAhueli.currentTime = 0; audioAhueli.play(); }, 1200);
            }
        }
    }, 9400); // Тайминг остановки
});

// --- ТУЛТИПЫ ---
infoIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
        infoIcons.forEach(i => { if (i !== icon) i.classList.remove('show-tooltip'); });
        icon.classList.toggle('show-tooltip');
        e.stopPropagation();
    });
});

document.addEventListener('click', () => {
    infoIcons.forEach(icon => icon.classList.remove('show-tooltip'));
});