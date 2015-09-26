/*globals d3, topojson, document*/
// These are helpers for those using JSHint

var data,
    locationData,
    teamSchedules,
    selectedSeries,
    colorScale
    Games=[];

var colorbrewer = {Dark2: {
3: ["#1b9e77","#d95f02","#7570b3"],
4: ["#1b9e77","#d95f02","#7570b3","#e7298a"],
5: ["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e"],
6: ["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02"],
7: ["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d"],
8: ["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666"]
}};

/* EVENT RESPONSE FUNCTIONS */

function setHover(d) {
    // There are FOUR data_types that can be hovered;
    // nothing (null), a single Game, a Team, or
    // a Location
    
    // ******* TODO: PART V *******
    var info = document.getElementById("info");
    if(!d){
    	info.innerHTML=" ";
    	return;
    }
    res=d.split("<br>").join(" ");
    //console.log(res);
    
    info.innerHTML=res;
}

function clearHover() {
    setHover(null);
}

function changeSelection(d) {
    // There are FOUR data_types that can be selected;
    // an empty selection (null), a single Game,
    // a Team, or a Location.

    // ******* TODO: PART V *******
    
    // Update everything that is data-dependent
    // Note that updateBarChart() needs to come first
    // so that the color scale is set
    if(!teamSchedules[d]){
    	Games=[];
    	updateForceDirectedGraph1();
    	return;
    }
    selectedSeries = teamSchedules[d];
    updateBarChart();
    
    //console.log("forced is:"+forced);
    updateForceDirectedGraph1();
    updateMap1();
    
}
function updateMap1(){
d3.select("svg#map").selectAll("g#points").selectAll("circle").data(d3.values(locationData)).
      		attr("fill",function(d){
      				for(j=0;j<d.games.length;j++){
      				
      				if(Games.indexOf(d.games[j]["_id"]) != -1 ){
        				sum=0;
      					for(i=0;i<d.games.length;i++){
      						sum+=d.games[i].attendance
      						}
      					sum=sum/d.games.length;
        				return colorScale(sum);
        				
        				}}
        			
        				return "rgba(0, 117, 128, 0.01)";
      				
      }).
      attr("r",function(d){
      				for(j=0;j<d.games.length;j++){
      				if(Games.indexOf(d.games[j]["_id"]) != -1 ){
      					return 20;
        				}
        				}
        				return 5;
      				
      });
}

/* DRAWING FUNCTIONS */

function updateForceDirectedGraph1(){

var node=d3.select('svg#graph').select('g#nodes').selectAll("path")
        .data(data.vertices);

    node.attr("d", d3.svg.symbol()
    	.type(function(d) { return d3.svg.symbolTypes[type(d.data_type)]; })
        .size(function(d){
        	if(Games.indexOf(d["_id"]) != -1 ){
      				
        				return 200;
        				}
        			else if(d.data_type == "Team"){
        				return 50;
        			}
            			else{
        				return 30;
        				}
        })).style("fill", function(d){
        			//console.log("here");
        			if(Games.indexOf(d["_id"]) != -1 ){
      				
        				return colorScale(d.attendance);
        				}
    })
    .style("stroke","Black")
        .style("stroke-width","1px");
        /*.attr("transform", function(d) {
        	if((d["Home Team Name"] == forced_home || d["Visit Team Name"] ==forced_away) && (forced_home==forced_away)){
        				return "scale(2)";
        				}
        		else if(d["Home Team Name"] == forced_home && d["Visit Team Name"] ==forced_away){
        				return "scale(2)";
        			}
        
    return "scale(1)" ;
  });*/

}

function updateBarChart() {
	console.log("enter");
      //console.log(teamSchedules["Utah"]);
	/*var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);	*/
    //Games=[];
    for(i=0;i<selectedSeries.length;i++){
    Games.push(selectedSeries[i]["_id"]);}
   // console.log(Games.length);
    var svgBounds = document.getElementById("barChart").getBoundingClientRect(),
        xAxisSize = 100,
        yAxisSize = 60;
        var Dates = [];
        /*for(i=0;i< data.vertices.length ; i++){
        	if(data.vertices[i].data_type != 'Team'){
        	console.log(data.vertices[i].data_type);
        	break;
        	}
        	}*/
        	max=0;
        Min_attend = d3.min(selectedSeries, function (d) {
            return d.attendance;
        });
        Max_Attend = d3.max(d3.values(teamSchedules), function (d) {
        	console.log(d);
            for(i=0;i<d.length;i++){
            	
            		if( d[i].attendance > max){
            			console.log("here");
            			max = d[i].attendance
            			}
            		
            }
            return max;
        });
        Tol=0;
        
    // ******* TODO: PART I *******
    	 var yScale = d3.scale.linear()
        .domain([0, Max_Attend])
        .range([svgBounds.height-xAxisSize,0]);
        
       
        
        var xScale = d3.scale.ordinal()
       .domain(selectedSeries.map(function(d){
       		return d.Date;
       	}))
        .rangeRoundBands([yAxisSize,svgBounds.width-20],0.05)
        //.range([yAxisSize,svgBounds.width-20])
        //.nice();
        //console.log(xScale(Date.parse(selectedSeries[0].Date)));
        
   	colorScale = d3.scale.linear()
   .domain([0, Max_Attend+Tol])
    .range(colorbrewer.Dark2[4]);
    
   		xAxis = d3.svg.axis()
      .scale(xScale)
      .tickSize(5)
      .tickSubdivide(true);
      
    yAxis = d3.svg.axis()
      .scale(yScale)
      .tickSize(0)
      .orient('left')
      .tickSubdivide(true);
      
    d3.select("svg#barChart").select("g#xAxis")
  .attr('transform', 'translate(0,' + (svgBounds.height-xAxisSize) + ')')
  .call(xAxis)
  .selectAll("text")
     .style("text-anchor", "end")
     .attr("dx", "-0.8em")
     .attr("dy", "-.25em")
     .attr("transform", function(d) {
         return "rotate(-90)" 
     });
//var barWidth = ((svgBounds.width-20) - yAxisSize) / selectedSeries.length;
//console.log(barWidth)
 d3.select("svg#barChart").select("g#yAxis")
  .attr('transform', 'translate(' + (yAxisSize) + ',0)')
  .call(yAxis);
d3.select('svg#barChart').select("g#bars").selectAll("rect").remove();
d3.select('svg#barChart').select("g#bars").selectAll("rect")
    .data(selectedSeries)
  	.enter().append('rect')
var BBounds = document.getElementsByTagName("BODY")[0].getBoundingClientRect();
d3.select('svg#barChart').select("g#bars").selectAll("rect")
    .data(selectedSeries).on("mouseover", function(d) {
         /* tooltip.transition()
               .duration(200)
               .style("opacity", .9);*/
          var str = d["Home Team Name"]+" vs "+d["Visit Team Name"]; 
          /*tooltip.html(str)
	        .style("left", (BBounds.width) -420 + "px")
               .style("top", 100 + "px");*/
               setHover(str);
      })
       .on("mouseout", function(d) {
          /*tooltip.transition()
               .duration(500)
               .style("opacity", 0);*/
               clearHover();
      })

  .on("click",function(d){
  			
  			selectedSeries=[];
  			Games=[];
      		selectedSeries.push(d);
      		updateBarChart();
  			updateForceDirectedGraph1();
  			updateMap1();
      		//changeSelection(d);
      		//console.log("\ndata is :"+d);
      })

d3.select('svg#barChart').select("g#bars").selectAll("rect")
    .data(selectedSeries)
    //.attr('class', 'bar')
    .attr('transform', 'translate(0, ' + (svgBounds.height-xAxisSize)  + ') scale(1,-1)')
    .attr('x', function(d) { return xScale(d.Date); })
    .attr('y', 0)
    .attr('fill',function(d) { return colorScale(d.attendance); })
    .attr('width', xScale.rangeBand())
    .attr('height', function(d) { return (svgBounds.height-xAxisSize) - yScale(d.attendance)});
   		
    // Create the x and y scales; make
    // sure to leave room for the axes
    
    // Create colorScale (note that colorScale
    // is global! Other functions will refer to it)

    // Create the axes (hint: use #xAxis and #yAxis)

    // Create the bars (hint: use #bars)
    
    // ******* TODO: PART IV *******
    
    // Make the bars respond to hover and click events
}

function type(p1){
	if(p1=='Team')
		return 5;
	else
		return 0;
}

function updateForceDirectedGraph() {
    // ******* TODO: PART II *******
    	/*colorScale = d3.scale.linear()
   .domain([d3.min(data.vertices, function (d) {
            return d._id;
        }), d3.max(data.vertices, function (d) {
            return d._id;
        })])*/
        //console.log("here forced")
        /* var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);*/
 
    var svgBounds = document.getElementById("graph").getBoundingClientRect();
    var force = d3.layout.force()
    				  .charge(-120)
    				  .linkDistance(20)
                     .nodes(data.vertices)
                     .links(data.edges)
                     .friction(0.9)
                     .gravity(0.2)
                     .size([svgBounds.width, svgBounds.height])
                     .start();
                     
     
    	//console.log(type('Team'));
        var edges = d3.select('svg#graph').select('g#links').selectAll("line").data(data.edges)
        .enter()
        .append("line")
        .style("stroke-width", 1);
        
        var nodes_1 = d3.select('svg#graph').select('g#nodes').selectAll("path")
        .data(data.vertices)
        .enter()
        .append("path");
        var BBounds = document.getElementsByTagName("BODY")[0].getBoundingClientRect();
    d3.select('svg#graph').select('g#nodes').selectAll("path")
        .data(data.vertices).on("mouseover", function(d) {
          /*tooltip.transition()
               .duration(200)
               .style("opacity", .9);*/
          if(d.data_type == 'Team'){
          var str=d.name;
          }
          else{
          var str = d["Home Team Name"]+" vs "+d["Visit Team Name"];
          }
          /*tooltip.html(str)
	        .style("left", (BBounds.width) -420 + "px")
               .style("top", 100 + "px");*/
               setHover(str);
      })
       .on("mouseout", function(d) {
         /* tooltip.transition()
               .duration(500)
               .style("opacity", 0);*/
               clearHover();
      })

  .on("click",function(d){
  			if(d.data_type == "Team"){
      		//console.log(d);
      		selectedSeries=teamSchedules[d.name];
      		Games=[];
      		updateBarChart();
  			updateForceDirectedGraph1();
  			updateMap1();
      		}
      		else
      		{
      		//console.log(d);
      		selectedSeries=[];
      		selectedSeries.push(d);
      		Games=[];
      		updateBarChart();
  			updateForceDirectedGraph1();
  			updateMap1();
      		}
      })
      ;
        var nodes = nodes_1
        .attr("d", d3.svg.symbol()
        .type(function(d) { return d3.svg.symbolTypes[type(d.data_type)]; })
        .size(function(d){
        	//console.log(d);
        	if(d.data_type == "Team"){
        				return 50;
        			}
        	if(Games.indexOf(d["_id"]) != -1 ){
        				return 200;
        				}
            			else{
        				return 30;
        				}
        }))
        //.append("circle")
        .attr("class",function(d){
        	if(d.data_type == 'Team')
        		return "team";
        	else
        		return "game";
        })
        .style("stroke","Black")
        .style("stroke-width","1px")
        .style("fill", function(d){
        		if(Games.indexOf(d["_id"]) != -1 ){
      				
        				return colorScale(d.attendance);
        				}
        			
        })
        .call(force.drag);
        
        force.on("tick", function() {

edges.attr("x1", function(d) { return d.source.x; })
     .attr("y1", function(d) { return d.source.y; })
     .attr("x2", function(d) { return d.target.x; })
     .attr("y2", function(d) { return d.target.y; });

 nodes.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
    });
    
//nodes.attr("cx", function(d) { return d.x; })
//     .attr("cy", function(d) { return d.y; });

});
       
    
    // Set up the force-directed
    // layout engine

    // Draw the links (hint: use #links)

    // Update the links based on the current selection

    // Draw the nodes (hint: use #nodes), and make them respond to dragging
    
    // ******* TODO: PART IV *******
  
    
    // Make the nodes respond to hover and click events
    
    // ******* TODO: PART V *******
    
    // Color and size the Game nodes if they are in selectedSeries
    
    // ******* TODO: PART II *******
    
    // Finally, tell the layout engine how
    // to manipulate the nodes and links
    // that we've drawn
}

function updateMap() {
    // ******* TODO: PART III *******
  /* var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);*/
    var svgBounds = document.getElementById("map").getBoundingClientRect();
    var svg = d3.select("svg#map").selectAll("g#points").selectAll("circle").data(d3.values(locationData))
  .enter().append("circle");
  

    var projection = d3.geo.albersUsa()
    .scale(1000)
    .translate([svgBounds.width / 2, svgBounds.height / 2]);
    svg
  .attr("r", function(d){
  					for(j=0;j<d.games.length;j++){
      				if(Games.indexOf(d.games[j]["_id"]) != -1 ){
      					return 20;
        				}
        				}
        				return 5;
      				
      })
    //  .attr("class","game")
  //.attr("cx",function(d){return svgBounds.width / 2+d.longitude})
   //.attr("cy",function(d){return svgBounds.height / 2+d.latitude});
   .attr("stroke","black")
   .attr("stroke-width","2px")
  .attr("fill",function(d){
                  
  					for(j=0;j<d.games.length;j++){
      				
      				if(Games.indexOf(d.games[j]["_id"]) != -1 ){
        				sum=0;
      					for(i=0;i<d.games.length;i++){
      						sum+=d.games[i].attendance
      						}
      					sum=sum/d.games.length;
        				return colorScale(sum);
        				
        				}}
        			
        				return "rgba(0, 117, 128, 0.01)";
      				
      })
  .attr("transform", function(d) {
    return "translate(" + projection([
      d.longitude,
      d.latitude
    ]) + ")";
  });
  var BBounds = document.getElementsByTagName("BODY")[0].getBoundingClientRect();
    d3.select("svg#map").selectAll("g#points").selectAll("circle").data(d3.values(locationData)).on("mouseover", function(d) {
          /*tooltip.transition()
               .duration(200)
               .style("opacity", .9);*/
          var str=""
          if (d.games.length<2){
          str=str.concat("<br>"+d.games.length+ " Game played between<br>" )
          }
          else{
          str=str.concat("<br>"+d.games.length+ " Games played between<br>")
          }
          for(i=0;i<d.games.length - 1;i++){
          		str=str.concat((i+1)+". "+d.games[i]["Home Team Name"] + " vs " + d.games[i]["Visit Team Name"]+",<br>")
          }
          str=str.concat((i+1)+". "+d.games[i]["Home Team Name"] + " vs " + d.games[i]["Visit Team Name"]+".")
         /* tooltip.html(" latitude: " + d.latitude 
	        + ", <br> longitude: " + d.longitude + ",<br> Stadium: "+ d.games[0]["Stadium Name"] +", "+ str )
	        .style("left", (BBounds.width) -320 + "px")
               .style("top", BBounds.height-578 + "px");*/
               setHover(str);
      })
       .on("mouseout", function(d) {
          /*tooltip.transition()
               .duration(500)
               .style("opacity", 0);*/
               clearHover();
      })

  .on("click",function(d){
  		
  	  	selectedSeries=[];
  	  	Games=[];
  	  	for(i=0;i<d.games.length;i++){
  	  		selectedSeries.push(d.games[i]);
  	  	}
  	  	updateBarChart();
  	  	updateForceDirectedGraph1();
  		updateMap1();
  	  	
      })
    
    // Draw the games on the map (hint: use #points)
    
    // NOTE: locationData is *NOT* a Javascript Array, like
    // we'd normally use for .data() ... instead, it's just an
    // object (often called an Associative Array)!
    
    // ******* TODO: PART V *******
    
    // Update the circle appearance (set the fill to the
    // mean attendance of all selected games... if there
    // are no matching games, revert to the circle's default style)
}

function drawStates(usStateData) {
    // ******* TODO: PART III *******
    //Citation: http://bl.ocks.org/mbostock/4090848
     var svgBounds = document.getElementById("map").getBoundingClientRect();
     var svg = d3.select("svg#map").select("g#states");
     var projection = d3.geo.albersUsa()
    .scale(1000)
    .translate([svgBounds.width / 2, svgBounds.height / 2]);
    var path = d3.geo.path()
    .projection(projection);
     d3.json("data/us.json", function(error, us) {
  if (error) throw error;
	svg.append("path", ".graticule")
      .datum(topojson.feature(us, us.objects.land))
      .attr("id", "states")
      .attr("d", path);

  svg.insert("path", ".graticule")
      .datum(topojson.mesh(us, us.objects.counties, function(a, b) { return a !== b && !(a.id / 1000 ^ b.id / 1000); }))
      .attr("id", "states")
      .attr("d", path);

  svg.insert("path", ".graticule")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("id", "states")
      .attr("d", path);
});
//d3.select(self.frameElement).style("height", svgBounds.height + "px");
    // Draw the background (state outlines; hint: use #states)
}


/* DATA DERIVATION */

// You won't need to edit any of this code, but you
// definitely WILL need to read through it to
// understand how to do the assignment!

function dateComparator(a, b) {
    // Compare actual dates instead of strings!
    return Date.parse(a.Date) - Date.parse(b.Date);
}

function isObjectInArray(obj, array) {
    // With Javascript primitives (strings, numbers), you
    // can test its presence in an array with
    // array.indexOf(obj) !== -1
    
    // However, with actual objects, we need this
    // helper function:
    var i;
    for (i = 0; i < array.length; i += 1) {
        if (array[i] === obj) {
            return true;
        }
    }
    return false;
}

function deriveGraphData() {
    // Currently, each edge points to the "_id" attribute
    // of each node with "_outV" and "_inV" attributes.
    // d3.layout.force expects source and target attributes
    // that point to node index numbers.

    // This little snippet adds "source" and "target"
    // attributes to the edges:
    var indexLookup = {};
    data.vertices.forEach(function (d, i) {
        indexLookup[d._id] = i;
    });
    data.edges.forEach(function (d) {
        d.source = indexLookup[d._outV];
        d.target = indexLookup[d._inV];
    });
}

function deriveLocationData() {
    var key;

    // Obviously, lots of games are played in the same location...
    // ... but we only want one interaction target for each
    // location! In fact, when we select a location, we want to
    // know about ALL games that have been played there - which
    // is a different slice of data than what we were given. So
    // let's reshape it ourselves!

    // We're going to create a hash map, keyed by the
    // concatenated latitude / longitude strings of each game
    locationData = {};

    data.vertices.forEach(function (d) {
        // Only deal with games that have a location
        if (d.data_type === "Game" &&
            d.hasOwnProperty('latitude') &&
            d.hasOwnProperty('longitude')) {

            key = d.latitude + "," + d.longitude;

            // Each data item in our new set will be an object
            // with:

            // latitude and longitude properties,

            // a data_type property, similar to the ones in the
            // original dataset that you can use to identify
            // what type of selection the current selection is,
            
            // and a list of all the original game objects that
            // happened at this location
            
            if (!locationData.hasOwnProperty(key)) {
                locationData[key] = {
                    "latitude": d.latitude,
                    "longitude": d.longitude,
                    "data_type": "Location",
                    "games": []
                };
            }
            locationData[key].games.push(d);
        }
    });

    // Finally, let's sort each list of games by date
    for (key in locationData) {
        if (locationData.hasOwnProperty(key)) {
            locationData[key].games = locationData[key].games.sort(dateComparator);
        }
    }
}

function deriveTeamSchedules() {
    var teamName;

    // We're going to need a hash map, keyed by the
    // Name property of each team, containing a list
    // of all the games that team played, ordered by
    // date
    teamSchedules = {};

    // First pass: I'm going to sneakily iterate over
    // the *edges*... this will let me know which teams
    // are associated with which games
    data.edges.forEach(function (d) {
        // "source" always refers to a game; "target" always refers to a team
        teamName = data.vertices[d.target].name;
        if (!teamSchedules.hasOwnProperty(teamName)) {
            teamSchedules[teamName] = [];
        }
        teamSchedules[teamName].push(data.vertices[d.source]);
    });

    // Now that we've added all the game objects, we still need
    // to sort by date
    for (teamName in teamSchedules) {
        if (teamSchedules.hasOwnProperty(teamName)) {
            teamSchedules[teamName] = teamSchedules[teamName].sort(dateComparator);
        }
    }
}


/* DATA LOADING */

// This is where execution begins; everything
// above this is just function definitions
// (nothing actually happens)

d3.json("data/us.json", function (error, usStateData) {
    if (error) throw error;
    
    drawStates(usStateData);
});
d3.json("data/pac12_2013.json", function (error, loadedData) {
    if (error) throw error;

    // Store the data in a global variable for all functions to access
    data = loadedData;

    // These functions help us get slices of the data in
    // different shapes
    deriveGraphData();
    deriveLocationData();
    deriveTeamSchedules();
    
    // Start off with Utah's games selected
    selectedSeries = teamSchedules.Utah;
    // Draw everything for the first time
    updateBarChart();
    updateForceDirectedGraph();
    updateMap();
});