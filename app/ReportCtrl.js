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
                    updateChart();
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

        $scope.projects = [];
        $scope.workLog = {items: []};
        
        $scope.fetchItems = function (month) {
            $http.get('http://localhost:8080/endpoints/v1/calendar/' + month + '/work-log/entries').success(function (data) {
                $scope.workLog = data;
                $scope.projects = distinct('projectName');
                $scope.employees = distinct('employee');
                $scope.filter.activeProjects = $scope.projects;
                $scope.filter.activeEmployees = $scope.employees;
                updateChart();
            });

            function distinct(property) {
                return _($scope.workLog.items).pluck(property).uniq().value();
            }
        };

        $scope.satisfies = function (item) {
            return $scope.filter.isActiveProject(item.projectName) && $scope.filter.isActiveEmployee(item.employee);
        };

        $scope.remove = function (entry) {
        	
        	$http({method: 'DELETE', url: 'http://localhost:8080/endpoints/v1/work-log/entries/' + entry.id}).success(function (data) {
        		$scope.fetchItems($scope.filter.activeMonth);
        	});
        }
        
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

        $scope.shareForProject = function(project){
        	var p = new Workload($scope.totalForProject(project)).minutes;
        	var t = new Workload($scope.totalForMonth()).minutes;
        	return Math.round(p/t * 100) + "%";
        };
        
//        var colors = ['#F7464A', '#E2EAE9', '#D4CCC5', '#949FB1', '#4D5360', '#F38630', '#E0E4CC', '#69D2E7'];
//        var colors = ['88', 'AA', 'CC'];

        var colors = ['88', 'AA', 'CC'];
        
        $scope.colorFor = function(project){
        
        	var i = $scope.projects.indexOf(project);
        	var num = (i * 11 + 5) % 27;
			
			c1 = Math.floor(num/9);
			c2 = Math.floor((num - c1*9)/3);
			c3 = num % 3;
			
			return '#' + colors[c1] + colors[c2] + colors[c3];
        };
        
        var updateChart = function(){

        	var chartElement = document.getElementById("projectShare");
        	
        	if(!chartElement){
        		return;
        	}
        	
        	var ctx = chartElement.getContext("2d");
        	var data = [];
        	
        	for(i=0; i<$scope.filter.activeProjects.length; i++){
        		var p = $scope.filter.activeProjects[i];
        		var wl = $scope.totalForProject(p);
        		var share = new Workload(wl).minutes;
        		data.push({
        			value: share,
        			color: $scope.colorFor(p),
        			label: wl
        		});
        	}
        	
        	var chart = new Chart(ctx).Doughnut(data, {
        		animationEasing : "easeOutQuart"
        	});                        
        };
    });