describe('Registration Controller should', function() {
	beforeEach(module('openTrApp'))

	var scope, httpBackend;
	beforeEach(inject(function($rootScope, $controller, $httpBackend) {
		scope = $rootScope.$new();
		$controller('RegistrationCtrl', {
			$scope : scope
		});
		httpBackend = $httpBackend;
	}));

	it('create socpe', function() {
		expect(scope).toBeDefined();
	});

	it('logs work to server', function() {
		scope.workLogExpression = '2h on #ProjectManhattan @2014/01/03';
		httpBackend.expectPOST("http://localhost:8080/endpoints/v1/employee/1/work-log/entries", {
			projectName: 'ProjectManhattan',
			workload: '2h',
			day: '2014/01/03'
		}).respond(200);

		scope.logWork();
		httpBackend.flush();
	});

	it('clear input after successfull submit', function() {
		scope.workLogExpression = '2h on #ProjectManhattan @2014/01/03';
		httpBackend.expectPOST("http://localhost:8080/endpoints/v1/employee/1/work-log/entries", {
			projectName: 'ProjectManhattan',
			workload: '2h',
			day: '2014/01/03'
		}).respond(200);
		
		scope.logWork();
		httpBackend.flush();
		
		expect(scope.workLogExpression).toBe('');
	});
	
	it('display feedback to user in case of successfull request', function() {
		scope.workLogExpression = '2h on #ProjectManhattan @2014/01/03';
		httpBackend.expectPOST("http://localhost:8080/endpoints/v1/employee/1/work-log/entries", {
			projectName: 'ProjectManhattan',
			workload: '2h',
			day: '2014/01/03'
		}).respond({
			status: "SUCCESS",
			link: "/endpoints/v1/work-log/entries/WL.0001"
		});
		
		scope.logWork();
		httpBackend.flush();
		
		expect(scope.alerts).toContain({ 
			type: 'success', 
			message: 'Worklog entry <strong>WL.0001</strong> has been successfully created!'
		});
	});
	
	it('does not log work to server if invalid expression', function() {

		scope.workLogExpression = 'invalidExpresion';
		
		scope.logWork();
		
		httpBackend.verifyNoOutstandingRequest();
	});
	
	it('shows success fedback if expression is valid', function() {

		scope.workLogExpression = '2h on #ProjectManhattan @2014/01/03';
		
		scope.update();
		
		expect(scope.status).toBe('success');
	});

	it('shows error fedback if expression is not valid', function() {
		
		scope.workLogExpression = 'not valid';
		
		scope.update();
		
		expect(scope.status).toBe('error');
	});
	
	it('shows no fedback if expression is empty', function() {
		
		scope.workLogExpression = '';
		
		scope.update();
		
		expect(scope.status).toBe('');
	});
	
});