
   let randomInt = function(min, max) {
                      min = Math.ceil(min);
                      max = Math.floor(max);
                      return Math.floor(Math.random() * (max - min + 1)) + min;
                    };



(function(angular) {
    
  var app = angular.module("francaisApp", ['ngSanitize', 'ngAnimate', 'ngAria', 'ngRoute'])


    .controller("flashCardCtrl", [ "$scope", "$timeout", "$http", "getData", function($scope, $timeout, $http, getData) {


        //this object will hold all of the data contained in the separate json files- populated completely on page load
        $scope.sectionsObject  = getData;

        $scope.thisSection = {};
               
         
        //now that json data loaded, use it to show list of section items and populate a local variable when item clicked
        //initial values- populated when section clicked  
        $scope.section;   
        $scope.thisSection = {
                                "source": {},
                                "vocab": [{ }]
                                };
          
                  
        $scope.randomNum = randomInt(0, $scope.thisSection.vocab.length-1 );
        $scope.randomWord = $scope.thisSection.vocab[$scope.randomNum];
        $scope.language = 1;  //1=anglais, 0=francais
        $scope.definitions = $scope.randomWord.definitions; 
        $scope.descriptions = [];
                      
        $scope.getNewWord = function(dbArray) {
            $scope.descriptions = [];
            $scope.randomNum = randomInt(0, dbArray.length-1);
            $scope.randomWord = dbArray[$scope.randomNum];
            $scope.definitions = $scope.randomWord.definitions;
            };   
          
        // $scope.setTitle = function(db) {
        //     $scope.section = db.type;  //eg $scope.sectionsObject.verbs - see templates flashCard.html for where this is interpolated- used as "title" of flash card section
        //     };
          
        $scope.startSection = function(section) {
            //hide all elements for ui effect
            $scope.hideElement('main-menu-content-fade');
            $scope.hideElement('flash-card-content-wrapper');
            $scope.hideElement('card-front-content-fade');
            $scope.hideElement('card-back-content-fade');
            //re-add flash card wrapper to DOM
            document.getElementById('flash-card-content-wrapper').style.display= 'block';
            //remove menu wrapper from DOM (sub-wrapper as well since absolute positioned)
            document.getElementById('main-menu-content-fade').style.display= 'none';
            document.getElementById('main-menu-wrapper').style.display="none";
            
            $scope.thisSection = {
                "source": $scope.sectionsObject[section],
                "vocab": $scope.sectionsObject[section].vocabArray,
                "title": $scope.sectionsObject[section].fullTitle
            };
          	
        	
            $scope.switchToEnglish();
            $timeout(function() {
                    $scope.getNewWord($scope.thisSection.vocab);
                    //$scope.setTitle($scope.thisSection); //now section you are currently in displayed in flashCard template
                    $scope.language = 0;
                    $scope.switchLanguage();
                    $scope.showElement('flash-card-content-wrapper');
                    $scope.showElement('card-front-content-fade');
                    }, 500);
            };
          
        $scope.showElement = function(element) {
            document.getElementById(element).style.opacity='1.0';
            };
        $scope.hideElement = function(element) {
              document.getElementById(element).style.opacity='0.0';
              };
                           
        $scope.switchToEnglish = function() {
            document.getElementById('showButton').textContent = "fr";
            $scope.language = 1;
        };
        $scope.switchToFrench = function() {
            document.getElementById('showButton').textContent = "en";
                $scope.language = 0;
        };
        $scope.toggleTitle = function() {
            if ($scope.titleCondition=== true) {
                document.getElementById('main-menu-content-fade').firstElementChild.textContent = 'french flash cards';
                $scope.titleCondition = false;
                } else {
                    document.getElementById('main-menu-content-fade').firstElementChild.innerHTML = 'cartes flash fran&#231;ais';
                    $scope.titleCondition = true;
                };
        };
                 
        $scope.backToMenu = function() {
            $scope.hideElement('flash-card-content-wrapper');
            $scope.showElement('main-menu-content-fade');
            $scope.about = false;
            $timeout(function() {
                document.getElementById('main-menu-content-fade').style.display= 'block';
                document.getElementById('main-menu-wrapper').style.display= 'block';
                    }, 400);
            $timeout(function() {
                    document.getElementById('flash-card-content-wrapper').style.display= 'none';
                    }, 400);
               }  
          
        $scope.switchLanguage = function() {
            if ($scope.language === 1) {
                $scope.switchToFrench();
                $scope.hideElement('card-front-content-fade');
                $scope.showElement('card-back-content-fade');
                } else {
                $scope.switchToEnglish();
                $scope.hideElement('card-back-content-fade');
                $scope.showElement('card-front-content-fade');    
                 };
        };
          
        $scope.nextWord = function() {
            
            //hide both sides for ui effect
            $scope.hideElement('card-front-content-fade');
            $scope.hideElement('card-back-content-fade');
            //get a new word after both sides faded
            $timeout(function() {
                    $scope.getNewWord($scope.thisSection.vocab);
                    //show front of card by default
                    $scope.showElement('card-front-content-fade');
                    //if in french view switch back to english
                    if ($scope.language === 0) {
                        $scope.switchToEnglish();
                    };                    
                }, 500);
        };
         
    
       
    
    }])


    
    .controller("wordIndexCtrl", [ "$scope", "$http", "getData", function($scope, $http, getData)  { 
            console.log("word index controller loaded");
            $scope.wordIndexController = "!Word Index Controller!";
        //     $scope.sectionsObject  = {
        // "menuArray": []  //used to display length of section on main menu view
        // };
            $scope.sectionsObject = getData;
        console.log($scope.sectionsObject);
        } ])

    .factory('getData', ['$http', function($http){

        let sectionsObject  = {
            "menuArray": []  //used to display length of section on main menu view
            };

        $http.get('./json/master/vocab_agg.json').then(
                    function successCallback(data) {
                        //console.log(data.data);
                        for (let z = 0; z < data.data.length; z++ ) {
                            //console.log(data.data[z]);
                            sectionsObject[data.data[z].type] = data.data[z];
                            sectionsObject.menuArray.push( { "source": data.data[z], "type": data.data[z].type, "count": data.data[z].vocabArray.length} )
                        };
                            console.log('json data request for index successful');
                            //console.log($scope.sectionsObject);
                    }, function errorCallback() {
                        document.getElementById('main-menu-wrapper').innerHTML = '<h2>error connecting to data. try reloading</h2>';
                    }); 

            
        //pull the data from json file
        
        return sectionsObject;


    }])

    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'index.html'
        })
            .when('/wordIndex', {
                controller: 'wordIndexCtrl',
                templateUrl: 'templates/wordIndex.html'
            })
            .otherwise( {
                redirectTo: '/'
        });
            
        console.log('route provider loaded');
        } )


    .directive('mainMenu', function() {
        return {
            restrict: 'E',
            templateUrl: "templates/mainMenu.html"
            };
    })
    .directive('flashCard', function() {
        return {
            restrict: 'E',
            templateUrl: "templates/flashCard.html",
            
            };
        
    })
    .directive('cardFront', function() {
        return {
            restrict: 'E',
            templateUrl: "templates/cardFront.html"            
        };       
    })
    .directive('cardBack', function() {
        return {
            restrict: 'E',
            templateUrl: "templates/cardBack.html"            
        };       
    })
    .directive('about', function() {
        return {
            restrict: 'E',
            templateUrl: "templates/about.html"
        };
    });

   
    
    
})(window.angular);



    
















