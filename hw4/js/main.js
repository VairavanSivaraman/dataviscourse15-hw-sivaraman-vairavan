/*globals d3, queue, CountVis, AgeVis, PrioVis*/

/**
 * Created by Alex Bigelow (alex.bigelowsite.com) on 9/25/15.
 */

// This syntax may look weird:

// (function () {
//      // all the code is in here
// })();

// This is called a "closure." In previous assignments,
// we have just executed statements in a global context
// as files were loaded. Closures are similar - stuff inside
// the closure is executed immediately. However, all the
// variables and things we create globally no longer "pollute"
// the global namespace; now they're eligible for garbage
// collection, and global variable names you define here
// won't collide with variable names in other scripts and libraries.
 
 var start ,end;
 var from_s ,end_s;
 var temp_from_s,temp_to_s;
 var ageVis,prioVis;
 
 function changeDataPrev() {
    // Load the file indicated by the select menu
     var dataRange = document.getElementById('range previous').value
     if(dataRange == "Previous Range"){
    	prioVis1.onSelectionChange(temp_from_s,temp_to_s,0);
    }
    else if(dataRange == "Previous Range Average"){
    	prioVis1.onSelectionChange(temp_from_s,temp_to_s,1);
    }
}

function changeData() {
    // Load the file indicated by the select menu
     var dataRange = document.getElementById('range').value
     if(dataRange == "Selected Range"){
    	ageVis.onSelectionChange(from_s,to_s);
    	prioVis.onSelectionChange(from_s,to_s,0);
    }
    else if(dataRange == "Overall")
    {
    	ageVis.onSelectionChange(start,end);
    	prioVis.onSelectionChange(start,end,0);
    }
    else if(dataRange == "Selected Range Average"){
    	ageVis.onSelectionChange(from_s,to_s);
    	prioVis.onSelectionChange(from_s,to_s,1);
    }
    else
    {
    	ageVis.onSelectionChange(start,end);
    	prioVis.onSelectionChange(start,end,1);
    }
}
(function () {
    // some variables
    var allData = [];
    var metaData = {};
   
    
    // function that uses files

    // this function can convert Date objects to a string
    // it can also convert strings to Date objects
    // see: https://github.com/mbostock/d3/wiki/Time-Formatting
    var dateFormatter = d3.time.format("%Y-%m-%d");
    
    
    
    // call this function after Data is loaded, reformatted and bound to the variables
    function initVis() {
        
        // ******* TASK 3b, 3c *******
        // Create a handler that will deal with a custom event named "selectionChanged"
        // (you will need to edit this line)
        //del
		var eventHandler = d3.dispatch("selectionChanged");
		eventHandler.on("selectionChanged",myFunction); 
        // Instantiate all Vis Objects here
        var countVis = new CountVis(d3.select("#countVis"), allData, metaData, eventHandler);
        ageVis = new AgeVis(d3.select("#ageVis"), allData, metaData);
        prioVis = new PrioVis(d3.select("#prioVis"), allData, metaData);
        prioVis1 = new PrioVis1(d3.select("#prioVis1"), allData, metaData);
        
        // ******** TASK 3b, 3c *******
        // Bind the eventHandler to the Vis Objects
        // events will be created from the CountVis object (TASK 4b)
        // events will be consumed by the PrioVis and AgeVis object
        // (you should bind the appropriate functions here)
        // Also make sure to display something reasonable about
        // the brush in #brushInfo
        //del
        /*function myFunction(From,To){
        console.log(From);
        console.log(To);
        //PrioVis.onSelectionChange(From,To);*/
        	function myFunction(from,to){
        	console.log(from+" "+to)
        	temp_from_s = from_s;
        	temp_to_s = to_s;
        	from_s=from;
        	to_s=to;
        	ageVis.onSelectionChange(from_s,to_s);
        	prioVis.onSelectionChange(from_s,to_s,0);
        	prioVis1.onSelectionChange(temp_from_s,temp_to_s,0);
        	document.getElementById('range').selectedIndex = 1;
        	document.getElementById('range previous').selectedIndex = 0;
        	document.getElementById('current').innerHTML = "Current selected range is From: "+from_s+" To: "+to_s;
        	document.getElementById('previous').innerHTML = "Previously selected range is From: "+temp_from_s+" To: "+temp_to_s;
        }
        //del
        
    }

    // call this function after both files are loaded -- error should be "null" if no error
    function dataLoaded(error, perDayData, _metaData) {
        if (!error) {
            // make our data look nicer and more useful:
            allData = perDayData.map(function (d) {
                var res = {
                    time: dateFormatter.parse(d.day),
                    count: +d["count(*)"]
                };
                
                res.prios = d3.range(0, 16).map(function (counter) {
                        return d["sum(p" + counter + ")"];
                    });
                res.ages = d3.range(0, 99).map(function () {
                    return 0;
                });
                d.age.forEach(function (a) {
                    if (a.age < 100) {
                        res.ages[a.age] = a["count(*)"];
                    }
                });
                return res;
            });
            metaData = _metaData;
            Min_date = d3.min(allData, function (d) {
            return d.time;
        });
        	Max_date = d3.max(allData, function (d) {
            return d.time;
        });
        	start=from_s=temp_from_s= Min_date;
        	end=to_s=temp_to_s=Max_date;
			//console.log(Min_date+" "+Max_date);
            initVis();
        }
    }
    
    
    
    
    
    function startHere() {
        // ******* TASK 1a *******
        // Load each data file ASYNCHRONOUSLY, and then call dataLoaded() when they are finished.
         queue()
    .defer(d3.json, 'data/perDayData.json') 
    .defer(d3.json, 'data/MYWorld_fields.json') 
    .await(dataLoaded); 
    
       	//; 
    }
    
    startHere();
})();

