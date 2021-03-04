/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

// Сумарна ціна замовлення
let totalCost = 0;

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");

function addToCart(pizza, size) {
	//Додавання однієї піци в кошик покупок
	const pizzaExists = Cart.find(
		(pizzaToFind) =>
			pizzaToFind.pizza.title == pizza.title && pizzaToFind.size == size
	);
	if (pizzaExists !== undefined) {
        ++pizzaExists.quantity;
        localStorage.setItem(
			pizzaExists.pizza.id + (size === PizzaSize.Big ? "b" : "s"),
			JSON.stringify({
				pizza: pizza,
				size: size,
				quantity: pizzaExists.quantity,
			})
		);
	} else {
		Cart.push({
			pizza: pizza,
			size: size,
			quantity: 1,
		});
        localStorage.setItem(
			pizza.id + (size === PizzaSize.Big ? "b" : "s"),
			JSON.stringify({
				pizza: pizza,
				size: size,
				quantity: 1,
			})
		);
	}

	totalCost += pizza[size].price;

	//Оновити вміст кошика на сторінці
	updateCart();
}

function removeFromCart(cart_item) {
	//Видалити піцу з кошика
	const pizzaToDeleteIndex = Cart.findIndex(
		(pizza) => pizza.pizza.title === cart_item.pizza.title && pizza.size == cart_item.size
	);
    Cart.splice(pizzaToDeleteIndex, 1);
    localStorage.removeItem(cart_item.pizza.id + (cart_item.size === PizzaSize.Big ? "b" : "s"));
	//Після видалення оновити відображення
	updateCart();
}

function initializeCart() {
	//Фукнція віпрацьвуватиме при завантаженні сторінки
	//Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
	let keys = Object.keys(localStorage);
	for (let key of keys) {
		try {
            let pizza = JSON.parse(localStorage.getItem(key));
			let pizzaSize = pizza.size;
            if (pizza !== null && typeof pizza === 'object') {
                Cart.push(pizza);
				totalCost += pizza.pizza[pizzaSize].price * pizza.quantity;
            }
        } catch (e) {
            continue;
        }
	}
	updateCart();
}

function getPizzaInCart() {
	//Повертає піци які зберігаються в кошику
	return Cart;
}

function updateCart() {
	//Функція викликається при зміні вмісту кошика
	//Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

	//Очищаємо старі піци в кошику
	$cart.html("");

	//Онволення однієї піци
	function showOnePizzaInCart(cart_item) {
		var html_code = Templates.PizzaCart_OneItem(cart_item);

		var $node = $(html_code);

		$node.find(".plus").click(function () {
			//Збільшуємо кількість замовлених піц
			++cart_item.quantity;
			localStorage.setItem(
				cart_item.pizza.id + (cart_item.size === PizzaSize.Big ? "b" : "s"),
				JSON.stringify({
					pizza: cart_item.pizza,
					size: cart_item.size,
					quantity: cart_item.quantity,
				})
			);
			totalCost += cart_item.pizza[cart_item.size].price;
			//Оновлюємо відображення
			updateCart();
		});

		$node.find(".minus").click(function () {
			//Зменшуємо кількість замовлених піц
			--cart_item.quantity;
			localStorage.setItem(
				cart_item.pizza.id + (cart_item.size === PizzaSize.Big ? "b" : "s"),
				JSON.stringify({
					pizza: cart_item.pizza,
					size: cart_item.size,
					quantity: cart_item.quantity,
				})
			);
			if (cart_item.quantity <= 0) {
				removeFromCart(cart_item);
			}
			totalCost -= cart_item.pizza[cart_item.size].price;
			//Оновлюємо відображення
			updateCart();
		});

		$node.find(".delete").click(function () {
			// Видаляємо піцу з кошика
			removeFromCart(cart_item);
			totalCost -= cart_item.pizza[cart_item.size].price * cart_item.quantity;
			//Оновлюємо відображення
			updateCart();
		});

		$cart.append($node);
	}

	Cart.forEach(showOnePizzaInCart);
	if (Cart.length > 0) {
		$cart.append(`<span id="totalCost">Всього до сплати: ${totalCost}</span>`);
		$cart.append('<button class="btn btn-danger" id="clearCart">Очистити замовлення</button>');
	}
	$cart.find("#clearCart").click(function () {
		Cart.length = 0;
		let keys = Object.keys(localStorage);
		for (let key of keys) {
			if (key.match(/[0-9]+[bs]/)) {
				localStorage.removeItem(key);
			}
		}
		updateCart();
	})
}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initializeCart = initializeCart;

exports.PizzaSize = PizzaSize;