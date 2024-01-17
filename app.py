import datetime
from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey

app = Flask(__name__)

app.secret_key = '1F7VkTpXpSBo9P6Oskv9Kq$23QwD9FG44U'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hotel.db'
db = SQLAlchemy(app)

with app.app_context():
    db.create_all()


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



def database_check():
    u = Dates(
        datetime.date(2024, 1, 16),
        datetime.date(2024, 1, 18),
        2,
        1)
    db.session.add(u)
    db.session.flush()
    db.session.commit()


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


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/booking")
def booking():
    return render_template("booking.html")


if __name__ == "__main__":
    # with app.app_context():
    #     db.create_all()
    #     database_check()
    app.run(debug=True, host="0.0.0.0", port=8080)

