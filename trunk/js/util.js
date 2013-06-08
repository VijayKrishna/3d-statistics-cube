function run_test() {
    var sides = 1;
    var alternativeOption = getSelected(document.getElementById('alternative-options'));
    var dataSetOne = document.getElementById('sample_one').content;
    var dataSetTwo = document.getElementById('sample_two').content;
    
    if(alternativeOption !== 'notequals') {
        sides = 2;
    }
    if((! dataSetOne) || (! dataSetTwo)) {
        alert("Missing Data Set");
        return;
    }
    var startDateOne = document.getElementById('chart_one_selection_start').firstChild.data;
    var startDateTwo = document.getElementById('chart_two_selection_start').firstChild.data;
    var endDateOne = document.getElementById('chart_one_selection_end').firstChild.data;
    var endDateTwo = document.getElementById('chart_two_selection_end').firstChild.data;
    
    var setOne = getRawDataSet(dataSetOne, startDateOne, endDateOne);
    var setTwo = getRawDataSet(dataSetTwo, startDateTwo, endDateTwo);
    meanOne = mean(setOne);
    meanTwo = mean(setTwo);
    // If this is a sample rather than a population
    if(setOne.length !== dataSetOne.length){
        stdDevOne = stdDev(setOne, true);
        stdDevTwo = stdDev(setTwo, true);
    } else {
        stdDevOne = stdDev(setOne, false);
        stdDevTwo = stdDev(setTwo, false);
    }
    
    var t_score = (meanOne - meanTwo)/
            Math.sqrt(Math.pow(stdDevOne, 2)/setOne.length
                          +Math.pow(stdDevTwo, 2)/setTwo.length);
    
    // From http://ncalculators.com/statistics/effect-of-size-calculator.htm
    var sdpooled = Math.sqrt(((stdDevOne*stdDevOne)+(stdDevTwo*stdDevTwo))/2);
    var d= (meanOne - meanTwo)/sdpooled;
    var r= d/Math.sqrt((d*d)+4);
    d=Math.round(d*10000000)/10000000; 
    
    var df = 1;
    if(!document.getElementById("df"))  {
        df=parseFloat(document.getElementById("df").value);
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
    
    if(sides === 1){
        document.getElementById('significance_level').innerHTML 
                ="Significance Level (p-value)<div>"+TtoP(t_score,df).toFixed(4)+"</div>";
    } else {
        document.getElementById('significance_level').innerHTML 
                ="Significance Level (p-value)<div>"+(TtoP(t_score,df)/2).toFixed(4)+"</div>";
    }
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

function total(arrayIntegers){
    var total = 0;
    for(var i = 0; i < arrayIntegers.length; i++){
        total += parseInt(arrayIntegers[i]);
    }
    return total;
}

function mean(arrayIntegers){
    return total(arrayIntegers)/arrayIntegers.length;
}

function variance(arrayIntegers, booleanSample){
    var deviations = []
    var meanValue = mean(arrayIntegers);

    for(var i = 0; i < arrayIntegers.length; i++){
        deviations.push(Math.pow(arrayIntegers[i] - meanValue, 2));
    }
    
    if(booleanSample) {
        return total(deviations)/(deviations.length - 1);
    } else {
        return total(deviations)/deviations.length;
    }
}

function stdDev(arrayIntegers, booleanSample){
    var varianceValue = variance(arrayIntegers, booleanSample);
    return Math.sqrt(varianceValue)
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

// Conversion from t-value to p-value
// http://easycalculation.com/statistics/p-value-t-test.php
function TtoP(t, df) {
    with (Math)   {
        var abst = abs(t), tsq = t*t, p;
        if(df == 1) {
            p = 1 - 2*atan(abst)/PI;
        }
        else if (df == 2) {
            p = 1 - abst/sqrt(tsq + 2);
        }
        else if (df == 3) {
            p = 1 - 2*(atan(abst/sqrt(3)) + abst*sqrt(3)/(tsq + 3))/PI;
        }
        else if (df == 4) {
            p = 1 - abst*(1 + 2/(tsq + 4))/sqrt(tsq + 4);
        }
        else {
            var z = TtoZ(abst, df);
            if (df>4){
                p = Norm_p(z);
            }
            else {
                p = Norm_p(z); 
            }
        }
    }
    return p;
}

function TtoZ(t, df) {
  var A9 = df - 0.5;
  var B9 = 48*A9*A9;
  var T9 = t*t/df, Z8, P7, B7, z;
  with (Math) {
    if (T9 >= 0.04) 
    {
      Z8 = A9*log(1+T9);
    }
    else
    {
      Z8 = A9*(((1 - T9*0.75)*T9/3 - 0.5)*T9 + 1)*T9;
    }
    P7 = ((0.4*Z8 + 3.3)*Z8 + 24)*Z8 + 85.5;
    B7 = 0.8*pow(Z8, 2) + 100 + B9;
    z = (1 + (-P7/B7 + Z8 + 3)/B9)*sqrt(Z8);
    return z;
  }
}

function Norm_p(z) {
  var absz = Math.abs(z);
  var a1 = 0.0000053830;
  var a2 = 0.0000488906;
  var a3 = 0.0000380036;
  var a4 = 0.0032776263;
  var a5 = 0.0211410061;
  var a6 = 0.0498673470;
  var p = (((((a1*absz+a2)*absz+a3)*absz+a4)*absz+a5)*absz+a6)*absz+1;
  p = Math.pow(p, -16);
  return p;
}
