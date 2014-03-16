angular.module('openTrApp').controller('ReportCtrl',
    function ($scope, $http, reportDates) {

        $scope.init = function () {
            var months = reportDates.getMonths();
            $scope.filter = {
                months: months,
                activeMonth: months[0],
                activeProjects: [],
                activeEmployees: [],
                isActive: function (month) {
                    return month == this.activeMonth;
                },
                setActive: function (month) {
                    this.activeMonth = month;
                    $scope.fetchItems(month);
                },
                toggleActiveProject: function (project) {
                    this.toggleElementOnList('activeProjects', project);
                    return false;
                },
                toggleElementOnList: function (list, entry) {
                    if (_.contains(this[list], entry)) {
                        this[list] = _.without(this[list], entry);
                    } else {
                        this[list].push(entry);
                    }
                }, toggleActiveEmployee: function (employee) {
                    this.toggleElementOnList('activeEmployees', employee);
                },
                isActiveProject: function (project) {
                    return _.contains(this.activeProjects, project);
                },
                isActiveEmployee: function (employee) {
                    return _.contains(this.activeEmployees, employee);
                }

            };

            $scope.filter.setActive($scope.filter.activeMonth);
        };

        $scope.fetchItems = function (month) {
            $http.get('http://localhost:8080/endpoints/v1/calendar/' + month + '/work-log/entries').success(function (data) {
                $scope.workLog = data;
                $scope.projects = distinct('projectName');
                $scope.employees = distinct('employee');
                $scope.filter.activeProjects = $scope.projects;
                $scope.filter.activeEmployees = $scope.employees;
                
            });

            function distinct(property) {
                return _($scope.workLog.items).pluck(property).uniq().value();
            }
        };

        $scope.satisfies = function (item) {
            return $scope.filter.isActiveProject(item.projectName) && $scope.filter.isActiveEmployee(item.employee);
        };

        var totalByFilter = function(filter){

        	var x = _($scope.workLog.items)
	    		.filter($scope.satisfies)
	    		.filter(filter)
	    		.map(function(x){ 
	    			return new Workload(x.workload); 
	    		})
	    		.reduce(function(a, b){
	    			return a.add(b);
	    		}, new Workload(0));
        	return x.print();
        };
        
        $scope.totalForMonth = function(){
        	
        	return totalByFilter(function(x){ return x.day.indexOf($scope.filter.activeMonth) == 0});
        };

        $scope.totalForEmployee = function(employee){
        	
        	return totalByFilter(function(x){ return x.employee == employee});
        };

        $scope.totalForProject = function(project){
        	
        	return totalByFilter(function(x){ return x.projectName == project});
        };
    })
;