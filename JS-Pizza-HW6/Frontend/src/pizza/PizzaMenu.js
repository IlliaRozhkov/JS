/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати

    let pizza_shown = Pizza_List.filter((pizza) => filter in pizza.content);

    if (filter === "all") {
        pizza_shown = Pizza_List;
        return;
    }
    if (filter === "vegan") {
        pizza_shown = Pizza_List.filter(
			(pizza) =>
				(pizza.content["meat"] === undefined &&
					pizza.content["chicken"] === undefined &&
					pizza.content["cheese"] === undefined &&
					pizza.content["ocean"] === undefined) ||
				pizza.type === "Вега піца"
			// Піца з сиром не є веганською, але ¯\_(ツ)_/¯
		);
    }

    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

function initializeMenu() {
    //Показуємо усі піци

    let $filters = $('.nav-pills > li > a');

    $filters.each(function(index) {
        $(this).click(function() {
            filterPizza(this.id);
        })
    })

    showPizzaList(Pizza_List);
}

exports.filterPizza = filterPizza;
exports.initializeMenu = initializeMenu;