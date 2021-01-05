from flask import Flask, request, render_template, session, jsonify, redirect, url_for
from DBHandler import DBHandler
import re

app = Flask(__name__)
app.secret_key = 's@#*je09el%^&'


@app.route('/')
def home():
    return render_template('a-dashboard.html')
