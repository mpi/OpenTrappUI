angular.module('openTrApp').factory('worklog', function ($http) {
	
	var worklog = [];
	var listeners = [];
	
	var that = {
		
		month: new String(''),
		employees: {},
		projects: {},
		worklog: [],

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
		enableProject: function(project){
			
			that.projects[project] = { active: true };
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
		reset: function(){
			that.month = new String('');
			that.employees = {};
			that.projects = {};
			that.worklog = [];
		}
		
	};
	
	var apply = function() {

		buildWorklog();
		calculateTotals();
	};

	var buildWorklog = function(){

		that.worklog = _(worklog)
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
		
		_(that.worklog).forEach(function(x){
			if(x.workload){
				var workload = new Workload(x.workload);
				that.month.total = that.month.total.add(workload);
				that.employees[x.employee].total = that.employees[x.employee].total.add(workload); 
				that.projects[x.projectName].total = that.projects[x.projectName].total.add(workload); 
			}
		});

		_([that.month]).forEach(normalizeTotal);
		_(that.employees).forEach(normalizeTotal);
		_(that.projects).forEach(normalizeTotal);
	};
	
	return that;
	
});


