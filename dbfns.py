import pymysql
import datetime


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
            currstatus = self.setStatus(stock, low)
            createdOn = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            args = (title, sku, cost, price, stock,
                    low, currstatus, createdOn)
            mydbCursor.execute(sql, args)
            mydb.commit()
            status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            return status
    # update the product

    def setStatus(self, stock, low):
        stock = int(stock)
        low = int(low)
        if stock >= low:
            return 'In Stock'
        elif stock == 0:
            return 'Out of Stock'
        elif stock < 15:
            return 'Soon out of Stock'
        elif stock < low:
            return 'Low Stock'

    def updateProduct(self, title, sku, cost, price, stock, low, prodid):
        prodid = int(prodid)
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "UPDATE products SET title=%s,sku=%s,cost=%s,price=%s,stock=%s,low=%s,curr_status=%s,last_updated=%s WHERE prod_id=%s"
            currstatus = self.setStatus(stock, low)
            lUpdated = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            args = (title, sku, cost, price, stock,
                    low, currstatus, lUpdated, prodid)
            mydbCursor.execute(sql, args)
            mydb.commit()
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


if __name__ == "__main__":
    obj = DBFns('localhost', 'root', 's@ajeel', 'wms')
    result = obj
    # result = obj.addEmployee(
    #     'sajeel', 'hassan', 'sajeel01', 'hsajeel786@gmail.com', '03491774641')
    # result = obj.updateEmployee(
    #     'Bint e', 'Abdullah', 'bitf18m033@pucit.edu.pk', '0309--90-090', 6)
    # result = obj.addCustomer(
    #     'Jameel', 'Khan', 'hsajeel786@gmail.com', '03491774641')
    # result = obj.isReceiptallowedEmp(2, 3)
    # result = obj.getFinalReceipt(7)
    # result = obj.getTheReceipt(1)
    # result = obj.emploginVerify('rohan1999', 'rohan00')
    # print(result)
    # result = obj.getEmpId('rohan1999')
    print(result)
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
