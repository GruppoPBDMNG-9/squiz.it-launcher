app.controller("userCtrl", function($scope, $http, $window, $compile, $location){

		//Loacl scope variables
		$scope.continents;
		$scope.selectedUrl;
		$scope.detailsMsg = "Select a short url to show its details";

		//Continents stat
		$scope.labels = [];
		$scope.data = [];

		//Last year stat
		$scope.labelsTime = [];
        $scope.seriesTime = [];
        $scope.dataTime = [];

        $scope.onClick = function (points, evt) {
        	console.log(points, evt);
        };

		//Account init
		$scope.accountInit =
				function(){
					//check
					var loggedIn = sessionStorage.loggedIn;
                    if(loggedIn==="true"){
                    	$scope.username = sessionStorage.username;
                    } else {
                    	alert("session expired");
						var oldPath = $location.absUrl();
						var newPath = oldPath.replace("account.html#","index.html#");
						$window.location.href = (newPath);
                    }

                    //Load Statistics
                    $scope.loadShortening();
                    $scope.getLastStat();
				}

		//Logout
    	$scope.logout =
    			function(){
    				sessionStorage.username = "";
    				sessionStorage.loggedIn = false;
    				var oldPath = $location.absUrl();
					var newPath = oldPath.replace("account.html#","index.html#");
					$window.location.href = (newPath);
    			}

		//Load statistics
		$scope.loadShortening =
				function(){
					$http.get("http://localhost:4567/loadShortening?username=" + $scope.username)
						.then(function(response){
							$scope.totalShorteners = response.data.totalShorteners
                        	$scope.totalClick = response.data.totalClick;
                        	$scope.records = response.data.records;
						}, function(response){
                        	alert("error in loadShortening");
                        });
				}

		//Show continents statistics
		$scope.showContinentClick =
				function(shortUrl){
					$scope.selectedUrl = shortUrl;
					$scope.detailsMsg = "";

					$http.get("http://localhost:4567/showContinentClick?shortUrl=" + shortUrl)
						.then(function(response){
                        	$scope.continentList = response.data;

							//Set params for graph
							var names = [];
							var click = [];
                        	$scope.continentList.forEach(function(continent){
                        		names.push(continent.name);
                        		click.push(continent.click);
                        	});
                        	$scope.labels = names;
                        	$scope.data = click;

                        	//Resetto il contenuto
                        	var head = document.getElementById("continentHead");
                        	head.innerHTML = '';
                        	$compile(head)($scope);

                        	//e ne creo uno nuovo
                        	 var head = document.getElementById("continentHead");
                        	 var headTr = document.createElement("tr");
                        	 headTr.innerHTML = '<th>Continent</th><th>Click</th>';
                        	 head.appendChild(headTr);
                        	 $compile(head)($scope);

						}, function(response){
                        	alert("error in showContinentClick");
						});
				}

		//Show continents statistics
        $scope.showCountryClick =
        		function(continent){
        			$scope.selectedContinent = continent;
        			$http.get("http://localhost:4567/showCountryClick?shortUrl=" + $scope.selectedUrl + "&continent=" + continent)
        				.then(function(response){
                        	$scope.countryList = response.data.countryList;

                            //Resetto il contenuto
                            var head = document.getElementById("countryHead");
                            head.innerHTML = '';
                            $compile(head)($scope);

							//..e ne ricreo uno nuovo
                            var headTr = document.createElement("tr");
                            headTr.innerHTML = '<th>{{selectedContinent}} - Countries</th><th>Click</th>';
                            head.appendChild(headTr);
                            $compile(head)($scope);

                        }, function(response){
                        	alert("error in showCountryClick");
                        });
        			}

        //Load last year stats
        $scope.getLastStat =
        		function(){
        			$http.get("http://localhost:4567/getLastStat?username=" + $scope.username)
        				.then(function(response){
        					var monthList = response.data;

        					//Set params for graph
        					var names = [];
        					var click = [];
        					monthList.forEach(function(month){
        						names.push(month.name);
        						click.push(month.click);
        					});

        					$scope.labelsTime = names;
        					$scope.dataTime.push(click);

        				}, function(response){
        					alert("error in getLastStat");
        				});
        		}

}

);