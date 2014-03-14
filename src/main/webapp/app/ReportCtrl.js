angular.module('openTrApp').controller('ReportCtrl',
    function ($scope, $http, reportDates) {

        $scope.init = function () {
            $scope.report = {
                year: moment().format("YYYY"),
                month: moment().format("MM"),
                months: reportDates.getMonths()
            };

            $scope.fetchItems();
        };

        $scope.fetchItems = function () {
            $http.get('http://localhost:8080/endpoints/v1/calendar/' + $scope.report.year + '/' + $scope.report.month + '/work-log/entries').success(function (data) {
                $scope.workLog = data;
            });
        };
    });