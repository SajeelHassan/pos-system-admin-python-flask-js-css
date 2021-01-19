
var today = document.getElementById('reports-today');
var yesterday = document.getElementById('reports-yesterday');
var lastmonth = document.getElementById('reports-month');
var reportsAll = document.getElementById('reports-all');
today.addEventListener('click', todayReports);
yesterday.addEventListener('click', yestReports);
lastmonth.addEventListener('click', monthReport);
reportsAll.addEventListener('click', allReports);
// Event listeners

// month.addEventListener('click', monthReports());

//GET AJAX REQUEST (ALl ProductsSold data) for ProductsSold
//Load ProductsSold

//today Products
var theProductsSoldToday;
var xmlObjToday = new XMLHttpRequest();
xmlObjToday.open('get', '/incProductsSoldToday', true);
xmlObjToday.send();
xmlObjToday.onreadystatechange = function () {
    if (this.readyState == 4 && this.status === 200) {
        // console.log(this.responseText);
        theProductsSoldToday = JSON.parse(this.responseText);
        xmlObjToday.abort();
        // console.trace(theProductsSoldToday);
        // console.log();
        // console.log(theProductsSoldToday[0][3]);
        if (theProductsSoldToday.length) {
            today.classList.add('active-btn');
            createProductsSoldTable(theProductsSoldToday);

        }

    }
}
//Yest Products
var theProductsSoldYest;
var xmlObjYest = new XMLHttpRequest();
xmlObjYest.open('get', '/incProductsSoldYest', true);
xmlObjYest.send();
xmlObjYest.onreadystatechange = function () {
    if (this.readyState == 4 && this.status === 200) {
        theProductsSoldYest = JSON.parse(this.responseText);
        xmlObjYest.abort();
    }
}


//all products
var theProductsSold;
var xmlObj = new XMLHttpRequest();
xmlObj.open('get', '/incProductsSold', true);
xmlObj.send();
xmlObj.onreadystatechange = function () {
    if (this.readyState == 4 && this.status === 200) {
        theProductsSold = JSON.parse(this.responseText);
        xmlObj.abort();

    }
}
var monthProductsSold;
var xmlObj2 = new XMLHttpRequest();
xmlObj2.open('get', '/incProductsSoldMonth', true);
xmlObj2.send();
xmlObj2.onreadystatechange = function () {
    if (this.readyState == 4 && this.status === 200) {
        // console.log(this.responseText);
        monthProductsSold = JSON.parse(this.responseText);
        xmlObj2.abort();

    }
}

function productSoldobj(id, title, cost, price, qty, total_price) {
    this.id = id;
    this.title = title;
    this.cost = cost;
    this.price = price;
    this.qty = qty;
    this.total_price = total_price;
}
var result = [];
function createProductsSoldTable(arraysOfArrays) {
    var data;

    var arrayofObj = [];
    for (let i = 0; i < arraysOfArrays.length; i++) {
        arrayofObj.push(new productSoldobj(arraysOfArrays[i][0], arraysOfArrays[i][1], arraysOfArrays[i][2], arraysOfArrays[i][3], arraysOfArrays[i][4], arraysOfArrays[i][5]));

    }
    result = [];
    arrayofObj.reduce(function (res, value) {
        if (!res[value.id]) {
            res[value.id] = { id: value.id, title: value.title, cost: value.cost, price: value.price, qty: 0, total_price: 0 };
            result.push(res[value.id])
        }
        res[value.id].qty += value.qty;
        res[value.id].total_price += value.total_price;
        return res;
    }, {});

    let tableElement = document.createElement('table');
    tableElement.id = 'productsSoldTable';
    // tableElement.classList = 'scrollableDiv';
    document.getElementById('products-sold-div').appendChild(tableElement);
    var t_cols = 5;
    var row;
    newTable = document.getElementById('productsSoldTable');
    //Inserting New Row
    for (let i = 0; i < result.length; i++) {
        row = newTable.insertRow();
        for (let j = 0; j < t_cols; j++)
            row.insertCell();
    }
    //creating table head
    var tablehead = newTable.createTHead();
    row = tablehead.insertRow();
    let ths = ["Sr.", "Product", "Sales", "Sold", "Profit"];
    for (let i = 0; i < t_cols; i++)
        row.append(document.createElement('th'));
    for (let i = 0; i < t_cols; i++)
        tablehead.rows[0].cells[i].innerHTML = ths[i];


    //populating the table
    for (let i = 0; i < result.length; i++) {
        //populating New Row

        data = [i + 1, result[i].title, result[i].total_price + ' Rs.', result[i].qty];
        data[4] = (result[i].price - result[i].cost) * result[i].qty;
        data[4] = data[4] + ' Rs.';
        for (let j = 0; j < t_cols; j++)
            newTable.rows[i + 1].cells[j].innerHTML = data[j];
        data = [];
    }
    updateCharts(result);
}
function deleteProductsSoldTable() {
    if (document.getElementById('productsSoldTable')) {
        document.getElementById('productsSoldTable').remove();
        removeClass();
    }
}

function removeClass() {
    today.classList.remove('active-btn');
    yesterday.classList.remove('active-btn');
    lastmonth.classList.remove('active-btn');
    reportsAll.classList.remove('active-btn');
}

function todayReports(e) {
    deleteProductsSoldTable();
    today.classList.add('active-btn');
    createProductsSoldTable(theProductsSoldToday);
    e.preventDefault();
}
function yestReports(e) {
    deleteProductsSoldTable();
    yesterday.classList.add('active-btn');
    createProductsSoldTable(theProductsSoldYest);
    e.preventDefault();
}
function monthReport(e) {
    deleteProductsSoldTable();
    lastmonth.classList.add('active-btn');
    createProductsSoldTable(monthProductsSold);
    e.preventDefault();
}
function allReports(e) {
    deleteProductsSoldTable();
    reportsAll.classList.add('active-btn');
    createProductsSoldTable(theProductsSold);
    e.preventDefault();
}
function removeCharts() {
    if (document.getElementById('chart1')) {
        document.getElementById('chart1').remove();
        document.getElementById('chart2').remove();
        document.getElementById('chart3').remove();
    }
}
//charts
function createCharts() {
    removeCharts();
    let creatingcharts = `<div id="chart1" class='chart'>
<div class="d-flex-sp">
    <h3>No. of Sales</h3>
    <h3><span id='t-n-sales'></span></h3>
</div>
<canvas id="chart-count-sales" width="280" height="300"></canvas>
</div>
<div id="chart2" class='chart'>
<div class="d-flex-sp">
    <h3>Total Sales</h3>
    <h3><span id='t-sales'></span></h3>
</div>
<canvas id="chart-sales" width="280" height="300"></canvas>
</div>
<div id="chart3" class='chart'>
<div class="d-flex-sp">
    <h3>Total Profit</h3>
    <h3><span id='t-profit'></span></h3>
</div>
<canvas id="chart-profit" width="280" height="300"></canvas>
</div>`;
    document.getElementById('the-graphs').innerHTML = creatingcharts;
}
function updateCharts(thedata) {
    createCharts();
    console.log(thedata);
    let saledata = [],
        numdata = [],
        profitdata = [], labels = [], colors = [];
    let sumQty = 0,
        sumSales = 0,
        sumProfit = 0;
    thedata.forEach(data => {
        saledata.push(data.total_price);
        sumSales += data.total_price;
        numdata.push(data.qty);
        sumQty += data.qty;
        let profit = (data.price - data.cost) * data.qty;
        profitdata.push(profit);
        sumProfit += profit;
        labels.push(data.title);
        colors.push('#' + Math.floor(Math.random() * 16777215).toString(16));
    });

    saleChart(saledata, labels, colors);
    numChart(numdata, labels, colors);
    profitChart(profitdata, labels, colors);
    sumQty = new Intl.NumberFormat('en-IN').format(sumQty);
    sumSales = new Intl.NumberFormat('en-IN').format(sumSales);
    sumProfit = new Intl.NumberFormat('en-IN').format(sumProfit);
    document.getElementById('t-n-sales').innerHTML = `${sumQty}`;
    document.getElementById('t-sales').innerHTML = `${sumSales} Rs.`;
    document.getElementById('t-profit').innerHTML = `${sumProfit} Rs.`;


}

function numChart(thedata, labelss, colors) {
    // myChart.destroy();
    let myChart = document.getElementById("chart-count-sales").getContext('2d');
    let chart2 = new Chart(myChart, {
        type: 'bar',
        data: {
            labels: labelss,
            datasets: [{
                data: thedata,
                backgroundColor: colors
            }]
        },
        options: {
            title: {
                text: 'Total Products Sold (Qty)',
                display: true
            },
            scales: {
                xAxes: [{
                    ticks: {
                        display: false
                    }
                }]
            },
            legend: {
                display: false
            }
        }
    });
}
function saleChart(thedata, labelss, colors) {
    // myChart.destroy();
    let myChart = document.getElementById("chart-sales").getContext('2d');
    let chart2 = new Chart(myChart, {
        type: 'bar',
        data: {
            labels: labelss,
            datasets: [{
                data: thedata,
                backgroundColor: colors
            }]
        },
        options: {
            title: {
                text: 'Total Sales (Cost + Profit)',
                display: true
            },
            scales: {
                xAxes: [{
                    ticks: {
                        display: false
                    }
                }]
            },
            legend: {
                display: false
            }
        }
    });
}
function profitChart(thedata, labelss, colors) {
    // myChart.clear();
    let myChart = document.getElementById("chart-profit").getContext('2d');
    let chart2 = new Chart(myChart, {
        type: 'bar',
        data: {
            // labels: labels2,
            labels: labelss,
            datasets: [{
                data: thedata,
                backgroundColor: colors
            }]
        },
        options: {
            title: {
                text: 'Total Profit',
                display: true
            },
            scales: {
                xAxes: [{
                    ticks: {
                        display: false
                    }
                }]
            },
            legend: {
                display: false
            }
        }
    });
}

