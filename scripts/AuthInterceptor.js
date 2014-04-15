angular.module('openTrapp').factory('authInterceptor', function ($cookies, $location) {

    return {

        request: function (config) {

            if ($cookies.authToken && config.url.indexOf('/endpoints/') != -1) {
                config.url = config.url + ';jsessionid=' + $cookies.authToken;
            }
            return config;
        },
        response: function (config) {
            return config;
        }
    };

});

angular.module('openTrapp').config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
});
