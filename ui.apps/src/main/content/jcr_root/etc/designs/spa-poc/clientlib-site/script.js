function enableHrefPageReload(){
	angular.element("a:visible").each(function(index) {
		$(this).attr("target","_self");
	});

	angular.element("a:hidden").each(function(index) {
		$(this).attr("target","_self");
	});
}

function isPublisher(){
	var resolvedMetaTagValue = "false";
	var elmPublisher = $('meta[name=publisher]').attr("content");
	if(typeof elmPublisher != 'undefined'){
		resolvedMetaTagValue = elmPublisher.toLowerCase();
	}

	return resolvedMetaTagValue;
}

var appSpaPoc = angular.module('appSpaPoc', ['ui.router', 'Routing'])
	.run(function($rootScope,$log,$timeout,PageMetaData){

		/****
		 * convenience method that returns aa bool telling us if we should use partials or not.  This helps us with editing in author mode.
		 * @returns {boolean}
		 */
		$rootScope.usePartials = function(){
			if($rootScope.isPublisher() == "true"){
				return true;
			}else{
				return false;
			}
		};

		/***
		 * $stateChangeStart event
		 * Fired when the transition begins before the view is inserted
		 */
		$rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
		});

		/***
		 * $stateChangeSuccess
		 * fired once the state transition is complete
		 */
		$rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
		});

		/****
		 * $viewContentLoaded - fired once the view is loaded, after the DOM is rendered.
		 */
		$rootScope.$on('$viewContentLoaded',function(event, viewConfig){
			//gets called twice on initial page load

			//if we are not on publish server we need to make sure the links reload the page
			if (!$rootScope.usePartials()) {
				$rootScope.enableHrefPageReload();
			}else{
				//window.picturefill();//set dynamic images up if they exist on the new partial

				//we will need to re-init some items that rely on document ready
				PageMetaData.updateHeaderToReflectPartialData();
			}

			//scroll to top of the page so the user sees the hero
			window.scrollTo(0,0);
		});

		/***
		 * enableHrefPageReload
		 *
		 * Adds _self to all links in the document to disable partial loading and do full page loading when a link is selected.
		 * We use this to help navigate while on the authoring server
		 */
		$rootScope.enableHrefPageReload = enableHrefPageReload;

		/***
		 * isPublisher
		 * convenience method that checks for the page meta tag named publisher we set when we rendered the page from Sightly.
		 * It tells us if wcmMode is publish
		 *
		 * @returns {string}
		 */
		$rootScope.isPublisher = isPublisher;
	})

	/***
	 * configuring the state provider and loading in the routes in our application
	 */
	.config(function ($stateProvider, $urlRouterProvider, routerProvider, $locationProvider) {
		$stateProvider
			.state('start', {
				url: location.pathname,
				views: {
					'navigation': {
						templateUrl: location.pathname.replace(location.pathname.substring(location.pathname.indexOf('.'), location.pathname.length), '.header-partial.html')
					},
					'main': {
						templateUrl: location.pathname.replace(location.pathname.substring(location.pathname.indexOf('.'), location.pathname.length), '.main-partial.html')				
					}
				}
			});

		$urlRouterProvider.otherwise(location.pathname);

		//really does not need to be an absolute path but thats what we did
		routerProvider.setCollectionUrl('/content/aem-spa-poc/jcr:content.routes.json');

		//Set the location provider to html5mode to make the urls pretty
		$locationProvider.html5Mode(true);
		$locationProvider.hashPrefix('!');
		
		if(isPublisher() == 'false') {
			enableHrefPageReload();
		}
	})

	.service('PageMetaData', function($location) {
		var _title = 'Love what you do';
		var _keywords = 'adobe@adobe,adobe,adobeAtadobe,photoshop,edge,aem,illustrator,dps,digital marketing,creative cloud,creative';
		var _description = 'We make stuff';
		var _url = '';

		return {
			title: function() {
				return typeof $('#partialTitle').attr('content') != 'undefined' ? $('#partialTitle').attr('content') : _title
			},
			setTitle: function(newTitle) {
				_title = _title;
				document.title = _title;
				$('#ogTitle').attr('content',_title);
				$('#twitterTitle').attr('content',_title);
			},
			keywords: function() {
				return typeof $('#partialKeywords').attr('content') != 'undefined' ? $('#partialKeywords').attr('content') : _keywords
			},
			setKeywords: function(newKeywords) {
				_keywords = newKeywords;
				$('meta[name=keywords]').attr('content',_keywords);
			},
			description: function() {
				return typeof $('#partialDescription').attr('content') != 'undefined' ? $('#partialDescription').attr('content') : _description;
			},
			setDescription: function(newDescription) {
				_description = newDescription;
				$('meta[name=description]').attr('content',_description);
				$('#ogDescription').attr('content',_description);
				$('#twitterDescription').attr('content',_description);
			},
			url: function() { return _url; },
			setUrl: function(newUrl) {
				_url = newUrl;
				$('#ogUrl').attr('content',_url);
			},
			getPartialMetaDescription:function(){
				var partialMetaDesc = $('#partialDescription').attr('content');
				if(typeof  partialMetaDesc == 'undefined') {
					partialMetaDesc = "no description found";
				}

				return partialMetaDesc;
			},
			getPartialDirectLink:function(){
				var partialDirectLink = $('#partialDirectLink').attr('content');
				if(typeof  partialDirectLink == 'undefined') {
					partialDirectLink = $location.url();
				}

				return partialDirectLink;
			},
			getPartialKeywords:function(){
				var partialKeywords = $('#partialKeywords').attr('content');
				if(typeof  partialKeywords == 'undefined') {
					partialKeywords = _keywords;
				}

				return partialKeywords;
			},
			getPartialTitle:function(){
				var partialTitle = $('#partialTitle').attr('content');
				if(typeof  partialTitle == 'undefined') {
					partialTitle = _title;
				}

				return partialTitle;
			},
			updateHeaderToReflectPartialData: function(){
				this.setDescription(this.getPartialMetaDescription());
				this.setUrl(this.getPartialDirectLink());
				this.setKeywords(this.getPartialKeywords());
				this.setTitle(this.getPartialTitle());
			}
		};
	})

	/*****
	 * DeviceDetection
	 * BrowserMap.getMatchedDeviceGroups() gets the matching device group
	 * /etc/clientlibs/browsermap.standard/libs/browsermap/devicegroups.js
	 *
	 * UNUSED AT THIS POINT
	 */
	.service('DeviceDetection',function(){
		return {
			getMatchedDeviceGroups: function(){
				if(typeof BrowserMap != "undefined"){
					return BrowserMap.getMatchedDeviceGroups();
				}else{
					return {};
				}
			}
		}
	})

	.controller('PageCtrl', function($scope,$window,$log,router) {
		$scope.reload = function() {
			router.setUpRoutes();
		};

		$scope.init = function(){
		};

	})
	
	.provider('runtimeStates', function runtimeStates($stateProvider) {
	  // runtime dependencies for the service can be injected here, at the provider.$get() function.
	  this.$get = function($q, $timeout, $state) { // for example
	    return { 
	      addState: function(name, state) { 
	        $stateProvider.state(name, state);
	      }
	    }
	  }
	})
	
	.controller('loginFormController', function($scope, $http, $state, runtimeStates) {

		$scope.formData = {};
	
		$scope.formData.j_validate = true;
	
		$scope.processForm = function() {
		  $http({
		  method  : 'POST',
		  url     : $("form").data("url"),
		  data    : $.param($scope.formData),  // pass in data as strings
		  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
		 })
		  .success(function(data) {
		    console.log(data);
		    //location.pathname = $("form input[name='resource']")[0].value;
		    //router.setUpRoutes()
		    
            $http.get('/content/aem-spa-poc/jcr:content.routes.json').success(function (collection) {
                for (var routeName in collection) {
                    if (!$state.get(routeName)) {
                        if(typeof routeName != "undefined" && routeName == "home"){
                        	runtimeStates.addState(routeName, collection[routeName]);
                            break;
                        }
                    }
                }
                
    		    $state.go("home")
            });
		    
		  })
		  .error(function(data) {
		    console.log(data);
		  });
		}
	});