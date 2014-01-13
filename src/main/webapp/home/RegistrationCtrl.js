angular.module('openTrApp.registration', []).controller('RegistrationCtrl',
		function($scope, $http) {
//			2h on #ProjectManhattan @2014/01/03
			$scope.logWork = function(){
				
				var regexp = /(.*) on #(.*) @(.*)/.exec($scope.workLogExpression);
				var data = {
					workload: regexp[1],
					projectName: regexp[2],
					day: regexp[3]
				};
				
				$http.post('http://localhost:8080/endpoints/v1/employee/1/work-log/entries', data);
				
			};
	
		});