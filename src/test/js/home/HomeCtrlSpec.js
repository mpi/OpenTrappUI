describe('Home Controler ', function() {
    beforeEach(module('timereg'))

    var scope;
    beforeEach(inject(function($rootScope){
        scope = $rootScope.$new();
    }));

    it('should create socpe', function() {
        expect(scope).toBeDefined();
    })
});