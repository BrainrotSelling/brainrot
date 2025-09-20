// Конфигурация Telegram бота
const TELEGRAM_BOT_TOKEN = '8332292030:AAE05VXZVX6cbxQKNQAS_4Zg7rfnZc8MMqU';
const TELEGRAM_CHAT_ID = '7474847646';

// Переменные для хранения состояния
let selectedItems = [];

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupItemSelection();
    setupFormHandler();
    addStyles();
}

// Настройка выбора товаров
function setupItemSelection() {
    const items = document.querySelectorAll('.item-card');
    
    items.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('selected');
            updateSelection();
        });
    });
}

// Обновление выбранных товаров
function updateSelection() {
    selectedItems = [];
    const selectedCards = document.querySelectorAll('.item-card.selected');
    const selectedContainer = document.getElementById('selectedItems');
    const noSelection = document.getElementById('noSelection');
    const totalElement = document.getElementById('totalPrice');
    
    // Собираем выбранные товары
    selectedCards.forEach(card => {
        selectedItems.push({
            name: card.dataset.name,
            price: card.dataset.price
        });
    });
    
    // Обновляем отображение
    if (selectedItems.length > 0) {
        noSelection.style.display = 'none';
        
        let itemsHTML = '';
        selectedItems.forEach(item => {
            itemsHTML += `
                <div class="selected-item">
                    <span>${item.name}</span>
                    <span class="price">${item.price} Robux</span>
                </div>
            `;
        });
        selectedContainer.innerHTML = itemsHTML;
    } else {
        noSelection.style.display = 'block';
        selectedContainer.innerHTML = '';
    }
    
    // Обновляем итоговую сумму
    const total = selectedItems.reduce((sum, item) => sum + parseInt(item.price), 0);
    totalElement.textContent = `Итого: ${total} робуксов`;
}

// Настройка обработчика формы
function setupFormHandler() {
    const form = document.getElementById('orderForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const nickname = document.getElementById('nickname').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Валидация
        if (!nickname) {
            showAlert('❌ Введите ваш никнейм!', 'error');
            return;
        }
        
        if (selectedItems.length === 0) {
            showAlert('❌ Выберите хотя бы один брейнрот!', 'error');
            return;
        }
        
        // Отправка заказа
        await sendOrder(nickname, message);
    });
}

// Функция отправки заказа в Telegram
async function sendOrder(nickname, userMessage) {
    const button = document.querySelector('#orderForm button[type="submit"]');
    const originalText = button.innerHTML;
    
    // Показываем загрузку
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
    button.disabled = true;
    
    try {
        // Формируем сообщение для Telegram
        const total = selectedItems.reduce((sum, item) => sum + parseInt(item.price), 0);
        
        let message = `🛒 НОВЫЙ ЗАКАЗ БРЕЙНРОТОВ%0A%0A`;
        message += `👤 Никнейм: ${encodeURIComponent(nickname)}%0A%0A`;
        
        message += `📦 Выбранные брейнроты:%0A`;
        selectedItems.forEach(item => {
            message += `• ${encodeURIComponent(item.name)} - ${item.price} Robux%0A`;
        });
        
        message += `%0A💰 Итого: ${total} Robux%0A`;
        
        if (userMessage) {
            message += `%0A📝 Сообщение: ${encodeURIComponent(userMessage)}%0A`;
        }
        
        message += `%0A⏰ Время: ${new Date().toLocaleString('ru-RU')}`;
        
        // Отправляем запрос к Telegram API
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${message}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.ok) {
            showAlert('✅ Заказ отправлен! С вами свяжутся в Roblox', 'success');
            resetForm();
        } else {
            console.error('Ошибка Telegram:', data);
            showAlert('❌ Ошибка отправки. Попробуйте еще раз', 'error');
        }
        
    } catch (error) {
        console.error('Ошибка:', error);
        showAlert('❌ Ошибка сети. Проверьте соединение', 'error');
    } finally {
        // Восстанавливаем кнопку
        button.innerHTML = originalText;
        button.disabled = false;
    }
}

// Сброс формы после успешной отправки
function resetForm() {
    // Сбрасываем форму
    document.getElementById('orderForm').reset();
    
    // Сбрасываем выбранные товары
    document.querySelectorAll('.item-card.selected').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Обновляем отображение
    updateSelection();
}

// Показ уведомлений
function showAlert(message, type) {
    // Создаем элемент уведомления
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Добавляем стили
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    
    alert.querySelector('button').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        margin-left: 10px;
    `;
    
    document.body.appendChild(alert);
    
    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}

// Добавление необходимых стилей
function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .item-card.selected {
            border: 3px solid #4CAF50 !important;
            background: linear-gradient(135deg, #e8f5e8 0%, #ffffff 100%) !important;
            transform: scale(1.02);
            box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3) !important;
        }
        
        .item-card.selected .item-name {
            color: #2E7D32 !important;
            font-weight: bold !important;
        }
        
        .selected-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            margin: 8px 0;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #4CAF50;
        }
        
        .selected-item .price {
            font-weight: bold;
            color: #e74c3c;
        }
        
        #orderForm button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
        
        .fa-spinner {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .alert {
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// Функция для ручного тестирования бота
window.testBotConnection = async function() {
    try {
        const testUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`;
        const response = await fetch(testUrl);
        const data = await response.json();
        
        console.log('Тест подключения:', data);
        
        if (data.ok) {
            showAlert('✅ Бот подключен!', 'success');
        } else {
            showAlert('❌ Ошибка подключения к боту', 'error');
        }
    } catch (error) {
        console.error('Ошибка теста:', error);
        showAlert('❌ Ошибка сети при тесте', 'error');
    }
}
