angular.module('openTrApp').factory('authInterceptor', function($cookies){

	var getParameterByName = function(name) {
		   name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		   var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		       results = regex.exec(window.location.search);
		   return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	};
	
	return {
		
		request: function(config){

			var authToken = getParameterByName("authToken");
			if(authToken){
				$cookies.authToken = authToken;
			}
			
			if($cookies.authToken && config.url.indexOf('/endpoints/') != -1){
				config.url = config.url + ';jsessionid=' + $cookies.authToken;
			}
			return config;
		},
		response: function(config){
			return config;
		}
	};
	
});

angular.module('openTrApp').config(function($httpProvider){
	$httpProvider.interceptors.push('authInterceptor');
});