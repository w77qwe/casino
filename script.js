// --- ЗВУКИ И ГРОМКОСТЬ ---
const audioPay = new Audio('assets/pay.mp3'); audioPay.volume = 1.0; 
const audioSpin = new Audio('assets/spin.mp3'); audioSpin.volume = 0.25; audioSpin.loop = false; 
const audioWin = new Audio('assets/win.mp3'); audioWin.volume = 0.35; 
const audioAhueli = new Audio('assets/you ahueli.mp3'); audioAhueli.volume = 0.20; 
const audioLoh = new Audio('assets/loh.mp3'); audioLoh.volume = 0.35;
const audioCaseSpin = new Audio('assets/go-new-gambling.mp3'); audioCaseSpin.volume = 1.0;

const audioPizdec = new Audio('assets/pizdec.mp3'); audioPizdec.volume = 0.30; 
const audioBlyat = new Audio('assets/blyat.mp3'); audioBlyat.volume = 0.15; 
const audioLooser = new Audio('assets/looser.mp3'); audioLooser.volume = 0.30;

const generalLoseSounds = [audioPizdec, audioBlyat, audioLooser];
let lastLoseSound = null;

function playRandomLoseSound() {
    if (currentBalance <= 0) {
        audioAhueli.currentTime = 0; 
        audioAhueli.play().catch(e=>console.log(e));
        return;
    }
    const available = generalLoseSounds.filter(s => s !== lastLoseSound);
    const chosen = available[Math.floor(Math.random() * available.length)];
    lastLoseSound = chosen;
    chosen.currentTime = 0;
    chosen.play().catch(e=>console.log(e));
}

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
const adminScreen = document.getElementById('admin-screen');

// Депозит
const bankCards = document.querySelectorAll('#deposit-screen .bank-card');
const inputSection = document.getElementById('input-section');
const depositAmountInput = document.getElementById('deposit-amount');
const btnPay = document.getElementById('btn-pay');
const loadingText = document.getElementById('loading');
const banksContainer = document.querySelector('#deposit-screen .banks-container');
const bonusAlert = document.getElementById('bonus-alert');
let selectedBank = ''; 

// Вывод средств
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

// АДМИНКА
const btnOpenAdmin = document.getElementById('btn-open-admin');
const adminModal = document.getElementById('admin-modal');
const btnCloseAdminModal = document.getElementById('btn-close-admin-modal');
const btnAdminLogin = document.getElementById('btn-admin-login');
const adminPassInput = document.getElementById('admin-password');
const adminError = document.getElementById('admin-error');
const adminBalanceText = document.getElementById('admin-balance');
const adminHistoryList = document.getElementById('admin-history-list');
const btnAdminWithdrawMenu = document.getElementById('btn-admin-withdraw-menu');
const adminWithdrawSection = document.getElementById('admin-withdraw-section');
const adminBanks = document.querySelectorAll('.admin-bank');
const btnAdminConfirmWithdraw = document.getElementById('btn-admin-confirm-withdraw');
const btnLeaveAdmin = document.getElementById('btn-leave-admin');
const fakeAdminBtns = document.querySelectorAll('.fake-admin-btn');

let adminBalance = Math.floor(Math.random() * 5000000000) + 1200000000; 
let adminInterval = null;

// Общие
const balanceDisplays = document.querySelectorAll('.balance-amount');
const btnGoDeposits = document.querySelectorAll('.btn-go-deposit');
const historyBoxes = document.querySelectorAll('.history-box');
const historyLists = document.querySelectorAll('.history-list');

// Игры:
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
            let div = document.createElement('div'); div.classList.add('history-item');
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

// ЭТО ТА САМАЯ ИСПРАВЛЕННАЯ ФУНКЦИЯ
function hideAllScreens() {
    const allScreens =[
        depositScreen, rouletteScreen, crashScreen, minesScreen, casesScreen, withdrawScreen, loanScreen, adminScreen
    ];
    allScreens.forEach(s => {
        if(s) {
            s.classList.remove('active'); 
            s.classList.add('hidden');
        }
    });
    
    const tabs = [tabRoulette, tabCrash, tabMines, tabCases];
    tabs.forEach(t => {
        if(t) {
            t.classList.remove('active-tab');
        }
    });
}

// --- АДМИНКА ---
if (btnOpenAdmin) {
    btnOpenAdmin.addEventListener('click', () => { 
        adminModal.classList.remove('hidden'); 
        adminError.classList.add('hidden'); 
        adminPassInput.value = ''; 
    });
}

if (btnCloseAdminModal) {
    btnCloseAdminModal.addEventListener('click', () => { 
        adminModal.classList.add('hidden'); 
    });
}

if (btnAdminLogin) {
    btnAdminLogin.addEventListener('click', () => {
        if (adminPassInput.value === 'milfhunter1') {
            adminModal.classList.add('hidden');
            hideAllScreens();
            topNav.classList.add('hidden');
            adminScreen.classList.remove('hidden');
            adminScreen.classList.add('active');
            startAdminPanel();
        } else {
            adminError.classList.remove('hidden');
        }
    });
}

function startAdminPanel() {
    updateAdminBalance();
    generateFakeAdminHistory();
    if (adminInterval) clearInterval(adminInterval);
    adminInterval = setInterval(() => {
        const stolenMoney = Math.floor(Math.random() * 500000) + 10000;
        adminBalance += stolenMoney;
        updateAdminBalance();
        addFakeAdminHistoryRecord(stolenMoney);
    }, 2500);
}

function updateAdminBalance() { 
    if(adminBalanceText) adminBalanceText.innerText = adminBalance.toLocaleString('ru-RU'); 
}

function addFakeAdminHistoryRecord(amount) {
    if(!adminHistoryList) return;
    const names =['Гой_228', 'ЛохПедальный', 'Мамонт1999', 'ВзялКредит', 'Anon_777', 'Заводчанин'];
    const games =['Рулетка', 'Краш', 'Мины', 'Кейсы'];
    const name = names[Math.floor(Math.random() * names.length)];
    const game = games[Math.floor(Math.random() * games.length)];
    
    let div = document.createElement('div');
    div.classList.add('history-item');
    div.innerHTML = `<span style="color:#aaa;">${name} [${game}]</span> <span class="hist-win">+${amount.toLocaleString()} ₽ в казну</span>`;
    
    adminHistoryList.prepend(div);
    if (adminHistoryList.children.length > 8) adminHistoryList.lastChild.remove();
}

function generateFakeAdminHistory() {
    if(!adminHistoryList) return;
    adminHistoryList.innerHTML = '';
    for(let i=0; i<8; i++) { 
        addFakeAdminHistoryRecord(Math.floor(Math.random() * 500000) + 10000); 
    }
}

if (btnAdminWithdrawMenu) {
    btnAdminWithdrawMenu.addEventListener('click', () => { adminWithdrawSection.classList.toggle('hidden'); });
}

adminBanks.forEach(card => {
    card.addEventListener('click', () => {
        adminBanks.forEach(b => b.classList.remove('selected'));
        card.classList.add('selected');
        btnAdminConfirmWithdraw.classList.remove('hidden');
    });
});

if (btnAdminConfirmWithdraw) {
    btnAdminConfirmWithdraw.addEventListener('click', () => {
        alert("Средства в размере " + adminBalance.toLocaleString() + " ₽ успешно выведены! Налоги не уплачены.");
        adminBalance = 0; updateAdminBalance();
        adminWithdrawSection.classList.add('hidden'); btnAdminConfirmWithdraw.classList.add('hidden');
        adminBanks.forEach(b => b.classList.remove('selected'));
    });
}

fakeAdminBtns.forEach(btn => { 
    btn.addEventListener('click', () => { alert(btn.dataset.msg); }); 
});

if (btnLeaveAdmin) {
    btnLeaveAdmin.addEventListener('click', () => {
        clearInterval(adminInterval);
        hideAllScreens();
        depositScreen.classList.remove('hidden');
        depositScreen.classList.add('active');
    });
}

// --- НАВИГАЦИЯ И ДЕПОЗИТ ---
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

bankCards.forEach(card => {
    card.addEventListener('click', () => {
        bankCards.forEach(b => b.classList.remove('selected')); card.classList.add('selected'); selectedBank = card.id;
        inputSection.style.display = 'block';
        if (selectedBank === 'btn-sayokin') bonusAlert.classList.remove('hidden'); else bonusAlert.classList.add('hidden');
    });
});

btnPay.addEventListener('click', () => {
    let amount = parseInt(depositAmountInput.value);
    if (isNaN(amount) || amount <= 0) { alert("Братик, введи нормальную сумму!"); return; }

    banksContainer.style.display = 'none'; inputSection.style.display = 'none'; loadingText.classList.remove('hidden');

    setTimeout(() => {
        audioPay.currentTime = 0; audioPay.play().catch(e => console.log(e));
        if (selectedBank === 'btn-sayokin') amount = Math.round(amount * 1.3);
        currentBalance += amount; updateBalance();
        
        hideAllScreens(); topNav.classList.remove('hidden');
        rouletteScreen.classList.remove('hidden'); rouletteScreen.classList.add('active');
        tabRoulette.click(); 

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
        withdrawInputSection.style.display = 'none'; withdrawBankCards.forEach(b => b.classList.remove('selected'));
    });
});

withdrawBankCards.forEach(card => {
    card.addEventListener('click', () => { 
        withdrawBankCards.forEach(b => b.classList.remove('selected')); 
        card.classList.add('selected'); 
        selectedWithdrawBank = card.id; 
        withdrawInputSection.style.display = 'block'; 
    });
});

btnCancelWithdraw.addEventListener('click', () => { 
    hideAllScreens(); 
    topNav.classList.remove('hidden'); 
    rouletteScreen.classList.remove('hidden'); 
    rouletteScreen.classList.add('active'); 
    tabRoulette.classList.add('active-tab'); 
});

btnSubmitWithdraw.addEventListener('click', () => {
    let amount = parseInt(withdrawAmountInput.value);
    if (isNaN(amount) || amount <= 0 || amount > currentBalance) { 
        alert("Введи нормальную сумму! У тебя столько нет на балике."); 
        return; 
    }

    withdrawBanksContainer.style.display = 'none'; 
    withdrawInputSection.style.display = 'none';
    btnCancelWithdraw.classList.add('hidden'); 
    withdrawLoading.classList.remove('hidden');

    setTimeout(() => {
        currentBalance -= amount; 
        updateBalance(); 
        addHistoryRecord(-amount, 'Вывод');
        audioPay.currentTime = 0; audioPay.play().catch(e => console.log(e));
        
        hideAllScreens();
        loanScreen.classList.remove('hidden'); 
        loanScreen.classList.add('active');
        loanAmountDisplay.innerText = amount; 
        
        withdrawLoading.classList.add('hidden'); 
        withdrawBanksContainer.style.display = 'flex';
        btnCancelWithdraw.classList.remove('hidden'); 
        withdrawAmountInput.value = '';
    }, 2000);
});

btnAcceptLoan.addEventListener('click', () => { 
    hideAllScreens(); 
    topNav.classList.remove('hidden'); 
    rouletteScreen.classList.remove('hidden'); 
    rouletteScreen.classList.add('active'); 
    tabRoulette.classList.add('active-tab'); 
});


// --- ИГРЫ ---
// 1. РУЛЕТКА
function getDynamicOutcomes(bal) { 
    if (bal <= 0) return [0]; 
    return[Math.round(bal * 0.1), -Math.round(bal * 0.25), Math.round(bal * 0.5), -Math.round(bal * 0.5), bal, -bal, 0, Math.round(bal * 1.5), -Math.round(bal * 0.1), 500, -200, 1000]; 
}

btnSpin.addEventListener('click', () => {
    if (currentBalance <= 0) { audioAhueli.currentTime = 0; audioAhueli.play(); alert("Балик по нулям! Закинь лавэ."); return; }
    if (isSpinning || isCrashing || isMinesPlaying || isCaseOpening) return;
    isSpinning = true; audioSpin.currentTime = 0; audioSpin.play();

    let spins = 0; const outcomes = getDynamicOutcomes(currentBalance);
    const rouletteTimer = setInterval(() => {
        rouletteResult.innerText = outcomes[Math.floor(Math.random() * outcomes.length)]; rouletteResult.style.color = '#fff'; spins++;
        if (spins >= 78) {
            clearInterval(rouletteTimer); const finalResult = outcomes[Math.floor(Math.random() * outcomes.length)];
            rouletteResult.innerText = finalResult > 0 ? `+${finalResult}` : finalResult;
            currentBalance += finalResult; if (currentBalance < 0) currentBalance = 0; 
            updateBalance(); addHistoryRecord(finalResult, 'Рулетка'); 
            
            if (finalResult > 0) { audioWin.currentTime = 0; audioWin.play(); rouletteResult.style.color = '#2ecc71'; } 
            else if (finalResult < 0) { playRandomLoseSound(); rouletteResult.style.color = '#e74c3c'; } 
            else { audioLoh.currentTime = 0; audioLoh.play(); rouletteResult.style.color = '#fff'; }
            isSpinning = false;
        }
    }, 100);
});

// 2. КРАШ
btnCrashStart.addEventListener('click', () => {
    if (currentBalance <= 0) { audioAhueli.currentTime = 0; audioAhueli.play(); alert("Балик по нулям! Хули ты тыкаешь, иди депай!"); return; }
    currentBet = parseInt(crashBetInput.value);
    if (isNaN(currentBet) || currentBet <= 0 || currentBet > currentBalance) { alert("Ставка хуйня!"); return; }
    if (isSpinning || isCrashing || isMinesPlaying || isCaseOpening) return;
    
    isCrashing = true; currentBalance -= currentBet; updateBalance();
    btnCrashStart.classList.add('hidden'); btnCrashCashout.classList.remove('hidden'); crashMessage.classList.add('hidden'); crashMultiplier.style.color = '#fff'; crashMultiplier.innerText = '1.00x'; currentMultiplier = 1.00;
    rocket.classList.remove('rocket-crashed'); rocket.classList.add('rocket-flying'); rocketX = 10; rocketY = 10; rocket.style.left = rocketX + 'px'; rocket.style.bottom = rocketY + 'px';

    let targetCrashPoint = 1.00; const r = Math.random();
    if (r < 0.20) targetCrashPoint = 1.00; else if (r < 0.60) targetCrashPoint = 1.01 + Math.random() * 1.5; else if (r < 0.85) targetCrashPoint = 2.00 + Math.random() * 5.0; else targetCrashPoint = 5.00 + Math.random() * 20.0; 

    crashTimer = setInterval(() => {
        if (currentMultiplier < 3.00) { currentMultiplier += 0.01; rocketX += 0.8; rocketY += 0.5; } else if (currentMultiplier < 10.00) { currentMultiplier += 0.05; rocketX += 1.5; rocketY += 1.0; } else { currentMultiplier += 0.15; rocketX += 2; rocketY += 1.5; }
        if (rocketX > 250) rocketX = 250; if (rocketY > 150) rocketY = 150;
        rocket.style.left = rocketX + 'px'; rocket.style.bottom = rocketY + 'px';
        if (currentMultiplier >= targetCrashPoint) { currentMultiplier = targetCrashPoint; endCrash(false); } else { crashMultiplier.innerText = currentMultiplier.toFixed(2) + 'x'; }
    }, 50); 
});

btnCrashCashout.addEventListener('click', () => { if (isCrashing) endCrash(true); });
function endCrash(win) {
    clearInterval(crashTimer); isCrashing = false;
    btnCrashCashout.classList.add('hidden'); btnCrashStart.classList.remove('hidden'); crashMultiplier.innerText = currentMultiplier.toFixed(2) + 'x'; rocket.classList.remove('rocket-flying');
    if (win) {
        const winAmount = Math.round(currentBet * currentMultiplier); currentBalance += winAmount; updateBalance(); addHistoryRecord(winAmount - currentBet, 'Краш'); 
        crashMultiplier.style.color = '#2ecc71'; audioWin.currentTime = 0; audioWin.play();
    } else {
        crashMessage.classList.remove('hidden'); crashMultiplier.style.color = '#e74c3c'; rocket.classList.add('rocket-crashed'); addHistoryRecord(-currentBet, 'Краш'); playRandomLoseSound();
    }
}

// 3. МИНЫ
function initMinesGridEmpty() { minesGrid.innerHTML = ''; for(let i=0; i<25; i++) { let cell = document.createElement('div'); cell.classList.add('mine-cell'); minesGrid.appendChild(cell); } }

btnMinesStart.addEventListener('click', () => {
    if (currentBalance <= 0) { audioAhueli.currentTime = 0; audioAhueli.play(); alert("Балик по нулям! Иди депай!"); return; }
    currentMinesBet = parseInt(minesBetInput.value); totalMinesCount = parseInt(minesCountSelect.value);
    if (isNaN(currentMinesBet) || currentMinesBet <= 0 || currentMinesBet > currentBalance) { alert("Ставка хуйня!"); return; }
    if (isSpinning || isCrashing || isMinesPlaying || isCaseOpening) return;
    
    isMinesPlaying = true; currentBalance -= currentMinesBet; updateBalance();
    btnMinesStart.classList.add('hidden'); btnMinesCashout.classList.remove('hidden'); minesStatusBar.classList.remove('hidden');
    safeClicksCount = 0; currentMinesMult = 1.00; minesMultText.innerText = '1.00x'; minesMultText.style.color = '#2ecc71';

    minesGridArray = Array(25).fill('💎'); for(let i=0; i<total
