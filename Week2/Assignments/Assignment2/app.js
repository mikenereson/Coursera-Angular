(function () {
    "use strict";
    angular.module("ShoppingListApp", [])
        .controller("ShoppingListAddController", ShoppingListAddController)
        .controller("ShoppingListShowController", ShoppingListShowController)
        .service("ShoppingListService", ["$rootScope", ShoppingListService]);

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

    ShoppingListShowController.$inject = ["$scope", "ShoppingListService"];

    function ShoppingListShowController($scope, ShoppingListService) {
        var showCtrl = this;

        $scope.$on("itemsChanged", refresh);
        refresh();

        showCtrl.removeItem = function (index) {
            ShoppingListService.removeItem(index);
        };

        showCtrl.togglePurchased = function (index, purchased) {
            ShoppingListService.togglePurchased(index, purchased);
        };

        showCtrl.sendToPrinter = function () {
            window.print();
        };

        function refresh() {
            showCtrl.items = ShoppingListService.getAllItems();
            showCtrl.unpurchasedItems = ShoppingListService.getAllUnpurchasedItems();
            showCtrl.purchasedItems = ShoppingListService.getAllPurchasedItems();
        }
    }

    function ShoppingListService($rootScope) {

        var service = this;

        // List of shopping items
        var items = [];
        //items.push({label: "default purchased item", quantity: 1, purchased: true});

        service.addItem = function (label, quantity) {
            items.push({label: label, quantity: quantity, purchased: false});
            $rootScope.$broadcast('itemsChanged');
        };

        service.removeItem = function (index) {
            items.splice(index, 1);
            $rootScope.$broadcast('itemsChanged');
        };

        service.togglePurchased = function (index, purchased) {
            items[index].purchased = purchased;
            $rootScope.$broadcast('itemsChanged');
        };

        service.getAllItems = function () {
            return items;
        };

        service.getAllUnpurchasedItems = function () {
            return items.filter(function (item) {
                return !item.purchased;
            });
        };

        service.getAllPurchasedItems = function () {
            return items.filter(function (item) {
                return item.purchased;
            });
        };

    }
})();