

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

var recentReceipts;
var recentReceiptsXML = new XMLHttpRequest();
recentReceiptsXML.open('get', '/incRecentReceipts', true);
recentReceiptsXML.onload = function () {
    if (this.status === 200) {
        recentReceipts = JSON.parse(this.responseText);
        // xmlObj.abort();
        console.trace(recentReceipts);
        createRecentReceipts(recentReceipts);
    }
}
recentReceiptsXML.send();
var nothingRecent = document.getElementById('nothingrecent');
function createRecentReceipts(foundArray) {
    if (foundArray.length >= 1) {
        nothingRecent.style.display = 'none';
        let resultTabElement = document.createElement('table');
        resultTabElement.id = 'recentTable';
        document.getElementById('last-receipts-by-emp').appendChild(resultTabElement);
        let row;
        let recentTable = document.getElementById('recentTable');
        //Inserting New Row
        for (let i = 0; i < foundArray.length; i++) {
            row = recentTable.insertRow();
            for (let j = 0; j < 3; j++)
                row.insertCell();

        }

        //creating table head 
        let tableheadrecent = recentTable.createTHead();
        row = tableheadrecent.insertRow();
        //Change this section
        for (let i = 0; i < 3; i++)
            row.append(document.createElement('th'));
        tableheadrecent.rows[0].cells[0].innerText = "Id";
        tableheadrecent.rows[0].cells[1].innerText = "Status";
        tableheadrecent.rows[0].cells[2].innerText = "Action";

        let data = [];
        // populating the table
        for (let i = 0; i < foundArray.length; i++) {
            //Change this section

            data = [foundArray[i][0], foundArray[i][8], `<button id = 'view-${foundArray[i][0]}' onclick = 'viewRecentReceipt(event)' >View</button>`];
            for (let j = 0; j < 3; j++)
                recentTable.rows[i + 1].cells[j].innerHTML = data[j];
            data = [];
        }
    }
}

function viewRecentReceipt(event) {
    let recentId = event.target.id;
    recentId = recentId.substring(5);
    recentId = Number(recentId);
    window.open(`/printReceipt/${recentId}`, '_Blank');
    event.preventDefault();
}
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
var selectCustomer = document.getElementById('select-existing-customers');
var selected_cust_id = 0;
selectCustomer.addEventListener('change', customerSelected);
function customerSelected(e) {
    let order_cust_id = (e.target.options[e.target.selectedIndex].id).substring(11);
    // console.log('customerSelected(e)=>> ', e.target);
    // console.log('customerSelected(e)=>> ', order_cust_id);
    order_cust_id = Number(order_cust_id);
    selected_cust_id = order_cust_id;
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
        document.getElementById('theFoundTableDiv').appendChild(resultTabElement);
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
var currentOrderProds = [];
var currentOrderSingleProd = {
    current_prod_id: 89,
    prod_title: "Biscuit",
    prod_price: 200,
    prod_qty: 1,
    prod_priceXqty: 200
};
var nothingCart = document.getElementById('nothing-cart');
function addToOrder(event) {
    // nothingCart.style.display = 'none';
    let cart_prod_id = event.target.id;
    cart_prod_id = cart_prod_id.substring(4);
    cart_prod_id = Number(cart_prod_id);
    updateRunningStock(cart_prod_id, event.target.id);
    // for (let i = 0; i < foundProducts.length; i++) {
    //     if (cart_prod_id == foundProducts[i][0]) {
    //         foundProducts[i][2] = foundProducts[i][2] - 1;
    //         let resultTable = document.getElementById('resultTable');
    //         resultTable.rows[i + 1].cells[1].innerHTML = foundProducts[i][2];
    //         if (foundProducts[i][2] == 0) {
    //             document.getElementById(event.target.id).disabled = true;
    //         }
    //         updateQty(cart_prod_id);
    //         creatCartTable(currentOrderProds);
    //         break;
    //     }
    // }

    // console.log(resultTable);
    event.preventDefault();
}
function updateRunningStock(cart_prod_id, event_target_id) {
    // console.log('its worrking');
    for (let i = 0; i < foundProducts.length; i++) {
        if (cart_prod_id == foundProducts[i][0]) {
            foundProducts[i][2] = foundProducts[i][2] - 1;
            let resultTable = document.getElementById('resultTable');
            resultTable.rows[i + 1].cells[1].innerHTML = foundProducts[i][2];
            if (foundProducts[i][2] == 0) {
                document.getElementById(event_target_id).disabled = true;
            }
            if (updateQty(cart_prod_id) == false) {
                currentOrderSingleProd = {
                    current_prod_id: cart_prod_id,
                    prod_title: foundProducts[i][1],
                    prod_price: foundProducts[i][3],
                    prod_qty: 1,
                    prod_priceXqty: foundProducts[i][3]
                };
                currentOrderProds.push(currentOrderSingleProd);
                currentOrderSingleProd = {};

            }

            removeCartTable();
            createCartTable(currentOrderProds);
            break;
        }
    }
}

function updateQty(id) {
    for (let i = 0; i < currentOrderProds.length; i++) {
        if (currentOrderProds[i].current_prod_id === id) {
            currentOrderProds[i].prod_qty += 1;
            currentOrderProds[i].prod_priceXqty = currentOrderProds[i].prod_qty * currentOrderProds[i].prod_price;
            return true;
        }
    }
    return false;
}
var saveNprntbtn = document.getElementById('save-print-btn');
var disocuntInput = document.getElementById('current-order-add-discount');
function createCartTable(currentOrderProds) {
    if (currentOrderProds.length >= 1) {
        // nothing.style.display = 'none';
        nothingCart.style.display = 'none';
        saveNprntbtn.disabled = false;
        saveNprntbtn.addEventListener('click', saveNPrint);
        disocuntInput.disabled = false;
        disocuntInput.addEventListener('input', updateTotalBill);
        var tableElement_cart = document.createElement('table');
        tableElement_cart.id = 'current-order-box-table';
        document.getElementById('theCartTable').appendChild(tableElement_cart);
        var row_cart;
        var resultTabElement_cart = document.getElementById('current-order-box-table');
        //Inserting New Row
        for (let i = 0; i < currentOrderProds.length; i++) {
            row_cart = resultTabElement_cart.insertRow();
            for (let j = 0; j < 6; j++)
                row_cart.insertCell();
        }
        //creating table head 
        var tablehead_cart = resultTabElement_cart.createTHead();
        row_cart = tablehead_cart.insertRow();
        for (let i = 0; i < 6; i++)
            row_cart.append(document.createElement('th'));
        tablehead_cart.rows[0].cells[0].innerText = "#";
        tablehead_cart.rows[0].cells[1].innerText = "Name";
        tablehead_cart.rows[0].cells[2].innerText = "Price";
        tablehead_cart.rows[0].cells[3].innerText = "Qty";
        tablehead_cart.rows[0].cells[4].innerText = "Total";
        tablehead_cart.rows[0].cells[5].innerText = "Remove";

        let data_cart = [];
        // populating the table
        for (let i = 0; i < currentOrderProds.length; i++) {
            //Change this section
            let delAction = `<button id = 'cart-${currentOrderProds[i].current_prod_id}' onclick = 'removeCartProd(event)'>Remove</button>`
            let qty = `<input type="number" value='${currentOrderProds[i].prod_qty}' name="qty" id="qty-${currentOrderProds[i].current_prod_id}" class='current-prod-qty'
            min="0" oninput='currentProdQty(event)'>`;
            data_cart = [i + 1, currentOrderProds[i].prod_title, 'Rs. ' + currentOrderProds[i].prod_price, qty, 'Rs. ' + currentOrderProds[i].prod_priceXqty, delAction];
            // data_cart = [0, 1, 2, 3, 4, 5];

            for (let j = 0; j < 6; j++)
                resultTabElement_cart.rows[i + 1].cells[j].innerHTML = data_cart[j];
            data_cart = [];
        }
        calculateTotals(currentOrderProds);

    }
}
function removeCartTable() {

    if (document.getElementById('current-order-box-table')) {
        document.getElementById('current-order-box-table').remove();
        clearTotals();
        saveNprntbtn.disabled = true;
        nothingCart.style.display = 'block';
        saveNprntbtn.removeEventListener('click', saveNPrint);
        disocuntInput.disabled = true;
        disocuntInput.removeEventListener('input', updateTotalBill);
        // nothing.style.display = 'block';
    }
}
function removeCartProd(event) {
    let id = event.target.id;
    id = id.substring(5);
    id = Number(id);
    var index;
    for (let i = 0; i < currentOrderProds.length; i++) {
        if (currentOrderProds[i].current_prod_id == id) {
            index = currentOrderProds.indexOf(currentOrderProds[i]);
            if (index > -1) {
                for (let j = 0; j < foundProducts.length; j++) {
                    if (id == foundProducts[j][0]) {
                        if (foundProducts[j][2] == 0) {
                            let xmlString = foundProducts[j][4];
                            let doc = new DOMParser().parseFromString(xmlString, "text/xml");
                            document.getElementById(doc.firstChild.id).disabled = false;
                        }
                        foundProducts[j][2] = foundProducts[j][2] + currentOrderProds[i].prod_qty;
                        let resultTable = document.getElementById('resultTable');
                        resultTable.rows[j + 1].cells[1].innerHTML = foundProducts[j][2];

                    }
                }
                currentOrderProds.splice(index, 1);
                removeCartTable();
                createCartTable(currentOrderProds);
            }
        }

    }


    event.preventDefault();
}


var subtotal, discount, total;
function calculateTotals(currentOrderProds) {
    let subtotal_text = document.getElementById('subTotal-text');
    let discount_text = document.getElementById('current-order-add-discount');
    let totalbill_text = document.getElementById('order-total-text');
    // let status_text = document.getElementById('status-text');

    subtotal = 0, discount = 0, total = 0;
    for (let i = 0; i < currentOrderProds.length; i++)
        subtotal += currentOrderProds[i].prod_priceXqty;
    discount = Number(getDiscount());
    console.log(discount, 'The discount');
    total = subtotal - discount;
    console.log(total, 'The total after discount');
    subtotal_text.innerText = subtotal + ' Rs.';
    totalbill_text.innerText = total + ' Rupees';

}

function clearTotals() {

    let subtotal_text = document.getElementById('subTotal-text');
    let totalbill_text = document.getElementById('order-total-text');
    let discount_text = document.getElementById('current-order-add-discount');
    subtotal_text.innerText = '';
    discount_text.value = 0;
    totalbill_text.innerText = '';
}

function getDiscount() {
    let discount_text = document.getElementById('current-order-add-discount');
    console.log('getDiscount FN : ', discount_text);
    return discount_text.value;
}
function updateTotalBill(e) {
    let subtotal_text = document.getElementById('subTotal-text');
    let totalbill_update = document.getElementById('order-total-text');
    let discount_text = document.getElementById('current-order-add-discount');
    totalbill_update.innerText = subtotal + ' Rupees';
    totalbill_update.innerText = subtotal - e.target.value;
    totalbill_update.innerText += ' Rupees';
    discount_text.value = e.target.value;
    e.preventDefault();
}
function currentProdQty(event) {
    let qty_prod_id = event.target.id;
    console.log(event.target.value);
    qty_prod_id = qty_prod_id.substring(4);
    qty_prod_id = Number(qty_prod_id);
    for (let i = 0; i < currentOrderProds.length; i++) {
        if (currentOrderProds[i].current_prod_id === qty_prod_id) {
            currentOrderProds[i].prod_qty = Number(event.target.value);
            currentOrderProds[i].prod_priceXqty = currentOrderProds[i].prod_qty * currentOrderProds[i].prod_price;
            removeCartTable();
            createCartTable(currentOrderProds);
        }
    }

    event.preventDefault();
}
function paidORunpaid(event) {
    var x = document.getElementById("status-text");
    if (x.innerText === "Unpaid") {
        x.innerHTML = "<h2 >Paid</h2>";
    } else {
        x.innerHTML = "<h2 >Unpaid</h2>";
    }
    event.preventDefault();
}

function saveNPrint(e) {

    let saveNPrintXML = new XMLHttpRequest();
    saveNPrintXML.open('post', '/incSavereceiptdata', true);
    let custid = selected_cust_id;
    let statuss = document.getElementById("status-text").innerText;
    let disc = getDiscount();
    let data = {
        'orderProducts': currentOrderProds,
        'cust_id': custid,
        'subtotal': subtotal,
        'discount': disc,
        'total': subtotal - disc,
        'status': statuss
    };
    saveNPrintXML.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == 'INVALID') {
                let msgP = document.getElementById('errorMsg-selling');
                msgP.innerText = 'Error! Server Problem';
                let msgBlock = document.getElementById('message-block-selling');
                msgBlock.style.display = 'block';
                setTimeout(function () {
                    msgBlock.style.display = 'none';
                }, 3000);
            }
            else {
                saveNprntbtn.disabled = true;
                saveNprntbtn.removeEventListener('click', saveNPrint);
                console.log('ordID got: ', this.responseText);
                let ordId = JSON.parse(this.responseText);
                console.log('ordID Parsed: ', ordId);
                // console.log(this.responseText);
                let msgP = document.getElementById('successMsg-emp');
                msgP.innerText = 'Order Completed! Creating Receipt.....';
                let msgBlock = document.getElementById('message-block-success-emp');
                msgBlock.style.display = 'block';
                setTimeout(function () {
                    msgBlock.style.display = 'none';
                    window.open(`/printReceipt/${ordId}`, '_Blank');
                    location.reload();
                }, 3000);
            }
        }
    };
    saveNPrintXML.setRequestHeader("content-Type", "application/json");
    data = JSON.stringify(data);
    saveNPrintXML.send(data);


    e.preventDefault();
}
