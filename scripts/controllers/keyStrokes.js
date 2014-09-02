(function () {
  'use strict';

  /*Clark Dever (clarkdever@gmail.com) - 20140830*/

  angular.module('myApp.controllers')
  .controller("keystrokeController", ['$scope', function($scope) {
    
/*
ToDo:   Handle Deleted Keystrokes
        Handle Spaces
        Handle Cursor Entry + Delete
        Handle Copy and Pasting
*/
    $scope.prompt = "Type a word:";
    //store the meta data about each keystroke
    //(time between presses, duration of key press, keyValue)
    $scope.keystrokeMetrics = [[],[]];
    //Supposedly only keyPress returns a valid keyCode
    var keyCode;
    //this is a timestamp used as a reference frame
    var lastPress = 0;
    //this is how long a key is depressed
    var pressDuration = 0;
    var elapsed = 0;
    //timestamps to calculate sumElapsed
    var startWord = 0;
    //how many times have we typed in our string?
    var itr = 0;

    $scope.title = "Visualization Area:";

    //these are used for scaling in d3
    $scope.setup = [];
    //y-axis scaling factor
    $scope.setup.maxDuration = 10;
    //x-axis scaling factor
    $scope.setup.maxElapsed = 1000;
    $scope.setup.update = true;
    $scope.setup.reset = true;
    //input value
    $scope.formInput = {};
    $scope.formInput.characters = "";
 
   
    //record a keystroke
    $scope.recordkeystroke = function(event) {
        /*
        event.timeStamp;
        event.charCode;
        */



        //There's a bug if you type too fast, duration becomes 0 and the math breaks and you get the timestamp for a duration.
        if(pressDuration>10000){
            pressDuration = event.timeStamp-pressDuration;
        } else {
          pressDuration = 20;
        }

        //The time between you started typing the word and now.
        elapsed = event.timeStamp - startWord;

        //See if this is the longest time it's taken to type a word (used to scale our graph)
        if($scope.setup.maxElapsed<elapsed){
          $scope.setup.maxElapsed = elapsed;
        }

        //What's our maximum duration, this will become the scaling factor of our x-axis
        if(pressDuration>$scope.setup.maxDuration){
            $scope.setup.maxDuration = pressDuration;
        }

        //expand our array if it's the first button push and we're about to go out-of-bounds
        if(lastPress==0 && itr==$scope.keystrokeMetrics.length && itr!=0){
          $scope.keystrokeMetrics.push([]);
        }

        //Is this the first key that's been pressed in this string?
        //If it is, set its elapsed time to 0 and make it's timestamp the new frame of reference (lastPress)      
        if(lastPress==0){
          $scope.keystrokeMetrics[itr].push({elapsed:1, duration:pressDuration, keyCode:keyCode, attempt:itr});
          lastPress = event.timeStamp;
        } else {
          //Else, set its elapsed time based on the difference between now and the last keypress
          $scope.keystrokeMetrics[itr].push({elapsed:elapsed,  duration:pressDuration, keyCode:keyCode, attempt:itr});

          //reset our reference frame
          lastPress = event.timeStamp;
        }
        
    }

    //Start the clock on this keypresses duration
    $scope.onKeyDown = function (event) {
      pressDuration = event.timeStamp;
      //if this is the first letter in the attempt, set our start word time.
      if(lastPress==0){
        startWord = event.timeStamp;
      }
    };


    //Start the clock on this keypresses duration
    $scope.onKeyPress = function (event) {
      keyCode=event.keyCode;
    };    

    //Stop the clock on duration and store the keypress for visualization
    $scope.onKeyUp = function (event) {
      //console.dir(event);
      //Escape Shift and Enter Keystrokes
      if(!(event.keyCode == 13 || event.keyCode == 16)){
        $scope.recordkeystroke(event)
      } 
    };

    //empty the array
    $scope.resetkeystrokeMetrics = function() {
      $scope.keystrokeMetrics = [[],[]];
    }

   //Set all of our values back to their default
   $scope.resetApp = function() {
      itr = 0;
      lastPress = 0;
      startWord = 0;
      pressDuration = 0;
      $scope.formInput.characters = "";
      $scope.resetkeystrokeMetrics();
      $scope.setup.maxDuration = 0;
      $scope.setup.maxElapsed = 0;
      $scope.title = "Visualization Area:";
      $scope.prompt = "Type a word:"
      $scope.setup.reset = true;
    } 

   //Someone hit the submit button, so lets iterate our design and update our visualization
   $scope.submission = function() {
  
      //iterate our array
      itr++;
      //reset our reference frame
      lastPress = 0;

      //Clear our input field or change our labels depending on how many times the user has typed
      if(itr>1){
        //reset our input field
        $scope.formInput.characters = "";
      } else{
        //set our title
        $scope.prompt = "Type \"" + $scope.formInput.characters + "\" Again";
        $scope.title = "Visualizing: \"" + $scope.formInput.characters + "\"";
        $scope.formInput.characters = "";
      } 
      //let d3 know it should render
      $scope.setup.update = true;
    } 
    

}]);

          

}());

