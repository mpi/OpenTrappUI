describe("ProjectNameTypeahead", function(){
	
	var scope;
	
	beforeEach(module('openTrApp'));
	
	beforeEach(inject(function($rootScope, $controller, $httpBackend, _currentEmployee_, _timeProvider_ ,_projectList_) {
		scope = $rootScope.$new();
		$controller('RegistrationCtrl', {
			$scope : scope
		});
        projectList = _projectList_;
	}));
	
	var followingProjectsAreAvailable = function(){
		projectList.projectList.splice(0, projectList.projectList.length);
		for(i =0; i<arguments.length; i++){
			projectList.projectList.push(arguments[i]);
		}
	};
	
	var suggestedProjectNames = function (){
		return scope.suggestions; 
	};
	
	var userTypes = function(input){
		scope.workLogExpression = input;
		scope.$digest();
	};
//	var userTypedBefore = function(input){
//		userTypes(input);
//	}
	
	it("suggests all available projects after typing #", function(){

		// given:
		followingProjectsAreAvailable('ProjectManhattan', 'ApolloProgram');
		// when:
		userTypes('#')
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
	
	it("suggest project starts with pattern", function(){
		
		// given:
		followingProjectsAreAvailable('ProjectManhattan', 'ApolloProgram');
		// when:
		userTypes('#App')
		// then:
		expect(suggestedProjectNames()).toEqual(['ApolloProgram']);
	});
	
});