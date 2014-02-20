 
function putDataInCouchbase(key, putdata, $routeParams, $scope, callback){
	try	{
		var p =  {
		   bucket: "default",
		   key: key,
		   post: {
			 value: putdata,
			 options: {}
		   }
		 }
	
		$.ajax({
			type: 'PUT',
			url: 'http://localhost:3000/default/s/' + key,
			data: JSON.stringify(p),
			contentType: 'application/json',
			dataType: 'json',
			success: function(msg) {
				console.log( msg );
			}
		})	
		.done(function(jd) {
			callback($routeParams, $scope, jd);
		})
		.fail(function() {
			console.log("put error");
		})
		.always(function() {
			console.log("put complete");
		});
	}
	catch(ex) {
		console.log(ex)
	}
}

function getDocumentFromCouchbase(key, $routeParams, $scope, callback){
	try
	{
		$.getJSON('http://localhost:3000/default/' + key, function(data) {
		})
		.done(function(jd) {
			console.log("get done");
			callback($routeParams, $scope, jd);
		})
		.fail(function() {
			console.log("get error");
		})
		.always(function() {
			console.log("get complete");
		});
	}
	catch(ex)
	{
		console.log(ex)
	}
}

// Create the XHR object.
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}

// Make the actual CORS request.
function makeCorsRequest() {
  // All HTML5 Rocks properties support CORS.
  var url = 'http://updates.html5rocks.com';
  url = 'http://localhost:3000/default/1|FEEDCONFIG?callback=?';

  var xhr = createCORSRequest('GET', url);
  if (!xhr) {
    console.log('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onreadystatechange  = function(evtXHR) {
		if (xhr.readyState == 4)
        {
			console.log("xhr.status=" + xhr.status);
                if (xhr.status == 200)
                {
                    //var response = xhr.responseXML;
					console.log("responseXML =" + xhr.responseXML);
					console.log("responseText =" + xhr.responseText);
                }
                else
                    console.log("xhr Errors Occured");
        }
        else
            console.log("currently the application is at" + xhr.readyState);
	console.log('Response from CORS request to ' + url + ': ');
  };

  xhr.onerror = function() {
    console.log('Woops, there was an error making the request.');
  };

  xhr.send();
}