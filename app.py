from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)

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
    arr = db.Column(db.String(20), nullable=False)
    dep = db.Column(db.String(20), nullable=False)
    persons = db.Column(db.Integer, nullable=False)
    contact_person = "foreign_key from Guests"


class Reservations(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date_id = "foreign_key from Dates"
    person_id = "foreign_key from Guests"


@app.route("/api/v1.0/check_dates", methods=["GET", "POST"])
def check_dates():
    _arr = request.form.get("arr")
    _dep = request.form.get("dep")
    print(_arr, _dep)
    if _arr == "2024-01-17":
        return {"status": "not_available"}
    else:
        return {"status": "success"}


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8080)