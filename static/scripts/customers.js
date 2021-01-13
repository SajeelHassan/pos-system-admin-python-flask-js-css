//grabbing elements
var nothing = document.getElementById('nothing-customers');
//GET AJAX REQUEST (ALl Inventory data) for inventory
//Load Inventory
var allCustomers;
var xmlObj = new XMLHttpRequest();
xmlObj.open('get', '/incCustomers', true);
xmlObj.send();
xmlObj.onreadystatechange = function () {
    if (this.readyState == 4 && this.status === 200) {
        allCustomers = JSON.parse(this.responseText);
        xmlObj.abort();
        // console.trace(allCustomers);
        if (allCustomers.length) {
            createDataTable(allCustomers);
        }

    }
}
// Main Table Creation
var data = [];
var newTable;
function createDataTable(arraysOfArrays) {
    var t_cols = 8;
    let tableElement = document.createElement('table');
    tableElement.id = 'table-main-customers';

    document.getElementById('main-article-customers').appendChild(tableElement);
    var row;
    newTable = document.getElementById('table-main-customers');
    //Inserting New Row
    for (let i = 0; i < arraysOfArrays.length; i++) {
        row = newTable.insertRow();
        for (let j = 0; j < t_cols; j++)
            row.insertCell();
    }
    //creating table head
    var tablehead = newTable.createTHead();
    row = tablehead.insertRow();
    let ths = ['Sr.', "firstname", "Created On", "Email", "Phone", "Total Orders", "Orders Detail", "Manage"]
    for (let i = 0; i < t_cols; i++)
        row.append(document.createElement('th'));
    for (let i = 0; i < t_cols; i++)
        tablehead.rows[0].cells[i].innerHTML = ths[i];

    var data;
    //populating the table
    for (let i = 0; i < arraysOfArrays.length; i++) {
        //populating New Row
        data = []
        data[0] = i + 1;
        data[1] = arraysOfArrays[i][1] + " " + arraysOfArrays[i][2];
        data[2] = arraysOfArrays[i][3];
        data[3] = arraysOfArrays[i][4];
        data[4] = arraysOfArrays[i][5];
        data[5] = arraysOfArrays[i][6];
        // data[0] = `<input type="checkbox" >`;
        // newTable.rows[i + 1].cells[0].innerHTML = data[0];
        data[t_cols - 2] = `<a href="#" id="cust-detail-${data[0]}">View</a>`;
        data[t_cols - 1] = `<div class="actions manage" id="cust-manage-${data[0]}"><span class='update-btn' onclick="updateModal(event)">&#9998;</span><span class='delete-btn' onclick="deleteModal(event)">&#10008;</span></div>`;

        for (let j = 0; j < t_cols; j++)
            newTable.rows[i + 1].cells[j].innerHTML = data[j];
        data = [];
    }
    nothing.style.display = 'none';
}
