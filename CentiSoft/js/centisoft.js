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
};

$(document).ready(function () {

    $("#btnGetDevelopers").click(function () {
        $.get("http://dm.sof60.dk:84/api/Developer", function (data) { loadDeveloperTable(data) });
    });

    $("#btnSubmit").click(function () {
        var email = $("#txtName").val();
        var name = $("txtEmail").val();
        $.post("http://dm.sof60.dk:84/api/Developer", { Name: name, Email: email });
    });

    $("#btnCookie").click(function () {
        var name = $("#cookie").val();

        var date = new Date();
        date.setTime(date.getDate() + 5);
        var expires = "expires=" + date.toUTCString();
        document.cookie = "myCookie=" + name + ";" + expires + ";";

        //var cookie = getCookie("myCookie");
        //$("#nameCookie").text(cookie);//getCookie("myCookie"));
        getCookie("nameCookie");
    })

});

function loadDeveloperTable(data) {
    var table = document.getElementById("developerTable")
    table.innerHTML = "<tr><th>Id</th><th>Name</th><th>Email</th><th>Task</th></tr>";
    for (var i = 0; i < data.length; i++) {
        table.innerHTML += "<tr>" +
            "<td class='id'>" + data[i].Id + "</td>" +
            "<td>" + data[i].Name + "</td>" +
            "<td>" + data[i].Email + "</td>" +
            "<td>" + data[i].Tasks + "</td>" +
            "<td><button class='btn' style='font-size:10px;'>Delete</button></td>"
        "</tr>"
    }

    $('#developerTable tr button').click(function () {
        var id = $(this).parent().parent().find('.id').text();
        deleteDeveloper(id);
    });
}

function deleteDeveloper(id) {
    $.ajax({
        url: 'http://dm.sof60.dk:84/api/Developer/' + id,
        method: 'DELETE',
        contentType: 'text/plain',
        success: function (result) {
            alert("So succesfull");
        },
        error: function (request, msg, error) {
            alert("Shit. didnt work. Try again");
        }
    });
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
            var cval = c.substring(name.length, c.length);

            document.getElementById("nameCookie").innerHTML = cval;

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
