function mod(a, b) {
  if (a >= 0) return a % b
  else return (a + b * Math.ceil(Math.abs(a) / b)) % b
}


async function updateDates(_year, _month) {
  document.getElementById("dates-table").innerHTML = "";
  let _days = new Date(_year, _month).daysInMonth();

  let formData = new FormData();

  formData.append("year", _year);
  formData.append("month", Number(_month) + 1);
  let response = await fetch("http://192.168.1.8:80/api/v1.0/get_booked_dates",
      {
        method: "POST",
        body: formData
      });
  let result = await response.json();
  let booked_dates = Array.from(result["dates"]);

  let _start_date = mod((new Date(_year, _month, 1).getDay() - 1), 7);
  let _day_html_prot = document.createElement("div");
  _day_html_prot.setAttribute("class", "day-prot");
  let _now = new Date();

  for (let i = 0; i < _days; i++) {
    let _local = new Date(_year, _month, i + 1);
    let _cur_date = mod(new Date(_year, _month, i + 1).getDay() - 1, 7) + 1;
    let _cur = _day_html_prot.cloneNode()
    _cur.innerText = String(i + 1);
    _cur.style.gridRowStart = String(Math.floor((i + _start_date) / 7) + 1);
    _cur.style.gridColumnStart = String(_cur_date);
    _cur.setAttribute("onclick", "bookDay(this)");
    if (booked_dates.includes(i + 1) && !booked_dates.includes(i + 2)) {
      _cur.classList.add("booked");
      if (_now.getDate() <= i + 1 || _now.getMonth() < _local.getMonth()) {
        _cur.classList.add("last-booked-day");
      }
    }
    if (booked_dates.includes(i + 1) && booked_dates.includes(i + 2)) {
      _cur.classList.add("booked");
    }

    if (_now.getFullYear() === _local.getFullYear() &&
        _now.getMonth() === _local.getMonth() && _now.getDate() === _local.getDate()) {
      _cur.classList.add("current");
    }
    if (_now.getDate() > i + 1 && _now.getMonth() === _local.getMonth() &&_now.getFullYear() === _local.getFullYear()) {
      _cur.classList.add("booked");
    }
    document.getElementById("dates-table").appendChild(_cur);
  }
}


Date.prototype.daysInMonth = function() {
  return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate();
};


function nextMonth() {
  document.getElementById("month-select").value = (Number(document.getElementById("month-select").value) + 1) % 12;
  updateDates(document.getElementById("year-select").value, document.getElementById("month-select").value);
}


function prevMonth() {
  document.getElementById("month-select").value = (11 + Number(document.getElementById("month-select").value)) % 12;
  updateDates(document.getElementById("year-select").value, document.getElementById("month-select").value);
}


function selectChange() {
  updateDates(document.getElementById("year-select").value, document.getElementById("month-select").value);
}


function bookDay(el) {
  if ((!Array.from(el.classList).includes("booked") || Array.from(el.classList).includes("booked") && Array.from(el.classList).includes("last-booked-day")) && !Array.from(el.classList).includes("book-day")) {
    Array.from(document.getElementsByClassName("book-day")).forEach((el) => {
      el.classList.remove("book-day");
    })
    el.classList.add("book-day");
    document.getElementById("arrive_date").value =  document.getElementById("year-select").value + "-" + String(Number(document.getElementById("month-select").value) + 1).padStart(2, "0") + "-" + el.innerHTML.padStart(2, "0");
    document.getElementById("calendar").style.display = "none";
  } else  {
    el.classList.remove("book-day");
  }
}


function testFunc(event){
  event.preventDefault();
  document.getElementById("calendar").style.display = "flex";
}


document.onclick = (event) => {
  const withinBoundaries = event.composedPath().includes( document.getElementById("calendar"));

  if ( ! withinBoundaries && event.target !==  document.getElementById("arrive_date")) {
    document.getElementById("calendar").style.display = 'none';
  }
}


updateDates(new Date().getFullYear(), new Date().getMonth())


