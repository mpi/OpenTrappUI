angular.module('openTrApp').controller('SignInCtrl',
    function ($scope, $http, currentEmployee) {
		$scope.init = function(){
            $http.get('http://localhost:8080/endpoints/v1/authentication/status').success(function (data) {
                $scope.displayName = data.displayName;
                $scope.authenticated = data.authenticated;
                $scope.username = data.username;
                $scope.loginUrl = data.loginUrl;
                $scope.logoutUrl = data.logoutUrl;
                
                currentEmployee.signedInAs(data.username);
            });
		};
	}
);