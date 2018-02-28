
var tempToken = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJTdGVmYW5PZ0FybmUiLCJqdGkiOiI3ZjBiYjRlNC1kOWFlLTRiY2EtYTQzZi03NTQyNmM2MWI3M2EiLCJuYmYiOjE1MTk3NDU3MjksImV4cCI6MTUyNDkyOTcyOSwiaXNzIjoiU1dLRyIsImF1ZCI6IkRFVlMifQ.kOQxyGBnUIywhIA-y5MvKQyGTMKarxuXvkJWvi1ONKI';

$(document).ready(function () {

    $("#btnGetDevelopers").click(function () {
        getDevelopers();
    })

    $("#btnSubmit").click(function () {
        let name = $("#txtName").val();
        let email = $("#txtEmail").val();
        let developer = { "Name": name, "Email": email, "Task": null }
        postDeveloper(developer)
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

    $("#btnLogin").click(function () {
        $.cookie("loginName", $("#loginName").val(), { expires: 7 });
        $.cookie("loginPassword", $("#loginPassword").val(), { expires: 7 });
        let loginData = { "username": $("#loginName").val(), "password": $("#loginPassword").val() }
        loginToWebservice(loginData)
    })

    $("#loginLink").click(function () {
        $("#loginDialog").modal('show');
        $("#loginName").val($.cookie("loginName"));
        $("#loginEmail").val($.cookie("loginPassword"));
    })
})


function loginToWebservice(loginData) {
    $.ajax({
        url: 'http://centisoft.gotomain.net/api/v1/Client/login',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(loginData),
        success: function (data) {
            $.cookie("token", 'bearer ' + data)
            alert($.cookie("token"));
        },
        error: function () {
            alert("Wrong username or password")
        }
    });
}

function loadDeveloperTable(data) {
    var table = document.getElementById("developerTable")
    table.innerHTML = "<tr><th>Id</th><th>Name</th><th>Email</th><th>Task</th></tr>";
    for (var i = 0; i < data.length; i++) {
        table.innerHTML += "<tr>" +
            "<td class='id'>" + data[i].Id + "</td>" +
            "<td class='editableCell editName' contenteditable='false'>" + data[i].Name + "</td>" +
            "<td class='editableCell editEmail' contenteditable='false'>" + data[i].Email + "</td>" +
            "<td class=tableTask>" + data[i].Tasks[0] + "</td>" +
            "<td><button class='btn delete' style='font-size:10px;'>Delete</button></td>" +
            "<td><button class='btn update' style='font-size:10px;'>Edit</button></td>"
        "</tr>"
    }

    $('#developerTable tr').find('.delete').click(function () {
        var id = $(this).parent().parent().find('.id').text();
        deleteDeveloper(id);
    });

    $('#developerTable tr').find('.update').click(function () {
        upDateButtonHandler($(this));
    });

}

function postDeveloper(newDeveloper) {
    $.ajax({
        url: 'http://centisoft.gotomain.net/api/v1/developer',
        dataType: 'json',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(newDeveloper),
        headers: { 'Authorization': $.cookie("token") },
        success: function (data) {
            getDevelopers();
            //Reset textfields
            $("#txtName").val("");
            $("#txtEmail").val("");
        },
        error: function () {
            alert("Something went wrong")
        }
    });
}

function updateDeveloper(editedDeveloper, id) {
    $.ajax({
        url: 'http://centisoft.gotomain.net/api/v1/developer/' + id,
        dataType: 'json',
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(editedDeveloper),
        headers: { 'Authorization': $.cookie("token") },
        success: function (data) {
            getDevelopers();
        },
        error: function (jqXhr, textStatus, errorThrown) {
            alert("Something went wrong")
        }
    });

}


function deleteDeveloper(id) {
    $.ajax({
        url: 'http://centisoft.gotomain.net/api/v1/developer/' + id,
        method: 'DELETE',
        contenttype: "application/json; charset=utf-8",
        headers: { 'Authorization': $.cookie("token") },
        success: function (result) {
            getDevelopers();

        },
        error: function (request, msg, error) {
            alert("Shit. didnt work. Try again");
        }
    });
}

function getDevelopers() {
    $.ajax({
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        url: 'http://centisoft.gotomain.net/api/v1/developer',
        headers: { 'Authorization': tempToken },
        success: function (data) {
            loadDeveloperTable(data);
        }
    });
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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

function upDateButtonHandler(updateButton) {
    //Clears previous selections
    $("#developerTable td").attr('contenteditable', 'false');
    $("#developerTable td").css("border", "none")

    if ($(updateButton).text() == "Edit") {
        //Reset all other buttons..There can be only one!
        $("#developerTable button").text("Edit");
        $("#developerTable button").css("color", "black");
        //Set all '.editCell -elements' contenteditable-attributes to true. And give a green border.... And sets focus
        $(updateButton).parent().parent().find('.editableCell').attr('contenteditable', 'true');
        $(updateButton).parent().parent().find('.editableCell').css("border", "solid rgba(0, 255, 0, 0.3) 4px")
        $(updateButton).parent().parent().find('.editName').trigger('focus');
        //Change button to save-mode
        $(updateButton).text("Save");
        $(updateButton).css("color", "green");
    }
    else if ($(updateButton).text() == "Save") {
        let id = $(updateButton).parent().parent().find('.id').text();
        let name = $(updateButton).parent().parent().find('.editName').text();
        let email = $(updateButton).parent().parent().find('.editEmail').text();
        let editedDeveloper = { "Name": name, "Email": email, "Task": null };
        updateDeveloper(editedDeveloper, id);
    }
}




