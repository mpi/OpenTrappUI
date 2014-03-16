angular.module('openTrApp').controller('SignInCtrl',
    function ($scope, $http) {
		$scope.init = function(){
            $http.get('http://localhost:8080/endpoints/v1/authentication/status').success(function (data) {
                $scope.displayName = data.displayName;
                $scope.authenticated = data.authenticated;
                $scope.loginUrl = data.loginUrl;
                $scope.logoutUrl = data.logoutUrl;
            });
		};
	}
);