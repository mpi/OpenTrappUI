angular.module('openTrapp')
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider.when('/registration', {
            templateUrl: 'registration.html'
        });
        $routeProvider.when('/report', {
            templateUrl: 'report.html'
        });
        $routeProvider.when('/config', {
            templateUrl: 'configuration.html'
        });
        $routeProvider.when('/', {
            templateUrl: 'home.html'
        });
        $routeProvider.when('/authToken/:authToken', {
            redirectTo: '/',
            reloadOnSearch: true,
            resolve: {
                auth: function ($route, $cookies, $rootScope, $location) {
                    $cookies.authToken = $route.current.params.authToken;
                    $rootScope.$emit('AuthTokenReceived');
                    $location.search({});
                }
            }
        });
        $routeProvider.otherwise({
            redirectTo: '/'
        });

        // configure html5 to get links working on jsfiddle
        $locationProvider.html5Mode(false);
    })
    .controller('RouterCtrl',
    function ($scope, $location) {
        $scope.isActive = function (path) {
            return ($location.path().substr(0, path.length) == path);
        };
    });

