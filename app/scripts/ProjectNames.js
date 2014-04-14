angular.module('openTrapp').factory('projectNames', function ($http) {

    var namePrefix = '';

    return {

        fetchFromServer: function () {
            return $http.get('http://localhost:8080/endpoints/v1/projects/');
        },
        startingWith: function (prefix) {
            namePrefix = prefix;
            return this;
        },
        list: function () {
            return this.fetchFromServer().then(function (response) {

                return _(response.data).filter(function (x) {
                    return x.indexOf(namePrefix) == 0;
                }).value();
            });
        },
        forEach: function (callback) {

            this.fetchFromServer().then(function (response) {
                _(response.data).filter(function (x) {
                    return x.indexOf(namePrefix) == 0;
                }).forEach(callback);
            });
        }
    }
});
