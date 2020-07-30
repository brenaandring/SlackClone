$(document).ready(function () {
    const socket = io.connect();
    const name = prompt('Please enter your first and last name! Otherwise, you will show up as a blank user due to prompt ;D');
    if (name == null) {
        return;
    }

    $('#user')[0].textContent = name;
    $('#user2')[0].textContent = name;

    socket.emit("new_user", {name: name});
    $('#button').click(function () {
        socket.emit("new_message", {name: name, message: $('#new_message').val()});
        $('#new_message').val("");
    });

    socket.on('existing_messages', function (data) {
        for (i in data)
            $(".content").append("<li>" + "<p style='color:black'>" + data[i].name + "</p>" + data[i].message + "</p>");
    });

    socket.on('update_messages', function (data) {
        $(".content").append("<li>" + "<p style='color:black'>" + data.name + "</p>" + data.message + "</p>");
    });

    socket.on('user_disconnect', function (data) {
        $(".content").append("<li>" + "<p style='color:lightgray'>" + data.name + " has left the channel" + "</p>");
    });

    socket.on('display_new_user', function (data) {
        $(".content").append("<li>" + "<p style='color:lightgray'>" + data.name + " has joined the channel" + "</p>");
    });

    $('#myform').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            url : $(this).attr('action') || window.location.pathname,
            type: "GET",
            data: $(this).serialize(),
            success: function (data) {
                $("#form_output").html(data);
            },
            error: function (jXHR, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });
    });
});

$(function() {
    $('messages').each(function() {
        $(this).find('messages').keypress(function(e) {
            // Enter pressed?
            if(e.which === 10 || e.which === 13) {
                this.messages.submit();
            }
        });

        $(this).find('input[type=submit]').hide();
    });
});