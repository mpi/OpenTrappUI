angular.module('openTrApp').factory('enviromentInterceptor', function($cookies){

	return {
		
		request: function(config){

			// FIXME: create placeholder and write tests
			
			if(!$cookies.apiServerUrl){
				$cookies.apiServerUrl = "open-trapp.herokuapp.com";
			}
			config.url = config.url.replace('localhost:8080', $cookies.apiServerUrl);
			
			return config;
		},
		response: function(config){
			return config;
		}
	};
	
});

angular.module('openTrApp').config(function($httpProvider){
	$httpProvider.interceptors.push('enviromentInterceptor');
});