if (window.File && window.FileReader && window.FileList && window.Blob) {
//  alert('Great success! All the File APIs are supported.');
} else {
  alert('The File APIs are not fully supported in this browser.');
}
var jsonString=[];

function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.
    var file = evt.dataTransfer.files[0];
    if(file.name.split(".")[1].toUpperCase() != "CSV") {
        alert("Invalid CSV File");
        e.target.parentNode.reset();
        return;
    } else {
        handleCSV(evt, file);
    }
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

function handleCSV(evt, f) {
    var reader = new FileReader();
        // files is a FileList of File objects. List some properties.
    reader.onload = function(f) {
        var content = f.target.result;
        var rows = f.target.result.split(/[\r\n|\n]+/);
        
        for(var i = 2; i < rows.length-208; i++){
               var row = rows[i].split(',');
               if(i===3){
                    if(evt.target.output_zone.indexOf("one") !== -1){
                        document.getElementById("sample_one").value = row[1];
                    } else {
                        document.getElementById("sample_two").value = row[1];
                    }
               }
               if(hasNumbers(row[0])){
                    if(hasNumbers(row[1])){
                        var rowData = new Object();
                        rowData.timeRange=row[0];
                        rowData.value = row[1];
                        jsonString.push(rowData);
                    }
               }
        }        
        drawGraph(evt, jsonString);
    }
    reader.readAsText(f);
}

function hasNumbers(t)
{
    return /\d/.test(t);
}

function drawGraph(evt,data){
    var chart = d3.select(evt.target.chart)
    .attr("class", "chart")
    .attr("width", 420)
    .attr("height", 20 * data.length);
    
    var w = 20,
    h = 80;

    var x = d3.scale.linear()
        .domain([0, 1])
        .range([0, w]);

    var y = d3.scale.linear()
        .domain([0, 100])
        .rangeRound([0, h]);
      
    chart.selectAll("rect")
        .data(data)
      .enter().append("rect")
        .attr("x", function(d, i) { return x(i) - .5; })
        .attr("y", function(d) { return h - y(d.value) - .5; })
        .attr("width", w)
        .attr("height", function(d) { return y(d.value); });
     
     chart.append("line")
        .attr("x1", 0)
        .attr("x2", w * data.length)
        .attr("y1", h - .5)
        .attr("y2", h - .5)
        .style("stroke", "#000");

}

// Setup the dnd listeners.
var dropZone1 = document.getElementById('drop_zone_one');
dropZone1.addEventListener('dragover', handleDragOver, false);
dropZone1.addEventListener('drop', handleFileSelect, false);
dropZone1.output_zone = 'list_one';
dropZone1.chart = '#chart_one';

var dropZone2 = document.getElementById('drop_zone_two');
dropZone2.addEventListener('dragover', handleDragOver, false);
dropZone2.addEventListener('drop', handleFileSelect, false);
dropZone2.output_zone = 'list_two';
dropZone2.chart = '#chart_two';