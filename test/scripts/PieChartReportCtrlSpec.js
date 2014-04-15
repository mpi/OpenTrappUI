describe('Pie Chart Report Controller', function () {

    beforeEach(module('openTrapp'));

    var scope;
    var worklog;
    var worklogUpdated;
    
    beforeEach(function(){
    	worklogUpdated = function(){};
    });
    
    beforeEach(inject(function ($rootScope, $controller) {
    	worklog = {
    			projects: {}, 
    			onUpdate: function(callback){
    				worklogUpdated = callback;
    			}
    		};
    	scope = $rootScope.$new();
        $controller('PieChartReportCtrl', {
            $scope: scope,
            worklog: worklog
        });
    }));

    it("calculates share for active project", function () {

        // given:
    	worklog.projects = {
    			"ProjectManhattan": {
    				active: true,
    				total: "1h"
    			}, 
    			"ApolloProgram": {
    				active: true,
    				total: "2h"
    			}, 
    			"OtherProject": {
    				active: false,
    				total: "1h"
    			}
    		};
    	scope.init();
    	
    	// when:
    	worklogUpdated();
    	
    	// then:
        expect(scope.projects).toEqual([
                                        {name: "ApolloProgram", total: "2h", share: "67%"},
                                        {name: "ProjectManhattan", total: "1h", share: "33%"}
                                       ]);
    });
    
});