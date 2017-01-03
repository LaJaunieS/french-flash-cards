
   let randomInt = function(min, max) {
                      min = Math.ceil(min);
                      max = Math.floor(max);
                      return Math.floor(Math.random() * (max - min + 1)) + min;
                    };



(function(angular) {
    
  var app = angular.module("francaisApp", ['ngSanitize', 'ngAnimate', 'ngAria'])

      .controller("flashCardCtrl", [ "$scope", "$timeout", "$http", function($scope, $timeout, $http) {


        $scope.testData = {
            length: 0,
            addElem: function(elem){
                [].push.call(this,elem);
            }
        };

        //this object will hold all of the data contained in the separate json files- populated completely on page load
        $scope.sectionsObject  = {
        "menuArray": []  //used to display length of section on main menu view
        };

        $scope.thisSection = {};


        $scope.getJson = function() {
            $scope.sectionsArray = [ 'verbs', 'adjectives', 'adjectives2' ,'transitionals', 'time', 'family', 'pronouns','adverbs', 'directions', 'weather', 'household', 'body'];
                for (let i = 0; i < $scope.sectionsArray.length; i++) {
                
                    $http.get('./json/' + $scope.sectionsArray[i] + '.json').then(
                        function successCallback(data) {
                            //$scope.testData.addElem(data.data);
                            console.log('data request successful');
                            $scope.testData[$scope.sectionsArray[i]] = data.data;
                            $scope.sectionsObject[$scope.sectionsArray[i]] = data.data;
                            $scope.sectionsObject.menuArray.push( {"title": data.data.type, "count": data.data.vocabArray.length});
                            
                        }, function errorCallback() {
                            document.getElementById('main-menu-wrapper').innerHTML = '<h2>error connecting to data. try reloading</h2>';
                            i = $scope.sectionsArray.length;
                        });
                    };
            };

        
        //pull the data from json files
        $scope.getJson();

          
         
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
          
        $scope.setTitle = function(db) {
            $scope.section = db.type;  //eg $scope.{verbs} - see templates flashCard.html for where this is interpolated- used as "title" of flash card section
            };
          
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
                "vocab": $scope.sectionsObject[section].vocabArray
            };
          	
        	//console.log($scope.thisSection.vocab);
            
            $scope.switchToEnglish();
            $timeout(function() {
                    $scope.getNewWord($scope.thisSection.vocab);
                    $scope.setTitle($scope.thisSection.source); //now section you are currently in displayed in flashCard template
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
            document.getElementById('showButton').innerHTML = "fr";
            $scope.language = 1;
        };
        $scope.switchToFrench = function() {
            document.getElementById('showButton').innerHTML = "en";
                $scope.language = 0;
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



    
















