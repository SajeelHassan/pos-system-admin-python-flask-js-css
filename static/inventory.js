

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

var title = document.getElementById('prod-title');
var sku = document.getElementById('prod-sku');
var cost = document.getElementById('prod-cost');
var price = document.getElementById('prod-price');
var stock = document.getElementById('prod-stock');
var low = document.getElementById('prod-low');
function prodSubmit(e) {

    if (isEmpty() != true) {
        let msgBlock = document.getElementById('form-alert-error');
        msgBlock.style.display = 'block';
        msgBlock.innerHTML = "<div><h2>Empty Field/Feilds!</h2> </div>;"
        setTimeout(function () {
            msgBlock.style.display = 'none';
        }, 3000);
    }
    else if (isValid() != true) {
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
        xmlObj2.open('post', 'incAddproduct');
        xmlObj2.onload = function () {
            if (this.status === 200) {
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

function isEmpty() {
    if (title.value == "" || sku.value == '' || cost.value == '' || price.value == '' || stock.value == '' || low.value == '') {
        return false
    }
    return true
}
function isValid() {
    if (parseFloat(cost.value) < 0 || parseFloat(price.value) < 0 || parseFloat(stock.value) < 0 || parseFloat(low.value) < 0) {
        return false;
    }
    else {
        return true
    }
}

function updateModal(event) {
    //Update Product Modal

    // Get the modal
    let upmodal = document.getElementById("myModal-editUpdate");
    let prod_id = event.target.parentElement.id;
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    showmodal();
    getProdData(prod_id);
    // When the user clicks on the button, open the modal
    function showmodal() {
        upmodal.style.display = "block";

    }
    let closeModal = document.getElementById('close-modal');

    closeModal.addEventListener('click', modalNone);
    // When the user clicks on <span> (x), close the modal
    function modalNone() {
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
    let xmlObj = new XMLHttpRequest();
    xmlObj.open('post', 'incGetproduct', true);
    let theId = {
        "prod_id": `${id}`
    };

    xmlObj.onload = function () {
        if (this.status === 200) {
            let prodData = JSON.parse(this.responseText);
            xmlObj.abort();
            console.trace(prodData);
            if (prodData.length) {
                putDataInForm(prodData);
            }

        }
    }
    let idJsonString = JSON.stringify(theId);
    xmlObj.setRequestHeader("content-Type", "application/json");
    xmlObj.send(idJsonString);


}
function putDataInForm(theProd) {
    let title = document.getElementById('edit-title');
    let sku = document.getElementById('edit-sku');
    let cost = document.getElementById('edit-cost');
    let price = document.getElementById('edit-price');
    let stock = document.getElementById('edit-stock');
    let low = document.getElementById('edit-low');
    title.value = theProd[1];
    sku.value = theProd[2];
    cost.value = theProd[3];
    price.value = theProd1[4];
    stock.value = thePrd[5];
    low.value = theProd[6];
}
// Add product
// var submitAddprod = document.getElementById('prod-submit');



// submitAddprod.addEventListener('click', prodSubmit);

// var title = document.getElementById('prod-title');
// var sku = document.getElementById('prod-sku');
// var cost = document.getElementById('prod-cost');
// var price = document.getElementById('prod-price');
// var stock = document.getElementById('prod-stock');
// var low = document.getElementById('prod-low');
// function prodSubmit(e) {
// }



function deleteModal(event) {
    //Update Product Modal

    // Get the modal
    var delmodal = document.getElementById("myModal-delete");

    showmodal();
    // When the user clicks on the button, open the modal
    function showmodal() {
        delmodal.style.display = "block";

    }
    let closeModal = document.getElementById('delete-modal-close');

    closeModal.addEventListener('click', modalNone);
    // When the user clicks on <span> (x), close the modal
    function modalNone() {
        delmodal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == delmodal) {
            delmodal.style.display = "none";
        }
    }

    console.log('in update Modal ', event.target);
    event.preventDefault();
}