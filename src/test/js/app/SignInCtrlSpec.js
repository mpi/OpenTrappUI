ddescribe("SignIn", function(){
	
    beforeEach(module('openTrApp'));

    var scope, httpBackend;

    beforeEach(inject(function ($rootScope, $controller, $httpBackend) {
        scope = $rootScope.$new();
        $controller('SignInCtrl', {
            $scope: scope
        });
        httpBackend = $httpBackend;
    }));

    it('gets authentication status', function () {

        httpBackend.expectGET("http://localhost:8080/endpoints/v1/authentication/status").respond(200, {
            "authenticated": true,
            "displayName": "homer.simpson",
            "loginUrl": "/loginUrl",
            "logoutUrl": "/logoutUrl"
        });

    	scope.init();
    	httpBackend.flush();
    	
    	expect(scope.authenticated).toEqual(true);
    	expect(scope.displayName).toEqual("homer.simpson");
    	expect(scope.loginUrl).toEqual("/loginUrl");
    	expect(scope.logoutUrl).toEqual("/logoutUrl");
    });
	
});