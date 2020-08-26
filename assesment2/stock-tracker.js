let tooltipsdata =[];
var chart = {
  element      : "",
  chart        : "",
  path      : "",
  width        : 100,
  height       : 50,
  maxValue     : 0,
  values       : [],
  points       : [],
  vSteps       : 10,
  measurements : [],
  
  
  calcMeasure : function(){
    this.measurements = [];
      for(x=0; x < this.vSteps; x++){
        var measurement = Math.ceil((this.maxValue / this.vSteps) * (x +1));
        this.measurements.push(measurement);
      }
    
    this.measurements.reverse();
  },
  getElement : function(element){
  	if(element.indexOf(".") == 0){
  		this.element = document.getElementsByClassName("chart")[0]	
  	} 
  	else if(element.indexOf("#") == 0){
  		this.element = document.getElementById("chart");
  	}
  	else {
  		console.error("Please select a valid element");
  	}
  	
  },
  createChart : function(element, values){
  	this.getElement(element);
  	this.values = values;

    this.calcMaxValue();
    this.calcPoints();
    this.calcMeasure();
    
    this.element.innerHTML = "";
    
    this.chart = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.chart.setAttribute("width", "100%");
    this.chart.setAttribute("height", "100%");
    this.chart.setAttribute("viewBox", "0 0 " + chart.width + " " + chart.height);

    this.path = document.createElementNS('http://www.w3.org/2000/svg','path');
    this.path.setAttribute("d", "M"+ this.points);
    this.path.setAttribute("class", "line");
  
    if(this.values.length > 1){
      var measurements = document.createElement("div");
      measurements.setAttribute("class", "chartMeasurements");
      for(x=0; x < this.measurements.length; x++){
        var measurement = document.createElement("div");
        measurement.setAttribute("class", "chartMeasurement");
        measurement.innerHTML = this.measurements[x];
        measurements.appendChild(measurement);
      }
      

      this.element.appendChild(measurements);
      this.element.appendChild(this.chart);
      this.chart.appendChild(this.path);
    }
    this.path.setAttribute("onmousemove", "toggleTooltip(true,event,this)");
    this.path.setAttribute("onmouseout", "toggleTooltip(false,event,this)");
    this.path.setAttribute("onclick", "createTracker(event,this)");
  },
  calcPoints : function(){
    this.points = [];
    if(this.values.length > 1){
      var points = "0," + chart.height + " ";
      for(x=0; x < this.values.length; x++){
        var perc  = this.values[x].y / this.maxValue;
        var steps = 100 / ( this.values.length - 1 );
        var point = (steps * (x )).toFixed(2) + "," + (this.height - (this.height * perc)).toFixed(2) + " ";
        points += point;
        
        tooltipsdata.push({
          "pointX": point.split(',')[0],
          "pointY": point.split(',')[1],
          "x": this.values[x].x,
          "y":this.values[x].y,
          "open": this.values[x].open,
          "low": this.values[x].low,
          "high": this.values[x].high,
          "distance":(x + 1)
        })
      }
      
      points += "100," + this.height;
      this.points = points;
     
    }
  },
  
  calcMaxValue : function(){
    this.maxValue = 0;
    for(x=0; x < this.values.length; x++){
      if(this.values[x].y > this.maxValue){
        this.maxValue = this.values[x].y;
      }
    }
  
    this.maxValue = Math.ceil(this.maxValue);
  }
}

var values = [];

function addValue(){
  var input = document.getElementById("value");
  var value = parseInt(input.value);
  
  if(!isNaN(value)){
    values.push(value);
    chart.createChart('.chart',values);  
  } 
  
  input.value = "";
  
  
}

function clearChart(){
  values = [];
  chart.createChart('.chart',values);  
}



function getRequest(url, success) {
    var req = false;
    try {
      req = new XMLHttpRequest();
    } catch (e) {
      try {
        req = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
        try {
          req = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {
          return false;
        }
      }
    }
    if (!req) return false;
    if (typeof success != 'function') success = function() {};
    req.onreadystatechange = function() {
      if (req.readyState == 4) {
        if (req.status === 200) {
          success(req.responseText)
        }
      }
    }
    req.open("GET", url, true);
    req.send(null);
    return req;
  }
  
  toggleTooltip = (show,event,obj)=> {
    
    let tooltip = document.getElementById('tooltipMeasure');
    let xOffset = event.screenX+'px';
    let yOffset = (event.screenY - 50)+'px';
    let xpoint= event.offsetX/3;
    let buildpoint= Math.round(event.offsetX % 3 == 0? xpoint * 0.5 : (xpoint+1) * 0.5 );
   
    var tData = tooltipsdata.find(e=>e.distance == buildpoint );
    if(tData !== undefined)
    {
    let tooltipText = 'Date: '+tData.x +'<br>'+ 'Open: $ '+tData.open +'<br>'+'Low: $ '+tData.low +'<br>'+"High: $ "+tData.high+'<br>'+"Close: $ "+tData.y;
    tooltip.innerHTML = tooltipText;
    tooltip.style.left = xOffset;
    tooltip.style.top = yOffset;
    
    tooltip.className = "tooltipMeasure "+ (show? 'show' : 'hide');
  }
  }

  createTracker = (event,obj) =>{
    
    let xpoint= event.offsetX/3;
    let buildpoint= Math.round(event.offsetX % 3 == 0? xpoint * 0.5 : (xpoint+1) * 0.5 );
    var tData = tooltipsdata.find(e=>e.distance == buildpoint );
    
    let chart = document.getElementById('chart');
    let circle = document.createElement('div');
    circle.style.left = (event.offsetX + 45) + 'px';
    circle.style.top = (event.offsetY -2) + 'px';
    circle.style.zIndex = 9999;
    circle.className = "circle show";

    chart.appendChild(circle);
    
    let tracker = document.createElement('div');
    tracker.style.left = (event.offsetX + 45) + 'px';
    tracker.style.top = (event.offsetY -2) + 'px';
    tracker.style.zIndex = 9999;
    let tooltipText = 'Date: '+tData.x +'<br>'+'Low: $ '+tData.low +'<br>'+"High: $ "+tData.high+'<br>'+"Close: $ "+tData.y;
    tracker.innerHTML = tooltipText;
    tracker.style.left = (event.offsetX + 45) + 'px';
    tracker.style.top = (event.offsetY -65) + 'px';
    let show =false;
    tracker.className = "tooltipMeasure show";
    chart.appendChild(tracker);

  }
  
  
  
  