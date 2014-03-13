describe('Report Controller should', function() {

    beforeEach(module('openTrApp'));

	var scope, httpBackend;

    beforeEach(inject(function($rootScope, $controller, $httpBackend) {
		scope = $rootScope.$new();
		$controller('ReportCtrl', {
			$scope : scope
		});
		httpBackend = $httpBackend;
	}));

	it('create scope', function() {
		expect(scope).toBeDefined();
	});

	it('fetchItems', function() {
		var items = [ {
			"link" : "/endpoints/v1/work-log/entries/WL.0001",
			"id" : "WL.0001",
			"workload" : "1h",
			"projectName" : "TheProject",
			"employee" : "John"
		}, {
			"link" : "/endpoints/v1/work-log/entries/WL.0003",
			"id" : "WL.0003",
			"workload" : "3h",
			"projectName" : "TheProject",
			"employee" : "Jane"
		} ]
		var response = {
			"items" : items
		};
		httpBackend.expectGET("http://localhost:8080/endpoints/v1/calendar/2014/01/work-log/entries").respond(200, response);

		scope.fetchItems();
		httpBackend.flush();

		expect(scope.workLog.items).toEqual(items);
	});
});