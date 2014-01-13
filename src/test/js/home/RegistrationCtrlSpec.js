describe('Registration Controller should', function() {
	beforeEach(module('openTrApp.registration'))

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

	it('log work 1', function() {
		scope.workLogExpression = '2h on #ProjectManhattan @2014/01/03';
		httpBackend.expectPOST("http://localhost:8080/endpoints/v1/employee/1/work-log/entries", {
			projectName : 'ProjectManhattan',
			workload : '2h',
			day : '2014/01/03'
		}).respond(200);

		scope.logWork();
		httpBackend.flush();
	});

	it('log work 2', function() {
		scope.workLogExpression = '1h 30m on #ProjectX @2014/01/02';
		httpBackend.expectPOST("http://localhost:8080/endpoints/v1/employee/1/work-log/entries", {
			projectName : 'ProjectX',
			workload : '1h 30m',
			day : '2014/01/02'
		}).respond(200);
		
		scope.logWork();
		httpBackend.flush();
	});
});