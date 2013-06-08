function run_test() {
    var sides = 1;
    var alternativeOption = getSelected(document.getElementById('alternative-options'));
    var dataSetOne = document.getElementById('sample_one').content;
    var dataSetTwo = document.getElementById('sample_two').content;
    
    if(alternativeOption !== 'notequals') {
        sides = 2;
    }
    if(! document.getElementById('chart_one_selection_start')) {
    
    }

    var startDateOne = document.getElementById('chart_one_selection_start').firstChild.data;
    var startDateTwo = document.getElementById('chart_two_selection_start').firstChild.data;
    var endDateOne = document.getElementById('chart_one_selection_end').firstChild.data;
    var endDateTwo = document.getElementById('chart_two_selection_end').firstChild.data;
    
    var setOne = getRawDataSet(dataSetOne, startDateOne, endDateOne);
    var setTwo = getRawDataSet(dataSetTwo, startDateTwo, endDateTwo);
    meanOne = jStat.mean(setOne);
    meanTwo = jStat.mean(setTwo);
    stdDevOne = jStat.stdev(setOne);
    stdDevTwo = jStat.stdev(setTwo);
    var t_score = (meanOne - meanTwo)/
            Math.sqrt(Math.pow(stdDevOne, 2)/setOne.length
                          +Math.pow(stdDevTwo, 2)/setTwo.length);
    
    // From http://ncalculators.com/statistics/effect-of-size-calculator.htm
    var sdpooled = Math.sqrt(((stdDevOne*stdDevOne)+(stdDevTwo*stdDevTwo))/2);
    var d= (meanOne - meanTwo)/sdpooled;
    var r= d/Math.sqrt((d*d)+4);
    d=Math.round(d*10000000)/10000000; 
    
    
    if(!document.getElementById("df"))  {
        var df=parseFloat(document.getElementById("df").value);
        r = Math.sqrt((t_score*t_score)/((t_score*t_score)+(df*1)));
        d = (t_score*2)/(Math.sqrt(df));
    }
    //
    document.getElementById('t-value').innerHTML 
            ="t-value:<div>"+(t_score.toFixed(2))+"</div>";
    document.getElementById('mean').innerHTML 
            ="Mean<div>One: "+(meanOne.toFixed(2))+" Two: "+(meanTwo.toFixed(2))+"</div>";
    document.getElementById('standard_deviation').innerHTML 
            ="Standard Deviation<div>One: "+(stdDevOne.toFixed(2))+" Two: "+(stdDevTwo.toFixed(2))+"</div>";

    document.getElementById('effective_size').innerHTML 
            ="Effective Size<div>"+r.toFixed(2)+"</div>";
    document.getElementById('num_of_obs').innerHTML 
            ="Number of Observations<div>One: "+setOne.length+ " Two: "+setTwo.length+"</div>";
    document.getElementById('significance_level').innerHTML 
            ="Significance Level (p-value)<div>"+"TBD"+"</div>";

}

function getRawDataSet(dataSet, startDate, endDate){
    var startRecording = new Boolean();
    var sampleArray = [];
    
    for(var i = 0; i < dataSet.length; i++) {
        var dataBlock = dataSet[i];
        if(dataBlock.startDate === startDate){
            startRecording = true;
        }
        
        if(dataBlock.endDate === endDate){
            startRecording = false;
            break;
        }
        
        if(startRecording  === true){
            sampleArray.push(parseInt(dataBlock.value));
        }
    }
    return sampleArray;
}


function getSelected(selectOptions){
for(var i = 0; i < selectOptions.length;i++){
        if(selectOptions.options[i].selected){
            return selectOptions.options[i].value;
        }
    }
}

function cout(msg){
    console.log(msg)
}
