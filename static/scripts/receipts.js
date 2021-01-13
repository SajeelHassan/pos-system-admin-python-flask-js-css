//grabbing elements
var nothing = document.getElementById('nothing-receipts');
//GET AJAX REQUEST (ALl Inventory data) for inventory
//Load Inventory
var allReceipts;
var xmlObj = new XMLHttpRequest();
xmlObj.open('get', '/incReceipts', true);
xmlObj.send();
xmlObj.onreadystatechange = function () {
    if (this.readyState == 4 && this.status === 200) {
        allReceipts = JSON.parse(this.responseText);
        xmlObj.abort();
        console.trace(allReceipts);
        if (allReceipts.length) {
            nothing.style.display = 'none';
            createReceiptsTable(allReceipts);
        }

    }
}
// Main Table Creation
var data = [];
var newTable;
function createReceiptsTable(arraysOfArrays) {
    var t_cols = 8;
    let tableElement = document.createElement('table');
    tableElement.id = 'table-main-receipts';

    document.getElementById('receipts-table-div').appendChild(tableElement);
    var row;
    newTable = document.getElementById('table-main-receipts');
    //Inserting New Row
    for (let i = 0; i < arraysOfArrays.length; i++) {
        row = newTable.insertRow();
        for (let j = 0; j < t_cols; j++)
            row.insertCell();
    }
    //creating table head
    var tablehead = newTable.createTHead();
    // tablehead.classList.add("sticky");
    row = tablehead.insertRow();
    let ths = ["Order Id", "Datetime", "Amount", "Sold by", "Sold to", "Status", "Action", "Manage"]
    for (let i = 0; i < t_cols; i++)
        row.append(document.createElement('th'));
    for (let i = 0; i < t_cols; i++)
        tablehead.rows[0].cells[i].innerHTML = ths[i];

    var data;
    //populating the table
    for (let i = 0; i < arraysOfArrays.length; i++) {
        //populating New Row
        data = []
        data[0] = arraysOfArrays[i][0];
        data[1] = arraysOfArrays[i][9];
        data[2] = "Rs. " + arraysOfArrays[i][5];
        data[3] = arraysOfArrays[i][6];
        data[4] = arraysOfArrays[i][7];
        data[5] = arraysOfArrays[i][8];
        // data[0] = `<input type="checkbox" >`;
        // newTable.rows[i + 1].cells[0].innerHTML = data[0];
        data[t_cols - 2] = `<a id="receipt-detail-${data[0]}" onclick="viewReceipt(event)">View</a>`;
        data[t_cols - 1] = `<div class="actions manage" id="receipt-manage-${data[0]}"><span class='update-btn' onclick="updateModal(event)">&#9998;</span><span class='delete-btn' onclick="deleteModal(event)">&#10008;</span></div>`;

        for (let j = 0; j < t_cols; j++)
            newTable.rows[i + 1].cells[j].innerHTML = data[j];
    }

}

function viewReceipt(event) {
    let receiptId = event.target.id;
    receiptId = receiptId.substring(15);
    receiptId = Number(receiptId);
    window.open(`/viewReceipt/${receiptId}`, '_Blank');
    event.preventDefault();
}

