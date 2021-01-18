import pymysql
import datetime
import smtplib
from email.message import EmailMessage


class DBFns:
    def __init__(self, host, user, password, database):
        self.host = host
        self.user = user
        self.password = password
        self.database = database
    # add the product

    def addProduct(self, title, sku, cost, price, stock, low):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "INSERT INTO products (title,sku,cost,price,stock,low,curr_status,created_on) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)"
            productData = (title, sku, cost, price, stock, low)
            currstatus = self.getStatus(stock, low)
            print(currstatus, 'creating prouduct')
            createdOn = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            args = (title, sku, cost, price, stock,
                    low, currstatus, createdOn)
            mydbCursor.execute(sql, args)
            mydb.commit()
            self.sendStockStatus(productData, currstatus)
            status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            return status
    # update the product

    def getStatus(self, stock, low):
        stock = int(stock)
        low = int(low)
        if stock >= low:
            return 'In Stock'
        else:
            if stock == 0:
                return 'Out of Stock'
            else:
                return 'Low Stock'

    def sendStockMail(self, prod_id, status):
        if status != 'In Stock':
            products = self.getProduct(prod_id)
            productData = (products[1], products[2], products[3],
                           products[4], products[5], products[6])
            self.sendStockStatus(productData, status)

    def updateProduct(self, title, sku, cost, price, stock, low, prodid):
        prodid = int(prodid)
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "UPDATE products SET title=%s,sku=%s,cost=%s,price=%s,stock=%s,low=%s,curr_status=%s,last_updated=%s WHERE prod_id=%s"
            productData = (title, sku, cost, price, stock, low)
            currstatus = self.getStatus(stock, low)
            print(currstatus, 'updating prouduct')
            lUpdated = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            args = (title, sku, cost, price, stock,
                    low, currstatus, lUpdated, prodid)
            mydbCursor.execute(sql, args)
            mydb.commit()
            self.sendStockStatus(productData, currstatus)
            status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            return status
    # // get single product using prod id and its sku

    def isSkuExists(self, sku):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "Select * from products WHERE sku =%s"
            mydbCursor.execute(sql, sku)
            myresult = mydbCursor.fetchone()
            if myresult != None:
                if myresult[2] == sku:
                    status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            return status

    def getProduct(self, prodid):
        prodid = int(prodid)
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "Select * from products WHERE prod_id =%s"
            args = (prodid)
            mydbCursor.execute(sql, args)
            myresult = mydbCursor.fetchone()
            if myresult != None:
                if myresult[0] == prodid:
                    status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            if status == True:
                return myresult
            else:
                return status

    def getAllProducts(self):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "Select * from products ORDER BY created_on DESC"
            mydbCursor.execute(sql)
            myresult = mydbCursor.fetchall()
            if myresult != None:
                # print(myresult[8].strftime("%c"))
                status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            if status == True:
                return myresult
            else:
                return status

    def deleteProduct(self, prodid):
        prodid = int(prodid)
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "Delete FROM products WHERE prod_id=%s"
            # lUpdated = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            args = (prodid)
            mydbCursor.execute(sql, args)
            mydb.commit()
            status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            return status

    def setCurrStatus(self, prod_id, stock, low):
        stock = int(stock)
        low = int(low)
        thestatus = ""
        if stock >= low:
            thestatus = 'In Stock'
        else:
            if stock == 0:
                thestatus = 'Out of Stock'
            else:
                thestatus = 'Low Stock'
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "UPDATE products SET curr_status=%s WHERE prod_id=%s"
            args = (thestatus,  prod_id)
            mydbCursor.execute(sql, args)
            mydb.commit()
            status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            return status

    def addProdToReceipt(self, rcpt_id, prod_id, title, price, qty, total_price):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "INSERT INTO receiptproducts (rcpt_id, prod_id,title, price, qty, total_price) VALUES (%s,%s,%s,%s,%s,%s)"
            args = (rcpt_id, prod_id, title, price, qty, total_price)
            mydbCursor.execute(sql, args)
            mydb.commit()
            status = True
            self.updateStock(prod_id, qty)
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            return status

    def getLow(self, prod_id):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "Select prod_id,low from products WHERE prod_id =%s"
            args = (prod_id)
            mydbCursor.execute(sql, args)
            myresult = mydbCursor.fetchone()
            # print(myresult)
            if myresult != None:
                if myresult[0] == prod_id:
                    # print(myresult[8].strftime("%c"))
                    # print(myresult[1])
                    status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            if status == True:
                return myresult[1]
            else:
                return status

    def getStock(self, prod_id):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "Select prod_id,stock from products WHERE prod_id =%s"
            args = (prod_id)
            mydbCursor.execute(sql, args)
            myresult = mydbCursor.fetchone()
            # print(myresult)
            if myresult != None:
                if myresult[0] == prod_id:
                    # print(myresult[8].strftime("%c"))
                    # print(myresult[1])
                    status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            if status == True:
                return myresult[1]
            else:
                return status

    def updateStock(self, prod_id, qty):

        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "UPDATE products SET stock=stock-%s WHERE prod_id=%s"
            args = (qty, prod_id)
            mydbCursor.execute(sql, args)
            mydb.commit()
            stock = self.getStock(prod_id)

            low = self.getLow(prod_id)
            print(stock, low)
            curr_status = self.getStatus(stock, low)
            print(curr_status)
            mydbCursor2 = mydb.cursor()
            sql = "UPDATE products SET curr_status=%s WHERE prod_id=%s"
            args2 = (curr_status, prod_id)
            mydbCursor2.execute(sql, args2)
            mydb.commit()
            self.sendStockMail(prod_id, curr_status)
            status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            return status

    def saveReceipt(self, cust_id, emp_id, total_prod, discount, total_rcpt_price, pay_status):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "INSERT INTO receipt (cust_id,emp_id, total_prod,discount, total_rcpt_price, sold_by, cust_name, pay_status,date_time) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)"
            createdOn = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            sold_by = self.getEmpName(emp_id)
            cust_name = self.getCustName(cust_id)
            args = (cust_id, emp_id, total_prod, discount, total_rcpt_price,
                    sold_by, cust_name, pay_status, createdOn)
            self.addinCustOrder(cust_id)
            self.addEmpScore(emp_id)
            mydbCursor.execute(sql, args)
            mydb.commit()
            status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            return status

    def getEmpName(self, id):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "Select emp_id,firstname,lastname from employee WHERE emp_id =%s"
            args = (id)
            mydbCursor.execute(sql, args)
            myresult = mydbCursor.fetchone()
            # print(myresult)
            if myresult != None:
                if myresult[0] == id:
                    # print(myresult[8].strftime("%c"))
                    # print(myresult[1])
                    status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            if status == True:
                return myresult[1]+' '+myresult[2]
            else:
                return status

    def getCustName(self, id):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "Select cust_id,firstname,lastname from customer WHERE cust_id =%s"
            args = (id)
            mydbCursor.execute(sql, args)
            myresult = mydbCursor.fetchone()
            # print(myresult)
            if myresult != None:
                if myresult[0] == id:
                    # print(myresult[8].strftime("%c"))
                    # print(myresult[1])
                    status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            if status == True:
                return myresult[1]+' '+myresult[2]
            else:
                return status

    def getlastReceiptIdEmp(self, id):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "Select rcpt_id,emp_id from receipt WHERE emp_id =%s ORDER BY rcpt_id DESC LIMIT 1"
            args = (id)
            mydbCursor.execute(sql, args)
            myresult = mydbCursor.fetchone()
            # print(myresult)
            print(myresult[0])
            if myresult != None:
                if myresult[1] == id:
                    print(myresult)
                    # print(myresult[8].strftime("%c"))
                    # print(myresult[1])
                    status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            if status == True:
                return myresult[0]
            else:
                return status

    def isReceiptallowedEmp(self, ordid, empid):
        tenReceipts = self.getLastReceiptsEmp(empid)
        if tenReceipts:
            for rcpt in tenReceipts:
                if rcpt[0] == ordid:
                    return True

        return False

    def getLastReceiptsEmp(self, id):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "Select * from receipt WHERE emp_id =%s ORDER BY rcpt_id DESC LIMIT 10"
            args = (id)
            mydbCursor.execute(sql, args)
            myresult = mydbCursor.fetchall()
            if myresult != None:
                if myresult[0][2] == id:
                    status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            if status == True:
                return myresult
            else:
                return status

    def getFinalReceiptProducts(self, id):
        id = int(id)
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = 'select rcpt_id,title,price,qty,total_price FROM receiptproducts WHERE rcpt_id=%s'
            args = (id)
            mydbCursor.execute(sql, args)
            myresult = mydbCursor.fetchall()
            # print('getFinalReceiptProducts', myresult)
            if myresult != None:
                if myresult[0][0] == id:
                    status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            if status == True:
                return myresult
            else:
                return status

    def getFinalReceipt(self, id):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "select  rcpt_id, date_time, cust_id, emp_id, total_prod,discount, total_rcpt_price, pay_status from receipt where rcpt_id=%s"
            args = (id)
            mydbCursor.execute(sql, args)
            myresult = mydbCursor.fetchone()
            # print('getFinalReceipt', myresult)
            if myresult != None:
                # print(myresult)
                # print(myresult[0])
                if myresult[0] == id:
                    status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            if status == True:
                return myresult
            else:
                return status

    def getTheReceipt(self, id):
        receipt_info = self.getFinalReceipt(id)
        if receipt_info:
            products = self.getFinalReceiptProducts(id)
            if products:
                return [receipt_info, products]
        else:
            return False

    def addEmpScore(self, id):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "UPDATE employee SET total_orders=total_orders+1 WHERE emp_id=%s"
            args = (id)
            mydbCursor.execute(sql, args)
            mydb.commit()
            status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            return status

    def addinCustOrder(self, id):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "UPDATE customer SET total_orders=total_orders+1 WHERE cust_id=%s"
            args = (id)
            mydbCursor.execute(sql, args)
            mydb.commit()
            status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            return status

    def getAllReceipts(self):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "Select * from receipt ORDER BY date_time DESC"
            mydbCursor.execute(sql)
            myresult = mydbCursor.fetchall()
            if myresult != None:
                status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            if status == True:
                return myresult
            else:
                return status

    def deleteReceipt(self, ordid):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "Delete FROM receipt WHERE rcpt_id=%s"
            args = (ordid)
            mydbCursor.execute(sql, args)
            mydb.commit()
            status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            return status

    def addEmployee(self, firstname, lastname, username, email, phone):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "INSERT INTO employee (firstname, lastname,username, joined_on, email, phone,total_orders) VALUES (%s,%s,%s,%s,%s,%s,%s)"
            joinedOn = datetime.datetime.now().strftime("%Y-%m-%d")
            total_orders = 0
            args = (firstname, lastname, username,
                    joinedOn, email, phone, total_orders)
            mydbCursor.execute(sql, args)
            mydb.commit()
            status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            return status

    def removeEmployee(self, empid):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "Delete FROM employee WHERE emp_id=%s"
            args = (empid)
            mydbCursor.execute(sql, args)
            mydb.commit()
            status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            return status

    def updateEmployee(self, firstname, lastname,  email, phone, empid):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "UPDATE employee SET firstname=%s,lastname=%s,email=%s,phone=%s WHERE emp_id=%s"
            args = (firstname, lastname,  email, phone, empid)
            mydbCursor.execute(sql, args)
            mydb.commit()
            status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            return status

    def getAllEmployees(self):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "Select * from employee ORDER BY joined_on ASC"
            mydbCursor.execute(sql)
            myresult = mydbCursor.fetchall()
            if myresult != None:
                status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            if status == True:
                return myresult
            else:
                return status

    def addCustomer(self, firstname, lastname, email, phone):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "INSERT INTO customer (firstname, lastname, created_on, email, phone,total_orders) VALUES (%s,%s,%s,%s,%s,%s)"
            createdOn = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            total_orders = 0
            args = (firstname, lastname, createdOn, email, phone, total_orders)
            mydbCursor.execute(sql, args)
            mydb.commit()
            status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            return status

    def removeCustomer(self, cust_id):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "Delete FROM customer WHERE cust_id=%s"
            args = (cust_id)
            mydbCursor.execute(sql, args)
            mydb.commit()
            status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            return status

    def updateCustomer(self, firstname, lastname,  email, phone, custid):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "UPDATE customer SET firstname=%s,lastname=%s,email=%s,phone=%s WHERE cust_id=%s"
            args = (firstname, lastname,  email, phone, custid)
            mydbCursor.execute(sql, args)
            mydb.commit()
            status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            return status

    def getAllCustomers(self):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "Select * from customer ORDER BY created_on ASC"
            mydbCursor.execute(sql)
            myresult = mydbCursor.fetchall()
            if myresult != None:
                status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            if status == True:
                return myresult
            else:
                return status

    def getsellingProducts(self):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "Select prod_id,title,stock,price from products ORDER BY created_on DESC"
            mydbCursor.execute(sql)
            myresult = mydbCursor.fetchall()
            if myresult != None:
                status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            if status == True:
                return myresult
            else:
                return status

    def getEmpId(self, username):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "Select emp_id,username from employee WHERE username=%s"
            mydbCursor.execute(sql, username)
            myresult = mydbCursor.fetchone()
            if myresult != None:
                if myresult[1] == username:
                    status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            if status == True:
                return myresult[0]
            else:
                return status

    def empSignUpVerify(self, username):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "Select emp_id,username from emplogin WHERE username=%s"
            args = (username)
            mydbCursor.execute(sql, args)
            myresult = mydbCursor.fetchone()
            print('empSignUpVerify', myresult)
            if myresult != None:
                if myresult[1] == username:
                    status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()

            return status

    def getEmpPassword(self, username):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "Select emp_id,username,password from emplogin WHERE username=%s"
            mydbCursor.execute(sql, username)
            myresult = mydbCursor.fetchone()
            if myresult != None:
                if myresult[1] == username:
                    status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            if status == True:
                return myresult[2]
            else:
                return status

    def emploginVerify(self, username, password):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "Select emp_id,username from emplogin WHERE username=%s AND password=%s"
            args = (username, password)
            mydbCursor.execute(sql, args)
            myresult = mydbCursor.fetchone()
            print('emploginVerify', myresult)
            if myresult != None:
                if myresult[1] == username:
                    status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()

            return status

    def isUnameRegistered(self, username):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "Select emp_id,username from employee WHERE username=%s"
            args = (username)
            mydbCursor.execute(sql, args)
            myresult = mydbCursor.fetchone()
            print('empRegistered', myresult)
            if myresult != None:
                if myresult[1] == username:
                    status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()

            return status

    def signupEmployee(self, empid, username, password):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "INSERT INTO emplogin (emp_id, username, password) VALUES (%s,%s,%s)"
            args = (empid, username, password)
            mydbCursor.execute(sql, args)
            mydb.commit()
            status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            return status

    def adminLogin(self, username, password):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "Select username,password from adminlogin WHERE username=%s AND password=%s"
            args = (username, password)
            mydbCursor.execute(sql, args)
            myresult = mydbCursor.fetchone()
            print('adminLogin', myresult)
            if myresult != None:
                if myresult[0] == username and myresult[1] == password:
                    status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()

            return status

    def sendStockStatus(self, product, status):
        if status != 'In Stock':
            EMAIL_ADDRESS = "hsajeel786@gmail.com"
            EMAIL_PASSWORD = "hjsrwkmjdihfpcro"
            msg = EmailMessage()
            msg['Subject'] = f'Stock Update-{product[0]}'
            msg['From'] = EMAIL_ADDRESS
            msg['To'] = 'bitf18m005@pucit.edu.pk'
            msg.add_alternative(f"""\
            <!DOCTYPE html>
    <html>

        <body style="width: 600px;margin: 0 auto;" cz-shortcut-listen="true">
            <div style="width:500px;margin: 30px auto;">
                <div style="
        background-color: #43425D;
        color: white;
        padding: 20px;
        text-align: center;
        ">
                    <h1>{status} Alert</h1>
                </div>
                <div style="
        padding: 5px;
    ">
                    <p><span><b>Hi Admin<br><br></b></span>A product is <span style='background-color: black;
                        color: white;
                        padding: 5px 5px;'>{status}</span> Product details are shown
                        below
                        for
                        your reference:</span></p>
                </div>
                <div style="
        padding: 4px;
    ">
                    <h2>Product Details</h2>
                </div>
                <table style="
                width: 100%;
                border-collapse: collapse;
                text-align: center;
            ">
                    <thead style="background-color: #3B86FF;">
                        <tr>
                            <th style="
                border: 1px solid black;
                padding: 10px;
            ">Product</th>
                            <th style="
                border: 1px solid black;
                padding: 10px;
            ">SKU</th>
                            <th style="
                border: 1px solid black;
                padding: 10px;
            ">Available Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="
                text-align: left;
                border: 1px solid black;
                padding: 10px;
            ">{product[0]}</td>
                            <td style="
                border: 1px solid black;
                padding: 10px;
            ">{product[1]}</td>
                            <td style="
                border: 1px solid black;
                padding: 10px;
            ">{product[4]}</td>
                        </tr>
                    </tbody>
                </table>
                <div style="
        margin-top: 50px;
        background: #eeeded;
    ">
                    <p style="
        opacity: 50%;
        padding: 30px;
        font-style: italic;
    ">Sent by automatic stock status sending function in dbfns.py file</p>
                </div>
            </div>



        </body>

    </html>
            """, subtype='html')
            try:
                with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
                    smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
                    smtp.send_message(msg)
                    print('mail sent')
            except Exception as e:
                print(str(e))

    def getallProductsSold(self):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "select products.prod_id,receiptproducts.title, products.cost,products.price,receiptproducts.qty,receiptproducts.total_price,receipt.rcpt_id,receiptproducts.rcpt_id,receipt.date_time from ((products inner join receiptproducts on products.prod_id = receiptproducts.prod_id) inner join receipt on receipt.rcpt_id = receiptproducts.rcpt_id) group by receipt.rcpt_id,receiptproducts.prod_id order by receipt.date_time desc;"
            mydbCursor.execute(sql)
            myresult = mydbCursor.fetchall()
            # print(myresult)
            if myresult != None:
                status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            if status == True:
                return list(myresult)
            else:
                return status

    def insertProductsSold(self):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            allprods = self.getallProductsSold()
            sq = 'TRUNCATE TABLE  productssold;'
            mydbCursor.execute(sq)
            mydb.commit()
            sql = "INSERT INTO productssold (prod_id, title, cost, price, qty, total_price, r_rcpt_id, date_time) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)"
            for prod in allprods:
                args = (prod[0], prod[1], prod[2], prod[3],
                        prod[4], prod[5], prod[6], prod[8])
                mydbCursor.execute(sql, args)
                mydb.commit()
            status = True
        except Exception as e:
            print('insertProductsSold')
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            return status

    def getProductsSold(self):
        if self.insertProductsSold():
            mydb = None
            status = False
            try:
                mydb = pymysql.connect(
                    host=self.host, user=self.user, password=self.password, database=self.database)
                mydbCursor = mydb.cursor()
                sql = "Select * from productssold"
                mydbCursor.execute(sql)
                myresult = mydbCursor.fetchall()
                if myresult != None:
                    status = True
            except Exception as e:
                print('getProductsSold')
                print(str(e))
            finally:
                if mydb != None:
                    mydb.close()
                if status == True:
                    return myresult
                else:
                    return status
        else:
            return False

    def getMonthProductsSold(self):
        if self.insertProductsSold():
            mydb = None
            status = False
            try:
                mydb = pymysql.connect(
                    host=self.host, user=self.user, password=self.password, database=self.database)
                mydbCursor = mydb.cursor()
                sql = "SELECT prod_id, title, cost, price, qty, total_price, r_rcpt_id,DATE_FORMAT(date_time, '%d/%m/%Y') FROM productssold WHERE   date_time BETWEEN NOW() - INTERVAL 30 DAY AND NOW();"
                mydbCursor.execute(sql)
                myresult = mydbCursor.fetchall()
                if myresult != None:
                    status = True
            except Exception as e:
                print('getProductsSold')
                print(str(e))
            finally:
                if mydb != None:
                    mydb.close()
                if status == True:
                    return myresult
                else:
                    return status
        else:
            return False


if __name__ == "__main__":
    obj = DBFns('localhost', 'root', 's@ajeel', 'wms')
    result = obj
    # result = obj.addEmployee(
    #     'sajeel', 'hassan', 'sajeel01', 'hsajeel786@gmail.com', '03491774641')
    # result = obj.updateEmployee(
    #     'Bint e', 'Abdullah', 'bitf18m033@pucit.edu.pk', '0309--90-090', 6)
    # result = obj.addCustomer(
    #     'Khaleel', 'Jibran', 'khaleel90@gmail.com', '03099999765')
    # status = "Out Of Stock"
    # obj.sendStockStatus(
    #     ('My Product', '098Ik', '900', '1900', '0', '30'), status)

    # result = obj.isReceiptallowedEmp(2, 3)
    # result = obj.getFinalReceipt(7)
    # result = obj.getTheReceipt(1)
    # result = obj.emploginVerify('rohan1999', 'rohan00')
    # print(result)
    # result = obj.getEmpId('rohan1999')
    # result = obj.adminLogin('ahmed7351', 's@ajeel')
    # result = obj.addProduct('finalizinfggg', '098098',
    #                         222, 333, 900, 300, 'new status')
    # result = obj.addProduct('finalizinfggg', '098098',
    #                         222, 333, 900, 300, 'new status')
    # result = obj.addProduct('finalizinfggg', '098098',
    #                         222, 333, 900, 300, 'new status')
    # result = obj.addProduct('finalizinfggg', '098098',
    #                         222, 333, 900, 300, 'new status')
    # result = obj.addProduct('finalizinfggg', '098098',
    #                         222, 333, 900, 300, 'new status')
    # result = obj.addProduct('finalizinfggg', '098098',
    #                         222, 333, 900, 300, 'new status')
    # result = obj.addProduct('finalizinfggg', '098098',
    #                         222, 333, 900, 300, 'new status')
    # result = obj.addProduct('finalizinfggg', '098098',
    #                         222, 333, 900, 300, 'new status')
    # result = obj.addProduct('finalizinfggg', '098098',
    #                         222, 333, 900, 300, 'new status')
    # result = obj.addProduct('finalizinfggg', '098098',
    #                         222, 333, 900, 300, 'new status')
    # result = obj.addProduct('finalizinfggg', '098098',
    #                         222, 333, 900, 300, 'new status')
    # result = obj.addProduct('finalizinfggg', '098098',
    #                         222, 333, 900, 300, 'new status')
    # result = obj.addProduct('finalizinfggg', '098098',
    #                         222, 333, 900, 300, 'new status')
    # result = obj.addProduct('finalizinfggg', '098098',
    #                         222, 333, 900, 300, 'new status')
    # result = obj.addProduct('finalizinfggg', '098098',
    #                         222, 333, 900, 300, 'new status')
    # result = obj.updateProduct(
    #     'finalizinfggg', '098098', 222, 333, 299, 300, 'Low stock', 22)
    # result = obj.getProduct(22, '098098')
    # result = obj.getAllProducts()
    # result = obj.deleteProduct(22, '098098')
    # result = obj.getStock(12)
    # result = obj.updateStock(12, 100)
    # print('Stock update: ', result)
    # result = obj.deleteProduct(12, '78B90')

    # result = obj.deleteProduct(19, '098098')
    # result = obj.deleteProduct(20, '098098')
    # result = obj.deleteProduct(21, '098098')
    # result = obj.getStock(12)
    # print(result)
