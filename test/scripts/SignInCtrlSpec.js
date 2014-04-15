describe("SignIn", function () {

    beforeEach(module('openTrapp'));
    beforeEach(inject(function (_enviromentInterceptor_) {
        _enviromentInterceptor_.request = function (x) {
            return x;
        };
    }));

    var scope, httpBackend;
    var currentEmployee;
    var location;

    beforeEach(inject(function ($rootScope, $controller, $httpBackend, $location, _currentEmployee_) {
        scope = $rootScope.$new();
        $controller('SignInCtrl', {
            $scope: scope
        });
        httpBackend = $httpBackend;
        location = $location;
        currentEmployee = _currentEmployee_;
        spyOn(currentEmployee, 'signedInAs');
    }));

    it('gets authentication status', function () {

        httpBackend.expectGET("http://localhost:8080/endpoints/v1/authentication/status").respond(200, {
            "authenticated": true,
            "displayName": "Homer Simpson",
            "username": "homer.simpson",
            "loginUrl": "/loginUrl",
            "logoutUrl": "/logoutUrl"
        });
        spyOn(location, 'absUrl').andReturn('currentLocation');

        scope.init();
        httpBackend.flush();

        expect(scope.authenticated).toEqual(true);
        expect(scope.displayName).toEqual("Homer Simpson");
        expect(scope.username).toEqual("homer.simpson");
        expect(scope.loginUrl).toEqual("/loginUrl?redirect_to=currentLocation");
        expect(scope.logoutUrl).toEqual("/logoutUrl?redirect_to=currentLocation");
    });

    it('sets currentEmployee', function () {

        httpBackend.expectGET("http://localhost:8080/endpoints/v1/authentication/status").respond(200, {
            "authenticated": true,
            "displayName": "Homer Simpson",
            "username": "homer.simpson",
            "loginUrl": "/loginUrl",
            "logoutUrl": "/logoutUrl"
        });

        scope.init();
        httpBackend.flush();

        expect(currentEmployee.signedInAs).toHaveBeenCalledWith('homer.simpson');
    });
});
