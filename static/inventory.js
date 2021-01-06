

//Event Listners

var nothing = document.getElementById('nothing');


//GET AJAX REQUEST (ALl Inventory data) for inventory
//Load Inventory

var theInventory;

var xmlObj = new XMLHttpRequest();
xmlObj.open('get', 'incInventory', true);
xmlObj.send();
xmlObj.onload = function () {
    if (this.status === 200) {
        theInventory = JSON.parse(this.responseText);
        console.trace(theInventory);
        if (theInventory.length) {
            createDataTable(theInventory);
        }

    }
}


//Table creation

// var inventoryTable = document.getElementById('inventoryTable');

var data = [];
var newTable;
function createDataTable(arraysOfArrays) {

    let tableElement = document.createElement('table');
    tableElement.id = 'inventoryTable';
    tableElement.classList = 'scrollit';
    document.getElementById('main-article').appendChild(tableElement);
    var row;
    newTable = document.getElementById('inventoryTable');
    //Inserting New Row
    for (let i = 0; i < arraysOfArrays.length; i++) {
        row = newTable.insertRow();
        for (let j = 0; j < 11; j++)
            row.insertCell();
    }
    // }
    //Inserting New Row
    // row = newTable.insertRow();
    // for (let j = 0; j < 10; j++)
    //     row.insertCell();
    //creating table head
    var tablehead = newTable.createTHead();
    row = tablehead.insertRow();
    for (let i = 0; i < 11; i++)
        row.append(document.createElement('th'));
    tablehead.rows[0].cells[0].innerHTML = `<input type="checkbox" id='prod-all'>`;
    tablehead.rows[0].cells[1].innerHTML = "Product";
    tablehead.rows[0].cells[2].innerHTML = "SKU";
    tablehead.rows[0].cells[3].innerHTML = "Cost";
    tablehead.rows[0].cells[4].innerHTML = "Price";
    tablehead.rows[0].cells[5].innerHTML = "Stock";
    tablehead.rows[0].cells[6].innerHTML = "Low";
    tablehead.rows[0].cells[7].innerHTML = "Status";
    tablehead.rows[0].cells[8].innerHTML = "Created On";
    tablehead.rows[0].cells[9].innerHTML = "Last Updated";
    tablehead.rows[0].cells[10].innerHTML = "Actions";

    var data;
    //populating the table
    for (let i = 0; i < arraysOfArrays.length; i++) {
        //populating New Row
        console.log('its poplationing');
        data = arraysOfArrays[i];
        console.log(data);
        data[0] = `<input type="checkbox" id='prod-${data[0]}'>`;
        // newTable.rows[i + 1].cells[0].innerHTML = data[0];
        data[10] = `<div><button class="actions-btn">&#927;&#927;&#927;</button> </div>`;
        for (let j = 0; j < 11; j++)
            newTable.rows[i + 1].cells[j].innerHTML = data[j];
        data = [];
    }
    nothing.style.display = 'none';
}

