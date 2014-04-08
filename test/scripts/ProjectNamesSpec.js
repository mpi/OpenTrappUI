describe('Project Names', function() {
	
	beforeEach(module('openTrApp'));
    beforeEach(inject(function(_enviromentInterceptor_){
    	_enviromentInterceptor_.request = function(x){
    		return x;
    	};
    }));

	var httpBackend, projectNames;
	beforeEach(inject(function($httpBackend, _projectNames_) {
		httpBackend = $httpBackend;
		projectNames = _projectNames_;
	}));
	
	it('fetches projects from server', function(){
		
		// given:
        httpBackend.expectGET("http://localhost:8080/endpoints/v1/projects/").respond(200,
        	['ManhattanProject', 'ApolloProgram']
        );
		
		// when:
		var projects = [];
		projectNames.forEach(function(project){
			projects.push(project);
		});
		httpBackend.flush();
		
		// then:
		expect(projects).toContain('ManhattanProject', 'ApolloProgram');
		
	});
	
	it('filters names by prefix', function(){
		
		// given:
        httpBackend.expectGET("http://localhost:8080/endpoints/v1/projects/").respond(200,
        	['ManhattanProject', 'ApolloProgram']
        );
		
		// when:
		var projects = [];
		projectNames.startingWith('Man').forEach(function(project){
			projects.push(project);
		});
		httpBackend.flush();
		
		// then:
		expect(projects).toEqual(['ManhattanProject']);
	});
});
