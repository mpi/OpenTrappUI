angular.module('openTrApp').controller('ReportCtrl',
    function ($scope, $http, reportDates) {

        $scope.init = function () {
            var months = reportDates.getMonths();
            $scope.filter = {
                months: months,
                activeMonth: months[0],
                activeProjects: [],
                activeEmployees: [],
                isActive: function (month) {
                    return month == this.activeMonth;
                },
                setActive: function (month) {
                    this.activeMonth = month;
                    $scope.fetchItems(month);
                },
                toggleActiveProject: function (project) {
                    if (_.contains(this.activeProjects, project)) {
                        this.activeProjects = _.without(this.activeProjects, project);
                    } else {
                        this.activeProjects.push(project);
                    }
                },
                isActiveProject: function (project) {
                    return _.contains(this.activeProjects, project);
                }

            };

            $scope.filter.setActive($scope.filter.activeMonth);
        };

        $scope.fetchItems = function (month) {
            $http.get('http://localhost:8080/endpoints/v1/calendar/' + month + '/work-log/entries').success(function (data) {
                $scope.workLog = data;
                $scope.projects = distinct('projectName');
                $scope.employees = distinct('employee');
                $scope.filter.activeProjects = $scope.projects;
                $scope.filter.activeEmployees = $scope.employees;
            });

            function distinct(property) {
                return _($scope.workLog.items).pluck(property).uniq().value();
            }
        };

    })
;