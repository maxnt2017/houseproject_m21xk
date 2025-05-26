document.addEventListener('DOMContentLoaded', () => {
    const mainDoor = document.getElementById('mainDoor');
    const doorStatus = document.getElementById('doorStatus'); // Елемент для відображення статусу дверей
    const openDoorButton = document.getElementById('openDoorButton');
    const closeDoorButton = document.getElementById('closeDoorButton');
    const repairDoorButton = document.getElementById('repairDoorButton');

    const cameraIcon = document.getElementById('cameraIcon');
    const cameraFeed = document.getElementById('cameraFeed');
    const cameraVideo = document.getElementById('cameraVideo');
    const toggleCameraButton = document.getElementById('toggleCamera');

    const navButtons = document.querySelectorAll('.nav-button');
    const allViews = document.querySelectorAll('.house-facade, .floor-layout');

    const addItemButton = document.getElementById('addItem');
    const itemTypeSelect = document.getElementById('itemType');
    const itemNameInput = document.getElementById('itemName');
    const selectRoomMessage = document.querySelector('.select-room-message');

    let currentFloorId = 'outside'; // Початковий поверх - зовнішній вигляд
    let selectedRoom = null; // Змінна для зберігання поточної вибраної кімнати
    let isDoorBroken = false; // Змінна для відстеження стану дверей (зламані чи ні)

    // Функція для оновлення статусу дверей на інтерфейсі
    function updateDoorStatus(statusText, isBroken = false) {
        doorStatus.textContent = statusText;
        if (isBroken) {
            mainDoor.classList.add('broken');
            // Деактивуємо кнопки відкриття/закриття, якщо двері зламані
            openDoorButton.disabled = true;
            closeDoorButton.disabled = true;
        } else {
            mainDoor.classList.remove('broken');
            openDoorButton.disabled = false;
            closeDoorButton.disabled = false;
        }
        isDoorBroken = isBroken;
    }

    // Ініціалізуємо статус дверей при завантаженні
    updateDoorStatus('Двері зачинені', false);

    // Функція для перемикання поверхів
    function switchFloor(targetFloorId) {
        allViews.forEach(view => {
            view.classList.remove('current-floor');
            view.style.display = 'none';
        });

        const targetElement = document.getElementById(targetFloorId);
        if (targetElement) {
            targetElement.style.display = 'flex';
            targetElement.classList.add('current-floor');
            currentFloorId = targetFloorId;

            // Скидаємо вибрану кімнату при зміні поверху
            if (selectedRoom) {
                selectedRoom.classList.remove('selected-room');
                selectedRoom = null;
                selectRoomMessage.style.display = 'block'; // Показати повідомлення, що кімнату треба обрати
            } else if (currentFloorId !== 'outside') {
                selectRoomMessage.style.display = 'block';
            } else {
                selectRoomMessage.style.display = 'none';
            }
        }
    }

    // Ініціалізація: показати зовнішній вигляд при завантаженні сторінки
    switchFloor('outside');

    // Керування дверима
    openDoorButton.addEventListener('click', () => {
        if (isDoorBroken) {
            alert('Двері зламані! Спочатку їх потрібно відремонтувати.');
            return;
        }
        mainDoor.classList.add('open');
        updateDoorStatus('Двері відчинені');
    });

    closeDoorButton.addEventListener('click', () => {
        if (isDoorBroken) {
            alert('Двері зламані! Спочатку їх потрібно відремонтувати.');
            return;
        }
        mainDoor.classList.remove('open');
        updateDoorStatus('Двері зачинені');
    });

    repairDoorButton.addEventListener('click', () => {
        if (!isDoorBroken) {
            alert('Двері не зламані. Можна зламати їх (для демонстрації) або продовжити.');
            // Для демонстрації можна додати випадкове "зламати"
            if (confirm('Двері не зламані. Зламати їх для демонстрації?')) {
                updateDoorStatus('Двері зламані!', true);
                alert('Двері зламалися!');
            }
            return;
        }
        updateDoorStatus('Двері відремонтовано. Зачинені.');
        alert('Двері успішно відремонтовано!');
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
        toggleCameraButton.click();
    });

    // Навігація по поверхах
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const floorId = button.dataset.floor;
            switchFloor(floorId);
        });
    });

    // Обробник кліку на кімнату
    document.querySelector('.house-view').addEventListener('click', (event) => {
        const clickedRoom = event.target.closest('.room');

        if (clickedRoom) {
            const currentActiveFloorElement = document.getElementById(currentFloorId);
            if (currentActiveFloorElement && currentActiveFloorElement.contains(clickedRoom)) {
                if (selectedRoom) {
                    selectedRoom.classList.remove('selected-room');
                }
                clickedRoom.classList.add('selected-room');
                selectedRoom = clickedRoom;
                selectRoomMessage.style.display = 'none';
            }
        }
    });

    // Додавання "розумних" речей
    addItemButton.addEventListener('click', () => {
        const itemType = itemTypeSelect.value;
        const itemName = itemNameInput.value.trim();

        if (!itemName) {
            alert('Будь ласка, введіть назву для пристрою.');
            return;
        }

        if (!selectedRoom) {
            alert('Будь ласка, спочатку виберіть кімнату, щоб додати пристрій.');
            selectRoomMessage.style.display = 'block';
            return;
        }

        const itemPlaceholder = selectedRoom.querySelector('.item-placeholder');

        if (!itemPlaceholder) {
            alert('Не знайдено місце для пристроїв у вибраній кімнаті.');
            return;
        }

        const newItemDiv = document.createElement('div');
        newItemDiv.classList.add('smart-item', itemType);

        let itemDisplayName = '';
        let itemContent = '';

        switch (itemType) {
            case 'light':
                itemDisplayName = 'Світло';
                itemContent = `<span>${itemName} (${itemDisplayName})</span>
                               <button data-action="toggle">Увімкнути</button>`;
                break;
            case 'thermostat':
                itemDisplayName = 'Термостат';
                itemContent = `<span>${itemName} (${itemDisplayName})</span>
                               <span class="temperature">22°C</span>
                               <button data-action="temp-up">+</button>
                               <button data-action="temp-down">-</button>`;
                break;
            case 'speaker':
                itemDisplayName = 'Колонка';
                itemContent = `<span>${itemName} (${itemDisplayName})</span>
                               <button data-action="play">Відтворити</button>
                               <button data-action="pause">Пауза</button>`;
                break;
            case 'tv':
                itemDisplayName = 'Телевізор';
                itemContent = `<span>${itemName} (${itemDisplayName})</span>
                               <button data-action="toggle">Увімкнути</button>`;
                break;
            case 'motion-sensor':
                itemDisplayName = 'Датчик руху';
                itemContent = `<span>${itemName} (${itemDisplayName})</span>
                               <span class="status">Неактивний</span>
                               <button data-action="toggle-status">Перемкнути статус</button>`;
                break;
            case 'smart-lock':
                itemDisplayName = 'Розумний замок';
                itemContent = `<span>${itemName} (${itemDisplayName})</span>
                               <span class="status">Заблоковано</span>
                               <button data-action="toggle-lock">Розблокувати</button>`;
                break;
            case 'blinds':
                itemDisplayName = 'Розумні штори';
                itemContent = `<span>${itemName} (${itemDisplayName})</span>
                               <div class="blinds-controls">
                                   <button data-action="open">Відкрити</button>
                                   <button data-action="close">Закрити</button>
                                   <button data-action="partially">Привідкрити</button>
                               </div>`;
                break;
            case 'air-purifier':
                itemDisplayName = 'Очищувач повітря';
                itemContent = `<span>${itemName} (${itemDisplayName})</span>
                               <span class="status">Вимкнений</span>
                               <button data-action="toggle">Увімкнути</button>`;
                break;
            case 'smoke-detector':
                itemDisplayName = 'Датчик диму';
                itemContent = `<span>${itemName} (${itemDisplayName})</span>
                               <span class="status">Норма</span>
                               <button data-action="simulate-alarm">Імітувати дим</button>
                               <button data-action="reset-alarm" style="display: none;">Скинути</button>`;
                break;
            case 'smart-plug':
                itemDisplayName = 'Розумна розетка';
                itemContent = `<span>${itemName} (${itemDisplayName})</span>
                               <span class="status">Вимкнена</span>
                               <button data-action="toggle">Увімкнути</button>`;
                break;
            case 'robot-vacuum':
                itemDisplayName = 'Робот-пилосос';
                itemContent = `<span>${itemName} (${itemDisplayName})</span>
                               <span class="status">Припаркований</span>
                               <button data-action="start-cleaning">Почати прибирання</button>
                               <button data-action="dock">Припаркувати</button>`;
                break;
            default:
                itemDisplayName = itemType;
                itemContent = `<span>${itemName} (${itemDisplayName})</span>
                               <button data-action="info">Інфо</button>`;
                break;
        }

        newItemDiv.innerHTML = itemContent;

        newItemDiv.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                const parentItem = button.closest('.smart-item');

                switch (itemType) {
                    case 'light':
                    case 'tv':
                    case 'smart-plug':
                        const toggleButton = button;
                        const statusSpan = parentItem.querySelector('.status');
                        if (toggleButton.textContent.includes('Увімкнути')) {
                            toggleButton.textContent = 'Вимкнути';
                            parentItem.classList.add('on');
                            if (statusSpan) statusSpan.textContent = 'Увімкнена';
                        } else {
                            toggleButton.textContent = 'Увімкнути';
                            parentItem.classList.remove('on');
                            if (statusSpan) statusSpan.textContent = 'Вимкнена';
                        }
                        alert(`Керування ${itemName}: ${toggleButton.textContent}`);
                        break;
                    case 'thermostat':
                        const tempSpan = parentItem.querySelector('.temperature');
                        let currentTemp = parseInt(tempSpan.textContent);
                        if (action === 'temp-up') {
                            currentTemp++;
                        } else if (action === 'temp-down') {
                            currentTemp--;
                        }
                        tempSpan.textContent = `${currentTemp}°C`;
                        alert(`Температура ${itemName}: ${currentTemp}°C`);
                        break;
                    case 'speaker':
                        if (action === 'play') {
                            alert(`Відтворюється на ${itemName}`);
                        } else if (action === 'pause') {
                            alert(`Пауза на ${itemName}`);
                        }
                        break;
                    case 'motion-sensor':
                        const sensorStatus = parentItem.querySelector('.status');
                        if (sensorStatus.textContent === 'Неактивний') {
                            sensorStatus.textContent = 'Активний';
                            parentItem.classList.add('active');
                            alert(`Датчик руху ${itemName}: Виявлено рух!`);
                        } else {
                            sensorStatus.textContent = 'Неактивний';
                            parentItem.classList.remove('active');
                            alert(`Датчик руху ${itemName}: Активний статус скинуто.`);
                        }
                        break;
                    case 'smart-lock':
                        const lockStatus = parentItem.querySelector('.status');
                        const lockButton = button;
                        if (lockStatus.textContent === 'Заблоковано') {
                            lockStatus.textContent = 'Розблоковано';
                            parentItem.classList.remove('locked');
                            parentItem.classList.add('unlocked');
                            lockButton.textContent = 'Заблокувати';
                            alert(`Замок ${itemName}: Розблоковано.`);
                        } else {
                            lockStatus.textContent = 'Заблоковано';
                            parentItem.classList.remove('unlocked');
                            parentItem.classList.add('locked');
                            lockButton.textContent = 'Розблокувати';
                            alert(`Замок ${itemName}: Заблоковано.`);
                        }
                        break;
                    case 'blinds':
                        if (action === 'open') {
                            alert(`Штори ${itemName}: Повністю відкрито.`);
                        } else if (action === 'close') {
                            alert(`Штори ${itemName}: Повністю закрито.`);
                        } else if (action === 'partially') {
                            alert(`Штори ${itemName}: Привідкрито.`);
                        }
                        break;
                    case 'air-purifier':
                        const purifierStatus = parentItem.querySelector('.status');
                        const purifierButton = button;
                        if (purifierButton.textContent.includes('Увімкнути')) {
                            purifierButton.textContent = 'Вимкнути';
                            purifierStatus.textContent = 'Увімкнений';
                            parentItem.classList.add('on');
                        } else {
                            purifierButton.textContent = 'Увімкнути';
                            purifierStatus.textContent = 'Вимкнений';
                            parentItem.classList.remove('on');
                        }
                        alert(`Очищувач повітря ${itemName}: ${purifierStatus.textContent}`);
                        break;
                    case 'smoke-detector':
                        const smokeStatus = parentItem.querySelector('.status');
                        const simulateButton = parentItem.querySelector('button[data-action="simulate-alarm"]');
                        const resetButton = parentItem.querySelector('button[data-action="reset-alarm"]');
                        if (action === 'simulate-alarm') {
                            smokeStatus.textContent = 'ТРИВОГА!';
                            parentItem.classList.add('alarm');
                            simulateButton.style.display = 'none';
                            resetButton.style.display = 'inline-block';
                            alert(`Датчик диму ${itemName}: Виявлено дим!`);
                        } else if (action === 'reset-alarm') {
                            smokeStatus.textContent = 'Норма';
                            parentItem.classList.remove('alarm');
                            simulateButton.style.display = 'inline-block';
                            resetButton.style.display = 'none';
                            alert(`Датчик диму ${itemName}: Скинуто тривогу.`);
                        }
                        break;
                    case 'robot-vacuum':
                        const vacuumStatus = parentItem.querySelector('.status');
                        const startButton = parentItem.querySelector('button[data-action="start-cleaning"]');
                        const dockButton = parentItem.querySelector('button[data-action="dock"]');

                        if (action === 'start-cleaning') {
                            vacuumStatus.textContent = 'Прибирання...';
                            parentItem.classList.remove('docked');
                            parentItem.classList.add('cleaning');
                            startButton.style.display = 'none';
                            dockButton.style.display = 'inline-block';
                            alert(`Робот-пилосос ${itemName}: Почав прибирання.`);
                        } else if (action === 'dock') {
                            vacuumStatus.textContent = 'Припаркований';
                            parentItem.classList.remove('cleaning');
                            parentItem.classList.add('docked');
                            startButton.style.display = 'inline-block';
                            dockButton.style.display = 'none';
                            alert(`Робот-пилосос ${itemName}: Припарковано.`);
                        }
                        break;
                    default:
                        alert(`Керування пристроєм: ${itemName} (${itemDisplayName}) - Дія: ${action}`);
                        break;
                }
            });
        });

        itemPlaceholder.appendChild(newItemDiv);
        itemNameInput.value = '';
    });
});
