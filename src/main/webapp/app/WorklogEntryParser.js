angular.module('openTrApp').factory('worklogEntryParser', function(timeProvider){

    var projectPattern = /#([a-zA-Z0-9_]*)?/;
    var workloadPattern = /(\d+(d|h|m)( )?)+/;
    var dayPattern = /@([0-9\/]*)/;
    var daysAgoPattern = /@t-(\d*)/;

    var getWorkloadFromExpression = function(expression) {
        if (workloadPattern.test(expression)) {
            return workloadPattern.exec(expression)[0].trim()
        } else {
            return "1d";
        }
    }

    function matchesDayRegex(expression) {
        return dayPattern.test(expression);
    }

    function dayRegexHasValidDate(expression) {
        return moment(dayPattern.exec(expression)[1]).isValid();
    }

    var getDayFromExpression = function(expression) {
        if(matchesDayRegex(expression) && dayRegexHasValidDate(expression)) {
            return dayPattern.exec(expression)[1]
        } else if (forYesterday(expression)) {
            return moment(timeProvider.getCurrentDate()).subtract('days', 1).format("YYYY/MM/DD")
        } else if (isForDaysAgo(expression)) {
            return moment(timeProvider.getCurrentDate()).subtract('days', daysAgoPattern.exec(expression)[1]).format("YYYY/MM/DD")
        } else {
            return moment(timeProvider.getCurrentDate()).format("YYYY/MM/DD");
        }
    }

    function hasDayExpression(expression) {
        return /@/.test(expression);
    }

    function hasValidDateExpression(expression) {
        return (hasDayExpression(expression) && dayRegexHasValidDate(expression));
    }

    function forYesterday(expression) {
        return /@yesterday/.test(expression);
    }

    function isForDaysAgo(expression) {
        return daysAgoPattern.test(expression);
    }

    var dayValid = function(expression) {
        return hasValidDateExpression(expression) || forYesterday(expression) || isForDaysAgo(expression) || !hasDayExpression(expression)
    }

    function projectValid(expression) {
        return projectPattern.test(expression);
    }

    return{
        isValid: function(expression) {
            return projectValid(expression) && dayValid(expression)
        },
        parse: function(expression) {
            return {
                workload: getWorkloadFromExpression(expression),
                projectName: projectPattern.exec(expression)[1],
                day: getDayFromExpression(expression)
            };
        }
    }
});