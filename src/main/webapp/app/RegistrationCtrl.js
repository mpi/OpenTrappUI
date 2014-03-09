angular.module('openTrApp').controller('RegistrationCtrl',
		function($scope, $http) {
			
			$scope.alerts = [];
			
			var pattern = /(.*) on #(.*) @(.*)/;

			var parseExpression = function(expression){
				
				var regexp = pattern.exec(expression);
				
				return {
					workload: regexp[1],
					projectName: regexp[2],
					day: regexp[3]
				};
			};
	
			var isValid = function(expression){
				return pattern.test(expression);
			};
	
			//	2h on #ProjectManhattan @2014/01/03
			$scope.logWork = function(){
				
				if(!isValid($scope.workLogExpression)){
					return;
				}
				
				var data = parseExpression($scope.workLogExpression);
				$http
					.post('http://localhost:8080/endpoints/v1/employee/1/work-log/entries', data)
					.success(function(response, status){
						$scope.workLogExpression = '';
						$scope.update();
						var message = 'Worklog entry <strong>WL.0001</strong> has been successfully created!';
						$scope.alerts.push({ type: 'success', message: message});
					});
			};
			
			
			$scope.update = function(){
				
				if($scope.workLogExpression == ''){
					$scope.status = '';
					return;
				}
				
				if(isValid($scope.workLogExpression)){
					$scope.status = 'success';
				} else{
					$scope.status = 'error';
				}
			};
			
		});