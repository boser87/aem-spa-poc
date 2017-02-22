appSpaPoc.directive('directiveComponent', ['$http', function($http) {
	  return {
	    restrict: 'A',
	    controller : function($scope) {
	    	console.info("enter directive controller");
	    	$scope.entries = [];

	    	console.log($scope.src);

			$http({
				method : 'GET',
				url : '/content/aem-spa-poc/data.12345.json'
			}).then(function(result) {
				console.log(result);
				$scope.entries = result.data;
			}, function(result) {
				alert("Error: No data returned");
			});
	},
	    templateUrl: function(elem, attr) {
	        return attr.template;
	      }
	}
}])