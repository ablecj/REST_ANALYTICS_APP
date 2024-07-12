from flask import Flask, request, jsonify, render_template
import mysql.connector
from mysql.connector import Error
import logging
import configparser

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Read database configuration from config.properties
config = configparser.ConfigParser()
config.read('connection.properties')

db_config = {
    'host': config['database']['host'],
    'user': config['database']['user'],
    'password': config['database']['password'],
    'database': config['database']['database'],
    'port': config['database'].getint('port')
}

# Configure MySQL connection
def get_db_connection():
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
    except Error as e:
        logger.error(f"Error: {e}")
    return connection


@app.route('/')
def index():
    return render_template('index.html')

# route for the get restaurent data
@app.route('/get_restaurants', methods=['GET'])
def get_restaurants():
    connection = get_db_connection()
    restaurants = []
    if connection:
        try:
            cursor = connection.cursor(dictionary=True)
            cursor.execute("select 'All' as 'restaurant_name' from dual union all SELECT DISTINCT restaurant_name as 'restaurant_name' FROM rpt_kpi_details")
            restaurants = cursor.fetchall()
            print(restaurants, "restaurents")
            cursor.close()
        except Error as e:
            logger.error(f"Error executing query: {e}")
        finally:
            connection.close()

    return jsonify(restaurants)

# route for the second chart
@app.route('/get_top5items', methods=['POST'])
def top5Items():
    filters = request.json.get('filters', {})
     # category = filters.get('category')
    start_date = filters.get('start_date')
    end_date = filters.get('end_date')
    # frequency = filters.get('frequency')
    restaurant_name = filters.get('restaurant_name')

    if restaurant_name != 'All':
        query = "select item_name item_name,sum(item_quantity) item_count from  order_item_details where date between %s and %s and restaurant_name=%s group by item_name order by item_count desc limit 5;"
        params = [start_date, end_date, restaurant_name]
    else:
         query = "select item_name item_name,sum(item_quantity) item_count from  order_item_details where date between %s and %s group by item_name order by item_count desc limit 5;"
         params = [start_date, end_date]

    connection = get_db_connection()
    data = []
    if connection:
        try:
            cursor = connection.cursor(dictionary=True)
            cursor.execute(query, params)
            data = cursor.fetchall()
            cursor.close()
        except Error as e:
            logger.error(f"Error executing query: {e}")
        finally:
            connection.close()

    logger.debug(f"Query result: {data}")
    return jsonify(data)

# route for the top 10 category
@app.route('/get_top10category', methods=['POST'])
def get_data():
    filters = request.json.get('filters', {})
    # category = filters.get('category')
    start_date = filters.get('start_date')
    end_date = filters.get('end_date')
    # frequency = filters.get('frequency')
    restaurant_name = filters.get('restaurant_name')
    print(restaurant_name, "rest")

    if restaurant_name != 'All':
        query = "select category_name category_name,sum(item_total) total_amount from order_item_details where date between %s and %s and restaurant_name=%s group by category_name order by total_amount desc limit 10;"
        params = [start_date, end_date, restaurant_name]
    else:
         query = "select category_name category_name,sum(item_total) total_amount from order_item_details where date between %s and %s  group by category_name order by total_amount desc limit 10;"
         params = [start_date, end_date]

    connection = get_db_connection()
    data = []
    if connection:
        try:
            cursor = connection.cursor(dictionary=True)
            cursor.execute(query, params)
            data = cursor.fetchall()
            cursor.close()
        except Error as e:
            logger.error(f"Error executing query: {e}")
        finally:
            connection.close()

    logger.debug(f"Query result: {data}")
    return jsonify(data)

# route for daily revenue
@app.route('/get_dailyRevenue', methods=['POST'])
def daily_revenue():
    filters = request.json.get('filters', {})
    # category = filters.get('category')
    start_date = filters.get('start_date')
    end_date = filters.get('end_date')
    # frequency = filters.get('frequency')
    restaurant_name = filters.get('restaurant_name')
    # print(restaurant_name, "rest")

    if restaurant_name != 'All':
        query = "select transaction_date,sum(dtd) total_revenue from rpt_kpi_details where kpi_name='Total Revenue' and transaction_date between %s and %s and restaurant_name=%s group by transaction_date order by transaction_date"
        params = [start_date, end_date, restaurant_name]
    else:
         query = "select transaction_date,sum(dtd) total_revenue from rpt_kpi_details where kpi_name='Total Revenue' and transaction_date between %s and %s group by transaction_date order by transaction_date"
         params = [start_date, end_date]

    connection = get_db_connection()
    data = []
    if connection:
        try:
            cursor = connection.cursor(dictionary=True)
            cursor.execute(query, params)
            data = cursor.fetchall()
            cursor.close()
        except Error as e:
            logger.error(f"Error executing query: {e}")
        finally:
            connection.close()

    logger.debug(f"Query result: {data}")
    return jsonify(data)

# route for old customer vs new customer
@app.route('/get_newvsoldcust', methods=['POST'])
def get_oldvsnewcust():
    filters = request.json.get('filters', {})
    # category = filters.get('category')
    start_date = filters.get('start_date')
    end_date = filters.get('end_date')
    # frequency = filters.get('frequency')
    restaurant_name = filters.get('restaurant_name')
    # print(restaurant_name, "rest")

    if restaurant_name != 'All':
        query = "select transaction_date,dtd oldcustomer, mtd newcustomer from rpt_kpi_details where kpi_name='New Customer' and transaction_date between %s and %s and restaurant_name=%s"
        params = [start_date, end_date, restaurant_name]
    else:
         query = "select transaction_date,dtd oldcustomer, mtd newcustomer from rpt_kpi_details where kpi_name='New Customer' and transaction_date between %s and %s"
         params = [start_date, end_date]

    connection = get_db_connection()
    data = []
    if connection:
        try:
            cursor = connection.cursor(dictionary=True)
            cursor.execute(query, params)
            data = cursor.fetchall()
            cursor.close()
        except Error as e:
            logger.error(f"Error executing query: {e}")
        finally:
            connection.close()

    logger.debug(f"Query result: {data}")
    return jsonify(data)












if __name__ == '__main__':
    app.run(debug=True)