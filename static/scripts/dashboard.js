//all products
var topProductsSold;
var xmlObj = new XMLHttpRequest();
xmlObj.open('get', '/inctopProductsSold', true);
xmlObj.send();
xmlObj.onreadystatechange = function () {
    if (this.readyState == 4 && this.status === 200) {
        topProductsSold = JSON.parse(this.responseText);
        xmlObj.abort();
        console.log(topProductsSold);
        createProductsSoldTable(topProductsSold);


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
    tableElement.id = 'topproductsSoldTable';
    // tableElement.classList = 'scrollableDiv';
    document.getElementById('top-sold-div').appendChild(tableElement);
    var t_cols = 3;
    var row;
    newTable = document.getElementById('topproductsSoldTable');
    //Inserting New Row
    for (let i = 0; i < result.length; i++) {
        row = newTable.insertRow();
        for (let j = 0; j < t_cols; j++)
            row.insertCell();
    }
    //creating table head
    var tablehead = newTable.createTHead();
    row = tablehead.insertRow();
    let ths = ["Product", "Sold", "Total"];
    for (let i = 0; i < t_cols; i++)
        row.append(document.createElement('th'));
    for (let i = 0; i < t_cols; i++)
        tablehead.rows[0].cells[i].innerHTML = ths[i];

    // console.log(result[0].title);
    var data = [];
    //populating the table
    for (let i = 0; i < result.length; i++) {
        //populating New Row
        data[0] = result[i].title;
        data[1] = result[i].qty;
        data[2] = new Intl.NumberFormat('en-IN').format(result[i].total_price);
        data[2] = data[2] + ' Rs.';
        console.log(data);
        for (let j = 0; j < t_cols; j++)
            newTable.rows[i + 1].cells[j].innerHTML = data[j];
        data = [];
    }
    updateStats(result);
}
function sortBySold(prods) {
    for (let i = 0; i < prods.length; i++) {
        for (let j = 0; j < prods.length; j++) {


        }

    }
}

function updateStats(thedata) {
    let sumProfit, sumSales, sumQty;
    sumProfit = 0, sumQty = 0, sumSales = 0;
    thedata.forEach(data => {
        sumSales += data.total_price;
        sumQty += data.qty;
        let profit = (data.price - data.cost) * data.qty;
        sumProfit += profit;

    });
    sumQty = new Intl.NumberFormat('en-IN').format(sumQty);
    sumSales = new Intl.NumberFormat('en-IN').format(sumSales);
    sumProfit = new Intl.NumberFormat('en-IN').format(sumProfit);
    document.getElementById('s-sales').innerText = sumSales + ' Rs';
    document.getElementById('s-profit').innerText = sumProfit + ' Rs.';
    document.getElementById('s-sold').innerText = sumQty;
}