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


    describe('filters',function(){
        it('all project are active by default',function(){
            worklogForMonthContains("2014/03", [
                {
                    "projectName": "ProjectManhattan"
                },
                {
                    "projectName": "ApolloProgram"
                }
            ]);

            scope.filter.setActive("2014/03");

            expect(scope.filter.activeProjects).toEqual(scope.projects);
        });

        it('all employees are selected by default',function(){
            worklogForMonthContains("2014/03", [
                {
                    "employee": "bart.simpson"
                },
                {
                    "employee": "homer.simpson"
                }
            ]);

            scope.filter.setActive("2014/03");

            expect(scope.filter.activeEmployees).toEqual(scope.employees);
        });

        it('setting active project',function(){
            scope.init();
            scope.filter.activeProjects = [];

            scope.filter.toggleActiveProject("ProjectManhattan");

            expect(scope.filter.activeProjects).toContain("ProjectManhattan");
        });

        it('resetting active project',function(){
            scope.init();
            scope.filter.activeProjects = ["ProjectManhattan"];

            scope.filter.toggleActiveProject("ProjectManhattan");

            expect(scope.filter.activeProjects).not.toContain("ProjectManhattan");
        });

        it('asking for active Project',function(){
            scope.init();
            scope.filter.activeProjects = ["ProjectManhattan"];

            expect(scope.filter.isActiveProject("ProjectManhattan")).toBeTruthy();
            expect(scope.filter.isActiveProject("ApolloProgram")).toBeFalsy();
        });

        it('setting active employee',function(){
            scope.init();
            scope.filter.activeEmployees = [];

            scope.filter.toggleActiveEmployee("homer.simpson");

            expect(scope.filter.activeEmployees).toContain("homer.simpson");
        });

        it('resetting active employee',function(){
            scope.init();
            scope.filter.activeEmployees = ["homer.simpson"];

            scope.filter.toggleActiveEmployee("homer.simpson");

            expect(scope.filter.activeEmployees).not.toContain("homer.simpson");
        });

        it('asking for active employee',function(){
            scope.init();
            scope.filter.activeEmployees = ["homer.simpson"];

            expect(scope.filter.isActiveEmployee("homer.simpson")).toBeTruthy();
            expect(scope.filter.isActiveEmployee("bart.simpson")).toBeFalsy();
        });

        it('filter only active projects & employees',function(){

            scope.init();
            scope.filter.activeProjects = ["ProjectManhattan"];
            scope.filter.activeEmployees = ["homer.simpson"];

            expect(scope.satisfies(
                {
                    "projectName": "ProjectManhattan",
                    "employee": "homer.simpson"
                }
            )).toBeTruthy();
            expect(scope.satisfies(
                {
                    "projectName": "ApolloProgram",
                    "employee": "homer.simpson"
                }
            )).toBeFalsy();
            expect(scope.satisfies(
                {
                    "projectName": "ProjectManhattan",
                    "employee": "bart.simpson"
                }
            )).toBeFalsy();
            expect(scope.satisfies(
                {
                    "projectName": "ApolloProgram",
                    "employee": "bart.simpson"
                }
            )).toBeFalsy();
        });
    });

    describe("aggregates", function(){
    	
    	it("calculates total workload for active month", function(){
    		
    		scope.init();
    		scope.filter.activeEmployees = ["active"];
    		scope.filter.activeProjects = ["active"];
    		scope.filter.activeMonth = ["2014/01"];
    		
    		scope.workLog = { 
    				items: [
    		                 {
    		                	 "workload": "1h",
    		                	 "projectName": "active",
    		                	 "employee": "active",
    		                	 "day": "2014/01/01"		 
    		                 }, 
    		                 {
    		                	 "workload": "2h",
    		                	 "projectName": "active",
    		                	 "employee": "active",
    		                	 "day": "2014/02/01"		 
    		                 }, 
    		                 {
    		                	 "workload": "3h",
    		                	 "projectName": "active",
    		                	 "employee": "active",
    		                	 "day": "2014/01/01"		 
    		                 } 
    		                ]
    		};
    		
    		expect(scope.totalForMonth()).toEqual("4h");
    	});

    	it("calculates total workload for active employees", function(){
    		
    		scope.init();
    		scope.filter.activeEmployees = ["homer.simpson", "bart.simpson"];
    		scope.filter.activeProjects = ["active"];
    		scope.filter.activeMonth = ["2014/01"];
    		
    		scope.workLog = { 
    				items: [
    		                 {
    		                	 "workload": "1h",
    		                	 "projectName": "active",
    		                	 "employee": "homer.simpson",
    		                	 "day": "2014/01/01"		 
    		                 }, 
    		                 {
    		                	 "workload": "2h",
    		                	 "projectName": "active",
    		                	 "employee": "bart.simpson",
    		                	 "day": "2014/01/01"		 
    		                 }, 
    		                 {
    		                	 "workload": "3h",
    		                	 "projectName": "active",
    		                	 "employee": "homer.simpson",
    		                	 "day": "2014/01/01"		 
    		                 } 
    		                ]
    		};
    		
    		expect(scope.totalForEmployee("homer.simpson")).toEqual("4h");
    		expect(scope.totalForEmployee("marge.simpson")).toEqual("0h");
    		
    	});
    	
    	it("calculates total workload for active projects", function(){
    		
    		scope.init();
    		scope.filter.activeEmployees = ["active"];
    		scope.filter.activeProjects = ["ProjectManhattan", "ApolloProgram"];
    		scope.filter.activeMonth = ["2014/01"];
    		
    		scope.workLog = { 
    				items: [
    		                 {
    		                	 "workload": "1h",
    		                	 "projectName": "ProjectManhattan",
    		                	 "employee": "active",
    		                	 "day": "2014/01/01"		 
    		                 }, 
    		                 {
    		                	 "workload": "2h",
    		                	 "projectName": "ApolloProgram",
    		                	 "employee": "active",
    		                	 "day": "2014/01/01"		 
    		                 }, 
    		                 {
    		                	 "workload": "3h",
    		                	 "projectName": "ProjectManhattan",
    		                	 "employee": "active",
    		                	 "day": "2014/01/01"		 
    		                 } 
    		                 ]
    		};
    		
    		expect(scope.totalForProject("ProjectManhattan")).toEqual("4h");
    		expect(scope.totalForProject("OtherProject")).toEqual("0h");
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
        spyOn(reportDates, 'getMonths').and.returnValue([currentMonth]);
    }
});