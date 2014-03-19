angular.module('openTrApp').factory('authInterceptor', function($cookies, $location){

	return {
		
		request: function(config){

			if($location.search()['authToken']){
				$cookies.authToken = $location.search()['authToken'];
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