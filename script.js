// Конфигурация Telegram бота
const TELEGRAM_BOT_TOKEN = '8332292030:AAE05VXZVX6cbxQKNQAS_4Zg7rfnZc8MMqU';
const TELEGRAM_CHAT_ID = '7474847646';

// Переменные для хранения выбранных товаров
let selectedItems = [];

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeItemSelection();
    setupFormHandler();
});

// Инициализация выбора товаров
function initializeItemSelection() {
    const itemCards = document.querySelectorAll('.item-card');
    
    itemCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('selected');
            updateSelectedItems();
        });
    });
}

// Обновление списка выбранных товаров
function updateSelectedItems() {
    selectedItems = [];
    const selectedCards = document.querySelectorAll('.item-card.selected');
    const selectedContainer = document.getElementById('selectedItems');
    const noSelection = document.getElementById('noSelection');
    const totalElement = document.getElementById('totalPrice');
    
    // Собираем выбранные товары
    selectedCards.forEach(card => {
        selectedItems.push({
            name: card.dataset.name,
            price: parseInt(card.dataset.price)
        });
    });
    
    // Обновляем отображение
    if (selectedItems.length > 0) {
        noSelection.style.display = 'none';
        
        // Создаем HTML для выбранных товаров
        let itemsHTML = '';
        selectedItems.forEach(item => {
            itemsHTML += `
                <div class="selected-item">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">${item.price} Robux</span>
                </div>
            `;
        });
        selectedContainer.innerHTML = itemsHTML;
    } else {
        noSelection.style.display = 'block';
        selectedContainer.innerHTML = '';
    }
    
    // Обновляем итоговую сумму
    const total = selectedItems.reduce((sum, item) => sum + item.price, 0);
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
            alert('❌ Пожалуйста, введите ваш никнейм!');
            return;
        }
        
        if (selectedItems.length === 0) {
            alert('❌ Пожалуйста, выберите хотя бы один брейнрот!');
            return;
        }
        
        // Отправка заказа
        await sendOrderToTelegram(nickname, message);
    });
}

// Функция отправки заказа в Telegram
async function sendOrderToTelegram(nickname, userMessage) {
    const submitBtn = document.querySelector('#orderForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Показываем загрузку
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
    submitBtn.disabled = true;
    
    try {
        // Формируем сообщение
        const total = selectedItems.reduce((sum, item) => sum + item.price, 0);
        
        let message = `🛒 *НОВЫЙ ЗАКАЗ БРЕЙНРОТОВ*%0A%0A`;
        message += `👤 *Никнейм:* ${encodeURIComponent(nickname)}%0A`;
        
        if (userMessage) {
            message += `📝 *Сообщение:* ${encodeURIComponent(userMessage)}%0A`;
        }
        
        message += `%0A📦 *Выбранные брейнроты:*%0A`;
        selectedItems.forEach(item => {
            message += `➖ ${encodeURIComponent(item.name)} \\(${item.price} Robux\\)%0A`;
        });
        
        message += `%0A💰 *Итого:* ${total} Robux%0A`;
        message += `⏰ *Время заказа:* ${encodeURIComponent(new Date().toLocaleString('ru-RU'))}`;
        
        // Отправляем запрос к Telegram API
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${message}&parse_mode=markdown`;
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.ok) {
            alert('✅ Заказ успешно отправлен! С вами свяжутся в Roblox в ближайшее время.');
            
            // Очищаем форму
            document.getElementById('orderForm').reset();
            
            // Сбрасываем выбор товаров
            document.querySelectorAll('.item-card.selected').forEach(card => {
                card.classList.remove('selected');
            });
            updateSelectedItems();
            
        } else {
            console.error('Ошибка Telegram:', result);
            alert('❌ Ошибка при отправке заказа. Попробуйте еще раз или свяжитесь с поддержкой.');
        }
        
    } catch (error) {
        console.error('Ошибка сети:', error);
        alert('❌ Ошибка сети. Проверьте соединение и попробуйте еще раз.');
    } finally {
        // Восстанавливаем кнопку
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Добавляем стили для выбранных товаров
const style = document.createElement('style');
style.textContent = `
    .item-card.selected {
        border: 3px solid #4CAF50;
        background: linear-gradient(135deg, #e8f5e8 0%, #ffffff 100%);
        transform: scale(1.02);
        box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
    }
    
    .item-card.selected .item-name {
        color: #2E7D32;
        font-weight: bold;
    }
    
    .selected-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        margin: 5px 0;
        background: #f8f9fa;
        border-radius: 8px;
        border-left: 4px solid #4CAF50;
    }
    
    .selected-item .item-name {
        font-weight: 500;
        color: #2c3e50;
    }
    
    .selected-item .item-price {
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
`;
document.head.appendChild(style);
