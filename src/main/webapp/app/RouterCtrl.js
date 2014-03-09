angular.module('openTrApp', ['ngRoute', 'ngAnimate'])
.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/registration', {
    templateUrl: 'registration.html'
  });
  $routeProvider.when('/report', {
    templateUrl: 'report.html'
  });
//  $routeProvider.otherwise({
//	redirectTo: 'registration'
//  });
  
  // configure html5 to get links working on jsfiddle
  $locationProvider.html5Mode(true);
})
.controller('RouterCtrl',
	function($scope, $location) {
	
		$scope.isActive = function(path){
			return ($location.path().substr(0, path.length) == path);
		};
});

