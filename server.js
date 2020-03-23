const express = require("express");
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static((__dirname, "./public")));
app.set("view engine", "ejs");
app.set('views', (__dirname, './views'));

const server = app.listen(5000);
const io = require("socket.io")(server);

//sockets
var id = 0;
var messages = {};
var users = {};

io.sockets.on('connection', function (socket) {
    socket.on("new_user", function (data) {
        users[socket.id] = {name: data.name};
        socket.emit('existing_messages', messages);
        io.emit("display_new_user", {name: data.name})
    });

    socket.on("new_message", function (data) {
        messages[id] = {name: data.name, message: data.message};
        io.emit("update_messages", messages[id]);
        id++;
    })

    socket.on("disconnect", function () {
        io.emit("user_disconnect", users[socket.id])
    })
});

// routes
app.get("/", (req, res) => {
    res.render("index");
});


