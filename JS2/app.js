'use strict';

class Product {
    /** @type {string} */
    name;
    /** @type {number} */
    quantity = 1;
    /** @type {boolean} */
    bought = false;

    /** @type {HTMLElement} */
    root;
    
    /** @type {HTMLElement} */
    rightRoot;

    constructor(name) {
        this.name = name;
        this.createRoot();
        // this.redraw();
    }

    /** @returns {HTMLElement} */
    createRoot() {
        const mainDiv = crtEl('div', 'product');
        mainDiv.context = this;
        this.root = mainDiv;
        const productName = crtEl('div', 'productName');
        productName.innerText = this.name;
        mainDiv.appendChild(productName);
        const productQuantity = crtEl('div', 'productQuantity');
        mainDiv.appendChild(productQuantity);
        const inputBtnMinus = crtEl('button', 'quantity-arrow-minus');
        inputBtnMinus.setAttribute('data-tooltip', 'Зменшити');
        inputBtnMinus.innerText = '-';
        inputBtnMinus.onclick = (e) => {
            /** @type {Product} */
            const product = e.target.parentElement.parentElement.context;
            if (product.quantity > 0) {
                product.quantity--;
                product.redraw();
            }
        }
        const inputBtnPlus = crtEl('button', 'quantity-arrow-plus');
        inputBtnPlus.setAttribute('data-tooltip', 'Збільшити');
        inputBtnPlus.innerText = '+';
        inputBtnPlus.onclick = (e) => {
            /** @type {Product} */
            const product = e.target.parentElement.parentElement.context;
            if (product.quantity < 1000) {
                product.quantity++;
                product.redraw();
            }
        }
        const quantityInput = crtEl('input', 'quantity-num');
        quantityInput.setAttribute('type', 'number');
        quantityInput.setAttribute('min', '0');
        quantityInput.setAttribute('max', '1000');
        quantityInput.setAttribute('step', '1');
        quantityInput.setAttribute('value', '1');
        productQuantity.appendChild(inputBtnMinus);
        productQuantity.appendChild(quantityInput);
        productQuantity.appendChild(inputBtnPlus);
        quantityInput.oninput = (e) => {
            console.log(e);
            /** @type {Product} */
            const product = e.target.parentElement.parentElement.context;
            const value = parseInt(e.target.value);
            if (!isNaN(value)) {
                product.quantity = value;
                product.redraw();
            }
        }

        const productRight = crtEl('div', 'productRight');
        mainDiv.appendChild(productRight);
        const buyBtn = crtEl('button', 'buy');
        buyBtn.innerText = 'Куплено';
        buyBtn.setAttribute('data-tooltip', 'Куплено');
        buyBtn.onclick = (e) => {
            /** @type {Product} */
            const product = e.target.parentElement.parentElement.context;
            product.bought = !product.bought;
            product.redraw();
        }
        productRight.appendChild(buyBtn);
        const delBtn = crtEl('button', 'delete');
        delBtn.innerText = 'x';
        delBtn.setAttribute('data-tooltip', 'Видалити');
        delBtn.onclick = (e) => {
            /** @type {Product} */
            const product = e.target.parentElement.parentElement.context;
            product.root.remove();
            product.rightRoot.remove();
        }
        productRight.appendChild(delBtn);
        
        document.querySelector('#left > .products').appendChild(this.root);

        const rightRoot = crtEl('div', 'rightProduct');
        this.rightRoot = rightRoot;
        const rightName = crtEl('span', 'name');
        rightName.innerText = this.name;
        rightRoot.appendChild(rightName);
        const rightQuantity = crtEl('span', 'quantity');
        rightQuantity.innerText = Math.round(this.quantity);
        rightRoot.appendChild(rightQuantity);

        document.querySelector('#right_left > .products').appendChild(this.rightRoot);
    }

    redraw() {
        this.root.querySelector('input.quantity-num').value = Math.round(this.quantity);
        this.rightRoot.querySelector('span.quantity').innerText = Math.round(this.quantity);
        this.rightRoot.remove();
        if (this.bought) {
            this.root.querySelector('button.delete').style.display = 'none';
            this.root.querySelector('.productName').style.textDecoration = 'line-through';
            this.root.querySelector('.productQuantity > input').setAttribute('disabled', 'true');
            document.querySelector('#right_bought > .products').appendChild(this.rightRoot);
        } else {
            this.root.querySelector('button.delete').style.display = 'unset';
            this.root.querySelector('.productName').style.textDecoration = 'none';
            this.root.querySelector('.productQuantity > input').removeAttribute('disabled');
            document.querySelector('#right_left > .products').appendChild(this.rightRoot);
        }
    }
}


/**
 * 
 * @param {string} tagName 
 * @param {...string|undefined} classes 
 * @returns {HTMLElement}
 */
function crtEl(tagName, ...classes) {
    const element = document.createElement(tagName);
    if (classes) element.classList.add(...classes);
    return element;
}


document.getElementById('addButton').onclick = (e) => {
    const name = document.getElementById('addInput').value;
    if (name) {
        new Product(name);
        document.getElementById('addInput').value = '';
    } else {
        alert('Введи правильну назву')
    }
}

document.getElementById('addInput').addEventListener('focusin', (e) => {
    document.querySelector('.badge').classList.add('wbadge');
});
document.getElementById('addInput').addEventListener('focusout', (e) => {
    document.querySelector('.badge').classList.remove('wbadge');
});


new Product('Anna Bell Peaks))');
new Product('Нафта');
new Product('Земля');
new Product('Держоблігації');
