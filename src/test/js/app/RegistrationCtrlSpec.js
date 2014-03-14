describe('Registration Controller should', function() {
	beforeEach(module('openTrApp'));

	var scope, httpBackend;
	beforeEach(inject(function($rootScope, $controller, $httpBackend) {
		scope = $rootScope.$new();
		$controller('RegistrationCtrl', {
			$scope : scope
		});
		httpBackend = $httpBackend;
	}));

	it('create scope', function() {
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

    it('log work for today by default in simplified way', function() {
        scope.workLogExpression = '2h on #ProjectManhattan';
        httpBackend.expectPOST("http://localhost:8080/endpoints/v1/employee/1/work-log/entries", {
            projectName: 'ProjectManhattan',
            workload: '2h',
            day: '2014/03/14'
        }).respond(200);

        scope.logWork();
        httpBackend.flush();
    });

    it('log work with days workload by default in simplified way', function() {
        scope.workLogExpression = '1d on #ProjectManhattan';
        httpBackend.expectPOST("http://localhost:8080/endpoints/v1/employee/1/work-log/entries", {
            projectName: 'ProjectManhattan',
            workload: '1d',
            day: '2014/03/14'
        }).respond(200);

        scope.logWork();
        httpBackend.flush();
    });

    it('log work with days and hours workload by default in simplified way', function() {
        scope.workLogExpression = '1d 3h on #ProjectManhattan';
        httpBackend.expectPOST("http://localhost:8080/endpoints/v1/employee/1/work-log/entries", {
            projectName: 'ProjectManhattan',
            workload: '1d 3h',
            day: '2014/03/14'
        }).respond(200);

        scope.logWork();
        httpBackend.flush();
    });

    it('be invalid when date is not a proper format', function() {
        scope.workLogExpression = '2h on #ProjectManhattan @2014/01/03';

        scope.logWork();

        httpBackend.verifyNoOutstandingRequest();
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
	
	it('replace alert on second request', function() {
		scope.workLogExpression = '2h on #ProjectManhattan @2014/01/03';
		scope.alert = { type: 'success', message: '1' };
        httpBackend.expectPOST().respond(200);
		
		scope.logWork();
		httpBackend.flush();

		expect(scope.alert).toEqual({
			type: 'success',
			message: 'Worklog entry has been successfully created!'
		});
	});

    it('display feedback to user in case of failed request', function() {
        scope.workLogExpression = '2h on #ProjectManhattan @2014/01/03';
        httpBackend.expectPOST().respond(503);

        scope.logWork();
		httpBackend.flush();

        expect(scope.alert).toEqual({
            type: 'danger',
            message: 'Server not responding'
        });
    });

	it('does not log work to server if invalid expression', function() {

		scope.workLogExpression = 'invalid';

		scope.logWork();

		httpBackend.verifyNoOutstandingExpectation();
	});

    it('does not log work to server if invalid date', function() {

        scope.workLogExpression = '2h on #ProjectManhattan @invalid';

        scope.logWork();

        httpBackend.verifyNoOutstandingExpectation();
    });
	
	it('shows success fedback if expression is valid', function() {

		scope.workLogExpression = '2h on #ProjectManhattan @2014/01/03';
		
		scope.update();
		
		expect(scope.status).toBe('success');
	});

    it('be valid for worklog without date', function() {

        scope.workLogExpression = '2h on #ProjectManhattan';

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