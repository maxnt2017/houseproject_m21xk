document.addEventListener('DOMContentLoaded', () => {
    const mainDoor = document.getElementById('mainDoor');
    const toggleDoorButton = document.getElementById('toggleDoor');
    const cameraIcon = document.getElementById('cameraIcon');
    const cameraFeed = document.getElementById('cameraFeed');
    const cameraVideo = document.getElementById('cameraVideo');
    const toggleCameraButton = document.getElementById('toggleCamera');

    const navButtons = document.querySelectorAll('.nav-button');
    const houseView = document.querySelector('.house-view'); // Батьківський контейнер для всіх поверхів/фасаду
    const allViews = document.querySelectorAll('.house-facade, .floor-layout'); // Всі можливі види (фасад + поверхи)

    const addItemButton = document.getElementById('addItem');
    const itemTypeSelect = document.getElementById('itemType');
    const itemNameInput = document.getElementById('itemName');

    let currentFloorId = 'outside'; // Початковий поверх - зовнішній вигляд

    // Функція для перемикання поверхів
    function switchFloor(targetFloorId) {
        // Приховуємо всі поверхи та фасад
        allViews.forEach(view => {
            view.classList.remove('current-floor');
            view.style.display = 'none'; // Додаємо display: none для повного приховування
        });

        // Показуємо потрібний поверх або фасад
        const targetElement = document.getElementById(targetFloorId);
        if (targetElement) {
            targetElement.style.display = 'flex'; // Використовуємо flex, оскільки floor-layout flex
            targetElement.classList.add('current-floor');
            currentFloorId = targetFloorId;
        }
    }

    // Ініціалізація: показати зовнішній вигляд при завантаженні сторінки
    switchFloor('outside');

    // Перемикання дверей
    toggleDoorButton.addEventListener('click', () => {
        mainDoor.classList.toggle('open');
        if (mainDoor.classList.contains('open')) {
            toggleDoorButton.textContent = 'Закрити Двері';
        } else {
            toggleDoorButton.textContent = 'Відкрити Двері';
        }
    });

    // Перемикання камери
    toggleCameraButton.addEventListener('click', () => {
        if (cameraFeed.style.display === 'block') {
            cameraFeed.style.display = 'none';
            cameraVideo.pause();
            toggleCameraButton.textContent = 'Увімкнути Камеру';
        } else {
            cameraFeed.style.display = 'block';
            cameraVideo.play();
            toggleCameraButton.textContent = 'Вимкнути Камеру';
        }
    });

    cameraIcon.addEventListener('click', () => {
        // Та ж функціональність, що й у кнопки
        toggleCameraButton.click();
    });

    // Навігація по поверхах
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const floorId = button.dataset.floor;
            switchFloor(floorId);
        });
    });

    // Додавання "розумних" речей
    addItemButton.addEventListener('click', () => {
        const itemType = itemTypeSelect.value;
        const itemName = itemNameInput.value.trim();

        if (!itemName) {
            alert('Будь ласка, введіть назву для пристрою.');
            return;
        }

        // Пошук поточного активного поверху
        // Використовуємо currentFloorId для визначення поточного відображуваного поверху
        const currentActiveFloorElement = document.getElementById(currentFloorId);

        if (!currentActiveFloorElement || currentFloorId === 'outside') {
            alert('Будь ласка, оберіть внутрішній поверх (1-5) для додавання пристрою.');
            return;
        }

        // Знаходимо всі місця для пристроїв на поточному поверсі
        const itemPlaceholders = currentActiveFloorElement.querySelectorAll('.item-placeholder');

        if (itemPlaceholders.length === 0) {
            alert('На цьому поверсі немає місць для додавання пристроїв.');
            return;
        }

        // Створення нового елемента
        const newItemDiv = document.createElement('div');
        newItemDiv.classList.add('smart-item', itemType);

        let itemDisplayName = '';
        switch (itemType) {
            case 'light': itemDisplayName = 'Світло'; break;
            case 'thermostat': itemDisplayName = 'Термостат'; break;
            case 'speaker': itemDisplayName = 'Колонка'; break;
            case 'tv': itemDisplayName = 'Телевізор'; break;
            default: itemDisplayName = itemType;
        }

        newItemDiv.innerHTML = `
            <span>${itemName} (${itemDisplayName})</span>
            <button data-action="toggle">Увімкнути/Вимкнути</button>
        `;

        // Додаємо обробник подій для кнопки
        const toggleButton = newItemDiv.querySelector('button');
        toggleButton.addEventListener('click', () => {
            alert(`Керування пристроєм: ${itemName} (${itemDisplayName})`);
            // Тут можна додати більш складну логіку керування
        });

        // Додаємо новий елемент до першого доступного "placeholder"
        let added = false;
        for (const placeholder of itemPlaceholders) {
            // Перевіряємо, чи є в placeholder вже елементи. Якщо ні, додаємо.
            // Можна додати більш складну логіку для вибору місця, наприклад, кімнати
            if (placeholder.children.length === 0) {
                placeholder.appendChild(newItemDiv);
                added = true;
                break;
            }
        }

        if (!added) {
            alert('Всі місця для пристроїв на цьому поверсі зайняті. Створіть нову кімнату або приберіть існуючі пристрої.');
            return;
        }

        itemNameInput.value = ''; // Очистити поле введення
    });
});
