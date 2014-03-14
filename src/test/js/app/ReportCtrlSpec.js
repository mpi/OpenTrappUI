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

    it('fetch items for selected month', function () {
        var response = {
            "items": items
        };
        scope.report = {
            year: '2015',
            month: '05'
        };
        httpBackend.expectGET("http://localhost:8080/endpoints/v1/calendar/2015/05/work-log/entries").respond(200, response);

        scope.fetchItems();
        httpBackend.flush();

        expect(scope.workLog.items).toEqual(items);
    });

    it('fetch items for current month', function () {
        var date = moment().format("YYYY/MM");
        httpBackend.expectGET("http://localhost:8080/endpoints/v1/calendar/" + date + "/work-log/entries").respond(200, {
            "items": items
        });

        scope.init();
        httpBackend.flush();

        expect(scope.workLog.items).toEqual(items);
    });

    it('fetch report dates', function() {
        spyOn(reportDates,'getMonths').and.returnValue(["2014/01"]);

        scope.init();

        expect(scope.report.months).toEqual(["2014/01"]);
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