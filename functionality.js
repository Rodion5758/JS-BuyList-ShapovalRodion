document.addEventListener('DOMContentLoaded', () => {
  const shoppingList = document.querySelector('.main-shopping-list-section');
  const summaryList = document.querySelector('.shopping-summary-section');
  
  shoppingList.addEventListener('click', (event) => {
    const target = event.target;
    const productItem = target.closest('.shopping-list-item');
    const correspondingSummary = summaryList.querySelector(`[data-name="${productItem.dataset.name}"]`);
    
    // Для кнопок зменшення кількості
    if (target.classList.contains('decrease-btn')) {
        const quantityDisplay = productItem.querySelector('.current-quantity-display');
        let quantity = parseInt(quantityDisplay.textContent);
      if (quantity > 1) {
          quantityDisplay.textContent = quantity - 1;
          correspondingSummary.querySelector('.summary-item-quantity').textContent = quantity - 1;
        }
    }

    if (target.classList.contains('increase-btn')) {
      const quantityDisplay = productItem.querySelector('.current-quantity-display');
      let quantity = parseInt(quantityDisplay.textContent);
      quantityDisplay.textContent = quantity + 1;
      correspondingSummary.querySelector('.summary-item-quantity').textContent = quantity + 1;
    }

    // Changing status of an item
    if (target.classList.contains('item-status-label')) {
      const sumLists = Array.from(summaryList.querySelectorAll('.summary-items-list'));

      if (productItem.classList.contains('bought')) {
        target.textContent = "Куплено";
        productItem.classList.remove('bought');
        correspondingSummary.classList.remove('bought');
        sumLists[0].appendChild(correspondingSummary);
        sumLists[1].removeChild(correspondingSummary);

    } else {
        target.textContent = "Не куплено";
        productItem.classList.add('bought');
        correspondingSummary.classList.add('bought');
        sumLists[1].appendChild(correspondingSummary);
        sumLists[0].removeChild(correspondingSummary);
      }
    }

    if (target.classList.contains('item-name-display') && !productItem.classList.contains('bought')) {
        const originalText = target.textContent;
            
        const input = document.createElement('input');
        input.className = 'item-name-edit-input';
        input.type = 'text';
        input.value = originalText;
            
        target.replaceWith(input);
            
        input.focus();
        input.select();
            
        input.addEventListener('blur', () => {
            let label = input.value;
            if (label === '') label = originalText;
            let newtext = document.createElement('span');
            newtext.className = 'item-name-display';
            newtext.textContent = label;
            input.replaceWith(newtext);
            correspondingSummary.querySelector('.summary-item-name').textContent = label;
        });
    }
  });
  // Обробка додавання нового товару
//   document.querySelector('.add-item-button').addEventListener('click', () => {
//     const input = document.querySelector('.new-item-name-input');
//     const itemName = input.value.trim();
    
//     if (itemName) {
//       const newItem = document.createElement('div');
//       newItem.className = 'shopping-list-item';
//       newItem.innerHTML = `
//         <span class="item-name-display">${itemName}</span>
//         <div class="item-quantity-controls">
//           <button class="quantity-adjust-btn decrease-btn">-</button>
//           <span class="current-quantity-display">1</span>
//           <button class="quantity-adjust-btn increase-btn">+</button>
//         </div>
//         <div class="item-status-and-actions">
//           <span class="item-status-label">Не куплено</span>
//           <button class="remove-item-btn">x</button>
//         </div>
//       `;
      
//       shoppingList.appendChild(newItem);
//       input.value = '';
//     }
//   });
});