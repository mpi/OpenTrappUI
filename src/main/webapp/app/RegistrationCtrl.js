angular.module('openTrApp').controller('RegistrationCtrl',
		function($scope, $http) {

			var projectPattern = /#([a-zA-Z0-9_]*)?/;
			var workloadPattern = /(\d(d|h)( )?)+/;
			var dayPattern = /@([0-9\/]*)/;

			var parseExpression = function(expression){

                return {
                    workload: workloadPattern.exec(expression)[0].trim(),
                    projectName: projectPattern.exec(expression)[1],
                    day: getDayFromExpression(expression)
                };
			};

            function matchesDayRegex(expression) {
                return dayPattern.test(expression);
            }

            function dayRegexHasValidDate(expression) {
                return moment(dayPattern.exec(expression)[1]).isValid();
            }

            var getDayFromExpression = function(expression) {
                if(matchesDayRegex(expression) && dayRegexHasValidDate(expression)) {
                    return dayPattern.exec(expression)[1]
                } else {
                    return moment().format("YYYY/MM/DD");
                }
            }

            function hasDayExpression(expression) {
                return /@/.test(expression);
            }

            var dayValid = function(expression) {
                return (hasDayExpression(expression) && dayRegexHasValidDate(expression)) ||
                    !hasDayExpression(expression)
            }

			var isValid = function(expression){
				return projectPattern.test(expression) &&
                    workloadPattern.test(expression) &&
                    dayValid(expression)
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
                        var message = 'Worklog entry has been successfully created!';
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