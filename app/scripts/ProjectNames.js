angular.module('openTrApp').factory('projectNames', function ($http) {

	var cached;

	var ProjectNames = function(prefix){

		return {
	    	
			fetchFromServer: function(){

				if(!cached){
					return $http.get('http://localhost:8080/endpoints/v1/projects/').then(function(x){
						cached = x;
					});
				}
				return {
					then: function(callback){
						callback(cached);
					}
				};
			},
			startingWith: function(prefix){
				return new ProjectNames(prefix);
	    	},
	    	forEach: function(callback){
	    		
	    		this.fetchFromServer().then(function(response){
	    			_(response.data).filter(function(x){
	    				return x.indexOf(prefix) == 0;
	    			}).forEach(callback);
	    		});
	    	}
	    }
	};
	
	return new ProjectNames('');	
});


