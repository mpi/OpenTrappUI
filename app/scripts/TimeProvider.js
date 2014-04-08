angular.module('openTrApp').factory('timeProvider', function () {
    return{
        getCurrentDate: function () {
            return new Date();
        }
    }
});
