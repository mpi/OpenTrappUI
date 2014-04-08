angular.module('openTrApp').controller('SettingsCtrl',
    function ($scope, $cookies) {
        $scope.init = function () {

            $scope.apiServerUrl = 'http://open-trapp.herokuapp.com';
            if ($cookies.apiServerUrl) {
                $scope.apiServerUrl = $cookies.apiServerUrl;
            }
        };

        $scope.cancel = function () {

            $scope.init();
        };

        $scope.save = function () {

            $cookies.apiServerUrl = $scope.apiServerUrl;
            $scope.alert = 'Settings have been saved!';
        }
    }
);
