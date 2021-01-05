import pymysql
import datetime


class DBFns:
    def __init__(self, host, user, password, database):
        self.host = host
        self.user = user
        self.password = password
        self.database = database
    # add the product

    def addProduct(self, title, sku, cost, price, stock, low, currstatus):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "INSERT INTO products (title,sku,cost,price,stock,low,curr_status,created_on) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)"

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

    def updateProduct(self, title, sku, cost, price, stock, low, currstatus, prodid):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "UPDATE products SET title=%s,sku=%s,cost=%s,price=%s,stock=%s,low=%s,curr_status=%s,last_updated=%s WHERE prod_id=%s"
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

    def getProduct(self, prodid, sku):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "Select * from products WHERE prod_id =%s AND sku =%s"
            args = (prodid, sku)
            mydbCursor.execute(sql, args)
            myresult = mydbCursor.fetchone()
            if myresult != None:
                if myresult[0] == prodid and myresult[2] == sku:
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

    def getAllProducts(self):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "Select * from products"
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

    def deleteProduct(self, prodid, sku):
        mydb = None
        status = False
        try:
            mydb = pymysql.connect(
                host=self.host, user=self.user, password=self.password, database=self.database)
            mydbCursor = mydb.cursor()
            sql = "Delete FROM products WHERE prod_id=%s AND sku=%s"
            # lUpdated = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            args = (prodid, sku)
            mydbCursor.execute(sql, args)
            mydb.commit()
            status = True
        except Exception as e:
            print(str(e))
        finally:
            if mydb != None:
                mydb.close()
            return status

    def addProductToReceipt(self, srNo, title, each_price, qty, total_price):


if __name__ == "__main__":
    obj = DBFns('localhost', 'root', 's@ajeel', 'wms')
    # result = obj.addProduct('finalizinfggg', '098098', 222,
    #                         333, 900, 300, 'new status')
    # result = obj.updateProduct(
    #     'finalizinfggg', '098098', 222, 333, 299, 300, 'Low stock', 22)
    # result = obj.getProduct(22, '098098')
    # result = obj.getAllProducts()
    result = obj.deleteProduct(22, '098098')
    print(result)
