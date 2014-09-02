(function () {
  'use strict';

  /*Clark Dever (clarkdever@gmail.com) - 20140830*/
  
  angular.module('myApp.directives')
    .directive('d3Bars', ['d3', function(d3) {
      return {
        restrict: 'EA',
        scope: {
          data: "=",
          setup: "=",
          update: "="
        },
        link: function(scope, el, attr) {

          //make sure d3 has loaded 
          d3.d3().then(function(d3) {


        // declare scope variables
          var width, height, xScale, yScale, colorScale, rScale, margin;
          var itr = 0;
          var dataset = {};
          var svg = d3.select(el[0])
              .append("svg")
              .attr("width", "100%");

          //Make sure we see the update in the function below this
          window.onresize = function() {
            return scope.$apply();
          };

          //If angular sees the browser resize render
          scope.$watch(function(){
              return angular.element(window)[0].innerWidth;
            }, function(){
              return scope.render(scope.data);
            }
          );


          //watch for a reset request
          scope.$watch('setup.reset', function(){
            if(scope.setup.reset == true){
              scope.reset();
              scope.setup.update = false;
            }
          });

          // watch for data changes and re-render
          scope.$watch('data', function(newVals, oldVals) {
            return scope.render(newVals);
          }, true);

          scope.reset = function(){
              // remove all previous items before render
              svg.selectAll("*").remove();
          }

          //Refresh our scale objects based on any changes to our data
          scope.rescale = function(){

            // setup variables
            width = d3.select(el[0])[0][0].offsetWidth;
            height = 300;
            //Make sure our circles are completely visible
            margin = 35;

            //radius scaler
            rScale = d3.scale.linear()
                                .domain([20, scope.setup.maxDuration])
                                .range([10, 30]);
            //x-axis scaler
            xScale = d3.scale.linear()
                                .domain([0, scope.setup.maxElapsed])
                                .range([margin, width-margin]);
            //y-axis scaler
            yScale = d3.scale.linear()
                                .domain([0, scope.setup.maxDuration])
                                .range([margin, height-margin]);
            //color range
            colorScale = d3.scale.linear()
                            .domain([0, scope.data.length])
                            .range(["red", "blue"]);

          }


          // define render function
          scope.render = function(dataset){

            //clear the svg
            scope.reset();
            //check our scaling based on new data
            scope.rescale();
            


             


            // set the height based on the calculations above
            svg.attr('height', height);

            //background color
            svg.append("rect")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("fill", "white")
                .attr("stroke", "black");



              //Group our arrays and pass them in for rendering one at a time
              //Equivilent to nest loop
              var sets = svg.selectAll('g')
                       .data(dataset)
                       .enter(function(d){console.dir(d);})
                       .append('g');

              //inner loop
              //plot our circles
             sets.selectAll("circle")
                 .data(function(d){
                    return d;
                  })
                 .enter()
                 .append("circle")
                 .attr("cx", function(d) {
                      return xScale(d.elapsed);    
                  })
                 .attr("cy", function(d){
                    return yScale(d.duration)
                  })
                 .attr("r", function(d){
                    return rScale(d.duration)
                  })
                 .attr("fill", function(d){
                    return colorScale(d.attempt)
                  });
              
                              
                 //plot our labels on the circles
              sets.selectAll("text")
                 .data(function(d){
                    return d;
                  })
                 .enter()
                 .append("text")
                 .text( function(d){
                   return d.keystroke;
                    }
                  )
                 .attr("x", function(d) {
                    //console.log("Canvas:" + width + "x" + height + " p:" + Math.round(xScale(d.elapsed)) + "," + Math.round(yScale(d.duration)) + " " + String.fromCharCode(d.keyCode));
                      return xScale(d.elapsed);  
                 })
                 .attr("y", function(d) {
                      return yScale(d.duration);  
                 })
                  .attr("font-family", "sans-serif")
                  .attr("font-weight", "bold")
                  .attr("font-size", function(d){
                    return rScale(d.duration);
                  })
                  .attr("fill", "white");
                }
           
          });
          
        }
      };
    }]);

}());

