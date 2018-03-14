(function () {
    "use strict";
    angular.module("myFirstApp", [])
        .controller("MyFirstController", function ($scope) {
            $scope.name = "Mike Nereson!";
            $scope.sayHello = function () {
                return ($scope.name) ? "Hello " + $scope.name : "";
            };
        })
        .controller("NameCalculatorController", function ($scope) {
            $scope.name = "";
            $scope.nameValue = 0;

            $scope.recalculateNameValue = function () {
                $scope.nameValue = calculateNameValue($scope.name);
            };

            function calculateNameValue(string) {
                if (!string) {
                    return 0;
                }

                var value = 0;
                for (var i = 0; i < string.length; i++) {
                    value += string.charAt(i).toLowerCase().charCodeAt(0) - "a".charCodeAt(0) + 1;
                }
                return value;
            }
        });
})();
