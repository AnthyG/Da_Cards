"use strict";

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var request = require('request');
var mysql = require('mysql');
var fs = require('fs');

// USE REAL LOGIN-SYSTEM (with mysql) HERE!!
var loginlist = [];

function getloginlist(callback) {
    loginlist = [];

    var rows;
    rows = eval(fs.readFileSync('PRIVATE/loginlist.js', 'UTF-8'));
    rows.forEach(function(row) {
        //  console.log("\n"+Date().toString()+":\n"+row);
        loginlist.push({ "user_name": row['user_name'], "user_email": row['user_email'], "user_password_hash": row['user_password_hash'] });
    });

    setTimeout(function() {
        typeof callback === 'function' && callback();
    }, 1000);
};

function ggetloginlist(callback2) {
    getloginlist(function() {
        if (loginlist !== undefined && loginlist.length !== 0) {
            console.log("\n" + Date().toString() + ":\n" + "loginlist loaded!");
        } else if (loginlist === undefined || loginlist.length < 1) {
            console.error("\n" + Date().toString() + ":\n" + "loginlist not loaded!!");
        }
        setTimeout(function() {
            typeof callback2 === 'function' && callback2();
        }, 1000);
    });
}

server.listen(port, function() {
    ggetloginlist(function() {
        console.log("\n" + Date().toString() + ":\n" + 'Server listening at port %d', port);
    });
});

// Routing
var dir = __dirname + '/public/';
app.use(express.static(dir));
app.get(/^(.+)$/, function(req, res) {
    res.sendFile(dir + "index.html");
});

var numUsers = 0;
var userlists = { "eo": {}, "o": [], "g": {}, "gids": [] };

// (min * 60secs)-1sec = secs
var roundLengthNormal = (1 * 10) - 1; // 1min (60secs)
var roundLengthExtended = (60 * 60) - 1; // 60mins (3600secs)

// https://mcsanthy.de/da_cards/cardcreator.php
var standardDeckCards = eval(fs.readFileSync('standardDeckCards.js', 'UTF-8'));
setInterval(function() {
    standardDeckCards = eval(fs.readFileSync('standardDeckCards.js', 'UTF-8'));
}, 5000);

ggetloginlist(function() {
    console.log("The Second Time Of Loading The LoginList..");
});

io.on('connection', function(socket) {
    var addedUser = false;

    function SA(msg, fnc, mode, room) {
        if (typeof fnc !== 'function') { fnc = undefined; } else if (typeof fnc === 'function') { var fnc = fnc.toString(); }
        var room = room || undefined;
        var mode = mode || undefined;
        console.log("\n" + Date().toString() + ":\n" + socket.username + " | " + msg + " | " + fnc + " | " + mode + " | " + room);
        if (mode !== undefined && mode !== "") {
            if (mode === "ai") { // all include
                io.emit('SA', {
                    msg: msg,
                    fnc: fnc
                });
            } else if (mode === "ae") { // all except
                socket.broadcast.emit('SA', {
                    msg: msg,
                    fnc: fnc
                });
            } else if (mode === "aiI" && room !== undefined) { // all include IN
                io.in(room).emit('SA', {
                    msg: msg,
                    fnc: fnc
                });
            } else if (mode === "aeI" && room !== undefined) { // all except IN
                socket.broadcast.to(room).emit('SA', {
                    msg: msg,
                    fnc: fnc
                });
            }
        } else {
            if (room !== undefined) { // sender IN
                socket.to(room).emit('SA', {
                    msg: msg,
                    fnc: fnc
                });
            } else { // sender
                socket.emit('SA', {
                    msg: msg,
                    fnc: fnc
                });
            }
        }
    }

    function SCL(msg, fnc, mode, room) {
        if (typeof fnc !== 'function') { fnc = undefined; } else if (typeof fnc === 'function') { var fnc = fnc.toString(); }
        var room = room || undefined;
        var mode = mode || undefined;
        console.log("\n" + Date().toString() + ":\n" + socket.username + " | " + msg + " | " + fnc + " | " + mode + " | " + room);
        if (mode !== undefined && mode !== "") {
            if (mode === "ai") { // all include
                io.emit('SCL', {
                    msg: msg,
                    fnc: fnc
                });
            } else if (mode === "ae") { // all except
                socket.broadcast.emit('SCL', {
                    msg: msg,
                    fnc: fnc
                });
            } else if (mode === "aiI" && room !== undefined) { // all include IN
                io.in(room).emit('SCL', {
                    msg: msg,
                    fnc: fnc
                });
            } else if (mode === "aeI" && room !== undefined) { // all except IN
                socket.broadcast.to(room).emit('SCL', {
                    msg: msg,
                    fnc: fnc
                });
            }
        } else {
            if (room !== undefined) { // sender IN
                socket.to(room).emit('SCL', {
                    msg: msg,
                    fnc: fnc
                });
            } else { // sender
                socket.emit('SCL', {
                    msg: msg,
                    fnc: fnc
                });
            }
        }
    }

    function SP(page, fnc, mode, room) {
        var cntnt = fs.readFileSync('public/' + page, 'UTF-8');
        if (typeof fnc !== 'function') { fnc = undefined; } else if (typeof fnc === 'function') { var fnc = fnc.toString(); }
        var room = room || undefined;
        var mode = mode || undefined;
        console.log("\n" + Date().toString() + ":\n" + socket.username + " | " + page + " | " + fnc + " | " + mode + " | " + room);
        if (mode !== undefined && mode !== "") {
            if (mode === "ai") { // all include
                io.emit('SP', {
                    cntnt: cntnt,
                    fnc: fnc
                });
            } else if (mode === "ae") { // all except
                socket.broadcast.emit('SP', {
                    cntnt: cntnt,
                    fnc: fnc
                });
            } else if (mode === "aiI" && room !== undefined) { // all include IN
                io.in(room).emit('SP', {
                    cntnt: cntnt,
                    fnc: fnc
                });
            } else if (mode === "aeI" && room !== undefined) { // all except IN
                socket.broadcast.to(room).emit('SP', {
                    cntnt: cntnt,
                    fnc: fnc
                });
            }
        } else {
            if (room !== undefined) { // sender IN
                socket.to(room).emit('SP', {
                    cntnt: cntnt,
                    fnc: fnc
                });
            } else { // sender
                socket.emit('SP', {
                    cntnt: cntnt,
                    fnc: fnc
                });
            }
        }
    }

    function fy(a, b, c, d) { //array,placeholder,placeholder,placeholder
        c = a.length;
        while (c) b = Math.random() * c-- | 0, d = a[c], a[c] = a[b], a[b] = d
    }

    function rlp(callback) {
        SP("lobbypage.html", function FNCr(CALLBACKf) {
            setTimeout(function() {
                $(".reloadlobbypagebutton").on('click', function() {
                    socket.emit('rlp');
                });
                $(".searchbutton").on('click', function() {
                    socket.emit('sosS');
                });
                $(".logoutbutton").html("Logout, " + username);
                $("#PAGETITLE").html("Da_Cards: Lobby");
                typeof CALLBACKf === 'function' && CALLBACKf();
            }, 1500);
        });
        SCL("lobbypage reloaded");
        SCL(userlists);
        rlp2();
        typeof callback === 'function' && callback();
    }
    socket.on('rlp', rlp);

    function rlp2(callback) {
        io.in('lobby').emit('rlp2', {
            nrofmep: Object.keys(userlists["g"]).length,
            nrops: userlists["gids"].length,
            po: userlists["o"]
        });
        SCL("lobbypage-data reloaded");
        typeof callback === 'function' && callback();
    }
    socket.on('rlp', rlp2);

    socket.on("rcvsrlst", function() {
        SCL(userlists);
    });
    socket.on("get_g", function(data) {
        var gid = data["gid"];
        SCL(userlists["g"][gid]);
    });

    var testlogin;

    function logincheck(username, password) {
        loginlist.forEach(function(user) {
            if (user !== undefined) {
                if (username === user['user_name'] || username === user['user_email']) {
                    var hash = user['user_password_hash'];
                    username = user['user_name'];
                    if (hash === password) {
                        testlogin = "true";
                    } else {
                        testlogin = "wp";
                    }
                    // hash = hash.replace(/^\$2y(.+)$/i, '\$2a$1');
                    // bcrpt.compare(password, hash, function(err, res) {
                    //     if (res === true) {
                    //         testlogin = "true";
                    //     } else {
                    //         testlogin = "wp";
                    //     }
                    // });
                }
            }
        });
        if (testlogin === undefined) {
            testlogin = "false";
        }
        return testlogin;
    }
    socket.on('try2login', function(data) {
        if (addedUser) return;

        function wlcm() {
            console.log("\n" + Date().toString() + ":\n" + ">>" + username + "<< successfully logged in!");
            socket.username = username;

            addedUser = true;

            if (userlists["eo"][socket.username] === undefined) {
                userlists["eo"][socket.username] = {
                    "gid": null
                };
            }

            userlists["o"].push(socket.username);

            socket.emit('loginvalid', {
                isvalid: true,
                wlcm: "da peece to MCSAnthy's Da_Cards!"
            });

            if (userlists["eo"][socket.username]["gid"] !== null) {
                var roomid = userlists["eo"][socket.username]["gid"];
                SCL("You are already in a Game (" + roomid + ")");

                socket.state = "playing";
                socket.join(roomid);
                socket.leave("lobby");
                socket.leave("searching");

                var itshimN;
                if (userlists["g"][roomid]["Players"][0]["Player"] === socket.username) {
                    itshimN = userlists["g"][roomid]["Players"][1]["Player"];
                } else if (userlists["g"][roomid]["Players"][1]["Player"] === socket.username) {
                    itshimN = userlists["g"][roomid]["Players"][0]["Player"];
                }
                socket.emit("otheropponent", {
                    "usr": itshimN
                });

                SP("gamepage.html", function FNCr(CALLBACKf) {
                    setTimeout(function() {
                        $(".gameid").html(roomid);
                        $(".opponent").html(opponent);
                        $(".giveupbutton").on('click', function() {
                            socket.emit('giveup');
                        });
                        $(".get_g_button").on('click', function() {
                            socket.emit('get_g', {
                                gid: roomid
                            });
                        });

                        $("#PAGETITLE").html("Da_Cards: VS " + opponent);
                        // socket.emit('rcvsrlst')

                        typeof CALLBACKf === 'function' && CALLBACKf();
                    }, 1500);
                });
                SCL("gamepage loaded");

                snddcks();
            } else {
                socket.join("lobby");
                socket.state = "lobby";
                rlp();
                // SCL(userlists, "", "aiI", "lobby");
            }
        }

        function wp() {
            console.log("\n" + Date().toString() + ":\n" + ">>" + username + "<< has entered wrong password!!");
            socket.emit('Wrong password!');
        }

        if (data['username'] !== "" && data['password'] !== "" && userlists["o"].indexOf(data['username']) === -1) {
            var username;
            var password;
            username = data['username'];
            password = data['password'];

            testlogin = undefined;

            console.log("\n" + Date().toString() + ":\n" + "Searching for >>" + username + "<< in the loginlist..");

            var testlogin = logincheck(username, password);
            if (testlogin === "true") {
                wlcm();
            } else if (testlogin === "wp") {
                wp();
            } else if (testlogin === "false") {
                console.log("\n" + Date().toString() + ":\n" + "Couldn't find >>" + username + "<< in current loginlist, trying again.. ");
                ggetloginlist(function() {
                    var testlogin = logincheck(username, password);
                    if (testlogin === "true") {
                        wlcm();
                    } else if (testlogin === "wp") {
                        wp();
                    } else if (testlogin === "false") {
                        socket.emit('Not registered yet!');
                        console.log("\n" + Date().toString() + ":\n" + "Couldn't find >>" + username + "<< in current loginlist!!");
                    }
                });
            }
        } else {
            console.log("\n" + Date().toString() + ":\n" + "User >>" + data['username'] + "<< already logged in or smthng not set");
            socket.emit('loginvalid', {
                isvalid: false
            });
        }
    });

    socket.on('sosS', function(data) {
        console.log(socket.username + " is currently in state " + socket.state);
        if (socket.state === "searching") {
            socket.state = "lobby";
        } else if (socket.state === "lobby") {
            // ZUERST MUSSER CHECKN, OB DER SPIELER NICH SCHON IN NEM SPIEL IS!! (userlists["eo"][socket.username]["gid"] === null)
            if (userlists["eo"][socket.username]["gid"] !== null) {
                var roomid = userlists["eo"][socket.username]["gid"];
                SCL("You are already in a Game (" + roomid + ")");

                socket.state = "playing";
                socket.join(roomid);
                socket.leave("lobby");
                socket.leave("searching");

                var itshimN;
                if (userlists["g"][roomid]["Players"][0]["Player"] === socket.username) {
                    itshimN = userlists["g"][roomid]["Players"][1]["Player"];
                } else if (userlists["g"][roomid]["Players"][1]["Player"] === socket.username) {
                    itshimN = userlists["g"][roomid]["Players"][0]["Player"];
                }
                socket.emit("otheropponent", {
                    "usr": itshimN
                });

                SP("gamepage.html", function FNCr(CALLBACKf) {
                    setTimeout(function() {
                        $(".gameid").html(roomid);
                        $(".opponent").html(opponent);
                        $(".giveupbutton").on('click', function() {
                            socket.emit('giveup');
                        });
                        $(".get_g_button").on('click', function() {
                            socket.emit('get_g', {
                                gid: roomid
                            });
                        });

                        $("#PAGETITLE").html("Da_Cards: VS " + opponent);
                        // socket.emit('rcvsrlst')

                        typeof CALLBACKf === 'function' && CALLBACKf();
                    }, 1500);
                });
                SCL("gamepage loaded");

                snddcks();
            } else if (userlists["eo"][socket.username]["gid"] === null) {
                socket.state = "searching";
                socket.join("searching");

                SCL("Starting search..", function FNCr(CALLBACKf) {
                    $(".searchbutton").html("Stop search for game");
                    $(".searchbutton").removeClass("btn-success");
                    $(".searchbutton").addClass("btn-warning");
                    $(".reloadlobbypagebutton").hide();
                    $(".logoutbutton").hide();
                    $("#PAGETITLE").html("Da_Cards: Searching..");
                    typeof CALLBACKf === 'function' && CALLBACKf();
                });

                if (userlists["gids"].length < 1) {
                    SCL("Creating GID..");

                    var roomid = "GID-" + (Math.floor((Math.random() * 1000000) + 1)).toString();
                    userlists["gids"].push(roomid);
                    userlists["eo"][socket.username]["gid"] = roomid;
                    socket.join(roomid);

                    SCL("GID Created! (" + roomid + ")");
                    socket.waiting = 0;
                    waitingforjoin(roomid);

                    rlp2();
                } else {
                    SCL(userlists);
                    socket.waiting = 0;
                    searchforjoin();
                }
            }
        } else if (socket.state === "playing") {
            SA("You are already in a Game (" + userlists["eo"][socket.username]["gid"] + ")");
        }
    });

    function waitingforjoin(roomid) {
        if (socket.waiting <= 60 && socket.state === "searching") {
            socket.waiting++;
            SCL("Waiting " + (socket.waiting).toString());
            setTimeout(function() {
                waitingforjoin(roomid);
            }, 1000);
        } else if (socket.waiting > 60 || socket.state !== "searching") {
            SCL("Stopping search..", function FNCr(CALLBACKf) {
                $(".searchbutton").html("Start search for game");
                $(".searchbutton").removeClass("btn-warning");
                $(".searchbutton").addClass("btn-success");
                $(".reloadlobbypagebutton").show();
                $(".logoutbutton").show();
                $("#PAGETITLE").html("Da_Cards: Lobby");
                typeof CALLBACKf === 'function' && CALLBACKf();
            });
            socket.leave("searching");

            if (socket.state !== "playing") {
                userlists["gids"].splice(userlists["gids"].indexOf(roomid), 1);
                socket.state = "lobby";
                userlists["eo"][socket.username]["gid"] = null;
                socket.leave(roomid);
                SCL("Quitted search!");
                rlp2();
            } else {
                SCL("Player Joined!");
                rlp2();
            }
        }
    }

    function searchforjoin() {
        if (socket.waiting <= 60 && socket.state === "searching") {
            socket.waiting++;
            SCL("Searching " + (socket.waiting).toString());

            if (userlists["gids"][0]) {
                var roomid = userlists["gids"][0];
                userlists["eo"][socket.username]["gid"] = roomid;

                userlists["gids"].splice(userlists["gids"].indexOf(roomid), 1);

                SCL("GID Found " + roomid);
                joingid();
            } else {
                setTimeout(function() {
                    searchforjoin();
                }, 1000);
            }
        } else if (socket.waiting > 60 || socket.state !== "searching") {
            SCL("Stopping search..", function FNCr(CALLBACKf) {
                $(".searchbutton").html("Start search for game");
                $(".searchbutton").removeClass("btn-warning");
                $(".searchbutton").addClass("btn-success");
                $(".reloadlobbypagebutton").show();
                $(".logoutbutton").show();
                $("#PAGETITLE").html("Da_Cards: Lobby");
                typeof CALLBACKf === 'function' && CALLBACKf();
            });

            socket.state = "lobby";
            socket.leave("searching");
        }
    }

    function joingid() {
        var roomid = userlists["eo"][socket.username]["gid"];

        socket.state = "playing";
        socket.join(roomid);
        socket.leave("lobby");
        socket.leave("searching");

        socket.emit("playerfound", {
            gid: roomid
        });
        socket.broadcast.to(roomid).emit('playerjoined', {
            usr: socket.username,
            gid: roomid
        });
    }
    socket.on('playerhasjoined', function(data) {
        socket.state = "playing";
        socket.leave("lobby");

        var roomid = userlists["eo"][socket.username]["gid"];

        socket.broadcast.to(roomid).emit('otheropponent', {
            usr: socket.username
        });

        setTimeout(function() {
            populateDeck2(roomid, data["oppo"]);
        }, 500);
    });


    function populateDeck2(roomid, oppo) {
        var oppos = [socket.username, oppo];
        userlists["g"][roomid] = {
            "RoomID": roomid,
            "Players": {
                0: {
                    "Player": socket.username,
                    "roundsOFF": 0,
                    "deck": {
                        "onHand": {},
                        "onField": {},
                        "inBlock": {}
                    },
                    "MP-Left": 20
                },
                1: {
                    "Player": oppo,
                    "roundsOFF": 0,
                    "deck": {
                        "onHand": {},
                        "onField": {},
                        "inBlock": {}
                    },
                    "MP-Left": 20
                }
            },
            "Creationdate": Date().toString(),
            "Winner": null,
            "WinCause": null,
            "currentPlayer": oppos[Math.floor(Math.random() * oppos.length)],
            "roundLength": roundLengthNormal,
            "timeRunning": 0,
            "roundNumber": 0
        };

        function generatedeckthingieandreturn(number, mode, empty) {
            var mode = mode || false;
            var empty = empty || false;

            var arr;
            arr = [];
            var fncs;
            fncs = [];
            var ARRAYTHINGIEd = {};

            function gRC() {
                // console.log("gRC called");
                return standardDeckCards[Math.floor(Math.random() * standardDeckCards.length)];
            }

            for (var a = 0; a < number; a++) {
                // console.log(a);
                fncs[a] = function(b, modeP, emptyP) {
                    // console.log(a+" called");
                    return function() {
                        if (emptyP !== true) {
                            arr[b] = gRC();
                            arr[b]["CID"] = "CID-" + (Math.floor((Math.random() * 900) + 100)).toString();
                            if (modeP === true) {
                                arr[b]["position"] = b;
                            }
                            return JSON.stringify(arr[b]);
                        } else if (emptyP === true) {
                            arr[b] = null;
                            return JSON.stringify(arr[b]);
                        }
                    }
                };
                ARRAYTHINGIEd[a] = (JSON.parse(fncs[a](a, mode, empty)()));
            }
            return ARRAYTHINGIEd;
        }
        for (var xa = 0; xa < 2; xa++) {
            userlists["g"][roomid]["Players"][xa]["deck"]["onHand"] = generatedeckthingieandreturn(5);
            userlists["g"][roomid]["Players"][xa]["deck"]["onField"] = generatedeckthingieandreturn(13, false, true);
            userlists["g"][roomid]["Players"][xa]["deck"]["inBlock"] = generatedeckthingieandreturn(50);
        }

        SP("gamepage.html", function FNCr(CALLBACKf) {
            setTimeout(function() {
                $(".gameid").html(roomid);
                $(".opponent").html(opponent);
                $(".giveupbutton").on('click', function() {
                    socket.emit('giveup');
                });
                $(".get_g_button").on('click', function() {
                    socket.emit('get_g', {
                        gid: roomid
                    });
                });

                $("#PAGETITLE").html("Da_Cards: VS " + opponent);
                // socket.emit('rcvsrlst')

                typeof CALLBACKf === 'function' && CALLBACKf();
            }, 1500);
        }, "aiI", roomid);
        SCL("gamepage loaded", "", "aiI", roomid);

        snddcks();
        snddcks(true);

        gameloop(roomid);
    }

    function snddcks(oppo) {
        var oppo = oppo || false;
        var roomid = userlists["eo"][socket.username]["gid"];
        var itsme;
        var itshim;
        if (userlists["g"][roomid]["Players"][0]["Player"] === socket.username) {
            itsme = 0;
            itshim = 1;
        } else if (userlists["g"][roomid]["Players"][1]["Player"] === socket.username) {
            itsme = 1;
            itshim = 0;
        }
        if (oppo === true) {
            socket.broadcast.to(roomid).emit('snddcks', {
                "d0_MP-Left": userlists["g"][roomid]["Players"][itshim]["MP-Left"],
                "d0_onHand": userlists["g"][roomid]["Players"][itshim]["deck"]["onHand"],
                "d0_onField": userlists["g"][roomid]["Players"][itshim]["deck"]["onField"],
                "d0_inBlockC": Object.keys(userlists["g"][roomid]["Players"][itshim]["deck"]["inBlock"]).length,
                "d1_MP-Left": userlists["g"][roomid]["Players"][itsme]["MP-Left"],
                "d1_onHand": Object.keys(userlists["g"][roomid]["Players"][itsme]["deck"]["onHand"]).length,
                "d1_onField": userlists["g"][roomid]["Players"][itsme]["deck"]["onField"],
                "d1_inBlockC": Object.keys(userlists["g"][roomid]["Players"][itsme]["deck"]["inBlock"]).length,
            });
            console.log("Sent decks into " + roomid);
        } else if (oppo === false) {
            socket.emit('snddcks', {
                "d0_MP-Left": userlists["g"][roomid]["Players"][itsme]["MP-Left"],
                "d0_onHand": userlists["g"][roomid]["Players"][itsme]["deck"]["onHand"],
                "d0_onField": userlists["g"][roomid]["Players"][itsme]["deck"]["onField"],
                "d0_inBlockC": Object.keys(userlists["g"][roomid]["Players"][itsme]["deck"]["inBlock"]).length,
                "d1_MP-Left": userlists["g"][roomid]["Players"][itshim]["MP-Left"],
                "d1_onHand": Object.keys(userlists["g"][roomid]["Players"][itshim]["deck"]["onHand"]).length,
                "d1_onField": userlists["g"][roomid]["Players"][itshim]["deck"]["onField"],
                "d1_inBlockC": Object.keys(userlists["g"][roomid]["Players"][itshim]["deck"]["inBlock"]).length,
            });
            console.log("Sent decks to " + socket.username);
        }
    }

    function gameloop(roomid, nextround) {
        var nextround = nextround || false;

        if (userlists["g"][roomid]["timeRunning"] % 5 === 0) {
            gl_sendCurPlayer(roomid);
            // SCL("Round ("+userlists["g"][roomid]["roundNumber"]+") Time passed: "+userlists["g"][roomid]["timeRunning"], "", "aiI", roomid);
        }

        if (userlists["g"][roomid]["timeRunning"] < userlists["g"][roomid]["roundLength"] && nextround === false) {
            userlists["g"][roomid]["timeRunning"]++;
        } else if (userlists["g"][roomid]["timeRunning"] >= userlists["g"][roomid]["roundLength"] || nextround === true) {
            for (var px = 0; px < 2; px++) {
                // for (var cx = 0; cx < userlists["g"][roomid]["Players"][px]["deck"]["onField"].length; cx++) {
                for (var cx in userlists["g"][roomid]["Players"][px]["deck"]["onField"]) {
                    // console.log(px+" // "+cx);
                    if (userlists["g"][roomid]["Players"][px]["deck"]["onField"][cx] !== null) {
                        userlists["g"][roomid]["Players"][px]["deck"]["onField"][cx]["AlreadyUsed"] = false;

                        // console.log("exists");
                        if (userlists["g"][roomid]["Players"][px]["deck"]["onField"][cx]["RoundsLeft"] >= 1) {
                            // userlists["g"][roomid]["Players"][px]["deck"]["onField"].splice(cx, 1);
                            userlists["g"][roomid]["Players"][px]["deck"]["onField"][cx]["RoundsLeft"]--;
                        } else if (userlists["g"][roomid]["Players"][px]["deck"]["onField"][cx]["RoundsLeft"] < 1) {
                            userlists["g"][roomid]["Players"][px]["deck"]["onField"][cx] = null;
                        }
                    }
                }
            }

            userlists["g"][roomid]["timeRunning"] = 0;
            userlists["g"][roomid]["roundNumber"]++;
            if (nextround === true) {
                console.log("\n" + Date().toString() + ":\n" + roomid + " is continuing to next Round (" + userlists["g"][roomid]["roundNumber"] + ")");
                SCL("Continuing to next Round (" + userlists["g"][roomid]["roundNumber"] + ")");
            } else {
                SCL("Round (" + userlists["g"][roomid]["roundNumber"] + ")", "", "aiI", roomid);
            }

            gl_changeCurPlayer(roomid);

            var itsone;
            var itstwo;
            if (userlists["g"][roomid]["Players"][0]["Player"] === userlists["g"][roomid]["currentPlayer"]) {
                itsone = 0;
                itstwo = 1;
            } else if (userlists["g"][roomid]["Players"][1]["Player"] === userlists["g"][roomid]["currentPlayer"]) {
                itsone = 1;
                itstwo = 0;
            }
            if (userlists["o"].indexOf(userlists["g"][roomid]["currentPlayer"]) === -1 && userlists["g"][roomid]["Players"][itsone]["roundsOFF"] < 3) {
                userlists["g"][roomid]["Players"][itsone]["roundsOFF"]++;
            } else if (userlists["o"].indexOf(userlists["g"][roomid]["currentPlayer"]) === -1 && userlists["g"][roomid]["Players"][itsone]["roundsOFF"] === 3) {
                // userlists["g"][roomid]["Winner"] = userlists["g"][roomid]["Players"][itstwo]["Player"];
                // userlists["g"][roomid]["WinCause"] = "RO";
                addnewwin(roomid, userlists["g"][roomid]["Players"][itstwo]["Player"], "RO");

                SCL("Your Opponent (" + userlists["g"][roomid]["Players"][itsone]["Player"] + ") was AFK for too long (" + userlists["g"][roomid]["Players"][itsone]["roundsOFF"] + "). You win!", function FNCr(CALLBACKf) {
                    $('.modal').modal('hide');
                    socket.emit('roundisover');
                }, "aeI", roomid);

                userlists["eo"][userlists["g"][roomid]["Players"][itsone]["Player"]]["gid"] = null;
                // userlists["eo"][userlists["g"][roomid]["Players"][itstwo]["Player"]]["gid"] = null;
            }

            if (userlists["g"][roomid]["Winner"] === null && userlists["g"][roomid]["WinCause"] === null) {
                snddcks();
                snddcks(true);
            }
        }

        if (userlists["g"][roomid]["Winner"] === null && userlists["g"][roomid]["WinCause"] === null && nextround === false) {
            setTimeout(function() {
                gameloop(roomid);
            }, 1000);
        } else if (nextround === false) {
            console.log("\n" + Date().toString() + ":\n" + "The Winner of " + roomid + " is " + userlists["g"][roomid]["Winner"]);
        }
    }

    function gl_sendCurPlayer(roomid) {
        io.in(roomid).emit('curplayer', {
            "curplayer": userlists["g"][roomid]["currentPlayer"],
            "fnc": function FNCr(CALLBACKf) {
                if (username === data["curplayer"]) {
                    $("#own_text").addClass("h3");
                    $("#own_text").removeClass("h4");
                    $("#opp_text").addClass("h4");
                    $("#opp_text").removeClass("h3");

                    $(".cardsonhand0 .cardc").attr("draggable", "true");
                    $(".cardsonfield0 .cardc").attr("draggable", "true");

                    assigncarddragsndrops();
                } else if (opponent === data["curplayer"]) {
                    $("#opp_text").addClass("h3");
                    $("#opp_text").removeClass("h4");
                    $("#own_text").addClass("h4");
                    $("#own_text").removeClass("h3");

                    $(".cardsonfield0 .cardc").removeAttr("draggable");

                    assigncarddragsndrops(true);
                }
            }.toString()
        });
    }

    function gl_changeCurPlayer(roomid) {
        if (userlists["g"][roomid]["currentPlayer"] === userlists["g"][roomid]["Players"][0]["Player"]) {
            userlists["g"][roomid]["currentPlayer"] = userlists["g"][roomid]["Players"][1]["Player"];
        } else if (userlists["g"][roomid]["currentPlayer"] === userlists["g"][roomid]["Players"][1]["Player"]) {
            userlists["g"][roomid]["currentPlayer"] = userlists["g"][roomid]["Players"][0]["Player"];
        }
    }
    socket.on("movecard", function(data) {
        var roomid = userlists["eo"][socket.username]["gid"];

        var mt = data["mt"];
        var c1 = data["c1"];
        var c2 = data["c2"];

        if (socket.username === userlists["g"][roomid]["currentPlayer"] || mt === "h0-h0") {
            // verify move

            var itsme;
            var itshim;
            if (userlists["g"][roomid]["Players"][0]["Player"] === socket.username) {
                itsme = 0;
                itshim = 1;
            } else if (userlists["g"][roomid]["Players"][1]["Player"] === socket.username) {
                itsme = 1;
                itshim = 0;
            }

            if (mt === "h0-h0") {
                // var oldc1P = userlists["g"][roomid]["Players"][itsme]["deck"]["onHand"][c1]["position"];
                // userlists["g"][roomid]["Players"][itsme]["deck"]["onHand"][c1]["position"] = userlists["g"][roomid]["Players"][itsme]["deck"]["onHand"][c2]["position"];
                // userlists["g"][roomid]["Players"][itsme]["deck"]["onHand"][c2]["position"] = oldc1P;

                var oldc1 = userlists["g"][roomid]["Players"][itsme]["deck"]["onHand"][c1];
                userlists["g"][roomid]["Players"][itsme]["deck"]["onHand"][c1] = userlists["g"][roomid]["Players"][itsme]["deck"]["onHand"][c2];
                userlists["g"][roomid]["Players"][itsme]["deck"]["onHand"][c2] = oldc1;

                console.log(socket.username + " :: h0-h0 :: " + c1 + " <--> " + c2);
                SCL(socket.username + " :: h0-h0 :: " + c1 + " <--> " + c2);
                snddcks();
            } else if (mt === "h0-f0") {
                if (userlists["g"][roomid]["Players"][itsme]["deck"]["onField"][c2]) {
                    // Hier kommt dann auch sowat wie ne sofort-aktion/effekt

                    SCL("there's already a card at " + c2);
                    snddcks();
                } else {
                    // userlists["g"][roomid]["Players"][itsme]["deck"]["onHand"][c1]["position"] = c2;

                    userlists["g"][roomid]["Players"][itsme]["deck"]["onField"][c2] = userlists["g"][roomid]["Players"][itsme]["deck"]["onHand"][c1];

                    delete userlists["g"][roomid]["Players"][itsme]["deck"]["onHand"][c1];
                    // userlists["g"][roomid]["Players"][itsme]["deck"]["onHand"].splice(c1, 1);

                    console.log(socket.username + " :: h0-f0 :: " + c1 + " --> " + c2);
                    SCL(socket.username + " :: h0-f0 :: " + c1 + " --> " + c2);
                    snddcks();
                    snddcks(true);

                    gameloop(roomid, true);
                }
            } else if (mt === "f0-f1") {
                // Checken, ob es gewisse typen gibt, die auf dem Gegnerfield ausliegen, die z.B. blockieren
                // Dann halt den Schaden/Effekte usw. austeilen, AlreadyUsed setzen, MP-Left für den Spieler decreasen und kA wat noch
                if (userlists["g"][roomid]["Players"][itsme]["deck"]["onField"][c1] && userlists["g"][roomid]["Players"][itshim]["deck"]["onField"][c2]) {
                    console.log(socket.username + " :: f0-f1 :: " + c1 + " --> " + c2);
                    SCL(socket.username + " :: f0-f1 :: " + c1 + " --> " + c2);

                    // VERY BASIC ATTACK-SYSTEM
                    if (userlists["g"][roomid]["Players"][itsme]["deck"]["onField"][c1]["AlreadyUsed"] === false) {
                        userlists["g"][roomid]["Players"][itsme]["deck"]["onField"][c1]["AlreadyUsed"] = true;

                        var c1_HP = userlists["g"][roomid]["Players"][itsme]["deck"]["onField"][c1]["HP"];
                        var c2_HP = userlists["g"][roomid]["Players"][itshim]["deck"]["onField"][c2]["HP"];
                        var c1_AP = userlists["g"][roomid]["Players"][itsme]["deck"]["onField"][c1]["AP"];
                        var c2_AP = userlists["g"][roomid]["Players"][itshim]["deck"]["onField"][c2]["AP"];

                        for (var attacks = 0; attacks < c1_AP; attacks++) {
                            if (c2_HP > 0) {
                                c2_HP--;
                            } else {
                                break;
                            }
                        }
                        if (c2_HP > 0) {
                            userlists["g"][roomid]["Players"][itshim]["deck"]["onField"][c2]["HP"] = c2_HP;
                            for (var attacks = 0; attacks < c1_HP; attacks++) {
                                if (c1_HP > 0) {
                                    c1_HP--;
                                } else {
                                    break;
                                }
                            }
                            if (c1_HP > 0) {
                                userlists["g"][roomid]["Players"][itsme]["deck"]["onField"][c1]["HP"] = c1_HP;
                            } else if (c1_HP === 0) {
                                userlists["g"][roomid]["Players"][itsme]["deck"]["onField"][c1] = null;
                                SCL(c1 + " of yours has been destroyed by " + itshim + " with " + c2);
                            }
                        } else if (c2_HP === 0) {
                            userlists["g"][roomid]["Players"][itshim]["deck"]["onField"][c2] = null;
                            SCL(c2 + " of " + itshim + " has been destroyed by you with " + c1);
                        }
                    } else {
                        SCL(c1 + " has already been used in this round!");
                    }

                    snddcks();
                    snddcks(true);
                } else {
                    SCL("either c1 :: " + c1 + " or c2 :: " + c2 + " doesn't exist.");
                    snddcks();
                }

                // Er soll ja nich ne neue runde anfangn, nur weil EINMAL angegriffn wurde..
                // gameloop(roomid, true);
            }

            // userlists["g"][roomid]["timeRunning"] = userlists["g"][roomid]["roundLength"] + 1;
        }
    });

    socket.on('giveup', function(data) {
        var oldroomid = userlists["eo"][socket.username]["gid"];

        var itsone;
        var itstwo;
        if (userlists["g"][oldroomid]["Players"][0]["Player"] === socket.username) {
            itsone = 0;
            itstwo = 1;
        } else if (userlists["g"][oldroomid]["Players"][1]["Player"] === socket.username) {
            itsone = 1;
            itstwo = 0;
        }

        SCL("Your Opponent (" + socket.username + ") gave up. You Win!", function FNCr(CALLBACKf) {
            $('.modal').modal('hide');
            setTimeout(function() {
                socket.emit('roundisover');
            }, 300);
        }, "aeI", oldroomid);

        SCL("You gave up, you ....", function FNCr(CALLBACKf) {
            $('.modal').modal('hide');
            setTimeout(function() {
                socket.emit('rlp');
            }, 300);
        });
        userlists["eo"][socket.username]["gid"] = null;

        // userlists["g"][oldroomid]["Winner"] = userlists["g"][oldroomid]["Players"][itstwo]["Player"];
        // userlists["g"][oldroomid]["WinCause"] = "OGU";
        addnewwin(oldroomid, userlists["g"][oldroomid]["Players"][itstwo]["Player"], "OGU");

        socket.state = "lobby";
        socket.join("lobby");
        socket.leave(oldroomid);
        // rlp();
    });
    socket.on('roundisover', function(data) {
        var oldroomid = userlists["eo"][socket.username]["gid"];
        userlists["eo"][socket.username]["gid"] = null;

        socket.state = "lobby";
        socket.join("lobby");
        socket.leave(oldroomid);
        rlp();
    });

    function addnewwin(roomid, winner, wincause) {
        if (typeof wincause !== 'undefined' && typeof wincause !== 'null' && wincause !== "") {
            userlists["g"][roomid]["WinCause"] = wincause;
        }
        if (typeof winner !== 'undefined' && typeof winner !== 'null' && winner !== "") {
            userlists["g"][roomid]["Winner"] = winner;
        }

        SCL("A game has ended (" + [roomid] + "). The Winner was " + userlists["g"][roomid]["Winner"], function FNCr(CALLBACKf) {
            socket.emit('rlp2');
        }, "aiI", "lobby");
    }

    socket.on('disconnect', function() {
        if (addedUser) {
            --numUsers;

            socket.leave("lobby");
            socket.leave("searching");

            userlists["o"].splice(userlists["o"].indexOf(socket.username), 1);
            if (socket.state !== "playing") {
                socket.state = "lobby";
                userlists["eo"][socket.username]["gid"] = null;
            }

            SCL(userlists, "", "aiI", "lobby");
            console.log("\n" + Date().toString() + ":\n" + ">>" + socket.username + "<< successfully logged out!");
        }
    });
});