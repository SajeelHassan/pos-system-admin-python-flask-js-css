
var today = document.getElementById('reports-today');
var yesterday = document.getElementById('reports-yesterday');
var lastmonth = document.getElementById('reports-month');
var reportsAll = document.getElementById('reports-all');

// Event listeners

// month.addEventListener('click', monthReports());

//GET AJAX REQUEST (ALl ProductsSold data) for ProductsSold
//Load ProductsSold
var theProductsSold;

var xmlObj = new XMLHttpRequest();
xmlObj.open('get', '/incProductsSold', true);
xmlObj.send();
xmlObj.onreadystatechange = function () {
    if (this.readyState == 4 && this.status === 200) {
        // console.log(this.responseText);
        theProductsSold = JSON.parse(this.responseText);
        xmlObj.abort();
        // console.trace(theProductsSold);
        // console.log();
        // console.log(theProductsSold[0][3]);
        if (theProductsSold.length) {
            let todayProds = getTodayProds(theProductsSold);
            // console.log(todayProds);
            createProductsSoldTable(todayProds);
            today.addEventListener('click', todayReports);
            yesterday.addEventListener('click', yestReports);
            reportsAll.addEventListener('click', allReports);
        }

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
        // console.trace(theProductsSold);
        // console.log();
        // console.log(theProductsSold[0][3]);
        if (monthProductsSold.length) {
            lastmonth.addEventListener('click', monthReport);
        }

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
function isToday(date) {
    const today = new Date()
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear() && date.getDate() !== today.getDate() - 1;
}
function isYesterday(date) {
    const today = new Date()
    return date.getDate() === today.getDate() - 1 && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
}


function todayReports(e) {
    deleteProductsSoldTable();
    let todayProds = getTodayProds(theProductsSold);
    createProductsSoldTable(todayProds);
    e.preventDefault();
}
function yestReports(e) {
    deleteProductsSoldTable();
    let yestProds = getYestProds(theProductsSold);
    createProductsSoldTable(yestProds);
    e.preventDefault();
}
function monthReport(e) {
    deleteProductsSoldTable();
    lastmonth.classList.add('active-btn');
    createProductsSoldTable(monthProductsSold);
    e.preventDefault();
}
function allReports() {
    deleteProductsSoldTable();
    reportsAll.classList.add('active-btn');
    createProductsSoldTable(theProductsSold);
    e.preventDefault();
}
function getTodayProds(theProductSold) {
    var todayProducts = [];
    theProductSold.forEach(soldProd => {
        let gD = new Date(soldProd[7]);
        if (isToday(gD)) {
            todayProducts.push(soldProd);
        }

    });
    today.classList.add('active-btn');
    return todayProducts;
}
function getYestProds(theProductSold) {
    let yestProducts = [];
    theProductSold.forEach(soldProd => {
        let gD = new Date(soldProd[7]);
        if (isYesterday(gD)) {
            yestProducts.push(soldProd);
        }

    });
    yesterday.classList.add('active-btn');
    return yestProducts;
}



//charts

function updateCharts(thedata) {
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
        profitdata.push((data.price - data.cost) * data.qty)

        labels.push(data.title);
        colors.push('#' + Math.floor(Math.random() * 16777215).toString(15));
    });

    saleChart(saledata, labels, colors);
    numChart(numdata, labels, colors);
    profitChart(profitdata, labels, colors);



}

function numChart(thedata, labelss, colors) {
    // myChart.destroy();
    let myChart = document.getElementById("chart-count-sales").getContext('2d');
    let chart2 = new Chart(myChart, {
        type: 'bar',
        data: {
            labels: labelss,
            datasets: [{
                barPercentage: 0.0,
                // barThickness: 6,
                maxBarThickness: 3,
                minBarLength: 2,
                data: thedata,
                // labels: labelss,
                backgroundColor: colors
            }]
        },
        options: {
            title: {
                text: 'Hello',
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
                text: 'Hello',
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
                text: 'Hello',
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


