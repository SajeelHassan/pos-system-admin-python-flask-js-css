

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
        xmlObj.abort();
        // console.trace(theInventory);
        if (theInventory.length) {
            createDataTable(theInventory);
        }

    }
}

//sidebar Requesting
var sidebar = document.getElementById

//sidebar Requested

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
    //creating table head
    var tablehead = newTable.createTHead();
    row = tablehead.insertRow();
    for (let i = 0; i < 11; i++)
        row.append(document.createElement('th'));
    tablehead.rows[0].cells[0].innerHTML = `Sr.`;
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

        data = arraysOfArrays[i];

        // data[0] = `<input type="checkbox" >`;
        // newTable.rows[i + 1].cells[0].innerHTML = data[0];

        data[10] = `<div class="actions" id="prod-${data[0]}">
        <span class='update-btn' onclick="updateModal(event)">&#9998;</span>
        <span class='delete-btn' onclick="deleteModal(event)">&#10008;</span>
    
    </div>`;
        data[0] = i + 1;
        for (let j = 0; j < 11; j++)
            newTable.rows[i + 1].cells[j].innerHTML = data[j];
        data = [];
    }
    nothing.style.display = 'none';
}



//ADD Product Modal

// Get the modal
var modal = document.getElementById("myModal-addproductform");

// Get the button that opens the modal
var btn = document.getElementsByClassName('add-product');
btn[0].addEventListener('click', showmodal);
btn[1].addEventListener('click', showmodal);
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
function showmodal(e) {
    modal.style.display = "block";
    e.preventDefault();
}

// When the user clicks on <span> (x), close the modal
span.onclick = function (e) {
    modal.style.display = "none";
    e.preventDefault();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    event.preventDefault();
}


// Add product
var submitAddprod = document.getElementById('prod-submit');
submitAddprod.addEventListener('click', prodSubmit);


function prodSubmit(e) {
    let title = document.getElementById('prod-title');
    let sku = document.getElementById('prod-sku');
    let cost = document.getElementById('prod-cost');
    let price = document.getElementById('prod-price');
    let stock = document.getElementById('prod-stock');
    let low = document.getElementById('prod-low');
    if (isEmpty([title.value, sku.value, cost.value, price.value, stock.value, low.value]) != true) {
        let msgBlock = document.getElementById('form-alert-error');
        msgBlock.style.display = 'block';
        msgBlock.innerHTML = "<div><h2>Empty Field/Feilds!</h2> </div>;"
        setTimeout(function () {
            msgBlock.style.display = 'none';
        }, 3000);
    }
    else if (isValid([cost.value, price.value, stock.value, low.value]) != true) {
        let msgBlock = document.getElementById('form-alert-error');
        msgBlock.style.display = 'block';
        msgBlock.innerHTML = "<div><h2>Invalid Numbers</h2> </div>;"
        setTimeout(function () {
            msgBlock.style.display = 'none';
        }, 3000);
    }
    else {
        var data = {
            "title": `${title.value}`,
            "sku": `${sku.value}`,
            "cost": `${cost.value}`,
            "price": `${price.value}`,
            "stock": `${stock.value}`,
            "low": `${low.value}`
        }
        var jsonString = JSON.stringify(data);
        var xmlObj2 = new XMLHttpRequest();
        xmlObj2.open('post', 'incAddproduct', true);
        xmlObj2.onreadystatechange = function () {
            if (this.readyState == 4 && this.status === 200) {
                if (this.responseText != 'true') {
                    let msgBlock = document.getElementById('page-alert');
                    let msgBlock2 = document.getElementById('page-alert-error');
                    msgBlock.style.display = 'block';
                    msgBlock2.style.display = 'block';
                    msgBlock2.innerHTML = `<div><h2>${this.responseText}</h2> </div>`;
                    setTimeout(function () {
                        msgBlock.style.display = 'none';
                        msgBlock2.style.display = 'none';
                    }, 3000);
                }
                else {
                    let msgBlock = document.getElementById('page-alert');
                    let msgBlock2 = document.getElementById('page-alert-success');
                    msgBlock.style.display = 'block';
                    msgBlock2.style.display = 'block';
                    msgBlock2.innerHTML = `<div><h2>Product Added!</h2> </div>`;
                    setTimeout(function () {
                        msgBlock.style.display = 'none';
                        msgBlock2.style.display = 'none';
                        location.reload();
                    }, 3000);
                }

            }
        }

        xmlObj2.setRequestHeader("content-Type", "application/json");
        xmlObj2.send(jsonString);


        title.value = "";
        sku.value = "";
        cost.value = "";
        price.value = "";
        stock.value = "";
        low.value = "";
        modal.style.display = "none";
        // location.reload();
    }



    e.preventDefault();
}


function updateModal(event) {
    //Update Product Modal
    let upmodal = document.getElementById("myModal-editUpdate");
    upmodal.style.display = "block";
    // Get the modal

    let prod_id = event.target.parentElement.id;
    // Get the <span> element that closes the modal
    getProdData(prod_id);
    let editSubmit = document.getElementById('edit-submit'); editSubmit.addEventListener('click', updateProdSubmit);
    // When the user clicks on the button, open the modal

    let closeModal = document.getElementById('update-modal-close');

    closeModal.addEventListener('click', updatemodalNone);
    // When the user clicks on <span> (x), close the modal
    function updatemodalNone() {
        upmodal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == upmodal) {
            upmodal.style.display = "none";
        }
    }

    console.log('in update Modal ', event.target);
    event.preventDefault();
}

function getProdData(id) {
    console.log('getProdData');
    let getProdXmlObj = new XMLHttpRequest();
    getProdXmlObj.open('post', 'incGetproduct', true);
    let theId = {
        "prod_id": `${id}`
    };
    getProdXmlObj.onreadystatechange = function () {
        if (this.readyState == 4 && this.status === 200) {
            let prodData = JSON.parse(this.responseText);
            getProdXmlObj.abort();
            console.trace(prodData);
            if (prodData.length) {
                putDataInForm(prodData);
            }
            getProdXmlObj.abort();

        }
    };
    let idJsonString = JSON.stringify(theId);
    getProdXmlObj.setRequestHeader("content-Type", "application/json");
    getProdXmlObj.send(idJsonString);
}
var title = document.getElementById('edit-title');
var sku = document.getElementById('edit-sku');
var cost = document.getElementById('edit-cost');
var price = document.getElementById('edit-price');
var stock = document.getElementById('edit-stock');
var low = document.getElementById('edit-low');
var hiddenid = document.getElementById('hiddenprodid');
function putDataInForm(theProd) {
    hiddenid.value = theProd[0];
    title.value = theProd[1];
    sku.value = theProd[2];
    cost.value = theProd[3];
    price.value = theProd[4];
    stock.value = theProd[5];
    low.value = theProd[6];
}
function updateProdSubmit(e) {
    console.log('In updateProdSubmit');
    if (isEmpty([title.value, sku.value, cost.value, price.value, stock.value, low.value]) != true) {
        let msgBlock = document.getElementById('update-form-alert-error');
        msgBlock.style.display = 'block';
        msgBlock.innerHTML = "<div><h2>Empty Field/Feilds!</h2> </div>;"
        setTimeout(function () {
            msgBlock.style.display = 'none';
        }, 3000);
    }
    else if (isValid([cost.value, price.value, stock.value, low.value]) != true) {
        let msgBlock = document.getElementById('update-form-alert-error');
        msgBlock.style.display = 'block';
        msgBlock.innerHTML = "<div><h2>Invalid Numbers</h2> </div>;"
        setTimeout(function () {
            msgBlock.style.display = 'none';
        }, 3000);
    }
    else {
        var data = {
            "title": `${title.value}`,
            "sku": `${sku.value}`,
            "cost": `${cost.value}`,
            "price": `${price.value}`,
            "stock": `${stock.value}`,
            "low": `${low.value}`,
            "id": `${hiddenid.value}`
        }
        console.log('Sending to incUpdateproduct ..', data);
        let updatejsonString = JSON.stringify(data);
        let xmlObjupdate = new XMLHttpRequest();
        xmlObjupdate.open('post', 'incUpdateproduct', true);
        console.log('sending...to incUpdateproduct');
        xmlObjupdate.onreadystatechange = function () {
            if (this.readyState == 4 && this.status === 200) {
                if (this.responseText != 'true') {
                    let msgBlock = document.getElementById('page-alert');
                    let msgBlock2 = document.getElementById('page-alert-error');
                    msgBlock.style.display = 'block';
                    msgBlock2.style.display = 'block';
                    msgBlock2.innerHTML = `<div><h2>${this.responseText}</h2> </div>`;
                    setTimeout(function () {
                        msgBlock.style.display = 'none';
                        msgBlock2.style.display = 'none';
                    }, 3000);
                }
                else {
                    let msgBlock = document.getElementById('page-alert');
                    let msgBlock2 = document.getElementById('page-alert-success');
                    msgBlock.style.display = 'block';
                    msgBlock2.style.display = 'block';
                    msgBlock2.innerHTML = `<div><h2>Product Updated!</h2> </div>`;
                    setTimeout(function () {
                        msgBlock.style.display = 'none';
                        msgBlock2.style.display = 'none';
                        location.reload();
                    }, 3000);
                }

            }
        }

        xmlObjupdate.setRequestHeader("content-Type", "application/json");
        console.log('sending updatejsonString');
        xmlObjupdate.send(updatejsonString);

        document.getElementById('myModal-editUpdate').style.display = "none";
        // location.reload();
        // e.preventDefault();

    }
    e.preventDefault();
}
var titleDis = document.getElementById('delete-title');
var skuDis = document.getElementById('delete-sku');
var costDis = document.getElementById('delete-cost');
var priceDis = document.getElementById('delete-price');
var stockDis = document.getElementById('delete-stock');
var lowDis = document.getElementById('delete-low');
var hiddenidDis = document.getElementById('delete-hiddenprodid');

function getDelProdData(id) {
    console.log('getDelProdData');
    let getDelProdXmlObj = new XMLHttpRequest();
    getDelProdXmlObj.open('post', 'incGetDelproduct', true);
    let theId = {
        "prod_id": `${id}`
    };
    getDelProdXmlObj.onreadystatechange = function () {
        if (this.readyState == 4 && this.status === 200) {
            let prodData = JSON.parse(this.responseText);
            getDelProdXmlObj.abort();
            console.trace(prodData);
            if (prodData.length) {
                putDeleteDataInForm(prodData);
            }
            getDelProdXmlObj.abort();

        }
    };
    let idJsonString = JSON.stringify(theId);
    getDelProdXmlObj.setRequestHeader("content-Type", "application/json");
    getDelProdXmlObj.send(idJsonString);
}

function putDeleteDataInForm(theProd) {
    hiddenidDis.value = theProd[0];
    titleDis.value = theProd[1];
    skuDis.value = theProd[2];
    costDis.value = theProd[3];
    priceDis.value = theProd[4];
    stockDis.value = theProd[5];
    lowDis.value = theProd[6];
}

function deleteModal(event) {
    //Delete Product Modal

    // Get the modal
    var delmodal = document.getElementById("myModal-delete");
    delmodal.style.display = "block";
    let prod_id = event.target.parentElement.id;
    let closeModal = document.getElementById('delete-modal-close');

    closeModal.addEventListener('click', deletemodalNone);

    getDelProdData(prod_id);
    let deleteConfirm = document.getElementById('delete-confirm'); deleteConfirm.addEventListener('click', confirmDelete);

    function deletemodalNone() {
        delmodal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == delmodal) {
            delmodal.style.display = "none";
        }
    }

    console.log('in del Modal ', event.target);
    event.preventDefault();
}

function confirmDelete(e) {
    var data = {
        "id": `${hiddenidDis.value}`
    }
    console.log('Sending to incdeleteproduct ..', data);
    let deletejsonString = JSON.stringify(data);
    let xmlObjdelete = new XMLHttpRequest();
    xmlObjdelete.open('post', 'incDeleteproduct', true);
    console.log('sending...to incDeleteproduct');
    xmlObjdelete.onreadystatechange = function () {
        if (this.readyState == 4 && this.status === 200) {
            if (this.responseText != 'true') {
                let msgBlock = document.getElementById('page-alert');
                let msgBlock2 = document.getElementById('page-alert-error');
                msgBlock.style.display = 'block';
                msgBlock2.style.display = 'block';
                msgBlock2.innerHTML = `<div><h2>${this.responseText}</h2> </div>`;
                setTimeout(function () {
                    msgBlock.style.display = 'none';
                    msgBlock2.style.display = 'none';
                }, 3000);
            }
            else {
                let msgBlock = document.getElementById('page-alert');
                let msgBlock2 = document.getElementById('page-alert-success');
                msgBlock.style.display = 'block';
                msgBlock2.style.display = 'block';
                msgBlock2.innerHTML = `<div><h2>Product deleted!</h2> </div>`;
                setTimeout(function () {
                    msgBlock.style.display = 'none';
                    msgBlock2.style.display = 'none';
                    location.reload();
                }, 3000);
            }

        }
    }

    xmlObjdelete.setRequestHeader("content-Type", "application/json");
    console.log('sending deletejsonString');
    xmlObjdelete.send(deletejsonString);

    document.getElementById('myModal-delete').style.display = "none";
    // location.reload();
    e.preventDefault();
}

function isEmpty(data) {
    if (data[0] == "" || data[1] == '' || data[2] == '' || data[3] == '' || data[4] == '' || data[5] == '') {
        return false
    }
    return true
}
function isValid(data) {
    if (parseFloat(data[0]) < 0 || parseFloat(data[1]) < 0 || parseFloat(data[2]) < 0 || parseFloat(data[3]) < 0) {
        return false;
    }
    else {
        return true
    }
}



//Search Functioning - Inventory


//Search input Event Listener               //search-proto
var searchElement = document.getElementById("inventory-search");
searchElement.addEventListener("input", searchNow);
var foundObjs = [];
var title, sku, cost, price, stock, low, status, created_on, lupdate, key;
var searchData = []
function searchNow(e) {
    key = searchElement.value;
    foundProducts = [];
    if (key != "") {
        key = key.toLowerCase();
        theInventory.forEach(product => {
            for (let j = 1; j < 10; j++) {
                searchData.push(product[j].toLowerCase());
            }
            for (let j = 1; j < 10; j++) {
                if (product[j].indexOf(key) != -1) {
                    foundProducts.push(objArray[i]);
                    break;
                }

            }

        });
    }
    createInventoryResultTable(foundProducts);
}


function createInventoryResultTable(foundArray) {
    if (foundArray.length >= 1) {
        removeInventoryResultTable();
        let resultTabElement = document.createElement('table');
        resultTabElement.id = 'InventoryresultTable';
        document.getElementById('main-article').insertBefore(resultTabElement, document.getElementById('inventoryTable'));
        var row;
        const InventoryresultTable = document.getElementById('InventoryresultTable');
        //Inserting New Row
        for (let i = 0; i < foundArray.length; i++) {
            row = InventoryresultTable.insertRow();
            for (let j = 0; j < 12; j++)
                row.insertCell();

        }

        //creating table head 
        var tablehead = InventoryresultTable.createTHead();
        row = tablehead.insertRow();
        for (let i = 0; i < 12; i++)
            row.append(document.createElement('th'));
        tablehead.rows[0].cells[0].innerText = "Title";
        tablehead.rows[0].cells[1].innerText = "Content";
        tablehead.rows[0].cells[2].innerText = "Author";
        tablehead.rows[0].cells[3].innerText = "DATE";

        var data = [];
        // populating the table
        for (let i = 0; i < foundArray.length; i++) {
            data = [foundArray[i].title, foundArray[i].content, foundArray[i].author, foundArray[i].date];
            for (let j = 0; j < 4; j++)
                InventoryresultTable.rows[i + 1].cells[j].innerHTML = data[j];
            data = [];
        }
    }
    else {
        removeInventoryResultTable();
    }
}
function removeInventoryResultTable() {
    if (document.getElementById('InventoryresultTable')) {
        document.getElementById('InventoryresultTable').remove();
    }
}