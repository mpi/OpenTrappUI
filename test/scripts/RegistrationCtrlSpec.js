describe('Registration Controller should', function() {
	beforeEach(module('openTrapp'));
    beforeEach(inject(function(_enviromentInterceptor_){
    	_enviromentInterceptor_.request = function(x){
    		return x;
    	};
    }));

    var timeProvider;
    var projectList;
    var currentDateString = "2014/01/02";
    var employeeUsername = 'homer.simpson';

	var scope, httpBackend;
	beforeEach(inject(function($rootScope, $controller, $httpBackend, _currentEmployee_, _timeProvider_ ,_projectNames_, $sce) {
		scope = $rootScope.$new();
		$controller('RegistrationCtrl', {
			$scope : scope
		});
		httpBackend = $httpBackend;
        timeProvider = _timeProvider_;
        currentEmployee = _currentEmployee_;
        spyOn(timeProvider, 'getCurrentDate').andReturn(new Date(currentDateString));
        spyOn(currentEmployee, 'username').andReturn(employeeUsername);
		spyOn(_projectNames_, 'startingWith').andReturn({
			forEach: function(callback){}
		});       
		spyOn($sce, 'trustAsHtml').andCallFake(function(x){return x;});
	}));

    it('create scope', function() {
		expect(scope).toBeDefined();
	});

	it('logs work to server', function() {
		scope.workLogExpression = '2h #ProjectManhattan @2014/01/03';
		httpBackend.expectPOST("http://localhost:8080/endpoints/v1/employee/homer.simpson/work-log/entries", {
			projectName: 'ProjectManhattan',
			workload: '2h',
			day: '2014/01/03'
		}).respond(200);

		scope.logWork();
		httpBackend.flush();
	});

    it('be invalid when date is not a proper format', function() {
        scope.workLogExpression = 'invalid';

        scope.logWork();

        httpBackend.verifyNoOutstandingExpectation();
    });

	it('clear input after successfull submit', function() {
		scope.workLogExpression = '2h #ProjectManhattan @2014/01/03';
		httpBackend.expectPOST("http://localhost:8080/endpoints/v1/employee/homer.simpson/work-log/entries", {
			projectName: 'ProjectManhattan',
			workload: '2h',
			day: '2014/01/03'
		}).respond(200);
		
		scope.logWork();
		httpBackend.flush();

		expect(scope.workLogExpression).toBe('');
	});

    it('show succesfull alert with actual data', function() {
        scope.workLogExpression = '#ProjectManhattan 1d 2h 5m';
        scope.alert = { type: 'success', message: '1' };
        httpBackend.expectPOST().respond(200);

        scope.logWork();
        httpBackend.flush();

        expect(scope.alerts).toContain({
            type: 'success',
            message: '<b>Hurray!</b> You  have successfully logged <b>1d 2h 5m</b> on project <b>ProjectManhattan</b> at <b>' + currentDateString+ '</b>.'
        });
    });
	
	it('replace alert on second request', function() {
		scope.workLogExpression = '2h #ProjectManhattan @2014/01/03';
		scope.alert = { type: 'success', message: '1' };
        httpBackend.expectPOST().respond(200);
		
		scope.logWork();
		httpBackend.flush();

		expect(scope.alerts).toContain({
			type: 'success',
			message: '<b>Hurray!</b> You  have successfully logged <b>2h</b> on project <b>ProjectManhattan</b> at <b>2014/01/03</b>.'
		});
	});

    it('display feedback to user in case of failed request', function() {
        scope.workLogExpression = '2h #ProjectManhattan @2014/01/03';
        httpBackend.expectPOST().respond(503);

        scope.logWork();
		httpBackend.flush();

		expect(scope.alerts).toContain({
			type: 'danger',
			message: '<b>Upps...</b> Server is not responding.'
		});
    });

	it('does not log work to server if invalid expression', function() {

		scope.workLogExpression = 'invalid';

		scope.logWork();

		httpBackend.verifyNoOutstandingExpectation();
	});

    it('does not log work to server if invalid date', function() {

        scope.workLogExpression = '2h #ProjectManhattan @invalid';

        scope.logWork();

        httpBackend.verifyNoOutstandingExpectation();
    });

    var userTypes = function(input){
    	scope.workLogExpression = input;
    	scope.$digest();
    };
    
	it('shows success fedback if expression is valid', function() {

		userTypes('2h #ProjectManhattan @2014/01/03');

		expect(scope.status).toBe('success');
	});

    it('be valid for worklog without date', function() {

    	userTypes('2h #ProjectManhattan');

        expect(scope.status).toBe('success');
    });

	it('shows error fedback if expression is not valid', function() {
		
		userTypes('not valid');
		
		expect(scope.status).toBe('error');
	});
	
	it('shows no fedback if expression is empty', function() {
		
		userTypes('');
		
		expect(scope.status).toBe('');
	});
	
});
