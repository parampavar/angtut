angular.module('FeedConfigManager', ['ngRoute', 'ngGrid', 'ngDragDrop'], 
	function($routeProvider, $locationProvider) {
	$routeProvider.when('/', {
		templateUrl: 'static/partials/landing.html',
		controller: IndexController
	});
	$routeProvider.when('/about', {
		templateUrl: 'static/partials/about.html',
		controller: AboutController
	});
	$routeProvider.when('/about/:name', {
		templateUrl: 'static/partials/about.html',
		controller: AboutController
	});
	$routeProvider.when('/feedconfigtype', {
		templateUrl: 'static/partials/show_feedconfigtypes.html',
		controller: FeedConfigTypeListController
	});
	$routeProvider.when('/feedconfigtype/:type_name', {
		templateUrl: 'static/partials/show_feedconfigtypes.html',
		controller: FeedConfigTypeLayoutController
	});
	// $routeProvider.when('/:tenantid/feedconfigtype', {
		// templateUrl: 'static/partials/show_feedconfigtypes.html',
		// controller: FeedConfigTypeListController
	// });
	// $routeProvider.when('/:tenantid/feedconfigtype/:type_name', {
		// templateUrl: 'static/partials/show_feedconfigtypes.html',
		// controller: FeedConfigTypeLayoutController
	// });

	$locationProvider.html5Mode(true);
});

function AboutController($scope, $routeParams) {
	$scope.aboutname = $routeParams.name;
}

function MainCntl($route, $routeParams, $location) {
  this.$route = $route;
  this.$location = $location;
  this.$routeParams = $routeParams;
}

function FeedConfigTypeListController($routeParams, $scope) {
	
	$scope.showDetail = false;
	$scope.tenantid = 1; //$routeParams.tenantid;
	$scope.currentDocument = {};
	$scope.feedconfigtypes = {};
	$scope.feedConfigTypeGridOptions = {};
	$.ajaxSetup({ cache: false });
	
	var jfct = { "updatedby":"", "description":"", "type":"", "createdby":"", "name":"" };
	feedConfigTypesArray = jQuery.map( jfct, function( a ) {
		return a;
	});
	$scope.feedconfigtypes = jfct;

	$scope.feedConfigTypeGridOptions = { 
		data: 'feedconfigtypes',
		multiSelect: false,
        columnDefs: [
			{field:'type', displayName:'Type'}, 
			{field:'name', displayName:'Name'}, 
			{field:'description', displayName:'Description'}, 
			{field:'createdby', displayName:'Created By'},
			{field:'editlayout', displayName: '', cellTemplate: '<div class="ngCellText"><a href="/feedconfigtype/{{row.entity.type}}">Edit</a></div>'}
			]
		};
 
	getDocumentFromCouchbase($scope.tenantid + "|FEEDCONFIG", $routeParams, $scope, getFeedConfigTypeList);
}

function getFeedConfigTypeList($routeParams, $scope, data){
	$scope.$apply(function(){
		$scope.currentDocument = data.document;
		$scope.feedconfigtypes = data.document['CONFIGS'];
		feedConfigTypesArray = jQuery.map( $scope.feedconfigtypes, function( a ) {
			return a;
		});
		$scope.feedconfigtypes = feedConfigTypesArray;
		$scope.feedConfigTypeGridOptions = { data: 'feedconfigtypes' };
		
	});	
}

function FeedConfigTypeLayoutController($routeParams, $scope) {
	$scope.submitStatus = false;
	$scope.tenantid = 1; //$routeParams.tenantid;
	$scope.submitMessage = "Changes successfully saved";
	$scope.showDetail = true;
	$scope.detailType = $routeParams.type_name;
	$scope.masterDocument = {};
	$scope.currentDocument = {};
	
	$scope.detailAvailableRowSchema = {};
	$scope.detailAvailableRowSchemaArray = [];

	$scope.detailAvailableRowKeySchema = {};
	$scope.detailAvailableRowKeySchemaArray = [];

	$scope.detailSelectedRowSchema = {};
	$scope.detailSelectedRowSchemaArray = [];
	
	$scope.detailSelectedRowKeySchema = {};
	$scope.detailSelectedRowKeySchemaArray = [];
	
	$scope.disableSubmit = true;
	
	$scope.$watch(
		function() {
			return $scope.detailSelectedRowSchemaArray;
		},
		function(newVal, oldVal) {
			if (newVal.length > 0){
				$scope.disableSubmit = !anyMatchInArray($scope.detailSelectedRowSchema, $scope.detailAvailableRowKeySchemaArray, newVal, "title");
				$scope.detailSelectedRowSchema = jQuery.map( newVal, function( a ) {
					return a["title"];
				});
			}
		},
		true
	);
	$scope.$watch(
		function() {
			return $scope.submitStatus;
		},
		function(newVal, oldVal) {
			$scope.submitStatus = newVal;
		},
		true
	);
	$scope.submit = function() {
		//$scope.currentDocument['tenantid'] = 1;
		$scope.currentDocument['CONFIGS'][$scope.detailType]['rowschema'] = $scope.detailSelectedRowSchema;
		$scope.currentDocument['CONFIGS'][$scope.detailType]['rowkeyschema'] = $scope.detailAvailableRowKeySchema;
		//console.log($scope.currentDocument);
		putDataInCouchbase($scope.tenantid + "|FEEDCONFIG", $scope.currentDocument, $routeParams, $scope, saveFeedConfigTypeLayout);
	};	
	getDocumentFromCouchbase("0|FEEDCONFIG", $routeParams, $scope, getFeedConfigTypeLayoutAvailable);
	getDocumentFromCouchbase($scope.tenantid + "|FEEDCONFIG", $routeParams, $scope, getFeedConfigTypeLayoutSelected);
}

function getFeedConfigTypeLayoutSelected($routeParams, $scope, data) {
	$scope.$apply(function(){
		$scope.currentDocument = data.document;
		$scope.detailSelectedRowSchema = data.document['CONFIGS'][$scope.detailType]['rowschema'];
		if ( $scope.detailSelectedRowSchema ) {
		$scope.detailSelectedRowSchemaArray = jQuery.map( $scope.detailSelectedRowSchema, function( a ) {
			var aj = {};
			aj = { 'title': a, 'drag': true}
			return aj;
		});
		}
		//$scope.detailSelectedRowSchemaArray = arrayforDragList($scope.detailSelectedRowSchema);
		
		$scope.detailSelectedRowKeySchema = data.document['CONFIGS'][$scope.detailType]['rowkeyschema'];
		if ( $scope.detailSelectedRowKeySchema ) {
		$scope.detailSelectedRowKeySchemaArray = jQuery.map( $scope.detailSelectedRowKeySchema, function( a ) {
			var aj = {};
			aj = { 'title': a, 'drag': true}
			return aj;
		});
		}
		//$scope.detailSelectedRowKeySchemaArray = arrayforDragList($scope.detailSelectedRowKeySchema);

		// Remove already selected items from available items
		for(var i = $scope.detailSelectedRowSchema.length-1; i >= 0; i--){
			var j = $scope.detailAvailableRowSchema.indexOf($scope.detailSelectedRowSchema[i]);
			$scope.detailAvailableRowSchemaArray.splice(j,1);
			$scope.detailAvailableRowSchema.splice(j,1);
		}
		//removeElementsFromArray($scope.detailSelectedRowSchema, $scope.detailAvailableRowSchemaArray, $scope.detailAvailableRowSchema);
	});	
}

function getFeedConfigTypeLayoutAvailable($routeParams, $scope, data) {
	$scope.$apply(function(){
		$scope.masterDocument = data.document;
		$scope.detailAvailableRowSchema = data.document['CONFIGS'][$scope.detailType]['rowschema'];
		$scope.detailAvailableRowSchemaArray = jQuery.map( $scope.detailAvailableRowSchema, function( a ) {
			var aj = {};
			aj = { 'title': a, 'drag': true}
			return aj;
		});
		$scope.detailAvailableRowKeySchema = data.document['CONFIGS'][$scope.detailType]['rowkeyschema'];
		$scope.detailAvailableRowKeySchemaArray = jQuery.map( $scope.detailAvailableRowKeySchema, function( a ) {
			var aj = {};
			aj = { 'title': a, 'drag': true}
			return aj;
		});
	});	
}

function saveFeedConfigTypeLayout($routeParams, $scope, data) {
	$scope.$apply(function(){
		data.document;
		$scope.submitStatus = true;
	});	
}
