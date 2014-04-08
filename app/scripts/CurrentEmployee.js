angular.module('openTrApp').factory('currentEmployee', function () {

    var username = 'Anonymous';

    return{

        signedInAs: function (u) {
            username = u;
        },
        username: function () {
            return username;
        }
    };
});
