(function () {
    "use strict";
    angular.module("ShoppingListApp", [])
        .controller("ShoppingListAddController", ShoppingListAddController)
        .controller("ShoppingListShowController", ShoppingListShowController)
        .service("ShoppingListService", ["$rootScope", ShoppingListService]);


    /**
     * ShoppingListAddController is responsible for the Add Item form
     */
    ShoppingListAddController.$inject = ["$scope", "ShoppingListService"];

    function ShoppingListAddController($scope, ShoppingListService) {
        var addCtrl = this;

        /* holds the entered values */
        addCtrl.label = "";
        addCtrl.quantity = "";

        /* add classes to the inputs, valid values are `` and `error` */
        addCtrl.labelState = "";
        addCtrl.quantityState = "";

        /* validate teh user's input, returns true when valid */
        addCtrl.isValid = function () {
            addCtrl.clearState();
            /* label must have a value */
            if (!addCtrl.label.length) addCtrl.labelState = "error";
            /* quantity must have a numeric value > 0222 */
            if (!addCtrl.quantity.length || isNaN(addCtrl.quantity) || addCtrl.quantity == 0) addCtrl.quantityState = "error";
            /* return true if no states are in error */
            return !addCtrl.labelState && !addCtrl.quantityState;
        };

        /* when input is valid, add a new item */
        addCtrl.addItem = function () {
            if (!addCtrl.isValid()) {
                return;
            }

            ShoppingListService.addItem(addCtrl.label, addCtrl.quantity);
            addCtrl.clear();
        };

        /* clear the new item form */
        addCtrl.clear = function () {
            addCtrl.label = "";
            addCtrl.quantity = "";
        };

        /* reset the validation state */
        addCtrl.clearState = function () {
            addCtrl.labelState = "";
            addCtrl.quantityState = "";
        }
    }

    /**
     * ShoppingListShowController is responsible for the two shopping lists: purchased and unpurchased
     */
    ShoppingListShowController.$inject = ["$scope", "ShoppingListService"];

    function ShoppingListShowController($scope, ShoppingListService) {
        var showCtrl = this;

        // subscribe to the itemsChanged event that the ShoppingListService triggers
        // whenever the items change.
        $scope.$on("itemsChanged", refresh);

        // init the lists
        refresh();

        // remove an item from the shopping lists
        showCtrl.removeItem = function (index) {
            ShoppingListService.removeItem(index);
        };

        // change the purchased state of an item
        showCtrl.togglePurchased = function (index, purchased) {
            ShoppingListService.togglePurchased(index, purchased);
        };

        showCtrl.sendToPrinter = function () {
            window.print();
        };

        // sync this controller's lists with the service
        function refresh() {
            showCtrl.items = ShoppingListService.getAllItems();
            showCtrl.purchasedItems = ShoppingListService.getAllPurchasedItems();
        }
    }

    function ShoppingListService($rootScope) {

        var service = this;

        // List of shopping items
        var items = [];

        // Add a new, unpurchased item to the shopping list
        service.addItem = function (label, quantity) {
            items.push({label: label, quantity: quantity, purchased: false});
            $rootScope.$broadcast('itemsChanged');
        };

        // Add an item.
        service.removeItem = function (index) {
            items.splice(index, 1);
            $rootScope.$broadcast('itemsChanged');
        };

        // change one item's purchased state
        service.togglePurchased = function (index, purchased) {
            items[index].purchased = purchased;
            $rootScope.$broadcast('itemsChanged');
        };

        // get all items on the shopping list
        service.getAllItems = function () {
            return items;
        };

        // get only the purchased items on the shopping list
        service.getAllPurchasedItems = function () {
            return items.filter(function (item) {
                return item.purchased;
            });
        };

    }
})();