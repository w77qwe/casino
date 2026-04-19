// --- ЗВУКИ И ГРОМКОСТЬ ---
const audioPay = new Audio('assets/pay.mp3');
audioPay.volume = 1.0; // Тихий звук, выкручиваем на максимум

const audioSpin = new Audio('assets/spin.mp3');
audioSpin.volume = 0.25; // Этот орет, глушим его до 25%
audioSpin.loop = false; // Не зацикливаем, он длится 7.9 сек, нам хватит на одну крутку

const audioWin = new Audio('assets/win.mp3');
audioWin.volume = 0.35; // Выравниваем под остальные

const audioLose = new Audio('assets/lose.mp3');
audioLose.volume = 0.25; // Глушим, чтобы по ушам не било

// --- ПЕРЕМЕННЫЕ И ЭЛЕМЕНТЫ ---
let currentBalance = 0;

// Экраны
const depositScreen = document.getElementById('deposit-screen');
const rouletteScreen = document.getElementById('roulette-screen');

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

// --- ЛОГИКА ДЕПОЗИТА ---

// Клик по Сберу
btnSber.addEventListener('click', () => {
    btnSber.classList.add('selected'); // Подсвечиваем кнопку
    inputSection.style.display = 'block'; // Показываем ввод суммы
});

// Клик по кнопке "Оплатить"
btnPay.addEventListener('click', () => {
    const amount = parseInt(depositAmountInput.value);
    
    // Проверка на дурака, чтобы не ввели хуйню или минус
    if (isNaN(amount) || amount <= 0) {
        alert("Братик, введи нормальную сумму, мы тут не в бирюльки играем!");
        return;
    }

    // Прячем всё нахуй и показываем фейк-загрузку
    banksContainer.style.display = 'none';
    inputSection.style.display = 'none';
    loadingText.classList.remove('hidden');

    // ФЕЙКОВАЯ ЗАДЕРЖКА (2 секунды)
    setTimeout(() => {
        // Загрузка прошла, делаем звук оплаты
        audioPay.currentTime = 0;
        audioPay.play().catch(e => console.log('Звук не сработал из-за браузера:', e));
        
        // Зачисляем бабки
        currentBalance += amount;
        updateBalance();

        // Скрываем депозит, показываем рулетку
        depositScreen.classList.remove('active');
        rouletteScreen.classList.remove('hidden');
        rouletteScreen.classList.add('active');

        // Возвращаем экран депозита в исходное состояние (на случай если вернемся)
        loadingText.classList.add('hidden');
        banksContainer.style.display = 'flex';
        depositAmountInput.value = '';
        btnSber.classList.remove('selected');
        
    }, 2000); // 2000 миллисекунд = 2 секунды
});

// --- ЛОГИКА РУЛЕТКИ ---

// Функция обновления балика на экране
function updateBalance() {
    balanceDisplay.innerText = currentBalance;
}

// Возможные исходы пока мельтешат цифры
const outcomes =[100, -50, 0, 500, -200, 1000, -currentBalance, 50, -10, 0, 200, -100];

let isSpinning = false;

btnSpin.addEventListener('click', () => {
    // Если бабок нет, шлем нахуй пополнять
    if (currentBalance <= 0) {
        alert("Балик по нулям! Закинь лавэ, чтобы крутить дальше.");
        return;
    }
    
    // Защита от спама кликами
    if (isSpinning) return;
    isSpinning = true;

    // Сбрасываем звук спина на начало и врубаем
    audioSpin.currentTime = 0;
    audioSpin.play().catch(e => console.log('Звук не сработал:', e));

    let spins = 0;
    // Настраиваем тайминги под твои 7.941 сек звука
    // 78 тиков по 100 миллисекунд = 7.8 секунд. Идеально под конец!
    const maxSpins = 78; 
    const spinInterval = 100; 

    // Запускаем мельтешение цифр
    const rouletteTimer = setInterval(() => {
        // Показываем рандомную хуйню пока крутится
        rouletteResult.innerText = outcomes[Math.floor(Math.random() * outcomes.length)];
        // Делаем цвет белым пока крутится, чтобы сбросить цвет прошлого выигрыша/проеба
        rouletteResult.style.color = '#fff';
        spins++;

        // Когда крутка заканчивается (звук затухает)
        if (spins >= maxSpins) {
            clearInterval(rouletteTimer);

            // Выбираем ФИНАЛЬНЫЙ результат
            // Специально обновляем массив, чтобы можно было слить весь балик (-currentBalance)
            const currentOutcomes =[100, -50, 0, 250, -150, 500, -currentBalance, 50, 0, 200, -100];
            const finalResult = currentOutcomes[Math.floor(Math.random() * currentOutcomes.length)];
            
            // Если плюс — рисуем с плюсом, иначе как есть
            rouletteResult.innerText = finalResult > 0 ? `+${finalResult}` : finalResult;

            // Обновляем балик
            currentBalance += finalResult;
            if (currentBalance < 0) currentBalance = 0; // Чтобы в минус не уходить
            updateBalance();

            // Врубаем звук в зависимости от результата и меняем цвет хуйни на экране
            if (finalResult > 0) {
                audioWin.currentTime = 0;
                audioWin.play().catch(e => console.log('Звук не сработал:', e));
                rouletteResult.style.color = '#2ecc71'; // Зеленый если поднял
            } else if (finalResult < 0) {
                audioLose.currentTime = 0;
                audioLose.play().catch(e => console.log('Звук не сработал:', e));
                rouletteResult.style.color = '#e74c3c'; // Красный если проебал
            } else {
                rouletteResult.style.color = '#fff'; // Белый если ноль
            }

            isSpinning = false;
        }
    }, spinInterval);
});

// --- ЛОГИКА КНОПКИ "ПОПОЛНИТЬ ЕЩЕ" ---
btnBack.addEventListener('click', () => {
    rouletteScreen.classList.remove('active');
    rouletteScreen.classList.add('hidden');
    
    depositScreen.classList.remove('hidden');
    depositScreen.classList.add('active');
    inputSection.style.display = 'none'; // Скрываем инпут, пусть заново жмут Сбер
});