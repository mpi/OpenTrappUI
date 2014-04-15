ddescribe('Worklog', function() {
	
	beforeEach(module('openTrApp'));
    beforeEach(inject(function(_enviromentInterceptor_){
    	_enviromentInterceptor_.request = function(x){
    		return x;
    	};
    }));

	var httpBackend, report;
	
	beforeEach(inject(function($httpBackend, _worklog_) {
		httpBackend = $httpBackend;
		report = _worklog_;
	}));

	it('fetches data for given month', function(){
		
		// expect:
		httpBackend
			.expectGET('http://localhost:8080/endpoints/v1/calendar/2014/01/work-log/entries')
			.respond(200);
		
		// when:
		report.setMonth('2014/01');
		httpBackend.flush();
	});
	
	it('exposes active month', function(){
		
		// given:
		monthContainsFollowingItems('2014/01', []); 
		
		// when:
		reportFor('2014/01');
		
		// then:
		expect(report.month).toEqual('2014/01');
	});
	
	it('exposes project names', function(){
		
		// given:
		monthContainsFollowingItems('2014/01', 
				[
				 { projectName: 'ProjectManhattan' }, 
				 { projectName: 'ApolloProgram' } 
			    ]);
		// when:
		reportFor('2014/01');
		
		// then:
		expect(report.projects['ProjectManhattan']).toBeDefined();
		expect(report.projects['ApolloProgram']).toBeDefined()
	});

	it('exposes employee usernames', function(){
		
		// given:
		monthContainsFollowingItems('2014/01', 
				[
				 { employee: 'bart.simpson' }, 
				 { employee: 'homer.simpson' } 
			    ]);
		// when:
		reportFor('2014/01');
		
		// then:
		expect(report.employees['bart.simpson']).toBeDefined();
		expect(report.employees['homer.simpson']).toBeDefined()
	});

	it('enables project', function(){
		
		// given:
		reportWith({ 
			projectName: 'ProjectManhattan' 
		});
		
		// when:
		report.enableProject('ProjectManhattan');
		
		// then:
		expect(report.projects['ProjectManhattan'].active).toBeTruthy();
	});
	
	it('enables project twice', function(){
		
		// given:
		reportWith({ 
			projectName: 'ProjectManhattan' 
		});
		
		// when:
		report.enableProject('ProjectManhattan');
		report.enableProject('ProjectManhattan');
		
		// then:
		expect(report.projects['ProjectManhattan'].active).toBeTruthy();
	});
	
	it('enables employee', function(){
		
		// given:
		reportWith({ 
				employee: 'bart.simpson' 
			});
		
		// when:
		report.enableEmployee('bart.simpson');
		
		// then:
		expect(report.employees['bart.simpson'].active).toBeTruthy();
	});

	it('enables employee twice', function(){
		
		// given:
		reportWith({ 
			employee: 'bart.simpson' 
		});
		
		// when:
		report.enableEmployee('bart.simpson');
		report.enableEmployee('bart.simpson');
		
		// then:
		expect(report.employees['bart.simpson'].active).toBeTruthy();
	});
	
	it('toggles project', function(){
		
		// given:
		reportWith({ 
				projectName: 'ProjectManhattan' 
			});
		
		// when:
		report.toggleProject('ProjectManhattan');
		
		// then:
		expect(report.projects['ProjectManhattan'].active).toBeTruthy();
	});
	
	it('toggles project twice', function(){
		
		// given:
		reportWith({ 
				projectName: 'ProjectManhattan' 
			});

		// when:
		report.toggleProject('ProjectManhattan');
		report.toggleProject('ProjectManhattan');
		
		// then:
		expect(report.projects['ProjectManhattan'].active).toBeFalsy();
	});
	
	it('toggles employee', function(){
		
		// given:
		reportWith({ 
				employee: 'bart.simpson' 
			});
		
		// when:
		report.toggleEmployee('bart.simpson');
		
		// then:
		expect(report.employees['bart.simpson'].active).toBeTruthy();
	});

	it('toggles employee twice', function(){
		
		// given:
		reportWith({ 
				employee: 'bart.simpson' 
			});
		
		// when:
		report.toggleEmployee('bart.simpson');
		report.toggleEmployee('bart.simpson');
		
		// then:
		expect(report.employees['bart.simpson'].active).toBeFalsy();
	});
	
	it('enable employee projects', function(){
		
		// given:
		reportWith(
				{ employee: 'bart.simpson', projectName: 'ProjectManhattan'},
				{ employee: 'bart.simpson', projectName: 'ApolloProgram'},
				{ employee: 'homer.simpson', projectName: 'OtherProject'}
			);
		
		// when:
		report.enableEmployeeProjects('bart.simpson');
		
		// then:
		expect(report.projects['ProjectManhattan'].active).toBeTruthy();
		expect(report.projects['ApolloProgram'].active).toBeTruthy();
		expect(report.projects['OtherProject'].active).toBeFalsy();
	});
	
	it('list empty workload after changing month', function(){
		
		// given:
		monthContainsFollowingItems('2014/02', []); 

		// when:
		reportWith(
				{ employee: 'bart.simpson', projectName: 'ProjectManhattan' });
		toggleAll();
		reportFor('2014/02');
		
		// then:
		expect(report.worklog).toEqual([]);
	});
	
	it('maintains active employees after changing month', function(){
		
		// given:
		report.toggleEmployee('bart.simpson');
		
		// when:
		reportWith({ employee: 'bart.simpson', projectName: 'ProjectManhattan' });
		
		// then:
		expect(report.employees['bart.simpson'].active).toBeTruthy();
	});

	it('maintains active projects after changing month', function(){
		
		// given:
		report.toggleProject('ProjectManhattan');
		
		// when:
		reportWith({ employee: 'bart.simpson', projectName: 'ProjectManhattan' });
		
		// then:
		expect(report.projects['ProjectManhattan'].active).toBeTruthy();
	});
	
	it('list all eligible workload entries', function(){
		
		// given:
		reportWith(
				{ employee: 'bart.simpson', projectName: 'ProjectManhattan' },
				{ employee: 'homer.simpson', projectName: 'ProjectManhattan' },
				{ employee: 'bart.simpson', projectName: 'ApolloProgram' },
				{ employee: 'homer.simpson', projectName: 'ApolloProgram' }
			);
		
		// when:
		report.toggleEmployee('bart.simpson');
		report.toggleProject('ApolloProgram');
		
		// then:
		expect(report.worklog).toEqual([{ employee: 'bart.simpson', projectName: 'ApolloProgram' }]);
	});
	
	describe('totals', function(){
		
		beforeEach(function(){

			// given:
			reportWith(
					{ employee: 'bart.simpson', projectName: 'ProjectManhattan', workload: '1m' },
					{ employee: 'homer.simpson', projectName: 'ProjectManhattan', workload: '1h' },
					{ employee: 'bart.simpson', projectName: 'ApolloProgram', workload: '1d' },
					{ employee: 'homer.simpson', projectName: 'ApolloProgram', workload: '7m' },
					{ employee: 'inactive.employee', projectName: 'ProjectManhattan', workload: '1h'},
					{ employee: 'homer.simpson', projectName: 'InactiveProject', workload: '1h'}
			);
			
			// when:
			report.toggleEmployee('bart.simpson');
			report.toggleEmployee('homer.simpson');
			report.toggleProject('ProjectManhattan');
			report.toggleProject('ApolloProgram');
			
		});
		
		it('is calculated for active month', function(){
			
			// then:
			expect(report.month.total).toEqual("1d 1h 8m");
		});

		it('is calculated for every active employee', function(){
			
			// then:
			expect(report.employees['bart.simpson'].total).toEqual("1d 1m");
			expect(report.employees['homer.simpson'].total).toEqual("1h 7m");
			expect(report.employees['inactive.employee'].total).toEqual("0h");
		});
		
		it('is calculated for every active project', function(){
			
			// then:
			expect(report.projects['ProjectManhattan'].total).toEqual("1h 1m");
			expect(report.projects['ApolloProgram'].total).toEqual("1d 7m");
			expect(report.projects['InactiveProject'].total).toEqual("0h");
		});
	
	});
	
	describe('notifications', function(){
		
		it('executes callback when worklog is ready', function(){
			
			// given:
			var callback = jasmine.createSpy('callback');
			monthContainsFollowingItems('2014/01', []); 
	
			// when:
			report.setMonth('2014/01', callback);
			expect(callback).not.toHaveBeenCalled();
			httpBackend.flush();
			
			// then:
			expect(callback).toHaveBeenCalled();
		});
	});
	
	// --
	
	var toggleAll = function(){
		
		_(report.employees).forEach(function(_, x){
			report.toggleEmployee(x);
		});
		_(report.projects).forEach(function(_, x){
			report.toggleProject(x);
		});
	};

	var monthContainsFollowingItems = function(month, items){
		httpBackend
			.whenGET('http://localhost:8080/endpoints/v1/calendar/' + month + '/work-log/entries')
			.respond(200, { items: items });
	};
	
	var reportFor = function(month){
		report.setMonth(month);
		httpBackend.flush();
	};
	
	var reportWith = function(items){

		monthContainsFollowingItems('2014/01', _.toArray(arguments));
		reportFor('2014/01');
	};

});