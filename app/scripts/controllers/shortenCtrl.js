app.controller('shortenCtrl', function($scope, $http, $compile, $window, $location){
		//Variables
        $scope.msg = "";
        $scope.customizeMsg = "";
        $scope.domain = "";
		$scope.longUrl = "";
        $scope.shortUrl = "";
        $scope.username = "";
        $scope.password = "";


		/*
		Function called on page load
		*/
		$scope.init =
        		function(){
        			sessionStorage.username = "";
        			sessionStorage.loggedIn = false;
        		}

		//Shortening Request
        $scope.generateShorteningRequest =
        		function(){
        			return "http://localhost:4567/generateShortening";
        		}

		/*
		It send request to the server and generate a random path for the short url
		*/
        $scope.letsShortenIt =
        		function(){
        			$scope.setMessages();
                    $scope.customizeObj();

           			$http.get($scope.generateShorteningRequest())
                   		.then(function(response) {
                    		$scope.shortUrl = response.data.shortUrl;
                    	},function(response) {
                    		alert("server error for letsShortenIt() method");
                    	});
        		}

		/*
		First generate a random url and then it allow to customize it.
		*/
        $scope.setMessages =
        		function(){
        			$scope.msg = "Your short url: ";
        			$scope.domain = "http://localhost:4567/";
        			$scope.customizeMsg = "Customize: ";
        		}

		/*
		Re-compile index.html adding the input text and the button for customize the url generated and save it
		*/
		$scope.customizeObj =
				function(){
                    var newDiv = document.createElement("div");
                    newDiv.id = "addedDiv"
                    newDiv.innerHTML = ' <input type="text" placeholder="Customize your short url" class="form-control" ng-model="shortUrl"> <br> <button type="submit" class="btn btn-primary btn-lg" ng-click="save()">Done &raquo;</button>  ';
                    document.getElementById("customizeForm").appendChild(newDiv);
                    $compile(newDiv)($scope);
				}

		/*
        Formalize request to send to the server
        */
        $scope.saveRequest =
        	function(){
        		var user;
        		if(sessionStorage.loggedIn === "false"){
        			user = "---";    //username allow only numbers and letters. so this is a good solution
        		} else {
        			user = sessionStorage.username;
        		}

        		return "http://localhost:4567/saveUrl?url=http://localhost:4567/" + $scope.shortUrl
                										+ "&longUrl=" + $scope.longUrl
                										+ "&username=" + user;
            }


		/*
		Save the url shortened in db if it's available
		*/
        $scope.save =
        		function(){
        			$http.get($scope.saveRequest())
        				.then(function(response) {
        					var result = response.data.result;
        					var msg = response.data.urlSavedMsg;

        					if(result == "ok"){
        						var url = response.data.url;
        						prompt(msg, url);
        						$scope.reset();
        						$window.location.reload();
        					} else if (result == "error") {
        						alert(msg);
        					}

        				},function(response) {
        					alert("server error for save() method");
        				});
        		}

		/*
		Called once the short url is been saved. Come back to the start view.
		*/
        $scope.reset =
        		function(){
        			$scope.msg = "";
                    $scope.customizeMsg = "";
                    $scope.domain = "";
                    $scope.longUrl = "";
                    $scope.shortUrl = "";

                    var addedDiv = angular.element( document.querySelector( '#addedDiv' ) );
                    addedDiv.remove();
        		}

        		//Singup
        		$scope.singupRequest =
        				function(){
        					return "http://localhost:4567/singup?username=" + $scope.username + "&password=" + $scope.password
        				}

        		$scope.singup =
        				function(){
        					$http.get($scope.singupRequest())
        						.then(function(response){
                                	var result = response.data.singupResult;
                                	alert(result);
                                	$scope.username = "";
                                	$scope.password = "";
        						}, function(response){
        							alert("error in singup");
        						});
        				}

        		//Login
            	$scope.loginRequest =
            			function(){
            				return "http://localhost:4567/login?username=" + $scope.username + "&password=" + $scope.password
            			}

            	$scope.login =
            			function() {
                            $http.get($scope.loginRequest())
                            	.then(function(response){
                            		var result = response.data.result;
                            		if(result == "error"){
                            			alert("Invalid username or password");
                            		} else {
                            			var username = response.data.username;

										/*
										Lo salvo sia in sessionStorage per farlo sopravvivere agli aggiornamenti e sia in $scope.loggedIn per controllare che ci sia un utente loggato
										quando viene effettuato uno shortening. Se non c'è bisogna salvare lo shortening nel database come shortening effettuato da un host.
										*/
                            			sessionStorage.loggedIn = true;
                            			$scope.sessionStorage = sessionStorage.loggedIn;

										/*
										Salvo l'username nello session storage per sopravvivere ai refresh
										*/
                            			sessionStorage.username = username;

                            			/*
                            			Mi trasferisco sulla pagina in cui si è autenticati. Tutte le variabili dovrebbero essere visibili
                            			*/
										var oldPath = $location.absUrl();
										var newPath = oldPath.replace("index.html#", "account.html#");
										$window.location.href = (newPath);
										
                            		}
                            	}, function(response){
                            		alert("Some errors occurred during login");
                            	});
            			}
    }
);
