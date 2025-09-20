document.addEventListener('DOMContentLoaded', function() {
    const itemCards = document.querySelectorAll('.item-card');
    const selectedItemsContainer = document.getElementById('selectedItems');
    const noSelectionText = document.getElementById('noSelection');
    const totalPriceElement = document.getElementById('totalPrice');
    const orderForm = document.getElementById('orderForm');
    
    // Массив для хранения выбранных товаров
    let selectedItems = [];
    
    // Цены за единицу каждого товара
    const prices = {
        'Bombardinni Tortinni': 15,
        'La Vacca Saturna Saturnita': 6,
        'Tractoro Dinosauro': 25,
        'Extinct Matteo': 18
    };
    
    // Обработчик клика по карточке товара
    itemCards.forEach(card => {
        card.addEventListener('click', function() {
            const itemName = this.dataset.name;
            const itemPrice = parseInt(this.dataset.price);
            
            // Проверяем, выбран ли уже товар
            const index = selectedItems.findIndex(item => item.name === itemName);
            
            if (index === -1) {
                // Добавляем товар
                selectedItems.push({
                    name: itemName,
                    price: itemPrice
                });
                this.classList.add('selected');
            } else {
                // Удаляем товар
                selectedItems.splice(index, 1);
                this.classList.remove('selected');
            }
            
            updateSelectedItems();
            calculateTotal();
        });
    });
    
    // Обновление списка выбранных товаров
    function updateSelectedItems() {
        // Очищаем контейнер
        while (selectedItemsContainer.children.length > 2) {
            selectedItemsContainer.removeChild(selectedItemsContainer.lastChild);
        }
        
        // Скрываем или показываем текст "Пока ничего не выбрано"
        if (selectedItems.length > 0) {
            noSelectionText.style.display = 'none';
            
            // Добавляем выбранные товары
            selectedItems.forEach(item => {
                const div = document.createElement('div');
                div.className = 'selected-item';
                div.innerHTML = `
                    <span>${item.name}</span>
                    <span>${item.price} робуксов</span>
                `;
                selectedItemsContainer.appendChild(div);
            });
        } else {
            noSelectionText.style.display = 'block';
        }
    }
    
    // Функция для расчета общей стоимости
    function calculateTotal() {
        const total = selectedItems.reduce((sum, item) => sum + item.price, 0);
        totalPriceElement.textContent = `Итого: ${total} робуксов`;
        
        // Анимация пульсации при изменении суммы
        totalPriceElement.classList.remove('pulse');
        void totalPriceElement.offsetWidth; // Trigger reflow
        totalPriceElement.classList.add('pulse');
    }
    
    // Обработка отправки формы
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (selectedItems.length === 0) {
            alert('Пожалуйста, выберите хотя бы один брейнрот!');
            return;
        }
        
        const nickname = document.getElementById('nickname').value;
        const message = document.getElementById('message').value;
        
        // Формируем список выбранных товаров
        const itemsList = selectedItems.map(item => `- ${item.name} (${item.price} робуксов)`).join('\n');
        const total = selectedItems.reduce((sum, item) => sum + item.price, 0);
        
        // В реальном проекте здесь был бы код для отправки данных на сервер
        alert(`Заказ отправлен!\n\nНикнейм: ${nickname}\n\nВыбранные брейнроты:\n${itemsList}\n\nОбщая сумма: ${total} робуксов\n\nДоп. информация: ${message || 'не указано'}\n\nС вами свяжутся в Roblox для завершения сделки.`);
        
        // Очистка формы
        orderForm.reset();
        selectedItems.forEach(item => {
            const card = [...itemCards].find(card => card.dataset.name === item.name);
            if (card) card.classList.remove('selected');
        });
        selectedItems = [];
        updateSelectedItems();
        calculateTotal();
    });
});