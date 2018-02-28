
var tempToken = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJTdGVmYW5PZ0FybmUiLCJqdGkiOiI3ZjBiYjRlNC1kOWFlLTRiY2EtYTQzZi03NTQyNmM2MWI3M2EiLCJuYmYiOjE1MTk3NDU3MjksImV4cCI6MTUyNDkyOTcyOSwiaXNzIjoiU1dLRyIsImF1ZCI6IkRFVlMifQ.kOQxyGBnUIywhIA-y5MvKQyGTMKarxuXvkJWvi1ONKI';
var storage = window.localStorage;
$(document).ready(function () {

    //Check if user is logged-in
    if ($.cookie('token') === null || $.cookie('token') === "") {
        alert("Please log in!");
        window.location.href = 'index.html'
    }
    //Check if there is pending posts thats nees sending
    if (!(storage.getItem("pendingPosts") === null)) {

        let pendingPosts = JSON.parse(storage.getItem("pendingPosts"));
        for (var i = 0; i < pendingPosts.length; i++) {
            postDeveloper(pendingPosts[i]);
        }
        storage.removeItem("pendingPosts");
    }


    $("#btnGetDevelopers").click(function () {
        getDevelopers();
    })

    $("#btnSubmit").click(function () {
        let name = $("#txtName").val();
        let email = $("#txtEmail").val();
        let developer = { "Name": name, "Email": email, "Task": null }
        postDeveloper(developer)
    });

    $("#btnLogin").click(function () {
        //Set cookies for easier access next time
        $.cookie("loginName", $("#loginName").val(), { expires: 7 });
        $.cookie("loginPassword", $("#loginPassword").val(), { expires: 7 });
        let loginData = { "username": $("#loginName").val(), "password": $("#loginPassword").val() }
        loginToWebservice(loginData)
    })

    $("#logInLink").click(function () {
        $("#loginDialog").modal('show');
        //Sets the cookie-values in the inputfields- OBS if they are set.
        $("#loginName").val($.cookie("loginName"));
        $("#loginEmail").val($.cookie("loginPassword"));
    })

    $("#logOutLink").click(function () {
        $.removeCookie('token');
        window.location.href = 'index.html'
    })

    $("#developerButton").click(function () {
        window.location.href = 'developer.html'
    })
})


function loginToWebservice(loginData) {
    $.ajax({
        url: 'http://centisoft.gotomain.net/api/v1/Client/login',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(loginData),
        success: function (data) {
            $.cookie("token", 'bearer ' + data);
            window.location.href = 'controlPanel.html';
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
            alert("Couldn't post new developer at the moment. Will try again after next refresh")
            var localstorage = window.localStorage;
            if (localstorage.getItem("pendingPosts") === null) {
                let posts = [];
                posts.push(newDeveloper);
                localstorage.setItem("pendingPosts", JSON.stringify(posts));
            }
            else {
                let storedPosts = JSON.parse(localstorage.getItem("pendingPosts"));
                storedPosts.push(newDeveloper);
                localstorage.setItem("pendingPosts", JSON.stringify(storedPosts));
            }

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
        headers: { 'Authorization': $.cookie("token") },
        success: function (data) {
            loadDeveloperTable(data);
        }
    });
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




