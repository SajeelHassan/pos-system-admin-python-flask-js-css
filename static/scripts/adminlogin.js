//Grabbing Btns
var loginBtn = document.getElementById('login-submit');

//Grabbing Login-form Feilds
var l_uname = document.getElementById('login-uname');
var l_pwd = document.getElementById('login-pwd');

//Global Variables

//Event listener
loginBtn.addEventListener('click', onLogin);
//Functions

function onLogin(event) {
    if (notEmpty() != true) {
        let msgP = document.getElementById('errorMsg');
        msgP.innerText = 'Empty Field/Fields - Fill and Click Login';
        let msgBlock = document.getElementById('message-block');
        msgBlock.style.display = 'block';
        setTimeout(function () {
            msgBlock.style.display = 'none';
        }, 3000);
    }
    else {

        let data = {
            "username": `${l_uname.value}`,
            "password": `${l_pwd.value}`
        }
        let jsonString = JSON.stringify(data);
        let xmlObj = new XMLHttpRequest();
        xmlObj.open('post', '/incAdminLogin', true);
        xmlObj.onreadystatechange = function () {
            if (this.readyState == 4 && this.status === 200) {
                if (this.responseText == 'INVALID') {
                    l_uname.value = '';
                    l_pwd.value = '';
                    let msgP = document.getElementById('errorMsg');
                    msgP.innerText = 'Invalid Username/Password';
                    let msgBlock = document.getElementById('message-block');
                    msgBlock.style.display = 'block';
                    setTimeout(function () {
                        msgBlock.style.display = 'none';
                    }, 3000);
                }
                else {
                    window.open('/dashboard');
                }
            }
        }
        xmlObj.setRequestHeader("content-Type", "application/json");
        xmlObj.send(jsonString);
    }
    event.preventDefault();
}
function notEmpty() {
    if (l_pwd.value == '' || l_uname.value == '')
        return false;
    return true;
}
