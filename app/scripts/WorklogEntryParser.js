angular.module('openTrApp').factory('worklogEntryParser', function (timeProvider) {

    var maxDaysForDiff = 365;
    var projectPattern = /#([a-zA-Z0-9_-]+)/;
    var workloadPattern = /^(\d+d)? *(\d+h)? *(\d+m)?$/;
    var dayPattern = /@([0-9\/]*)/;
    var daysAgoPattern = /@t([-+]\d*)/;
    var dayOfWeekPattern = /@(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i;

    var dateFormat = "YYYY/MM/DD";

    var getWorkloadFromExpression = function (expression) {
        if (workloadPattern.test(expression)) {
            return workloadPattern.exec(expression)[0].trim()
        } else {
            return "1d";
        }
    };

    function matchesDayRegex(expression) {
        return dayPattern.test(expression);
    }

    function dayRegexHasValidDate(expression) {
        return moment(dayPattern.exec(expression)[1]).isValid();
    }

    var getDayFromExpression = function (expression) {
        if (matchesDayRegex(expression) && dayRegexHasValidDate(expression)) {
            return moment(dayPattern.exec(expression)[1]).format(dateFormat)
        } else if (forYesterday(expression)) {
            return moment(timeProvider.getCurrentDate()).subtract('days', 1).format(dateFormat)
        } else if (isForDaysAgo(expression)) {
        	var daysToAdd = daysAgoPattern.exec(expression)[1];
            return moment(timeProvider.getCurrentDate()).add('days', daysToAdd).format(dateFormat)
        } else if (isForDayOfWeek(expression)) {
        	var dayOfWeek = moment(timeProvider.getCurrentDate()).day(dayOfWeekPattern.exec(expression)[1]);
        	if(dayOfWeek.isAfter(moment(timeProvider.getCurrentDate()))){
        		dayOfWeek.subtract('days', 7);
        	}
            return dayOfWeek.format(dateFormat);
        } else {
            return moment(timeProvider.getCurrentDate()).format(dateFormat);
        }
    };

    function hasDayExpression(expression) {
        return /@/.test(expression);
    }

    function hasValidDateExpression(expression) {
        return (hasDayExpression(expression) && dayRegexHasValidDate(expression));
    }

    function forYesterday(expression) {
        return /@yesterday/.test(expression);
    }

    function fitsDaysDiffLimit(expression) {
        return Math.abs(daysAgoPattern.exec(expression)[1]) <= maxDaysForDiff;
    }

    function isForDaysAgo(expression) {
        return daysAgoPattern.test(expression) && fitsDaysDiffLimit(expression);
    }

    function isForDayOfWeek(expression) {
        return dayOfWeekPattern.test(expression);
    }

    function dayValid(expression) {
        return hasValidDateExpression(expression) || forYesterday(expression) || isForDaysAgo(expression) || isForDayOfWeek(expression)
    }

    function projectValid(expression) {
        return projectPattern.test(expression);
    }

    function workloadValid(expression) {
        return workloadPattern.test(expression);
    }

    function workloadIsTooLong(workload) {
        var days = parseInt(workloadPattern.exec(workload)[1]) || 0;
        var hours = parseInt(workloadPattern.exec(workload)[2]) || 0;
        var minutes = parseInt(workloadPattern.exec(workload)[3]) || 0;

        var allMinutes = 8*60*days + 60*hours + minutes;
        return allMinutes > 960
    }

    var doParse = function (expression) {
        var projectName;
        var day;
        var workload = "";

        var array = expression.split(" ");
        for (var i in array) {
            var element = array[i];
            if (projectValid(element) && !projectName) {
                projectName = projectPattern.exec(expression)[1]
            } else if (dayValid(element) && !day) {
                day = getDayFromExpression(expression);
            } else if (workloadValid((workload + " " + element).trim())) {
                workload = getWorkloadFromExpression(workload + " " + element);
            } else {
                return undefined
            }
        }
        if (!projectName || workloadIsTooLong(workload)) {
            return undefined
        }
        return {
            workload: workload || "1d",
            projectName: projectName,
            day: day || getDayFromExpression(expression)
        };
    };
    return{
        isValid: function (expression) {
            return !!doParse(expression);
        },
        parse: function (expression) {
            return doParse(expression);
        }
    }
});