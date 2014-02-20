
function arrayforDragList(jsonArray, attribute){
	if ( jsonArray ) {
		if (!attribute) attribute = 'title';
		return jQuery.map( jsonArray, function( a ) {
			var aj = {};
			aj = { attribute: a, 'drag': true}
			return aj;
		});
	}
}

function anyMatchInArray (targetJsonArray, targetArray, checkerArray, attributeName) {
	var found = false;
	var foundCount = 0;
	var targetAttributeArray = jQuery.map( targetArray, function( a ) {
		return a[attributeName];
	});
	for (var i = 0, j = checkerArray.length; foundCount < targetAttributeArray.length && i < j; i++) {
		if (targetAttributeArray.indexOf(checkerArray[i][attributeName]) > -1) {
			foundCount++; 
		}
	}
	if (foundCount < targetArray.length)
		return false;
	else
		return true;
};

function removeElementsFromArray(elementsArray, removeFromArray1, removeFromArray2){
	// for(var i = $scope.detailSelectedRowSchema.length-1; i >= 0; i--){
		// var j = $scope.detailAvailableRowSchema.indexOf($scope.detailSelectedRowSchema[i]);
		// $scope.detailAvailableRowSchemaArray.splice(j,1);
		// $scope.detailAvailableRowSchema.splice(j,1);
	// }
	for(var i = elementsArray.length-1; i >= 0; i--){
		var j = removeFromArray1.indexOf(elementsArray[i]);
		removeFromArray2.splice(j,1);
		removeFromArray1.splice(j,1);
	}
}
