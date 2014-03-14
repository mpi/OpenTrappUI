angular.module('openTrApp').controller('RegistrationCtrl',
		function($scope, $http, worklogEntryParser) {

			$scope.logWork = function(){
				
				if(!worklogEntryParser.isValid($scope.workLogExpression)){
					return;
				}
				
				var data = worklogEntryParser.parse($scope.workLogExpression);
				$http
					.post('http://localhost:8080/endpoints/v1/employee/1/work-log/entries', data)
					.success(function(response, status){
						$scope.workLogExpression = '';
						$scope.update();
                        var message = sprintf("%s logged on project '%s' at %s", data.workload, data.projectName, data.day);
                        $scope.alert = ({ type: 'success', message: message});
					}).error(function(response,status){
                        var message = 'Server not responding';
                        $scope.alert = ({ type: 'danger', message: message});
                    });
			};
			
			
			$scope.update = function(){
				
				if($scope.workLogExpression == ''){
					$scope.status = '';
					return;
				}
				
				if(worklogEntryParser.isValid($scope.workLogExpression)){
					$scope.status = 'success';
				} else{
					$scope.status = 'error';
				}
			};
			
		});