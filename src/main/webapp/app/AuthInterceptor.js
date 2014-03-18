angular.module('openTrApp').factory('authInterceptor', function($cookies){

	return {
		
		request: function(config){

			if($cookies.JSESSIONID){
				config.url = config.url + ';jsessionid=' + $cookies.JSESSIONID;
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