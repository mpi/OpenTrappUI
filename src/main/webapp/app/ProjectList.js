angular.module('openTrApp').factory('projectList', function(){
    return{
        projectList : [
          "internal", "unity", "on", "nfon", "obf-starhome", "obf-syniverse", "syniverse"
        ],
        contains: function(projectName) {
            return _.contains(this.projectList,projectName);
        }
    }
});