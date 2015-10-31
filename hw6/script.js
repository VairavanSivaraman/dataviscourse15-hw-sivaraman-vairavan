/*globals VolumeRenderer, d3, console*/

var renderer,
    allHistograms = {};

var brushes_counter = 0;
var brush_extents = [];
var colors_selected = [];

function updateTransferFunction() {
    renderer.updateTransferFunction(function (value) {
        // ******* Your solution here! *******
        
        // Given a voxel value in the range [0.0, 1.0],
        // return a (probably somewhat transparent) color

        if(brush_extents.length >= 1 ){
            for(var i=0; i<brush_extents.length; i++ ){
                if(colors_selected[i])
                if(value>=brush_extents[i][0] && value<=brush_extents[i][1]){
                    newRGBA = colors_selected[i].r+','+colors_selected[i].g+','+colors_selected[i].b+','+value
                    //console.log(newRGBA);
                    return 'rgba('+newRGBA+')';
                }
            }
        }

        return 'rgba(255,255,255,' + value + ')';
    });
}
var xScale,height;
function setup() {
    var histVals;
    d3.select('#volumeMenu').on('change', function () {
        histVals = getHistogram(this.value, 0.025);
        renderer.switchVolume(this.value);
        console.log(this.value + ' histogram:', histVals);
        plotHistogram(histVals);
    });
    histVals = getHistogram('bonsai', 0.025);
    console.log('bonsai histogram:', histVals);
    plotHistogram(histVals);
}

function plotHistogram(histVals) {

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 300 - margin.left - margin.right;
        height = 150 - margin.top - margin.bottom;

    xScale = d3.scale.linear()
        .range([0, width]);

    var yScale = d3.scale.linear()
        .range([0, height]);

    //var xAxis = d3.svg.axis()
    //    .scale(x)
    //    .orient("bottom");

    //var area = d3.svg.area()
    //    .x(function(d) { return x(d.lowBound); })
    //    .y0(height)
    //    .y1(function(d) { return y(d.count); });
    //
    //var svg = d3.select("#histogram").append("svg")
    //    .attr("width", width + margin.left + margin.right)
    //    .attr("height", height + margin.top + margin.bottom)
    //    .append("g")
    //    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //
    //svg.append("path")
    //    .data(histVals)
    //    .attr("class", "area")
    //    .attr("d", area);
    //
    //svg.append("g")
    //    .attr("class", "x axis")
    //    .attr("transform", "translate(0," + height + ")")
    //    .call(xAxis);
    var maxval = d3.max(histVals, function (d) {
        return d.count;
    });

    xScale.domain([0, d3.max(histVals, function (d) {
        return d.lowBound;
    })]);
    yScale.domain([0, d3.max(histVals, function (d) {
        if (d.count != maxval)
            return d.count;
    })]);

    var area = d3.svg.area()
        .x(function (d) {
            return xScale(d.lowBound);
        })
        .y0(0)
        .y1(function (d) {
            return yScale(d.count);
        });


    var areaGraph = d3.select("#histogram")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .select("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //var areaGraphPlot = areaGraph.selectAll(".area")
    //    .data([histVals]);
    //
    //areaGraphPlot.enter()
    //    .append("path")
    //    .attr("class", "area")
    //    .attr("d", area);


    var bars = areaGraph.selectAll(".bar").data(histVals);
    bars.exit().remove();
    bars.enter().append("rect")
        .attr({
            "class": "bar",
            "width": '5px'
        }).style({
            "fill": "steelblue"
        });

    bars.attr({
        "height": function (d) {
            if (d.count == maxval)
                return 0;
            return yScale(d.count);
        },
        "x": function (d, i) {
            return (width / 40) * i;
        },
        "y": function (d) {
            if (d.count === maxval)
                return 0;
            return height - yScale(d.count);
        }
    });
   
    brush_here();
     updateColor("4FFF9B", 0);
     updateColor("FF4545", 1);
     updateColor("4D52FF", 2);
}


    function brush_here(){
        var margin = {top: 20, right: 20, bottom: 30, left: 50}
    var svg = d3.select("#histogram");
    //brushes container

        var gBrushes = svg.append('g')
                .attr("class", "brushes").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		

    //keep track of existing brushes
    var brushes = [];

    //return an array that contains the closest brush edge to the left and right
    function getBrushesAround(brush, brushes) {
        var edge = [];

        if (brush.extent.start === undefined)
            brush.extent.start = brush.extent();

        brushes.forEach(function (otherBrush) {
            var otherBrush_extent = otherBrush.extent();

            if (otherBrush !== brush) {

                if (brush.extent.start !== undefined
                    && otherBrush_extent[1] <= brush.extent.start[0]) {

                    if (edge[0] !== undefined && otherBrush_extent[1] > edge[0] || edge[0] === undefined)
                        edge[0] = otherBrush_extent[1];

                } else if (brush.extent.start !== undefined
                    && otherBrush_extent[0] > brush.extent.start[0]) {

                    if (edge[1] !== undefined && otherBrush_extent[0] < edge[1] || edge[1] === undefined)
                        edge[1] = otherBrush_extent[0];

                }
            }
        });

        return edge;
    }

    //new brush handler
    function newBrush() {

        if (brushes_counter < 3) {
            var brush = d3.svg.brush()
                .x(xScale)
                .on("brush", brushed) //Make sure don't pass surrounding brushes
                .on("brushend", brushend); //Keep track of what brushes is surrounding

            brushes.push({id: brushes.length, brush: brush});
        } else {
            //cannot add more than 3 brushes
        }

        function brushed() {
            //console.log(this);
            var id = this.getAttribute("class");
            id=id[id.length-1];
            

            var extent0 = brush.extent(),
                extent1;
            brush_extents[id] = brush.extent();
            updateTransferFunction();
            // if dragging, preserve the width of the extent
            if (d3.event.mode === "move") {
                var d0 = extent0[0],
                    d1 = d0 + ((extent0[1] - extent0[0]));
                extent1 = [d0, d1];
            }

            // otherwise, if resizing, round both dates
            else {
                extent1 = extent0;

                // if empty when rounded, use floor & ceil instead
                if (extent1[0] >= extent1[1]) {
                    extent1[0] = (extent0[0]);
                    extent1[1] = extent0[1];
                }
            }

            //Make sure no collision

            //find out what surrounds this brush
            var edge = getBrushesAround(brush, brushes.map(function (d) {
                return d.brush
            }));

            //if the current block gets brushed beyond the surrounding block, limit it so it does not go past
            if (edge[1] !== undefined && extent1[1] > edge[1]) {
                extent1[1] = edge[1];
                //if we are moving, not only do we stop it from going past, but also keep the brush the same size
                if (d3.event.mode === "move")
                    extent1[0] = extent1[1] - ((brush.extent.start[1] - brush.extent.start[0]) );
            } else if (edge[0] !== undefined && extent1[0] < edge[0]) {
                extent1[0] = edge[0];
                if (d3.event.mode === "move")
                    extent1[1] = extent1[0] + ((brush.extent.start[1] - brush.extent.start[0]) );
            }
            //updateTransferFunction();
            d3.select(this).call(brush.extent(extent1));

            //brush_extents[brushes_counter] = brush.extent();
            //updateTransferFunction();
            //brush_extents[brushes_counter][1] = brush.extent()[1];
        }

        function brushend() {
            //add a new brush as needed
            var lastBrushExtent = brushes[brushes.length - 1].brush.extent();
            if (lastBrushExtent[0] != lastBrushExtent[1]) {
                self.brushes_counter++;
                newBrush();

            }

            //keep track of current loc for comparison later
            brush.extent.start = brush.extent();
            if (brushes_counter == 1)
                self.label_data = "Select values for Channel 2 (Green)";
            else if (brushes_counter == 2)
                self.label_data = "Select values for Channel 3 (Blue)";
            else {
                alert('Cannot select more brushes.');
                self.label_data = "Cannot define more brushes. You may modify width of existing channels or reload to start again...";

                var brush1 = brushes[0].brush;
                var brush2 = brushes[1].brush;
                var brush3 = brushes[2].brush;
                ext1 = brush1.extent();
                ext2 = brush2.extent();
                ext3 = brush3.extent();
                console.log("brush1 from ", ext1[0], " to ", ext1[1]);
                console.log("brush2 from ", ext2[0], " to ", ext2[1]);
                console.log("brush3 from ", ext3[0], " to ", ext3[1]);

            }
            update_label_data();

        }
    }

    function update_label_data(){
        var text = d3.select("#labels > text") //todo: try to move it up
            .text(self.label_data);
        update();

    }

    function update() {
        var gBrush = gBrushes
            .selectAll('.brush')
            .data(brushes, function (d){return d.id});

        gBrush.enter()
            .insert("g", '.brush')
            .attr('class', 'brush')
            .each(function(brushWrapper) {
                //call the brush
                brushWrapper.brush(d3.select(this));
            });

        gBrush
            .each(function (brushWrapper,i){
                d3.select(this)
                    .attr('class', 'brush brush-'+i)
                    .selectAll('.background')
                    .style('pointer-events', function() {
                        var brush = brushWrapper.brush;

                        return i === brushes.length-1 &&
                        brush !== undefined &&
                        brush.extent()[0] === brush.extent()[1]
                            ? 'all' : 'none';
                    });

            })

        gBrush.selectAll('rect')
            .attr("height", height);

        gBrush.exit()
            .remove();
    }
    newBrush();
    update();

}

function clearBrushes(){
    brushes_counter=0;
    brush_extents = [];
    d3.select("#histogram").selectAll(".brushes").remove();
    d3.select("#histogram").selectAll(".brush").remove();
    brush_here();
}

/*

You shouldn't need to edit any code beyond this point
(though, as this assignment is more open-ended, you are
welcome to edit as you see fit)

*/


function getHistogram(volumeName, binSize) {
    /*
    This function resamples the histogram
    and returns bins from 0.0 to 1.0 with
    the appropriate counts
    (binSize should be between 0.0 and 1.0)
    
    */
    
    var steps = 256,    // the original histograms ranges from 0-255, not 0.0-1.0
        result = [],
        thisBin,
        i = 0.0,
        j,
        nextBin;
    while (i < 1.0) {
        thisBin = {
            count : 0,
            lowBound : i,
            highBound : i + binSize
        };
        j = Math.floor(i * steps);
        nextBin = Math.floor((i + binSize) * steps);
        while (j < nextBin && j < steps) {
            thisBin.count += Number(allHistograms[volumeName][j].count);
            j += 1;
        }
        i += binSize;
        result.push(thisBin);
    }
    return result;
}

function updateColor(val, selection){
    rgbcolor = parseColor('#'+val);
    colors_selected[selection] = rgbcolor;
    updateTransferFunction();
}

function parseColor(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
/*
Program execution starts here:

We create a VolumeRenderer once we've loaded all the csv files,
and VolumeRenderer calls setup() once it has finished loading
its volumes and shader code

*/
var loadedHistograms = 0,
    volumeName,
    histogramsToLoad = {
        'bonsai' : 'volumes/bonsai.histogram.csv',
        'foot' : 'volumes/foot.histogram.csv',
        'teapot' : 'volumes/teapot.histogram.csv'
    };

function generateCollector(name) {
    /*
    This may seem like an odd pattern; why are we generating a function instead of
    doing this inline?
    
    The trick is that the "volumeName" variable in the for loop below changes, but the callbacks
    are asynchronous; by the time any of the files are loaded, "volumeName" will always refer
    to "teapot"**. By generating a function this way, we are storing "volumeName" at the time that
    the call is issued in "name".
    
    ** This is yet ANOTHER javascript quirk: technically, the order that javascript iterates
    over an object's properties is arbitrary (you wouldn't want to rely on the last value
    actually being "teapot"), though in practice most browsers iterate in the order that
    properties were originally assigned.
    
    */
    return function (error, data) {
        if (error) {
            throw new Error("Encountered a problem loading the histograms!");
        }
        allHistograms[name] = data;
        loadedHistograms += 1;
        
        if (loadedHistograms === Object.keys(histogramsToLoad).length) {
            renderer = new VolumeRenderer('renderContainer', {
                'bonsai': 'volumes/bonsai.raw.png',
                'foot': 'volumes/foot.raw.png',
                'teapot': 'volumes/teapot.raw.png'
            }, setup);
        }
    };
}

for(volumeName in histogramsToLoad) {
    if (histogramsToLoad.hasOwnProperty(volumeName)) {
        d3.csv(histogramsToLoad[volumeName], generateCollector(volumeName));
    }
}