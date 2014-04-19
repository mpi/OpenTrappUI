angular.module('openTrapp').factory('enviromentInterceptor', function ($cookies) {

    return {

        request: function (config) {

            // FIXME: create placeholder and write tests

            if (!$cookies.apiServerUrl) {
                $cookies.apiServerUrl = "open-trapp-mpi.herokuapp.com";
            }
            config.url = config.url.replace('localhost:8080', $cookies.apiServerUrl);

            return config;
        },
        response: function (config) {
            return config;
        }
    };

});

angular.module('openTrapp').config(function ($httpProvider) {
    $httpProvider.interceptors.push('enviromentInterceptor');
});
