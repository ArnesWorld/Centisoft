function clickMe() {
    alert("Hello World!")
}


function postNewDeveloper() {
    var myObj = { Id: 100, Name: "TestName", Email: "Test@mail.com", Tasks: null }
    var params = JSON.stringify(myObj);

    var postReq = new XMLHttpRequest();
    postReq.open("POST", "http://dm.sof60.dk:84/api/Developer", true);
    postReq.setRequestHeader('Content-type', 'application/json');
    postReq.send(params);
}




$(document).ready(function () {

    $("#btnGetDevelopers").click(function () {
        $.get("http://dm.sof60.dk:84/api/Developer", function (data) { loadDeveloperTable(data) });
    })

    $("#btnSubmit").click(function () {
        var email = $("#txtName").val();
        var name = $("txtEmail").val();
        $.post("http://dm.sof60.dk:84/api/Developer", { Name: name, Email: email });
    });

    $("#btnCookie").click(function () {


        var name = $("#cookie").val();

        var date = new Date();
        date.setTime(date.getTime() + (1000 * 24 * 60 * 60 * 1000));
        var expires = "expires=" + date.toUTCString();
        document.cookie = "myCookie" + "=" + name + ";" + expires + ";path=C:file:///C:/Users/Arne/Documents/UCN/4.semester/WebDev/CentriSoft/index.html";

        var cookie = getCookie("myCookie");
        $("#nameCookie").text(cookie);//getCookie("myCookie"));
        alert(cookie);

    })
})



function loadDeveloperTable(data) {
    var table = document.getElementById("developerTable")
    table.innerHTML = "";
    for (var i = 0; i < data.length; i++) {
        table.innerHTML += "<tr><td>" + data[i].Id + "</td>" + "<td>" + data[i].Name + "</td>" + "<td>" + data[i].Email + "</td>" + "<td>" + data[i].Tasks + "</td></tr>"
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var user = getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            setCookie("username", user, 365);
        }
    }
}

/* JavaScriptVersion
function loadDeveloperTable(data) {

    var table = document.getElementById("developerTable")
    table.innerHTML = "";
    var developerList = data;//JSON.parse(this.responseText);
    for (var i = 0; i < developerList.length; i++) {
        table.innerHTML += "<tr><td>" + developerList[i].Id + "</td>" + "<td>" + developerList[i].Name + "</td>" + "<td>" + developerList[i].Email + "</td>" + "<td>" + developerList[i].Tasks + "</td></tr>"
    }
}
*/

function getDevelopers() {
    var onReq = new XMLHttpRequest();
    onReq.addEventListener("load", loadDeveloperTable);
    onReq.open("GET", "http://dm.sof60.dk:84/api/Developer");
    onReq.send();
}

