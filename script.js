document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const itemCards = document.querySelectorAll('.item-card');
    const selectedItemsContainer = document.getElementById('selectedItems');
    const noSelectionText = document.getElementById('noSelection');
    const totalPriceElement = document.getElementById('totalPrice');
    const orderForm = document.getElementById('orderForm');
    const modal = document.getElementById('successModal');
    const closeModalBtn = document.querySelector('.close');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    
    // Массив для хранения выбранных товаров
    let selectedItems = [];
    
    // Обработчики для карточек товаров
    itemCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('selected');
            updateSelectedItems();
        });
    });
    
    // Функция обновления выбранных товаров
    function updateSelectedItems() {
        selectedItems = [];
        const selectedCards = document.querySelectorAll('.item-card.selected');
        
        if (selectedCards.length > 0) {
            noSelectionText.style.display = 'none';
            
            // Очищаем контейнер и добавляем заголовок
            selectedItemsContainer.innerHTML = '<h3>Выбранные брейнроты:</h3>';
            
            // Добавляем выбранные товары
            selectedCards.forEach(card => {
                const itemName = card.dataset.name;
                const itemPrice = card.dataset.price;
                
                selectedItems.push({
                    name: itemName,
                    price: itemPrice
                });
                
                const itemElement = document.createElement('div');
                itemElement.className = 'selected-item';
                itemElement.innerHTML = `
                    <span>${itemName}</span>
                    <span>${itemPrice} робуксов</span>
                `;
                selectedItemsContainer.appendChild(itemElement);
            });
        } else {
            noSelectionText.style.display = 'block';
            selectedItemsContainer.innerHTML = '<h3>Выбранные брейнроты:</h3><p id="noSelection">Пока ничего не выбрано</p>';
        }
        
        // Обновляем общую стоимость
        updateTotalPrice();
    }
    
    // Функция обновления общей стоимости
    function updateTotalPrice() {
        const total = selectedItems.reduce((sum, item) => sum + parseInt(item.price), 0);
        totalPriceElement.textContent = `Итого: ${total} робуксов`;
    }
    
    // Обработчик отправки формы
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Проверяем, выбран ли хотя бы один товар
        if (selectedItems.length === 0) {
            alert('Пожалуйста, выберите хотя бы один брейнрот!');
            return;
        }
        
        // Получаем данные из формы
        const nickname = document.getElementById('nickname').value;
        const message = document.getElementById('message').value;
        
        // Формируем текст с выбранными товарами
        const selectedItemsText = selectedItems.map(item => 
            `${item.name} (${item.price} робуксов)`
        ).join(', ');
        
        // Отправляем данные в Google Forms
        sendToGoogleForms(nickname, selectedItemsText, message);
    });
    
    // Функция отправки данных в Google Forms
    function sendToGoogleForms(nickname, brainrots, message) {
        // ID вашей Google Forms
        const formID = '1FAIpQLSdHrXtItgkqb47iUyQWsobcb0hrFBwcnDnrgyjiG7J58wDlZw';
        
        // URL для отправки данных
        const formURL = `https://docs.google.com/forms/d/e/${formID}/formResponse`;
        
        // Параметры для отправки (замените на реальные entry ID из вашей формы)
        const params = new URLSearchParams({
            'entry.2005620554': nickname,     // Замените на реальный ID поля для ника
            'entry.1045781291': brainrots,    // Замените на реальный ID поля для брейнротов
            'entry.1065046570': message       // Замените на реальный ID поля для сообщения
        });
        
        // Отправляем данные с помощью fetch
        fetch(formURL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        })
        .then(() => {
            // Показываем модальное окно об успехе
            modal.style.display = 'block';
            
            // Очищаем форму
            orderForm.reset();
            
            // Сбрасываем выбранные товары
            document.querySelectorAll('.item-card.selected').forEach(card => {
                card.classList.remove('selected');
            });
            updateSelectedItems();
        })
        .catch(error => {
            console.error('Ошибка при отправке формы:', error);
            alert('Произошла ошибка при отправке заказа. Пожалуйста, попробуйте еще раз.');
        });
    }
    
    // Закрытие модального окна
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    modalCloseBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});
