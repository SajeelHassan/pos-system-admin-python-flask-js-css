from flask import Flask, request, render_template, session, jsonify, redirect, url_for
from dbfns import DBFns

app = Flask(__name__)
app.secret_key = 's@#*je09el%^&'

# s


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
    data = request.get_json(silent=True)
    print((data['prod_id'])[5:])
    data['prod_id'] = (data['prod_id'])[5:]
    obj = DBFns('localhost', 'root', 's@ajeel', 'wms')
    reqProd = obj.getProduct(data['prod_id'])
    return jsonify(reqProd)


@app.route('/incUpdateproduct', methods=['POST'])
def incUpdateproduct():
    response = request.get_json(silent=True)
    message = 'Database/Server Error!'
    try:
        obj = DBFns('localhost', 'root', 's@ajeel', 'wms')
        # response['id'] = (response['id'])[5:]
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


@ app.route('/')
@ app.route('/login')
def form():
    return render_template('./admin/login.html')


@ app.route('/dashboard')
def home():
    return render_template('./admin/dashboard.html')


@ app.route('/inventory')
def showInventory():
    return render_template('./admin/inventory.html')


@ app.route('/receipts')
def showReceipts():
    return render_template('./admin/receipts.html')


@ app.route('/customers')
def showCustomers():
    return render_template('./admin/customers.html')


@ app.route('/reports')
def showReports():
    return render_template('./admin/reports.html')


@ app.route('/employees')
def showEmployees():
    return render_template('./admin/employees.html')


@ app.route('/support')
def menuSupport():
    return render_template('./admin/support.html')


@ app.route('/settings')
def adminSettings():
    return render_template('./admin/settings.html')

# Selling Routes and Things


@app.route('/selling')
def selling():
    return render_template('./employee/login.html')


@app.route('/selling/')
@app.route('/selling/<subselling>')
def subselling(subselling='hello'):
    return render_template('./employee/login.html', sellingvar=subselling)


@app.route('/sales/<lempid>/sell')
def empidDashboard(lempid):
    return render_template('./employee/selling.html')


# inc Employee routes

@app.route('/incEmpLogin', methods=['GET', 'POST'])
def incEmpLogin():
    loginInfo = request.get_json(silent=True)
    return 'VALID'


@app.route('/incAvailableInventory')
def incAvailableInventory():
    obj = DBFns('localhost', 'root', 's@ajeel', 'wms')
    myavailableInventory = obj.getsellingProducts()
    # print(myavailableInventory)
    return jsonify(myavailableInventory)


@app.route('/incAvailableCustomer')
def incAvailableCustomer():
    obj = DBFns('localhost', 'root', 's@ajeel', 'wms')
    myavailableCustomers = obj.getAllCustomers()
    # print(myavailableInventory)
    return jsonify(myavailableCustomers)


# inc Selling Routes


@app.route('/incSavereceiptdata', methods=['GET', 'POST'])
def incSavereceiptdata():
    data = request.get_json(silent=True)
    cust_id = data['cust_id']
    emp_id = 3  # From session Session
    total_prod = len(data['orderProducts'])
    total_rcpt_price = data['total']
    pay_status = data['status']
    obj = DBFns('localhost', 'root', 's@ajeel', 'wms')
    if obj.saveReceipt(cust_id, emp_id, total_prod, total_rcpt_price, pay_status):
        rcpId = obj.getlastReceiptIdEmp(3)
        for prod in data['orderProducts']:
            obj.addProdToReceipt(
                rcpId, prod['current_prod_id'], prod['prod_qty'], prod['prod_price'])
        return 'VALID'
    #     if obj.addReceiptProducts(data['orderProducts']):
    #         return 'VALID'
    #     else:
    #         obj.deleteReceipt()
    return 'INVALID'


@app.route('/printReceipt')
def printReceipt():
    return 'Receipt with Print Button will be here'


if __name__ == "__main__":
    app.run(debug=True)
