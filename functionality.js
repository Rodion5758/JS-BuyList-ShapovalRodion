document.addEventListener('DOMContentLoaded', () => {
    const shoppingList = document.querySelector('.main-shopping-list-section');
    const summaryList = document.querySelector('.shopping-summary-section');
    const newItemNameInput = document.querySelector('.new-item-name-input');

    shoppingList.addEventListener('click', (event) => {
        const target = event.target;
        const productItem = target.closest('.shopping-list-item');
        let correspondingSummary = productItem
            ? summaryList.querySelector(`.summary-item[data-name="${productItem.dataset.name}"]`)
            : null;

        if (target.classList.contains('add-item-button')) {
            handleAddItem(newItemNameInput, shoppingList, summaryList);
            return;
        }

        if (!productItem) return;

        if (target.classList.contains('decrease-btn')) {
            decrementQuantity(productItem, correspondingSummary);
        } else if (target.classList.contains('increase-btn')) {
            incrementQuantity(productItem, correspondingSummary);
        } else if (target.classList.contains('item-status-label')) {
            toggleItemStatus(productItem, correspondingSummary, summaryList);
        } else if (target.classList.contains('item-name-display') && !productItem.classList.contains('bought')) {
            enableNameEdit(target, correspondingSummary);
        } else if (target.classList.contains('remove-item-btn')) {
            removeItem(productItem, correspondingSummary);
        }
    });

    updateButtons();
});

function handleAddItem(input, shoppingList, summaryList) {
    const itemName = input.value.trim();
    if (!itemName) return;

    if (isItemPresent(shoppingList, itemName, summaryList)) {
        input.value = '';
        return;
    }

    const newItem = createShoppingListItem(itemName);
    shoppingList.appendChild(newItem);

    const newSummaryItem = createSummaryItem(itemName, 1);
    const remainingSummaryList = summaryList.querySelector('.summary-items-list');
    if (remainingSummaryList) {
        remainingSummaryList.appendChild(newSummaryItem);
    }

    input.value = '';
    updateButtons();
}

function isItemPresent(shoppingList, itemName, summaryList) {
    const items = shoppingList.querySelectorAll('.shopping-list-item');
    for (const element of items) {
        if (element.querySelector('.item-name-display').textContent === itemName) {
            const summary = summaryList.querySelector(`.summary-item[data-name="${element.dataset.name}"]`);
            incrementQuantity(element, summary);
            return true;
        }
    }
    return false;
}

function createShoppingListItem(itemName) {
    const newItem = document.createElement('div');
    newItem.className = 'shopping-list-item';
    newItem.dataset.name = itemName;
    newItem.innerHTML = `
        <span class="item-name-display">${itemName}</span>
        <div class="item-quantity-controls">
            <button class="quantity-adjust-btn decrease-btn" data-tooltip="Відняти одиницю товару">-</button>
            <span class="current-quantity-display">1</span>
            <button class="quantity-adjust-btn increase-btn" data-tooltip="Додати одиницю товару">+</button>
        </div>
        <div class="item-status-and-actions">
            <button class="item-status-label" data-tooltip="Змінити статус товару">Куплено</button>
            <button class="remove-item-btn" data-tooltip="Видалити товар зі спикску">x</button>
        </div>
    `;
    return newItem;
}

function createSummaryItem(itemName, quantity) {
    const summaryItem = document.createElement('span');
    summaryItem.className = 'summary-item';
    summaryItem.dataset.name = itemName;
    summaryItem.innerHTML = `
        <span class="summary-item-name">${itemName}</span>
        <span class="summary-item-quantity">${quantity}</span>
    `;
    return summaryItem;
}

function incrementQuantity(productItem, correspondingSummary) {
    const quantityDisplay = productItem.querySelector('.current-quantity-display');
    let quantity = parseInt(quantityDisplay.textContent);
    quantityDisplay.textContent = quantity + 1;
    if (correspondingSummary) {
        correspondingSummary.querySelector('.summary-item-quantity').textContent = quantity + 1;
        if (quantity < 2) productItem.querySelector('.decrease-btn').disabled = false;
    }
}

function decrementQuantity(productItem, correspondingSummary) {
    const quantityDisplay = productItem.querySelector('.current-quantity-display');
    let quantity = parseInt(quantityDisplay.textContent);
    if (quantity > 1) {
        quantityDisplay.textContent = quantity - 1;
        if (correspondingSummary)
            correspondingSummary.querySelector('.summary-item-quantity').textContent = quantity - 1;
    }
    if (quantity < 3) productItem.querySelector('.decrease-btn').disabled = true;
}

function toggleItemStatus(productItem, correspondingSummary, summaryList) {
    const statusBtn = productItem.querySelector('.item-status-label');
    const sumLists = Array.from(summaryList.querySelectorAll('.summary-items-list'));

    if (!correspondingSummary) {
        correspondingSummary = createSummaryItem(
            productItem.querySelector('.item-name-display').textContent,
            productItem.querySelector('.current-quantity-display').textContent
        );
    }

    if (productItem.classList.contains('bought')) {
        statusBtn.textContent = "Куплено";
        productItem.classList.remove('bought');
        correspondingSummary.classList.remove('bought');
        sumLists[0].appendChild(correspondingSummary);
        if (sumLists[1].contains(correspondingSummary)) {
            sumLists[1].removeChild(correspondingSummary);
        }
    } else {
        statusBtn.textContent = "Не куплено";
        productItem.classList.add('bought');
        correspondingSummary.classList.add('bought');
        sumLists[1].appendChild(correspondingSummary);
        if (sumLists[0].contains(correspondingSummary)) {
            sumLists[0].removeChild(correspondingSummary);
        }
    }
}

function enableNameEdit(target, correspondingSummary) {
    const originalText = target.textContent;
    const input = document.createElement('input');
    input.className = 'item-name-edit-input';
    input.type = 'text';
    input.value = originalText;

    target.replaceWith(input);
    input.focus();
    input.select();

    input.addEventListener('blur', () => {
        let label = input.value || originalText;
        const newText = document.createElement('span');
        newText.className = 'item-name-display';
        newText.textContent = label;
        input.replaceWith(newText);
        if (correspondingSummary) {
            correspondingSummary.querySelector('.summary-item-name').textContent = label;
        }
    });
}

function removeItem(productItem, correspondingSummary) {
    productItem.remove();
    if (correspondingSummary) {
        correspondingSummary.remove();
    }
}

function updateButtons() {
    document.querySelectorAll('.shopping-list-item').forEach(element => {
        let decBtn = element.querySelector('.decrease-btn');
        if (parseInt(element.querySelector('.current-quantity-display').textContent) <= 1) {
            decBtn.disabled = true;
        } else {
            decBtn.disabled = false;
        }
    });
}