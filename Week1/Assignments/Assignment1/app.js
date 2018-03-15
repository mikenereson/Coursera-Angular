(function () {
    "use strict";

    angular.module("lunchCheck", [])
        .controller("LunchCheckController", LunchCheckController);

    LunchCheckController.$inject = ['$scope'];

    function LunchCheckController($scope) {

        $scope.lunch = "";      // holds the text entered by the user
        $scope.state = "";      // holds the current state, valid values are ``, `ok`, or `not-ok`
        $scope.message = "";    // valid values are `Enjoy!`, `Too much!`, `Please enter data first`

        var threshold = 3;      // the required number of lunch items to get a good state
        var messages = {
            "good": {"message": "Enjoy!", "state": "ok"},
            "bad": {"message": "Too much!", "state": "ok"},
            "default": {"message": "Please enter data first", "state": "not-ok"}
        };

        $scope.update = function () {
            // collect the lunch items
            var lunchItems = collectLunchItems();
            var stateName = "default"; // one of `default`, `bad`, or `good`

            if (lunchItems.length > threshold) {
                stateName = "bad";
            } else if (lunchItems.length && lunchItems.length <= threshold && lunchItems) {
                stateName = "good";
            }

            $scope.state = messages[stateName].state;
            $scope.message = messages[stateName].message;
        };

        function collectLunchItems() {
            // collect the lunch items
            var items = $scope.lunch.split(',');
            // remove empty lunch items and extraneous spaces
            items.forEach(function (item, index) {
                item = item.trim(); // remove spaces
                if (!item.length) {
                    items.splice(index, 1); // remove empty items
                }
            });
            return items;
        }
    }
})();
