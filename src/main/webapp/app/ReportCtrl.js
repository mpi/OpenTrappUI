angular.module('openTrApp').controller('ReportCtrl',
		function($scope, $http) {
	
			$scope.fetchItems = function(){
				$http.get('http://localhost:8080/endpoints/v1/calendar/2014/01/work-log/entries').success(function(data){
					$scope.workLog = data;
				});
			};
		});