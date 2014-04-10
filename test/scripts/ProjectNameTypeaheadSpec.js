describe("ProjectNameTypeahead", function(){
	
	var scope, http, projectNames;
	
	beforeEach(module('openTrApp'));
    beforeEach(inject(function(_enviromentInterceptor_){
    	_enviromentInterceptor_.request = function(x){
    		return x;
    	};
    }));
	
	beforeEach(inject(function($rootScope, $controller, $httpBackend, _projectNames_) {
		scope = $rootScope.$new();
		$controller('RegistrationCtrl', {
			$scope : scope
		});
		http = $httpBackend;
		projectNames = _projectNames_;
	}));
	
	var followingProjectsAreAvailable = function(){
		
		var args = _.toArray(arguments);

        http.expectGET("http://localhost:8080/endpoints/v1/projects/").respond(200, args);
        projectNames.forEach(function(){});
        http.flush();
	};
	
	var suggestedProjectNames = function (){
		return scope.suggestions; 
	};
	
	var userTypes = function(input){
		scope.workLogExpression = input;
		scope.$digest();
	};
	
	var userConfirmFirstSuggestion = function(){
		scope.selectSuggestion(scope.suggestions[0]);
	};
	
	it("suggests all available projects after typing #", function(){

		// given:
		followingProjectsAreAvailable('ProjectManhattan', 'ApolloProgram');
		// when:
		userTypes('#');
		// then:
		expect(suggestedProjectNames()).toContain('ProjectManhattan', 'AppolloProgram');
	});
	
	it("does not suggest any projects if # is not present", function(){
		
		// given:
		followingProjectsAreAvailable('ProjectManhattan', 'ApolloProgram');
		// when:
		userTypes('1d')
		// then:
		expect(suggestedProjectNames()).toEqual([]);
	});
	
	it("does not suggest any projects if # is recently added character", function(){
		
		// given:
		followingProjectsAreAvailable('ProjectManhattan', 'ApolloProgram');
		// when:
		userTypes('1d #AppolloProject @mon')
		// then:
		expect(suggestedProjectNames()).toEqual([]);
	});
	
	it("does not suggest any projects if # is recently added character", function(){
		
		// given:
		followingProjectsAreAvailable('ProjectManhattan', 'ApolloProgram');
		// when:
		userTypes('1d #ApolloProject ')
		// then:
		expect(suggestedProjectNames()).toEqual([]);
	});
	
	it("suggest project starts with pattern", function(){
		
		// given:
		followingProjectsAreAvailable('ProjectManhattan', 'ApolloProgram');
		// when:
		userTypes('#Ap')
		// then:
		expect(suggestedProjectNames()).toEqual(['ApolloProgram']);
	});
	
	it("complete project name on selecting suggestions", function(){
		
		// given:
		followingProjectsAreAvailable('ProjectManhattan', 'ApolloProgram');
		// when:
		userTypes('1d #ApolloPro')
		userConfirmFirstSuggestion();
		// then:
		expect(scope.workLogExpression).toEqual('1d #ApolloProgram ');
	});
	
});
