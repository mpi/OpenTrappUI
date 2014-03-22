angular.module('openTrApp')
.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/registration', {
    templateUrl: 'registration.html'
  });
  $routeProvider.when('/report', {
    templateUrl: 'report.html'
  });
  $routeProvider.when('/config', {
	  templateUrl: 'configuration.html'
  });
  $routeProvider.otherwise({
	  templateUrl: 'home.html'
  });
  
  // configure html5 to get links working on jsfiddle
  $locationProvider.html5Mode(false);
})
.controller('RouterCtrl',
	function($scope, $location) {
	
		$scope.isActive = function(path){
			return ($location.path().substr(0, path.length) == path);
		};
});
