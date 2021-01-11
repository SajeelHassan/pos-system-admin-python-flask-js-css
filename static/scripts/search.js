// Sajeel Hassan
// BITF18M005 - Web Enginnering - Assignment 2
function FormData(title,content,author,date){
    this.title=title;
    this.author=author;
    this.content=content;
    this.date=date;
}
var objArray=[];

function submitData(event){
    let thetitle=document.getElementById('title').value;
    let theAuthor=document.getElementById('author').value;
    let theContent=document.getElementById('content').value;
     if( thetitle==="" ||theAuthor==="" || theContent===""){
         alert('All the form entries should not be empty or null ... Click Ok and Fill the empty fields');
     }
     else{
        let date=getDateTime();
        let obj=new FormData(thetitle,theContent,theAuthor,date);
        objArray.push(obj);
        clearFields();
        createDataTable(objArray);
     }
    
    event.preventDefault();
}
function clearFields(){
    document.getElementById('title').value="";
    document.getElementById('content').value=""
    document.getElementById('author').value="";
    
}
function getDateTime(){
    let theDate=new Date();
    let date=theDate.getDate();
    let month = theDate.getMonth()+1;
    let mins=theDate.getMinutes();
    let secs=theDate.getSeconds();
    let hours=theDate.getHours();
    let mdiem=hours >= 12 ? 'PM' : 'AM';
    hours=hours>12?hours-12:hours;
    hours=hours===0?12:hours;
    date=date<10?'0'+date:date;
    month=month<10?'0'+month:month;
    hours=hours<10?'0'+hours:hours;
    mins=mins<10?'0'+mins:mins;
    secs=secs<10?'0'+secs:secs;
    theDate=date+'/'+month+'/'+String(theDate.getFullYear()).slice(2)+' '+hours+':'+mins+':'+secs+' '+mdiem;
    return theDate;
}
function createDataTable(objectArray){
    if(objArray.length>=1){

        if(objectArray.length===1){
        let tableElement=document.createElement('table');
        tableElement.id='newTable';
        document.getElementById('container').appendChild(tableElement);
        }
        var row;
        const newTable=document.getElementById('newTable');
        //Inserting New Row
        row=newTable.insertRow();
        for (let j = 0; j < 4; j++)
                row.insertCell();
        //creating table head
        if(objectArray.length===1){
            var tablehead=newTable.createTHead();
            row=tablehead.insertRow();
            for (let i = 0; i < 4; i++)
                row.append(document.createElement('th'));
            tablehead.rows[0].cells[0].innerText="Title";
            tablehead.rows[0].cells[1].innerText="Content";
            tablehead.rows[0].cells[2].innerText="Author";
            tablehead.rows[0].cells[3].innerText="DATE";
        }
        var data=[];
        // populating the table
        if(objectArray.length>=1){
            for (let i = 0; i < objectArray.length; i++){
                data=[objectArray[i].title,objectArray[i].content,objectArray[i].author,objectArray[i].date];
                for (let j = 0; j < 4; j++)
                    newTable.rows[i+1].cells[j].innerHTML=data[j];
                data=[];
            }
        }
    }
}

//Search input Event Listener
var searchElement=document.getElementById("search");
searchElement.addEventListener("input", searchNow);
var foundObjs=[];
var ti,co,au,da,key;
function searchNow(e){
    key=searchElement.value;
    foundObjs=[];
    if(key!=""){
        key=key.toLowerCase();
        for (let i = 0; i < objArray.length; i++) {
            ti=objArray[i].title.toLowerCase();
            co=objArray[i].content.toLowerCase();
            au=objArray[i].author.toLowerCase();
            da=objArray[i].date.toLowerCase();
            if(ti.indexOf(key)!=-1 || co.indexOf(key)!=-1 || au.indexOf(key)!=-1 || da.indexOf(key)!=-1 ){
                foundObjs.push(objArray[i]);   
            }
           
        }
       
    }
    createResultTable(foundObjs);
}
function createResultTable(foundArray){
    if(foundArray.length>=1){
        removeResultTable();
        let resultTabElement=document.createElement('table');
        resultTabElement.id='resultTable';
        document.getElementById('container').insertBefore(resultTabElement,document.getElementById('data-form'));
        var row;
        const resultTable=document.getElementById('resultTable');
        //Inserting New Row
        for (let i = 0; i < foundArray.length; i++){
            row=resultTable.insertRow();
            for (let j = 0; j < 4; j++)
                    row.insertCell();
            
        }
        
        //creating table head 
            var tablehead=resultTable.createTHead();
            row=tablehead.insertRow();
            for (let i = 0; i < 4; i++)
                row.append(document.createElement('th'));
            tablehead.rows[0].cells[0].innerText="Title";
            tablehead.rows[0].cells[1].innerText="Content";
            tablehead.rows[0].cells[2].innerText="Author";
            tablehead.rows[0].cells[3].innerText="DATE";
            
        var data=[];
        // populating the table
            for (let i = 0; i < foundArray.length; i++){
                data=[foundArray[i].title,foundArray[i].content,foundArray[i].author,foundArray[i].date];
                for (let j = 0; j < 4; j++)
                    resultTable.rows[i+1].cells[j].innerHTML=data[j];
                data=[];
        }
    }
    else{
        removeResultTable();
    }
}
function removeResultTable(){
    if ( document.getElementById('resultTable')) {
        document.getElementById('resultTable').remove();
    }
}