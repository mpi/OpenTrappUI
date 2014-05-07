angular.module('openTrapp').factory('worklog', function ($http) {
	
	var worklog = [];
	var listeners = [];
	
	var that = {
		
		month: new String(''),
		employees: {},
		projects: {},
		entries: [],

		setMonth: function(month, callback){
			$http.get('http://localhost:8080/endpoints/v1/calendar/' + month + '/work-log/entries')
				.success(function(data) {
					if(data){
						
						that.month = new String(month);
						var projects = {};
						var employees = {};

						worklog = data.items; 
						
						var statusOf = function(x){
							return _.isUndefined(x) ? { active: false } : { active: x.active };
						};
						
						_(worklog).pluck('projectName').uniq().forEach(function(project){
							projects[project] = statusOf(that.projects[project]); 
						});
						_(worklog).pluck('employee').uniq().forEach(function(employee){
							employees[employee] = statusOf(that.employees[employee]); 
						});
						
						_(that.projects).forEach(function(status, project){
							if(status.active && projects[project] == undefined){
								projects[project] = { hidden: true, active: true };	
							}
						});

						_(that.employees).forEach(function(status, employee){
							if(status.active && employees[employee] == undefined){
								employees[employee] = { hidden: true, active: true };	
							}
						});

						that.employees = employees;
						that.projects = projects;
						
						apply();
						if(callback){
							callback();
						}
					}
				});
		},
		toggleProject: function(projectName){
			if(_.isUndefined(that.projects[projectName])){
				that.projects[projectName] = { active: true };
			} else{
				that.projects[projectName].active = !that.projects[projectName].active;
			}
			apply();
		},
		toggleEmployee: function(employee){
			
			if(_.isUndefined(that.employees[employee])){
				that.employees[employee] = { active: true };
			} else{
				that.employees[employee].active = !that.employees[employee].active;
			}
			apply();
		},
		enableEmployee: function(employee){
			
			that.employees[employee] = { active: true };
			apply();
		},
		enableAllEmployees: function(){
			_(that.employees).forEach(function(status){
				status.active = true;
			});
			apply();
		},
		disableAllEmployees: function(){
			_(that.employees).forEach(function(status){
				status.active = false;
			});
			apply();
		},
		enableProject: function(project){
			
			that.projects[project] = { active: true };
			apply();
		}, 
		enableAllProjects: function(){
			_(that.projects).forEach(function(status){
				status.active = true;
			});
			apply();
		},
		disableAllProjects: function(){
			_(that.projects).forEach(function(status){
				status.active = false;
			});
			apply();
		},
		enableEmployeeProjects: function(employee){

			_(worklog).forEach(function(x){
				if(x.employee == employee){
					that.enableProject(x.projectName);
				}
			});
			apply();
		},
		remove: function(id){
            $http({method: 'DELETE', url: 'http://localhost:8080/endpoints/v1/work-log/entries/' + id})
            	.success(function (data) {
            		that.setMonth(that.month);
            	});
		},
		reset: function(){
			that.month = new String('');
			that.employees = {};
			that.projects = {};
			that.entries = [];
		},
		onUpdate: function(listener){
			listeners.push(listener);
		}
		
	};
	
	var apply = function() {

		buildWorklog();
		calculateTotals();
		notifyListeners();
	};

	var buildWorklog = function(){

		that.entries = _(worklog)
			.filter(function(x){ return that.employees[x.employee].active })
			.filter(function(x){ return that.projects[x.projectName].active })
			.value();
	};
	
	var calculateTotals = function(){
		
		var resetTotal = function(x){ x.total = new Workload(0); };
		var normalizeTotal = function(x){ x.total = x.total.print() };
		
		_(that.employees).forEach(resetTotal);
		_(that.projects).forEach(resetTotal);
		_([that.month]).forEach(resetTotal);
		
		_(worklog).forEach(function(x){
			if(x.workload){
				var workload = new Workload(x.workload);
				if(that.employees[x.employee].active && that.projects[x.projectName].active){
					that.month.total = that.month.total.add(workload);
				}
				if(that.projects[x.projectName].active){
					that.employees[x.employee].total = that.employees[x.employee].total.add(workload); 
				}
				if(that.employees[x.employee].active){
					that.projects[x.projectName].total = that.projects[x.projectName].total.add(workload); 
				}
			}
		});

		_([that.month]).forEach(normalizeTotal);
		_(that.employees).forEach(normalizeTotal);
		_(that.projects).forEach(normalizeTotal);
	};
	
	var notifyListeners = function(){
		_(listeners).forEach(function(listener){
			listener.call();
		});
	};
	
	return that;
	
});


