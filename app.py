from flask import Flask, request, render_template, session, jsonify, redirect, url_for
from dbfns import DBFns
import re

app = Flask(__name__)
app.secret_key = 's@#*je09el%^&'


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
    print(data['prod_id'])
    obj = DBFns('localhost', 'root', 's@ajeel', 'wms')
    reqProd = obj.getProduct(data['prod_id'])
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


if __name__ == "__main__":
    app.run(debug=True)
