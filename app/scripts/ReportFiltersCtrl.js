var openTrapp = angular.module('openTrapp'); 

openTrapp
	.controller('ReportFiltersCtrl', function ($scope, $http, worklog, currentMonth, currentEmployee) {
	
		$scope.report = worklog;
		$scope.months = [];

		$scope.init = function(){

			worklog.reset();
			worklog.setMonth(currentMonth.name, function(){

				var employee = currentEmployee.username();
				worklog.enableEmployee(employee);
				worklog.enableEmployeeProjects(employee);
				
			});
			
			$scope.months = [
			                 currentMonth.next().name,
			                 currentMonth.name,
			                 currentMonth.prev().name,
			                 currentMonth.prev().prev().name
			                ];
		};
	})
	.factory('currentMonth', function() {

		return new Month(moment().format('YYYY/MM'));
	});

var Month = function(month){
	
	var that = moment(month, 'YYYY/MM');
	
	return {
		
		name: that.format('YYYY/MM'),
		next: function(){
			return new Month(moment(that).add('month', 1).format('YYYY/MM'));
		},
		prev: function(){
			return new Month(moment(that).subtract('month', 1).format('YYYY/MM'));
		}
	};
};