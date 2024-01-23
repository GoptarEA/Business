import datetime
from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


app.secret_key = '1F7VkTpXpSBo9P6Oskv9Kq$23QwD9FG44U'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hotel.db'
db = SQLAlchemy(app)


class Guests(db.Model):
    __tableName__ = 'guests'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=False, nullable=False)
    surname = db.Column(db.String(20), unique=False, nullable=False)
    email = db.Column(db.String(20), unique=True)
    phone = db.Column(db.String(20), unique=True, nullable=False)

    def __init__(self, name, surname, email, phone):
        self.name = name
        self.surname = surname
        self.email = email
        self.phone = phone


class Dates(db.Model):
    __tableName__ = 'dates'
    id = db.Column(db.Integer, primary_key=True)
    arr = db.Column(db.Date, nullable=False)
    dep = db.Column(db.Date, nullable=False)
    persons = db.Column(db.Integer, nullable=False)
    contact_person_id = db.Column(db.Integer, ForeignKey("guests.id"), nullable=False)

    def __init__(self, arr, dep, persons, contact_person_id):
        self.arr = arr
        self.dep = dep
        self.persons = persons
        self.contact_person_id = contact_person_id


class Reservations(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date_id = db.Column('date_id', db.Integer, ForeignKey("dates.id"), nullable=False)
    person_id = db.Column('person_id', db.Integer, ForeignKey("guests.id"), nullable=False)


@app.route("/api/v1.0/reserve", methods=["GET", "POST"])
def reserve():
    pass


@app.route("/api/v1.0/check_dates", methods=["GET", "POST"])
def check_dates():
    _arr = datetime.date(*map(int, request.form.get("arr").split("-")))
    _dep = datetime.date(*map(int, request.form.get("dep").split("-")))
    _per = request.form.get("per")
    if any(True if date.arr <= _arr < date.dep else False for date in Dates.query.all()) or \
            any(True if date.arr < _dep <= date.dep else False for date in Dates.query.all()) or \
            any(True if _arr <= date.arr and _dep >= date.dep else False for date in Dates.query.all()):
        return {"status": "not_available"}
    else:
        return {"status": "success"}


@app.route("/api/v1.0/get_booked_dates", methods=["GET", "POST"])
def get_booked_dates():
    _year = request.form.get("year")
    _month = request.form.get("month")
    print(_year, _month)
    _booked_dates = []
    for date in Dates.query.all():
        if int(date.arr.month) == int(_month) and int(date.arr.year) == int(_year):
            _booked_dates.extend([day for day in range(date.arr.day, date.dep.day)])
    print({"dates": _booked_dates})
    return {"dates": list(set(_booked_dates))}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/booking")
def booking():
    return render_template("booking.html")


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=80)

