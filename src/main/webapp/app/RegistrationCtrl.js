angular.module('openTrApp').controller('RegistrationCtrl',
		function($scope, $http, timeProvider) {

			var projectPattern = /#([a-zA-Z0-9_]*)?/;
			var workloadPattern = /(\d+(d|h|m)( )?)+/;
			var dayPattern = /@([0-9\/]*)/;

            var getWorkloadFromExpression = function(expression) {
                if (workloadPattern.test(expression)) {
                    return workloadPattern.exec(expression)[0].trim()
                } else {
                    return "1d";
                }
            }

			var parseExpression = function(expression){

                return {
                    workload: getWorkloadFromExpression(expression),
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
                } else if (forYesterday(expression)) {
                    return moment(timeProvider.getCurrentDate()).subtract('days', 1).format("YYYY/MM/DD")
                } else {
                    return moment(timeProvider.getCurrentDate()).format("YYYY/MM/DD");
                }
            }

            function hasDayExpression(expression) {
                return /@/.test(expression);
            }

            function hasValidDateExpression(expression) {
                return (hasDayExpression(expression) && dayRegexHasValidDate(expression));
            }

            function forYesterday(expression) {
                return /@yesterday/.test(expression);
            }

            var dayValid = function(expression) {
                return hasValidDateExpression(expression) || forYesterday(expression) || !hasDayExpression(expression)
            }

            var isValid = function(expression){
				return projectPattern.test(expression) &&
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
                        var message = sprintf("%s logged on %s at %s", data.workload, data.projectName, data.day);
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