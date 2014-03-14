angular.module('openTrApp').controller('ReportCtrl',
    function ($scope, $http, reportDates) {

        $scope.init = function () {
            var months = reportDates.getMonths();
            $scope.filter = {
                months: months,
                activeMonth: months[0],
                isActive: function (month) {
                    return month == this.activeMonth;
                },
                setActive: function (month) {
                    this.activeMonth = month;
                    $scope.fetchItems(month);
                }
            };

            $scope.filter.setActive($scope.filter.activeMonth);
        };

        $scope.fetchItems = function (month) {
            $http.get('http://localhost:8080/endpoints/v1/calendar/' + month + '/work-log/entries').success(function (data) {
                $scope.workLog = data;
                $scope.projects = distinct('projectName');
                $scope.employees = distinct('employee');
            });

            function distinct(property) {
                return _($scope.workLog.items).pluck(property).uniq().value();
            }
        };

    });