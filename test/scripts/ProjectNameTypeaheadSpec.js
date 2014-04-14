describe("ProjectNameTypeahead", function () {

    var scope;

    beforeEach(module('openTrapp'));

    beforeEach(inject(function ($rootScope, $controller, $httpBackend, _currentEmployee_, _timeProvider_, _projectNames_) {
        scope = $rootScope.$new();
        $controller('RegistrationCtrl', {
            $scope: scope
        });
        projectNames = _projectNames_;
    }));

    var followingProjectsAreAvailable = function () {

        var args = arguments;

        spyOn(projectNames, 'fetchFromServer').andReturn({
            then: function (callback) {
                return callback({
                    data: _.toArray(args)
                });
            }
        });
    };

    var suggestedProjectNames = function () {
        return scope.suggestions;
    };

    var userTypes = function (input) {
        scope.workLogExpression = input;
        scope.$digest();
    };

    var userConfirmFirstSuggestion = function () {
        scope.selectSuggestion(scope.suggestions[0]);
    };

    it("suggests all available projects after typing #", function () {

        // given:
        followingProjectsAreAvailable('ProjectManhattan', 'ApolloProgram');
        // when:
        userTypes('#')
        // then:
        expect(suggestedProjectNames()).toContain('ProjectManhattan', 'AppolloProgram');
    });

    it("does not suggest any projects if # is not present", function () {

        // given:
        followingProjectsAreAvailable('ProjectManhattan', 'ApolloProgram');
        // when:
        userTypes('1d')
        // then:
        expect(suggestedProjectNames()).toEqual([]);
    });

    it("does not suggest any projects if # is recently added character", function () {

        // given:
        followingProjectsAreAvailable('ProjectManhattan', 'ApolloProgram');
        // when:
        userTypes('1d #AppolloProject @mon')
        // then:
        expect(suggestedProjectNames()).toEqual([]);
    });

    it("does not suggest any projects if # is recently added character", function () {

        // given:
        followingProjectsAreAvailable('ProjectManhattan', 'ApolloProgram');
        // when:
        userTypes('1d #AppolloProject ')
        // then:
        expect(suggestedProjectNames()).toEqual([]);
    });

    it("suggest project starts with pattern", function () {

        // given:
        followingProjectsAreAvailable('ProjectManhattan', 'ApolloProgram');
        // when:
        userTypes('#Ap')
        // then:
        expect(suggestedProjectNames()).toEqual(['ApolloProgram']);
    });

    it("complete project name on selecting suggestions", function () {

        // given:
        followingProjectsAreAvailable('ProjectManhattan', 'ApolloProgram');
        // when:
        userTypes('1d #ApolloPro')
        userConfirmFirstSuggestion();
        // then:
        expect(scope.workLogExpression).toEqual('1d #ApolloProgram ');
    });

});
