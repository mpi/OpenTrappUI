angular.module('openTrapp')
	.controller('MonthlyReportCtrl', function($scope, worklog, $http){

		$scope.days = [];
		$scope.report = {};
		$scope.init = function(){
			worklog.onUpdate(function(){
				fetchDays();
				calculateDays();
			});
		};

		var toHours = function(minutes){
			return (Math.round((minutes/60)*100)/100).toString();
		};
		
		var fetchDays = function(){
			$http.get('http://localhost:8080/endpoints/v1/calendar/' + worklog.month).success(function(data){
				$scope.days = _(data.days).map(function(d){
					
					var m = moment(d.id, 'YYYY/MM/DD');
					
					return {
						id: d.id,
						number: m.format('DD'),
						name: m.format('ddd'),
						holiday: d.holiday
					}
				}).value();
			});
		};
		
		var calculateDays = function(){
			$scope.report = {};
			_(worklog.entries).forEach(function(x){
				var employee = $scope.report[x.employee] || {};
				var day = employee[x.day] || 0;
				var total = employee.total || 0;
				employee[x.day] = day + new Workload(x.workload).minutes;
				employee.total = total + new Workload(x.workload).minutes;
				$scope.report[x.employee] = employee;
			});
			
			_($scope.report).forEach(function(employee){
				_(employee).forEach(function(minutes, day){
					employee[day] = toHours(minutes);
				});
			});
		};
	});