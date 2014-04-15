describe('Monthly Report Controller', function () {

    beforeEach(module('openTrapp'));
    beforeEach(inject(function (_enviromentInterceptor_) {
        _enviromentInterceptor_.request = function (x) {
            return x;
        };
    }));
    
    var scope, httpBackend;
    var worklog;
    var worklogUpdated;
    
    beforeEach(function(){
    	worklogUpdated = function(){};
    });
    
    beforeEach(inject(function ($rootScope, $controller, $httpBackend) {
    	worklog = {
    			month: '2014/01',
    			projects: {}, 
    			onUpdate: function(callback){
    				worklogUpdated = callback;
    			}
    		};
    	scope = $rootScope.$new();
        $controller('MonthlyReportCtrl', {
            $scope: scope,
            worklog: worklog
        });
        httpBackend = $httpBackend;
    }));

    it('fetches days in given month', function(){
    	
    	// given:
    	httpBackend
    		.whenGET('http://localhost:8080/endpoints/v1/calendar/' + worklog.month)
    		.respond(200, {
    			days: [ { id: '2014/01/01', holiday: false}, { id: '2014/01/02', holiday: true} ]
    		});
    	
    	// when:
    	scope.init();
    	worklogUpdated();
    	httpBackend.flush();
    	
    	// then:
        expect(scope.days)
    		.toEqual([
    		          { id: '2014/01/01', number: "01", name: "Wed", holiday: false },
    		          { id: '2014/01/02', number: "02", name: "Thu", holiday: true }
    		         ]);
    	
    });
    
    it("calculates every day totals for every employee", function () {

        // given:
    	worklog.entries = [
    			{
    				day: "2014/01/01",
    				employee: "bart.simpson",
    				workload: "1h"
    			}, 
    			{
    				day: "2014/01/01",
    				employee: "bart.simpson",
    				workload: "2h 30m"
    			}, 
    			{
    				day: "2014/01/02",
    				employee: "bart.simpson",
    				workload: "3h"
    			}, 
    			{
    				day: "2014/01/02",
    				employee: "homer.simpson",
    				workload: "4h 20m"
    			}
    		];
    	scope.init();
    	
    	// when:
    	worklogUpdated();
    	
    	// then:
        expect(scope.report)
        	.toEqual({
                "bart.simpson": { "2014/01/01": "3.5", "2014/01/02": "3", "total": "6.5" },
                "homer.simpson": { "2014/01/02": "4.33", "total": "4.33" }
        	});
    });
    
});