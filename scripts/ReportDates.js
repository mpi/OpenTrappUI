angular.module('openTrApp').factory('reportDates', function (timeProvider) {
    return{
        getMonths: function () {
            const dateFormat = "YYYY/MM";

            function formattedDateMinusMonths(monthsToSubtract) {
                var currentMoment = moment(timeProvider.getCurrentDate());
                return currentMoment.subtract('months', monthsToSubtract).format(dateFormat);
            }

            return [formattedDateMinusMonths(0), formattedDateMinusMonths(1), formattedDateMinusMonths(2)];
        }
    }
});
