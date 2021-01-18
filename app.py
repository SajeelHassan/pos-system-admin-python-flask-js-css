from flask import Flask, request, render_template, session, jsonify, redirect, url_for
from dbfns import DBFns
import json
app = Flask(__name__)
app.secret_key = 's@#*je/%//0$$/l%^&'

# MySQL configurations
app.config['DATABASE_HOST'] = 'localhost'
app.config['DATABASE_USER'] = 'root'
app.config['DATABASE_PASSWORD'] = 's@ajeel'
app.config['DATABASE_DB'] = 'wms'


@ app.route('/')
@ app.route('/login')
def index():
    return redirect(url_for('sellLoginSignup'))


@ app.route('/dashboard')
def home():
    if "adminLoggedIn" not in session:
        return redirect(url_for('adminlogin'))
    return render_template('./admin/dashboard.html')


@ app.route('/inventory')
def showInventory():
    if "adminLoggedIn" not in session:
        return redirect(url_for('adminlogin'))
    return render_template('./admin/inventory.html')


@ app.route('/receipts')
def showReceipts():
    if "adminLoggedIn" not in session:
        return redirect(url_for('adminlogin'))
    return render_template('./admin/receipts.html')


@ app.route('/customers')
def showCustomers():
    if "adminLoggedIn" not in session:
        return redirect(url_for('adminlogin'))
    return render_template('./admin/customers.html')


@ app.route('/reports')
def showReports():
    if "adminLoggedIn" not in session:
        return redirect(url_for('adminlogin'))
    return render_template('./admin/reports.html')


@ app.route('/employees')
def showEmployees():
    if "adminLoggedIn" not in session:
        return redirect(url_for('adminlogin'))
    return render_template('./admin/employees.html')


@ app.route('/support')
def menuSupport():
    if "adminLoggedIn" not in session:
        return redirect(url_for('adminlogin'))
    return render_template('./admin/support.html')


@ app.route('/settings')
def adminSettings():
    if "adminLoggedIn" not in session:
        return redirect(url_for('adminlogin'))
    return render_template('./admin/settings.html')

    # admin routes


@app.route('/viewReceipt/<int:ordid>')
def viewReceipt(ordid):
    if "adminLoggedIn" not in session:
        return redirect(url_for('adminlogin'))
    obj = DBFns('localhost', 'root', 's@ajeel', 'wms')
    data = obj.getTheReceipt(ordid)
    if data:
        return render_template('finalReceipt.html', data=data)
    return render_template('finalReceipt.html', message='NO Order Exists')


@app.route('/admin')
def adminlogin():
    if "adminLoggedIn" in session:
        return redirect(url_for('home'))
    if "loggedInEmpId" in session:
        return redirect(url_for('sellLoginSignup'))
    return render_template('./admin/login.html')

    # inc admin routes


@app.route('/admin/logout')
def adminLogout():
    if "adminLoggedIn" in session:
        session.pop("adminLoggedIn", None)
    return redirect(url_for("adminlogin"))


@app.route('/incProductsSold')
def productsSold():
    obj = DBFns('localhost', 'root', 's@ajeel', 'wms')
    productsSold = obj.getProductsSold()
    print('type of :  ', type(productsSold))
    return jsonify(productsSold)


@app.route('/incProductsSoldMonth')
def ProductsSoldMonth():
    obj = DBFns('localhost', 'root', 's@ajeel', 'wms')
    monthProductsSold = obj.getMonthProductsSold()
    return jsonify(monthProductsSold)


@app.route('/incProductsSoldYest')
def ProductsSoldYest():
    obj = DBFns('localhost', 'root', 's@ajeel', 'wms')
    yestProductsSold = obj.getYestProductsSold()
    return jsonify(yestProductsSold)


@app.route('/incProductsSoldToday')
def ProductsSoldToday():
    obj = DBFns('localhost', 'root', 's@ajeel', 'wms')
    todayProductsSold = obj.getTodayProductsSold()
    return jsonify(todayProductsSold)


@app.route('/incAdminLogin', methods=['GET', 'POST'])
def adminloginverify():
    if request.method == "POST":
        data = request.get_json(silent=True)
        # obj = DBFns('localhost', 'root', 's@ajeel', 'wms')
        obj = DBFns(app.config['DATABASE_HOST'], app.config['DATABASE_USER'],
                    app.config['DATABASE_PASSWORD'], app.config['DATABASE_DB'])
        if obj.adminLogin(data['username'], data['password']):
            session['adminLoggedIn'] = True
            return 'VALID'
        else:
            return 'INVALID'
    else:
        return redirect(url_for("adminlogin"))


@app.route('/incReceipts')
def incReceipts():
    obj = DBFns('localhost', 'root', 's@ajeel', 'wms')
    allReceipts = obj.getAllReceipts()
    return jsonify(allReceipts)


@app.route('/incCustomers')
def incCustomers():
    obj = DBFns('localhost', 'root', 's@ajeel', 'wms')
    allCustomers = obj.getAllCustomers()
    return jsonify(allCustomers)


@app.route('/incEmployees')
def incEmployees():
    obj = DBFns('localhost', 'root', 's@ajeel', 'wms')
    allEmployees = obj.getAllEmployees()
    return jsonify(allEmployees)


@app.route('/incInventory')
def incInventory():
    obj = DBFns('localhost', 'root', 's@ajeel', 'wms')
    myinventory = obj.getAllProducts()
    return jsonify(myinventory)


@app.route('/incAddproduct', methods=['POST'])
def incAddproduct():
    if request.method != "POST":
        return redirect(url_for("adminlogin"))
    response = request.get_json(silent=True)
    obj = DBFns('localhost', 'root', 's@ajeel', 'wms')
    message = 'Database/Server Error!'
    try:
        if obj.isSkuExists(response['sku']) != True:
            if obj.addProduct(response['title'], response['sku'], response['cost'],
                              response['price'], response['stock'], response['low']):
                message = 'true'
        elif obj.isSkuExists(response['sku']) == True:
            message = 'SKU Already Exist!'
    except Exception as e:
        print(str(e))
        message = 'Database/Server Error!'
    finally:
        return message


@app.route('/incGetproduct', methods=['POST'])
def incGetproduct():
    if request.method != "POST":
        return redirect(url_for("adminlogin"))
    data = request.get_json(silent=True)
    print((data['prod_id'])[5:])
    data['prod_id'] = (data['prod_id'])[5:]
    obj = DBFns('localhost', 'root', 's@ajeel', 'wms')
    reqProd = obj.getProduct(data['prod_id'])
    return jsonify(reqProd)


@app.route('/incUpdateproduct', methods=['POST'])
def incUpdateproduct():
    if request.method != "POST":
        return redirect(url_for("adminlogin"))
    response = request.get_json(silent=True)
    message = 'Database/Server Error!'
    try:
        obj = DBFns('localhost', 'root', 's@ajeel', 'wms')
        if obj.updateProduct(response['title'], response['sku'], response['cost'],
                             response['price'], response['stock'], response['low'], response['id']):
            message = 'true'
    except Exception as e:
        print(str(e))
        message = 'Database Error!'
    finally:
        return message


@app.route('/incDeleteproduct', methods=['POST'])
def incDeleteproduct():
    if request.method != "POST":
        return redirect(url_for("adminlogin"))
    response = request.get_json(silent=True)
    message = 'Database/Server Error!'
    try:
        obj = DBFns('localhost', 'root', 's@ajeel', 'wms')
        # response['id'] = (response['id'])[5:]
        print('incDeleteproduct', response)
        if obj.deleteProduct(response['id']):
            message = 'true'
    except Exception as e:
        print(str(e))
        message = 'Database Error!'
    finally:
        return message


@app.route('/incGetDelproduct', methods=['POST'])
def incGetDelproduct():
    if request.method != "POST":
        return redirect(url_for("adminlogin"))
    data = request.get_json(silent=True)
    print((data['prod_id'])[5:])
    data['prod_id'] = (data['prod_id'])[5:]
    reqProd = []
    try:
        obj = DBFns('localhost', 'root', 's@ajeel', 'wms')
        reqProd = obj.getProduct(data['prod_id'])
    except Exception as e:
        print(str(e))
        return 'Database Error!'
    finally:
        return jsonify(reqProd)

        # Selling Routes


@app.route('/sell')
def sellLoginSignup():
    if "loggedInEmpId" in session:
        return redirect(url_for('empidDashboard', lempid=session['loggedInEmpId']))
    elif "adminLoggedIn" in session:
        return redirect(url_for('adminlogin'))
    else:
        return render_template('./employee/loginSignup.html')


@app.route('/sell/<lempid>')
def empidDashboard(lempid):
    if "loggedInEmpId" in session:
        sessionEmpid = session["loggedInEmpId"]
        lempid = sessionEmpid
        return render_template('./employee/selling.html', id=sessionEmpid)
    else:
        return redirect(url_for("sellLoginSignup"))


@app.route('/printReceipt/<int:ordid>')
def printReceipt(ordid):
    if "loggedInEmpId" in session:
        empid = session["loggedInEmpId"]  # from session of employee
        print(empid)
        obj = DBFns('localhost', 'root', 's@ajeel', 'wms')
        if obj.isReceiptallowedEmp(ordid, empid):
            data = obj.getTheReceipt(ordid)
            if data:
                return render_template('finalReceipt.html', data=data)
        return render_template('finalReceipt.html', message='Only Admin can View that Receipt')
    else:
        return redirect(url_for("sellLoginSignup"))


@app.route('/sell/logout')
def logoutEmp():
    if "loggedInEmpId" in session:
        session.pop("loggedInEmpId", None)

    return redirect(url_for("sellLoginSignup"))

# inc Selling Routes


@app.route('/incRecentReceipts')
def incRecentReceipts():
    empid = session["loggedInEmpId"]
    response = 'ERROR'
    try:
        obj = DBFns('localhost', 'root', 's@ajeel', 'wms')
        response = obj.getLastReceiptsEmp(empid)
        response = jsonify(response)
    except Exception as e:
        print(str(e))
    return response


@app.route('/incEmpSignup', methods=["GET", "POST"])
def incEmpSignup():
    if request.method == "POST":
        signupInfo = request.get_json(silent=True)
        response = False
        try:
            obj = DBFns('localhost', 'root', 's@ajeel', 'wms')
            if obj.isUnameRegistered(signupInfo['username']):
                empId = obj.getEmpId(signupInfo['username'])
                print(empId)
                print(type(empId))
                if empId:
                    if obj.signupEmployee(empId, signupInfo['username'], signupInfo['password']):
                        response = True
        except Exception as e:
            print(str(e))
            response = False
        if response:
            return jsonify(empId)
        else:
            return 'INVALID'
    else:
        return redirect(url_for("sellLoginSignup"))


@app.route('/incEmpLogin', methods=['GET', 'POST'])
def incEmpLogin():
    if request.method == "POST":
        loginInfo = request.get_json(silent=True)
        response = False
        try:
            obj = DBFns('localhost', 'root', 's@ajeel', 'wms')
            empID = obj.getEmpId(loginInfo['username'])
            if empID:
                if obj.emploginVerify(loginInfo['username'], loginInfo['password']):
                    session["loggedInEmpId"] = empID
                    print('logged in id: ', empID)
                    print('logged in Session id: ', empID)
                    response = True

        except Exception as e:
            print(str(e))
            response = False
        finally:
            if response:
                return jsonify(empID)
            else:
                return 'INVALID'
    else:
        return redirect(url_for("sellLoginSignup"))


@app.route('/incAvailableInventory')
def incAvailableInventory():
    if "loggedInEmpId" in session:
        obj = DBFns('localhost', 'root', 's@ajeel', 'wms')
        myavailableInventory = obj.getsellingProducts()
        # print(myavailableInventory)
        return jsonify(myavailableInventory)
    else:
        return redirect(url_for("sellLoginSignup"))


@app.route('/incAvailableCustomer')
def incAvailableCustomer():
    if "loggedInEmpId" in session:
        obj = DBFns('localhost', 'root', 's@ajeel', 'wms')
        myavailableCustomers = obj.getAllCustomers()
        # print(myavailableInventory)
        return jsonify(myavailableCustomers)
    else:
        return redirect(url_for("sellLoginSignup"))


@app.route('/incSavereceiptdata', methods=['GET', 'POST'])
def incSavereceiptdata():
    if request.method == "POST":
        data = request.get_json(silent=True)
        cust_id = data['cust_id']
        emp_id = session["loggedInEmpId"]  # From session Session
        total_prod = len(data['orderProducts'])
        discount = data['discount']
        total_rcpt_price = data['total']
        pay_status = data['status']
        obj = DBFns('localhost', 'root', 's@ajeel', 'wms')
        print(cust_id)
        if obj.saveReceipt(cust_id, emp_id, total_prod, discount, total_rcpt_price, pay_status):
            rcpId = obj.getlastReceiptIdEmp(emp_id)
            for prod in data['orderProducts']:
                obj.addProdToReceipt(
                    rcpId, prod['current_prod_id'], prod['prod_title'], prod['prod_price'], prod['prod_qty'], prod['prod_priceXqty'])
            return jsonify(rcpId)
        return 'INVALID'
    else:
        return redirect(url_for("sellLoginSignup"))


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html')


if __name__ == "__main__":
    app.run(debug=True)
