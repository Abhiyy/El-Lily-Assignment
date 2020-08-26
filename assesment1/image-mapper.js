var openFile = function (event) {

    let input = event.target;
    let htmlstring = '';
    let reader = new FileReader();
    reader.onload = function () {
        let dataURL = reader.result;
        let output = document.getElementById('output');
        output.src = dataURL;
        htmlstring = '<strong>Image Name:</strong> ' + input.files[0].name + '<br>';
        htmlstring += '<strong>Dimension:</strong> ' + output.width + 'x' + output.height + '<br>';
        htmlstring += '<strong>MIME Type:</strong> ' + input.files[0].type + '<br>';
        let filedetails = document.getElementById('fildetails');
        filedetails.innerHTML = htmlstring;
        filedetails.style.display ="block";
    };
   


    reader.readAsDataURL(input.files[0]);
};
let xCoordinate, yCoordinate, name, userInputContainer;
let data = [];

function clickHotspotImage(event) {
    xCoordinate = event.offsetX;
    yCoordinate = event.offsetY;
    userInputContainer = document.getElementById('tooltipUserInput');
    userInputContainer.style.left = xCoordinate + 'px';
    userInputContainer.style.top = yCoordinate + 'px';
    userInputContainer.style.zIndex = 9999;
    userInputContainer.className = "tooltipUserInput show";

  
}
function Save(event) {
    const userInp = document.getElementById("txtpntDesc");
    name = userInp.value;
    data.push({ xPos: xCoordinate, yPos: yCoordinate, desc: name });

    userInputContainer.className = "tooltipUserInput hide";
    buildtable(data);
    userInp.value = '';
    createCircle(xCoordinate, yCoordinate);

}

function Close(event) {
    userInputContainer.className = "tooltipUserInput hide";
}

function buildtable(data) {
    let table = document.getElementById('tblData');
    
    let tablehtml = '<h3>Image Points</h3>';
    tablehtml += '<table class="table">';
    tablehtml += '<tr>';
    tablehtml += '<th>X Pos</th>';
    tablehtml += '<th>Y Pos</th>';
    tablehtml += '<th>Description</th>';
    tablehtml += '</tr>';

    tablehtml += data.map((r) => {
        return '<tr>'
            + '<td>' + r.xPos + '</td>'
            + '<td>' + r.yPos + '</td>'
            + '<td>' + r.desc + '</td>'
            + '</tr>';
    });
    tablehtml += '</table>';
    table.innerHTML = tablehtml;
}

function createCircle(x, y) {

    let imgMapper = document.getElementById('imageMapper');
    let circle = document.createElement('div');
    circle.style.left = (x+10) + 'px';
    circle.style.top = (y + 107) + 'px';
    circle.style.zIndex = 9999;
    circle.className = "circle show " + x;

    imgMapper.appendChild(circle);
}

function showToolTip(xPos) {

    let row = data.find(e => e.xPos == (xPos));
    let measure = document.getElementById('measure');
    measure.innerText = row.desc;
    let measureDiv = document.getElementById('tooltipMeasure');
    measureDiv.style.left = (row.xPos + 20) + 'px';
    measureDiv.style.top = (row.yPos + 120) + 'px';
    measureDiv.style.zIndex = 9999;
    measureDiv.className = 'tooltipMeasure show';
}


function hasClass(elem, className) {
    return elem.className.split(' ').indexOf(className) > -1;
}

document.addEventListener('mouseover', function (e) {
    if (hasClass(e.target, 'circle')) {

        let xCoordinate = e.target.className.split(' ')[2];
        let yCoordinate = e.offsetY;
        showToolTip(xCoordinate);
    }

}, false);

document.addEventListener('mouseout', function (e) {
    if (hasClass(e.target, 'circle')) {
        //   let xCoordinate = e.target.className.split(' ')[2];
        let measureDiv = document.getElementById('tooltipMeasure');
        measureDiv.className = 'tooltipMeasure hide';
    }

}, false);