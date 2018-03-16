(function () {
    "use strict";
    angular.module("ShoppingListApp", [])
        .controller("ShoppingListAddController", ShoppingListAddController)
        .controller("ShoppingListShowController", ShoppingListShowController)
        .service("ShoppingListService", ShoppingListService);


    ShoppingListAddController.$inject = ["$scope", "ShoppingListService"];

    function ShoppingListAddController($scope, ShoppingListService) {
        var addCtrl = this;

        /* holds the entered values */
        addCtrl.label = "";
        addCtrl.quantity = "";

        /* add classes to the inputs, valid values are `` and `error` */
        addCtrl.labelState = "";
        addCtrl.quantityState = "";

        addCtrl.isValid = function () {
            addCtrl.clearState();
            /* label must have a value */
            if (!addCtrl.label.length) addCtrl.labelState = "error";
            /* quantity must have a numeric value > 0222 */
            if (!addCtrl.quantity.length || isNaN(addCtrl.quantity) || addCtrl.quantity == 0) addCtrl.quantityState = "error";
            /* return true if no states are in error */
            return !addCtrl.labelState && !addCtrl.quantityState;
        };

        addCtrl.addItem = function () {
            if (!addCtrl.isValid()) {
                return;
            }

            ShoppingListService.addItem(addCtrl.label, addCtrl.quantity);
            addCtrl.clear();
        };

        addCtrl.clear = function () {
            addCtrl.label = "";
            addCtrl.quantity = "";
        };
        addCtrl.clearState = function () {
            addCtrl.labelState = "";
            addCtrl.quantityState = "";
        }
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


        // Add an item to get us started
        // items.push({label: 'first', quantity: 1});

        service.addItem = function (label, quantity) {
            items.push({label: label, quantity: quantity});
        };

        service.removeItem = function (index) {
            items.splice(index, 1);
        };

        service.getItems = function () {
            return items;
        };
    }
})();
