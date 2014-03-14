describe('Report Controller should', function () {

    beforeEach(module('openTrApp'));

    var scope, httpBackend, reportDates;

    beforeEach(inject(function ($rootScope, $controller, $httpBackend, _reportDates_) {
        scope = $rootScope.$new();
        $controller('ReportCtrl', {
            $scope: scope
        });
        httpBackend = $httpBackend;
        reportDates = _reportDates_;
    }));

    it('create scope', function () {
        expect(scope).toBeDefined();
    });

    it('fetch items for active month', function () {
        spyOn(reportDates, 'getMonths').and.returnValue(["2014/02","2014/01"]);
        httpBackend.expectGET("http://localhost:8080/endpoints/v1/calendar/2014/02/work-log/entries").respond(200, {
            "items": items
        });

        scope.init();
        httpBackend.flush();

        expect(scope.workLog.items).toEqual(items);
    });

    it('fetch report dates', function () {
        spyOn(reportDates, 'getMonths').and.returnValue(["2014/01"]);

        scope.init();

        expect(scope.report.months).toEqual(["2014/01"]);
    });

    it('first month is active by default', function () {
        spyOn(reportDates, 'getMonths').and.returnValue(["2014/02","2014/01"]);

        scope.init();

        expect(scope.report.activeMonth).toEqual("2014/02");
    });

    it('should set active month', function () {
        spyOn(reportDates, 'getMonths').and.returnValue(["2014/02","2014/01"]);
        scope.init();

        scope.report.setActive("2013/12");

        expect(scope.report.activeMonth).toEqual("2013/12");
    });

    var items = [
        {
            "link": "/endpoints/v1/work-log/entries/WL.0001",
            "id": "WL.0001",
            "workload": "1h",
            "projectName": "TheProject",
            "employee": "John"
        },
        {
            "link": "/endpoints/v1/work-log/entries/WL.0003",
            "id": "WL.0003",
            "workload": "3h",
            "projectName": "TheProject",
            "employee": "Jane"
        }
    ];
});