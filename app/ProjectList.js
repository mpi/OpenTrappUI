angular.module('openTrApp').factory('projectList', function(){
    return{
        projectList : [
          "internal", "vacation", "sick", "self-development",
          "unity", "on", "nfon", "obf-starhome", "obf-syniverse", "syniverse", "baltona"
        ],
        contains: function(projectName) {
            return _.contains(this.projectList,projectName);
        }
    }
});