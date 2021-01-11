

var availableInventory;
var nothing = document.getElementById('nothing-search');

var getInventoryXML = new XMLHttpRequest();
getInventoryXML.open('get', '/incAvailableInventory', true);
getInventoryXML.onload = function () {
    if (this.status === 200) {
        availableInventory = JSON.parse(this.responseText);
        // xmlObj.abort();
        console.trace(availableInventory);
    }
}
getInventoryXML.send();
var availableCustomer;
var getCustomerXML = new XMLHttpRequest();
getCustomerXML.open('get', '/incAvailableCustomer', true);
getCustomerXML.onload = function () {
    if (this.status === 200) {
        availableCustomer = JSON.parse(this.responseText);
        // xmlObj.abort();
        console.trace(availableCustomer);
        loadCustomers();
    }
}
getCustomerXML.send();

function loadCustomers() {
    let customerSelect = document.getElementById('select-existing-customers');
    let newoption;
    for (let i = 0; i < availableCustomer.length; i++) {
        newoption = document.createElement('option');
        newoption.id = `order-cust-${availableCustomer[i][0]}`;
        newoption.innerHTML = `${availableCustomer[i][1]} ${availableCustomer[i][2]} - ${availableCustomer[i][0]}`;
        customerSelect.appendChild(newoption);
    }

}
function customerSelected(e) {
    let order_cust_id = (e.target.options[e.target.selectedIndex].id).substring(11);
    order_cust_id = Number(order_cust_id);
    console.log(typeof (order_cust_id));
    e.preventDefault();
}

//Search input Event Listener
var searchElement = document.getElementById("search-sell-inventory");
searchElement.addEventListener("input", searchNow);
var key, lowerTitle;
var foundProducts = [];
function searchNow(e) {
    key = searchElement.value;
    foundProducts = [];
    if (key != "") {
        // key = key.toLowerCase();
        for (let i = 0; i < availableInventory.length; i++) {
            title = availableInventory[i][1];
            lowerTitle = availableInventory[i][1].toLowerCase();
            if (title.indexOf(key) != -1 || lowerTitle.indexOf(key) != -1) {
                foundProducts.push(availableInventory[i]);
            }

        }

    }

    createResultTable(foundProducts);
}
function createResultTable(foundArray) {
    if (foundArray.length >= 1) {
        removeResultTable();
        nothing.style.display = 'none';
        let resultTabElement = document.createElement('table');
        resultTabElement.id = 'resultTable';
        document.getElementById('search-available-products').append(resultTabElement);
        let row;
        let resultTable = document.getElementById('resultTable');
        //Inserting New Row
        for (let i = 0; i < foundArray.length; i++) {
            row = resultTable.insertRow();
            for (let j = 0; j < 4; j++)
                row.insertCell();

        }

        //creating table head 
        var tablehead = resultTable.createTHead();
        row = tablehead.insertRow();
        //Change this section
        for (let i = 0; i < 4; i++)
            row.append(document.createElement('th'));
        tablehead.rows[0].cells[0].innerText = "Name";
        tablehead.rows[0].cells[1].innerText = "Stock Available";
        tablehead.rows[0].cells[2].innerText = "Price";
        tablehead.rows[0].cells[3].innerText = "Action";

        var data = [];
        // populating the table
        for (let i = 0; i < foundArray.length; i++) {
            //Change this section
            foundArray[i][4] = `<button id = 'add-${foundArray[i][0]}' onclick = 'addToOrder(event)' > Add to Order</button>`

            if (foundArray[i][2] == 0) {
                foundArray[i][4] = `<button disabled> Add to Order</button> `
            }
            data = [foundArray[i][1], foundArray[i][2], foundArray[i][3], foundArray[i][4]];
            for (let j = 0; j < 4; j++)
                resultTable.rows[i + 1].cells[j].innerHTML = data[j];
            data = [];
        }
    }
    else {
        removeResultTable();
    }
}
function removeResultTable() {

    if (document.getElementById('resultTable')) {
        document.getElementById('resultTable').remove();
        nothing.style.display = 'block';
    }
}


// Add to current order

function addToOrder(event) {
    let cart_prod_id = event.target.id;
    cart_prod_id = cart_prod_id.substring(4);
    cart_prod_id = Number(cart_prod_id);
    for (let i = 0; i < foundProducts.length; i++) {
        if (cart_prod_id == foundProducts[i][0]) {
            foundProducts[i][2] = foundProducts[i][2] - 1;
            let resultTable = document.getElementById('resultTable');
            resultTable.rows[i + 1].cells[1].innerHTML = foundProducts[i][2];
            if (foundProducts[i][2] == 0) {
                document.getElementById(event.target.id).disabled = true;

            }
            break;
        }
    }

    console.log(resultTable);
    event.preventDefault();
}
function updateRunningStock() {

}