function changeTotalPrice(elem) {
    let _price = document.getElementById("price");
    if (elem.checked) {
        if (elem.id === "early_arr") {
            _price.innerHTML = String(parseInt(_price.innerHTML, 10) + 1000);
        }
        if (elem.id === "late_dep") {
            _price.innerHTML = String(parseInt(_price.innerHTML, 10) + 1000);
        }
        if (elem.id === "animals") {
            _price.innerHTML = String(parseInt(_price.innerHTML, 10) + 2000);
        }
        if (elem.id === "bath") {
            _price.innerHTML = String(parseInt(_price.innerHTML, 10) + 2000);
        }
    } else {
        if (elem.id === "early_arr") {
            _price.innerHTML = String(parseInt(_price.innerHTML, 10) - 1000);
        }
        if (elem.id === "late_dep") {
            _price.innerHTML = String(parseInt(_price.innerHTML, 10) - 1000);
        }
        if (elem.id === "animals") {
            _price.innerHTML = String(parseInt(_price.innerHTML, 10) - 2000);
        }
        if (elem.id === "bath") {
            _price.innerHTML = String(parseInt(_price.innerHTML, 10) - 2000);
        }
    }
}

function checkInputs () {
    let guests = Array.from(document.getElementsByClassName("guest"));
    let flag = true;
    guests.forEach((elem) => {
        if (! elem.childNodes[1].childNodes[3].value || ! elem.childNodes[3].childNodes[3].value
            || ! elem.childNodes[5].childNodes[3].value) {
            flag = false;
        }
    });
    if (! flag) {
        document.getElementById("check_inputs").style.display = "flex";
    } else {
        window.location.replace("/payment")
    }
}

