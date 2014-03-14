describe('Report Controller', function () {

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
        spyOn(reportDates, 'getMonths').and.returnValue(["2014/02", "2014/01"]);
        worklogForMonthContains("2014/02", items);

        expect(scope.workLog.items).toEqual(items);
    });

    it('fetch report dates', function () {
        spyOn(reportDates, 'getMonths').and.returnValue(["2014/01"]);

        scope.init();

        expect(scope.filter.months).toEqual(["2014/01"]);
    });

    it('first month is active by default', function () {
        spyOn(reportDates, 'getMonths').and.returnValue(["2014/02", "2014/01"]);

        scope.init();

        expect(scope.filter.activeMonth).toEqual("2014/02");
    });

    it('should set active month', function () {
        spyOn(reportDates, 'getMonths').and.returnValue(["2014/02", "2014/01"]);
        scope.init();

        scope.filter.setActive("2013/12");

        expect(scope.filter.activeMonth).toEqual("2013/12");
    });

    it('should fetch log entries on changing active month', function () {
        currentMonthIs("2014/02");
        worklogForMonthContains("2014/02", []);

        httpBackend.expectGET("http://localhost:8080/endpoints/v1/calendar/" + "2014/03" + "/work-log/entries").respond(200, {
            "items": items
        });

        scope.filter.setActive("2014/03");
        httpBackend.flush();

        expect(scope.workLog.items).toEqual(items);
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

    describe('project names', function () {

        it('are fetched from worklog entries', function () {

            currentMonthIs("2014/03");
            worklogForMonthContains("2014/03", [
                {
                    "projectName": "ProjectManhattan"
                },
                {
                    "projectName": "AppolloProgram"
                }
            ]);
            expect(scope.projects).toContain("AppolloProgram", "ProjectManhattan");
        });

        it('are fetched from worklog entries (ignoring duplicates)', function () {

            currentMonthIs("2014/03");
            worklogForMonthContains("2014/03", [
                {
                    "projectName": "ProjectManhattan"
                },
                {
                    "projectName": "ProjectManhattan"
                }
            ]);
            expect(scope.projects).toEqual(["ProjectManhattan"]);
        });

    });

    describe('employees', function () {

        it('are fetched from worklog entries', function () {

            currentMonthIs("2014/03");
            worklogForMonthContains("2014/03", [
                {
                    "employee": "bart.simpson"
                },
                {
                    "employee": "homer.simpson"
                }
            ]);
            expect(scope.employees).toContain("homer.simpson", "bart.simpson");
        });


        it('are fetched from worklog entries (ignoring duplicates)', function () {

            currentMonthIs("2014/03");
            worklogForMonthContains("2014/03", [
                {
                    "employee": "bart.simpson"
                },
                {
                    "employee": "bart.simpson"
                }
            ]);
            expect(scope.employees).toEqual(["bart.simpson"]);
        });
    });

    function worklogForMonthContains(month, items) {
        httpBackend.expectGET("http://localhost:8080/endpoints/v1/calendar/" + month + "/work-log/entries").respond(200, {
            "items": items
        });

        scope.init();
        httpBackend.flush();
    }

    function currentMonthIs(currentMonth) {
        spyOn(reportDates, 'getMonths').and.returnValue([ currentMonth]);
    }
});