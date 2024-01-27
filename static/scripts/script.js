function fadeOutEffect(fadeTarget) {
    var fadeEffect = setInterval(function () {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.01;
        } else {
            clearInterval(fadeEffect);
        }
    }, 4);}

function appearEffect(appearTarget) {
    var appEffect = setInterval(function () {
        if (appearTarget.style.opacity < 1) {
            appearTarget.style.opacity = Number(appearTarget.style.opacity) + 0.01;
        } else {
            clearInterval(appEffect);
        }
    }, 4);}

function changePic() {
    let curImage = document.querySelector(".galery-image");
    let imagePath = curImage.getAttribute("src").slice(
        0,
        curImage.getAttribute("src").lastIndexOf("/") + 1);
    let imageName = curImage.getAttribute("src").slice(
        curImage.getAttribute("src").lastIndexOf("/") + 1,
        curImage.getAttribute("src").lastIndexOf("."));
    imageName++;
    fadeOutEffect(curImage);
    setTimeout(() => curImage.setAttribute(
            "src",
            imagePath + imageName % 2 + ".png"),
        400)
    setTimeout(() => appearEffect(curImage), 400);
    let cur = document.querySelector(".current");
    cur.classList.remove("current");
    if (cur !== cur.parentNode.lastElementChild) {
        cur.nextElementSibling.classList.add("current");
    } else {
        cur.parentNode.firstElementChild.classList.add("current");
    }
}


async function checkDates() {
    let formData = new FormData();
    let _arr = document.getElementById("arrive_date").value;
    let _dep = document.getElementById("departure_date").value;
    let _per = document.getElementById("pers_num").value;
    if (_arr === _dep || _dep < _arr) {
        document.getElementById("dates_not_available_win__background").style.display = "flex";
        document.getElementById("dates_not_available_win__mess").innerText = "Даты заданы некорректно!";
    } else {
        let timer = setTimeout(() => {
                document.getElementById("dates_not_available_win__background").style.display = "flex";
                document.getElementById("dates_not_available_win__mess").innerText = "Сервис недоступен, повторите запрос позднее";
                document.getElementById("dates_not_available_win__btn").innerText = "Хорошо, попробую еще раз чуть позже!"
                document.querySelector(".loader").style.opacity = "0";
            },
            10000);
        document.querySelector(".loader").style.opacity = "1";
        formData.append("dep", _dep);
        formData.append("arr", _arr);
        formData.append("per", _per);
        let response = await fetch("http://192.168.1.8:80/api/v1.0/check_dates",
            {
                method: "POST",
                body: formData
            });
        let result = await response.json();
        if (result["status"] === "success") {
            document.getElementById("check-dates").style.display = "none";
            document.getElementById("open-book-win").style.display = "block";
            document.querySelector(".loader").style.opacity = "0";
            clearTimeout(timer);
        } else {
            document.getElementById("dates_not_available_win__background").style.display = "flex";
            document.querySelector(".loader").style.opacity = "0";
            clearTimeout(timer);
        }
    }
}

function check_back() {
    document.getElementById("check-dates").style.display = "block";
    document.getElementById("open-book-win").style.display = "none";
}

function closeNotAvailableWin() {
    document.getElementById("dates_not_available_win__background").style.display = "none";
    document.getElementById("dates_not_available_win__mess").innerText = "Сожалеем, но выбранные Вами даты\n" +
        "                на данный момент недоступны для бронирования :( Попробуйте выбрать другие даты,\n" +
        "                будем рады видеть Вас в числе наших гостей.";
    document.getElementById("dates_not_available_win__btn").innerText = "Понял, выберу другие даты!";
}



document.getElementById('arrive_date').valueAsDate = new Date();
let tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
document.getElementById('departure_date').valueAsDate = tomorrow;





let slideShowTimer = setInterval(() => changePic(), 10000);