ddescribe('Report Filters Controller', function () {
	
    beforeEach(module('openTrapp'));

    var currentMonth;
    var currentEmployee;
    var scope, worklog;
    var worklogIsReady;
    
    beforeEach(function(){
    	currentMonth = new Month('2014/01');
    	worklogIsReady = function(){};
    });
    beforeEach(inject(function ($rootScope, $controller, _worklog_, _currentEmployee_) {
        
    	scope = $rootScope.$new();
        $controller('ReportFiltersCtrl', {
            $scope: scope,
            currentMonth: currentMonth
        });
        
        currentEmployee = _currentEmployee_;
        worklog = _worklog_; 
        spyOn(worklog, 'setMonth').andCallFake(function(m, callback){
        	worklogIsReady = callback;
        });
        spyOn(worklog, 'enableEmployee');
        spyOn(worklog, 'enableEmployeeProjects');
    }));

    it('starts with current month', function(){
    	
    	// given:
    	// when:
    	scope.init();
    	
    	// then:
    	expect(worklog.setMonth).toHaveBeenCalledWith(currentMonth.name, worklogIsReady);
    });
    
    it('offers one next month and two previous months', function(){
    	
    	// given:
    	// when:
    	scope.init();
    	
    	// then:
    	expect(scope.months).toEqual(['2014/02', currentMonth.name, '2013/12', '2013/11']);
    });
    
    it('selects current user by default', function(){
    	
    	// given:
    	currentEmployeeIs('bart.simpson');
    	scope.init();
    	
    	// when:
    	worklogIsReady();

    	// then:
    	expect(worklog.enableEmployee).toHaveBeenCalledWith('bart.simpson');
    });
    
    it('selects current users projects by default', function(){
    	
    	// given:
    	currentEmployeeIs('bart.simpson');
    	scope.init();
    	
    	// when:
    	worklogIsReady();
    	
    	// then:
    	expect(worklog.enableEmployeeProjects).toHaveBeenCalledWith('bart.simpson');
    });
        
    // --

    var currentEmployeeIs = function(employee){
    	currentEmployee.signedInAs(employee);
    };
    
});