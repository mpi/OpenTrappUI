angular.module('openTrApp').controller('RegistrationCtrl',
		function($scope, $http) {
			
			var pattern = /(.*) on #([a-zA-Z0-9_]*)( @(.*))?/;

			var parseExpression = function(expression){
				
				var regexp = pattern.exec(expression);
				
				return {
					workload: regexp[1],
					projectName: regexp[2],
					day: getDay(regexp[4])
				};
			};

            var getDay = function(dayAsString) {
                if (dayAsString) {
                    return dayAsString
                } else {
                    return moment().format("YYYY/MM/DD");
                }
            }
	
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
				
				if(isValid($scope.workLogExpression)){
					$scope.status = 'success';
				} else{
					$scope.status = 'error';
				}
			};
			
		})
        .directive('ngEnter', function () {
            return function (scope, element, attrs) {
                element.bind("keydown keypress", function (event) {
                    if(event.which === 13) {
                        scope.$apply(function (){
                            scope.$eval(attrs.ngEnter);
                        });

                        event.preventDefault();
                    }
                });
            };
        });