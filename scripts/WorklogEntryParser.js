angular.module('openTrapp').factory('worklogEntryParser', function (timeProvider) {
    function doParse(expression) {
        return PegWorkLogEntryParser.parse(expression.trim(), { timeProvider: timeProvider });
    }

    return {
        isValid: function (expression) {
            return this.parse(expression) != undefined;
        },
        parse: function (expression) {
            try {
                return doParse(expression);
            } catch (e) {
                return undefined;
            }
        }
    }
});
