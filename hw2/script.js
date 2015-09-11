/*globals alert, document, d3, console*/
// These keep JSHint quiet if you're using it (highly recommended!)

window.onload = function() {
  changeData();
};

function mousein(e) {
  e.setAttribute('fill','seagreen');
}
function mouseout(e) {
  e.removeAttribute('fill');
}


function staircase() {
	var Parent = document.getElementById("unique");
	var height = Parent.getAttribute("height");
	var width = Parent.getAttribute("width");
	var children = Parent.childNodes
    var i=0;
    var j;
    var string="";
	for(child in children){
    	//console.log(String(children[child]));
    	if(String(children[child]) == "[object SVGRectElement]")
	    i++;
	}
	//console.log("Number of child is ="+i);
	for ( j=0; j< i; j++){
	string=string.concat('<rect x="' +(20*(j+1)) +'" y="'+ (height -(j*20))+'" width="20" height="'+ (j*20)+'"></rect>\n');
	}
	//console.log("The string is:"+string)
    Parent.innerHTML = string;
    console.log('Staircase Model')
}

function update(error, data) { 
    var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
   // document.getElementById("unique6").addEventListener("mouseover", printMouseover);
    if (error !== null) {
        alert("Couldn't load the dataset!");
    } else {
        // D3 loads all CSV data as strings;
        // while Javascript is pretty smart
        // about interpreting strings as
        // numbers when you do things like
        // multiplication, it will still
        // treat them as strings where it makes
        // sense (e.g. adding strings will
        // concatenate them, not add the values
        // together, or comparing strings
        // will do string comparison, not
        // numeric comparison).

        // We need to explicitly convert values
        // to numbers so that comparisons work
        // when we call d3.max()
        var array_a=[],array_b=[], polyline="",polyline_a="" , polyline_b="", polyarea_a="0 320" ,polyarea_b="0 320",polyarea="0 320";
        data.forEach(function (d) {
            d.a = parseInt(d.a);
            d.b = parseFloat(d.b);
            array_a.push(d.a);
            array_b.push(d.b);
          //  console.log("\n X is: " + d.a + "\t Y is: "+d.b);
        });
    }

    var Parent = document.getElementById("unique");
	var height = Parent.getAttribute("height");
	var width = Parent.getAttribute("width");
    // Set up the scales
    var xScale = d3.scale.linear()
        .domain([0, d3.max(data, function (d) {
            return d.a;
        })])
        .range([0, 150]);
    var yScale = d3.scale.linear()
        .domain([0, d3.max(data, function (d) {
            return d.b;
        })])
        .range([0, 150]);
    var iScale = d3.scale.linear()
        .domain([0, data.length])
        .range([0, 110]);
        
    for (i=0; i< array_a.length ; i++) {
    	if (i!= (array_a.length - 1)) {
    		polyline_a=polyline_a.concat(i*20+" "+(height-xScale(array_a[i])+","));
    		polyline=polyline.concat( "0 320," )
    	}
    	else{
    		polyline_a=polyline_a.concat(i*20+" "+ (height-xScale(array_a[i])) );
    		polyline=polyline.concat( "0 320," )
   		}
   		if (i!= (array_a.length - 1)) {
    		polyline_b=polyline_b.concat(i*20+" "+(height-yScale(array_b[i])+","));
    	}
    	else{
    		polyline_b=polyline_b.concat(i*20+" "+ (height-yScale(array_b[i])) );
   		}
    }
    polyarea=polyarea.concat(","+polyline+","+"0 320");
    polyarea_a= polyarea_a.concat(","+polyline_a+","+ (i-1)*20 +" 320");
    polyarea_b= polyarea_b.concat(","+polyline_b+","+ (i-1)*20 +" 320");
   // console.log(polyarea_a)
    //console.log(xScale(5)+" "+ yScale(5)+" "+iScale(5))

    // ****** TODO: PART III (you will also edit in PART V) ******

    // TODO: Select and update the 'a' bar chart bars
    
  
    //console.log("Selection");
    //console.log("Data");
    d3.select("#unique").selectAll("rect").data(data).enter().append("rect")
   /* d3.select("#unique").selectAll("rect").data(data).attr("x", function (d, i) {
                    return i * 20;
                })
                .attr("y", 320)//function (d, i) {
                  //  console.log(d);
                    //return height-yScale(d.a);
                //})
                .attr("height",0)
                .attr("width", 20)
                .attr("opacity",0)
                .attr("onmousemove","mousein(this)")
                .attr("onmouseout","mouseout(this)")*/
    d3.select("#unique").selectAll("rect").data(data).transition()
                .duration(3000).attr("x", function (d, i) {
                    return i * 20;
                })
                .attr("y", function (d, i) {
                  //  console.log(d);
                    return height-yScale(d.a);
                })
                .attr("height", function (d, i) {
                  //  console.log(d);
                    return yScale(d.a);
                })
                .attr("width", 20)
                .attr("opacity",1)
    
    d3.select("#unique").selectAll("rect").data(data).exit().attr("opacity", 1)
                .transition()
                .duration(3000)
                .attr("opacity", 0).remove();
    //d3.selec("#unique").selectAll("rect")
               // .style("fill", "steelblue")
    // TODO: Select and update the 'b' bar chart bars
    //console.log("Selection");
    //console.log("Data");
    d3.select("#unique1").selectAll("rect").data(data).enter().append("rect")
    d3.select("#unique1").selectAll("rect").data(data).transition()
                .duration(3000).attr("x", function (d, i) {
                    return i * 20;
                })
                .attr("y", function (d, i) {
                  //  console.log(d);
                    return height-yScale(d.b);
                })
                .attr("height", function (d, i) {
                  //  console.log(d);
                    return yScale(d.b);
                })
                .attr("width", 20)
                .attr("opacity",1)
                .attr("onmousemove","mousein(this)")
                .attr("onmouseout","mouseout(this)")
    d3.select("#unique1").selectAll("rect").data(data).exit().attr("opacity", 1)
                .transition()
                .duration(3000)
                .attr("opacity", 0).remove();
               // .style("fill", "steelblue")
    
    
    d3.select("#unique2").select("polyline").transition()
                .duration(3000).attr("points", polyline_a).attr("opacity",1)
    d3.select("#unique2").select("polyline").data(data).exit().attr("opacity", 1)
                .transition()
                .duration(3000)
                .attr("opacity", 0).remove();
    // TODO: Select and update the 'a' line chart path using this line generator
  /* var aLineGenerator = d3.svg.line()
        .x(function (d, i) {
            return iScale(i);
        })
        .y(function (d) {
            return aScale(d.a);
        });
*/
    // TODO: Select and update the 'b' line chart path (create your own generator)

    d3.select("#unique3").select("polyline").transition()
                .duration(3000).attr("points", polyline_b).attr("opacity",1)
    d3.select("#unique3").select("polyline").data(data).exit().attr("opacity", 1)
                .transition()
                .duration(3000)
                .attr("opacity", 0).remove();
    // TODO: Select and update the 'a' area chart path using this line generator
    d3.select("#unique4").select("polygon").transition()
                .duration(3000).attr("points", polyarea_a).attr("opacity",1)
    d3.select("#unique4").select("polygon").data(data).exit().attr("opacity", 1)
                .transition()
                .duration(3000)
                .attr("opacity", 0).remove();
    // TODO: Select and update the 'b' area chart path (create your own generator)
    d3.select("#unique5").select("polygon").transition()
                .duration(3000).attr("points", polyarea_b).attr("opacity",1)
    d3.select("#unique5").select("polygon").data(data).exit().attr("opacity", 1)
                .transition()
                .duration(3000)
                .attr("opacity", 0).remove();
    
    // TODO: Select and update the 'a' area chart path using this line generator
   

    // TODO: Select and update the scatterplot points
    d3.select("#unique6").selectAll("circle").data(data).enter().append("circle")
    d3.select("#unique6").selectAll("circle").data(data).on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(" (" + d.a 
	        + ", " + d.b + ")")
	        .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      })
      .on("click",function(d){
      		console.log("x: " +d.a+ " y: "+d.b);
      })
      ;
    d3.select("#unique6").selectAll("circle").data(data).transition().duration(3000).attr("cx", function (d, i) {
                    return (40 + (d.a * 20));
                })
                .attr("cy", function (d, i) {
                  //  console.log(d);
                    return height-(d.b*20);
                })
                .attr("r", 10)
                
    d3.select("#unique6").selectAll("circle").data(data).exit().attr("opacity", 1)
                .transition()
                .duration(3000)
                .attr("opacity", 0).remove();
    // ****** TODO: PART IV ******
}

function changeData() {
    // Load the file indicated by the select menu
    var dataFile = document.getElementById('dataset').value;
    d3.csv('data/' + dataFile + '.csv', update);
}

function randomSubset() {
    // Load the file indicated by the select menu,
    // and then slice out a random chunk before
    // passing the data to update()
    var dataFile = document.getElementById('dataset').value;
    d3.csv('data/' + dataFile + '.csv', function (error, data) {
        var subset = [];
        data.forEach(function (d) {
            if (Math.random() > 0.5) {
                subset.push(d);
            }
        });

        update(error, subset);
    });
}