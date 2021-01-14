//Grabbing Btns
var loginBtn = document.getElementById('login-submit-emp');
var toSignpForm = document.getElementById('employee-signup-emp');

//Grabbing Login-form Feilds
var l_uname = document.getElementById('login-emp-uname');
var l_pwd = document.getElementById('login-emp-pwd');

//Global Variables

//Event listener
loginBtn.addEventListener('click', onLogin);
//Functions

function onLogin(event) {
    if (notEmpty() != true) {
        let msgP = document.getElementById('errorMsg-emp');
        msgP.innerText = 'Empty Field/Fields - Fill and Click Login';
        let msgBlock = document.getElementById('message-block-emp');
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
        xmlObj.open('post', '/incEmpLogin', true);
        xmlObj.onreadystatechange = function () {
            if (this.readyState == 4 && this.status === 200) {
                if (this.responseText == 'INVALID') {
                    l_uname.value = '';
                    l_pwd.value = '';
                    let msgP = document.getElementById('errorMsg-emp');
                    msgP.innerText = 'Invalid Username/Password';
                    let msgBlock = document.getElementById('message-block-emp');
                    msgBlock.style.display = 'block';
                    setTimeout(function () {
                        msgBlock.style.display = 'none';
                    }, 3000);
                }
                else {
                    id = JSON.parse(this.responseText);
                    // id = 90;
                    window.location.href = `/sell/${id}`;
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

// Signup Area
//Event Listeners

var signup_btn = document.getElementById('signup-submit-emp');
var signup_uname = document.getElementById('signup-emp-uname');
var signup_pwd = document.getElementById('signup-emp-pwd');
var signup_pwd_confirm = document.getElementById('signup-emp-pwd-confirm');

signup_btn.addEventListener('click', onSignup);
function onSignup(e) {
    if (isEmptySignup() != true) {
        let msgP = document.getElementById('errorMsg-emp');
        msgP.innerText = 'Empty Field/Fields - Fill and Click Signup';
        let msgBlock = document.getElementById('message-block-emp');
        msgBlock.style.display = 'block';
        setTimeout(function () {
            msgBlock.style.display = 'none';
        }, 3000);
    }
    else {
        if (signup_pwd.value != signup_pwd_confirm.value) {
            let msgP = document.getElementById('errorMsg-emp');
            msgP.innerText = 'Those passwords didn\'t match. Try again';
            let msgBlock = document.getElementById('message-block-emp');
            msgBlock.style.display = 'block';
            setTimeout(function () {
                msgBlock.style.display = 'none';
            }, 3000);
        }
        else {
            let data = {
                "username": `${signup_uname.value}`,
                "password": `${signup_pwd.value}`
            }
            let jsonString = JSON.stringify(data);
            let signUpxmlObj = new XMLHttpRequest();
            signUpxmlObj.open('post', '/incEmpSignup', true);
            signUpxmlObj.onload = function () {
                if (this.status === 200) {
                    if (this.responseText == 'INVALID') {
                        let msgPp = document.getElementById('errorMsg-emp');
                        msgPp.innerText = 'Error! Contact Admin';
                        let msgBlockk = document.getElementById('message-block-emp');
                        msgBlockk.style.display = 'block';
                        setTimeout(function () {
                            msgBlockk.style.display = 'none';
                        }, 3000);

                    }
                    else {
                        let msgP = document.getElementById('successMsg-emp');
                        msgP.innerText = 'Account has been created! You Can signin Now';
                        let msgBlock = document.getElementById('message-block-success-emp');
                        msgBlock.style.display = 'block';
                        setTimeout(function () {
                            msgBlock.style.display = 'none';
                            location.reload();
                        }, 3000);

                    }
                }
            }
            signUpxmlObj.setRequestHeader("content-Type", "application/json");

            signUpxmlObj.send(jsonString);
        }



    }

    e.preventDefault();
}
function isEmptySignup() {
    if (signup_uname.value == "" || signup_pwd.value == '' || signup_pwd_confirm.value == '') {
        return false
    }
    return true
}