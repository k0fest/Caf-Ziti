document.addEventListener('DOMContentLoaded', function () {
    const anchorContainer = document.getElementById('anchorCategories');
    const menuContainer = document.getElementById('menuSections');

    fetch('../data/menu.json')
        .then(response => response.json())
        .then(data => {
            validateMenuData(data);
            renderMenu(data, anchorContainer, menuContainer);
        })
        .catch(error => {
            console.error('Ошибка загрузки меню:', error);
            menuContainer.innerHTML = '<p style="text-align:center; color:#904d30;">Извините, меню временно недоступно</p>';
        });
});

function validateMenuData(data) {
    const categories = data.categories;
    const dishes = data.dishes;
    const categoryIds = categories.map(cat => cat.id);

    let hasErrors = false;

    dishes.forEach((dish, index) => {
        // 1. Название – не более 100 символов
        if (dish.name.length > 100) {
            console.warn(`[Ошибка валидации] Блюдо #${index + 1}: название слишком длинное (${dish.name.length} > 100): "${dish.name}"`);
            hasErrors = true;
        }

        // 2. Описание – не более 500 символов
        if (dish.description.length > 500) {
            console.warn(`[Ошибка валидации] Блюдо #${index + 1}: описание слишком длинное (${dish.description.length} > 500): "${dish.name}"`);
            hasErrors = true;
        }

        // 3. Цена – должна быть числом
        if (typeof dish.price !== 'number' || isNaN(dish.price)) {
            console.warn(`[Ошибка валидации] Блюдо #${index + 1}: цена должна быть числом, получено "${dish.price}" для "${dish.name}"`);
            hasErrors = true;
        }

        // 4. Вес – формат "XXX г" или "XXX мл"
        const weightPattern = /^\d+\s*[гмл]/;
        if (!weightPattern.test(dish.weight)) {
            console.warn(`[Ошибка валидации] Блюдо #${index + 1}: вес должен быть в формате "XXX г" или "XXX мл", получено "${dish.weight}" для "${dish.name}"`);
            hasErrors = true;
        }

        // 5. Категория – должна быть в предопределённом списке
        if (!categoryIds.includes(dish.category)) {
            console.warn(`[Ошибка валидации] Блюдо #${index + 1}: категория "${dish.category}" не найдена в списке для "${dish.name}"`);
            hasErrors = true;
        }
    });

    if (!hasErrors) {
        console.log('[Валидация] ✅ Все данные меню корректны');
    } else {
        console.warn('[Валидация] ❌ Обнаружены ошибки в данных меню (см. предупреждения выше)');
    }
}

function renderMenu(data, anchorContainer, menuContainer) {
    const categories = data.categories;
    const dishes = data.dishes;

    let buttonsHTML = '';
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        buttonsHTML += `<a href="#cat-${category.id}" class="anchor-link">${category.name}</a>`;
    }
    anchorContainer.innerHTML = buttonsHTML;

    let sectionsHTML = '';

    for (let i = 0; i < categories.length; i++) {
        const currentCategory = categories[i];

        const categoryDishes = [];
        for (let j = 0; j < dishes.length; j++) {
            if (dishes[j].category === currentCategory.id) {
                categoryDishes.push(dishes[j]);
            }
        }

        if (categoryDishes.length === 0) continue;

        let cardsHTML = '';
        for (let k = 0; k < categoryDishes.length; k++) {
            const dish = categoryDishes[k];
            cardsHTML += `
                <div class="menu-card">
                    <img src="${dish.image}" alt="${dish.name}" loading="lazy">
                    <div class="card-content">
                        <h3>${dish.name}</h3>
                        <p class="card-desc">${dish.description}</p>
                        <div class="card-footer">
                            <span class="weight">⚖️ ${dish.weight}</span>
                            <span class="price">${dish.price} ₽</span>
                        </div>
                    </div>
                </div>
            `;
        }

        sectionsHTML += `
            <div id="cat-${currentCategory.id}" class="category-section">
                <h2 class="category-title">${currentCategory.name}</h2>
                <div class="menu-grid">
                    ${cardsHTML}
                </div>
            </div>
        `;
    }

    menuContainer.innerHTML = sectionsHTML;
}