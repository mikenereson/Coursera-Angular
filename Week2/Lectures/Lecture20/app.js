(function () {
    "use strict";
    angular.module("ShoppingListApp", [])
        .controller("ShoppingListAddController", ShoppingListAddController)
        .controller("ShoppingListShowController", ShoppingListShowController)
        .service("ShoppingListService", ShoppingListService);


    ShoppingListAddController.$inject = ["ShoppingListService"];

    function ShoppingListAddController(ShoppingListService) {
        var addCtrl = this;

        addCtrl.label = "";
        addCtrl.quantity = "";

        addCtrl.addItem = function () {
            /*console.info("addCtrl.addItem", addCtrl);*/
            ShoppingListService.addItem(addCtrl.label, addCtrl.quantity);
            addCtrl.label = "";
            addCtrl.quantity = "";
        };
    }

    ShoppingListShowController.$inject = ["ShoppingListService"];

    function ShoppingListShowController(ShoppingListService) {
        var showCtrl = this;

        showCtrl.items = ShoppingListService.getItems();

        showCtrl.removeItem = function (index) {
            ShoppingListService.removeItem(index);
        };

        showCtrl.sendToPrinter = function () {
            window.print();
        };
    }

    function ShoppingListService() {

        var service = this;

        // List of shopping items

        var items = [];
        items.push({label: 'first', quantity: 1});

        service.addItem = function (label, quantity) {
            /*console.debug("ShoppingListService.addItem", label + ' x' + quantity);*/
            items.push({label: label, quantity: quantity});
            /*console.debug("ShoppingListService.items", items);*/
        };

        service.removeItem = function (index) {
            items.splice(index, 1);
        };

        service.getItems = function () {
            console.info("entered >> ShoppingListService.getItems");
            return items;
        };
    }
})();
