$(function() {
    // Initialize variables
    var $window = $(window);

    var $usernameInput = $('.usernameInput'); // Input for username
    var $passwordInput = $('.passwordInput'); // Input for Password

    $MC = $('#maincontainer');

    var username;
    var password;
    var connected = false;
    var loginblocker = 0;
    var roomid;
    var opponent;

    var socket = io();

    // Prevents input from having injected markup
    function cleanInput(input) {
        return $('<div/>').text(input).text();
    }

    socket.on('SA', function(data) {
        var msg = data['msg'];
        eval(data['fnc']);

        alert(msg);
        typeof FNCr === 'function' && FNCr();
    })
    socket.on('SCL', function(data) {
        var msg = data['msg'];
        eval(data['fnc']);

        console.log(msg);
        typeof FNCr === 'function' && FNCr();
    });
    socket.on('SP', function(data) {
        var cntnt = data['cntnt'];
        eval(data['fnc']);

        $MC.html(cntnt);
        typeof FNCr === 'function' && FNCr();
    });

    function setUsername() {
        if (loginblocker === 0) {
            username = cleanInput($usernameInput.val().trim());
            password = cleanInput($passwordInput.val().trim());
            if (username && password) {
                socket.emit("try2login", {
                    username: username,
                    password: password
                });
            }
            loginblocker = 1;
        } else if (loginblocker === 1) {
            setTimeout(function() {
                loginblocker = 0;
            }, 1000);
        }
    }
    $("#loginbutton").click(function(e) {
        setUsername();
    });
    $("#loginform").submit(function(e) {
        e.preventDefault();
        setUsername();
    });
    socket.on('loginvalid', function(data) {
        if (data['isvalid'] === true) {
            connected = true;
            username = data['username'];
            console.log(data['wlcm']);
        } else if (data['isvalid'] === false) {
            alert('Already logged in or other things went wrong!!');
        }
    });
    socket.on('Wrong password!', function(data) {
        alert("Wrong Password!");
        $passwordInput.val("");
        password = "";
    });
    socket.on('Not registered yet!', function(data) {
        alert("Username does not exist!");
        $usernameInput.val("");
        $passwordInput.val("");
        username = "";
        password = "";
    });

    socket.on('rlp2', function(data) {
        $(".nrofmep").html(data.nrofmep);
        $(".nropo").html(data.po.length);
        $(".nrops").html(data.nrops);
        var poHTML = '';
        for (var x = 0; x < data.po.length; x++) {
            poHTML += '<li>' + data.po[x] + '</li>';
        }
        $(".po").html($(poHTML));
    });

    socket.on('playerfound', function(data) {
        roomid = data['gid'];
    });
    socket.on('playerjoined', function(data) {
        roomid = data['gid'];
        opponent = data['usr'];
        console.log(opponent + " has joined " + roomid);
        socket.emit('playerhasjoined', {
            "oppo": opponent
        });
    });
    socket.on('otheropponent', function(data) {
        opponent = data['usr'];
        roomid = data['gid'];
        console.log(opponent + " is your opponent");
    });

    function assigncarddragsndrops(off) {
        var off = off || false;
        if (off === false) {
            var coh = document.querySelectorAll(".cardsonhand0 .cardc");
            [].forEach.call(coh, function(c) {
                c.addEventListener('dragstart', handleDragStart, false);
                c.addEventListener('dragenter', handleDragEnter, false);
                c.addEventListener('dragover', handleDragOver, false);
                c.addEventListener('dragleave', handleDragLeave, false);
                c.addEventListener('drop', handleDrop, false);
                c.addEventListener('dragend', handleDragEnd, false);

                c.addEventListener('click', handleTouchThingy, false);
            });

            var coh = document.querySelectorAll(".cardsonfield0 .cardc");
            [].forEach.call(coh, function(c) {
                c.addEventListener('dragstart', handleDragStart, false);
                c.addEventListener('dragenter', handleDragEnter, false);
                c.addEventListener('dragover', handleDragOver, false);
                c.addEventListener('dragleave', handleDragLeave, false);
                c.addEventListener('drop', handleDrop, false);
                c.addEventListener('dragend', handleDragEnd, false);

                c.addEventListener('click', handleTouchThingy, false);
            });

            var coh = document.querySelectorAll(".cardsonfield1 .cardc");
            [].forEach.call(coh, function(c) {
                c.addEventListener('dragenter', handleDragEnter, false);
                c.addEventListener('dragover', handleDragOver, false);
                c.addEventListener('dragleave', handleDragLeave, false);
                c.addEventListener('drop', handleDrop, false);
                c.addEventListener('dragend', handleDragEnd, false);

                c.addEventListener('click', handleTouchThingy, false);
            });
        } else {
            var coh = document.querySelectorAll(".cardsonhand0 .cardc");
            [].forEach.call(coh, function(c) {
                c.addEventListener('dragstart', handleDragStart, false);
                c.addEventListener('dragenter', handleDragEnter, false);
                c.addEventListener('dragover', handleDragOver, false);
                c.addEventListener('dragleave', handleDragLeave, false);
                c.addEventListener('drop', handleDrop, false);
                c.addEventListener('dragend', handleDragEnd, false);

                c.addEventListener('click', handleTouchThingy, false);
            });

            var coh = document.querySelectorAll(".cardsonfield0 .cardc");
            [].forEach.call(coh, function(c) {
                c.removeEventListener('dragstart', handleDragStart, false);
                c.removeEventListener('dragenter', handleDragEnter, false);
                c.removeEventListener('dragover', handleDragOver, false);
                c.removeEventListener('dragleave', handleDragLeave, false);
                c.removeEventListener('drop', handleDrop, false);
                c.removeEventListener('dragend', handleDragEnd, false);

                c.removeEventListener('click', handleTouchThingy, false);
            });

            var coh = document.querySelectorAll(".cardsonfield1 .cardc");
            [].forEach.call(coh, function(c) {
                c.removeEventListener('dragenter', handleDragEnter, false);
                c.removeEventListener('dragover', handleDragOver, false);
                c.removeEventListener('dragleave', handleDragLeave, false);
                c.removeEventListener('drop', handleDrop, false);
                c.removeEventListener('dragend', handleDragEnd, false);

                c.removeEventListener('click', handleTouchThingy, false);
            });
        }
    }

    socket.on('snddcks', function(data) {
        console.log("DATA :: Players");
        console.log(data);

        var lolpos;
        $.each(data, function(key0, val0) {
            if (key0 === "d0_MP-Left") {
                $(".own_manapoints").html(val0);
            } else if (key0 === "d0_onHand") {
                $(".cardsonhand0").html('');
                $.each(val0, function(key, val) {
                    if (val) {
                        var cardcode = '<div class="cardc" cardid="' + key + '" draggable="true" val_HP="' + val["HP"] + '"> <div class="cardicon ' + val["Type"] + '"> <div id="head" class="ci head"> <div id="hat" class="ci hat"> <div id="hat-top" class="ci hat-top"></div><div id="hat-bottom" class="ci hat-bottom"></div></div><div id="hair" class="ci hair"></div><div id="eyes" class="ci eyes"> <div id="eye-left" class="ci eye-left"></div><div id="eye-right" class="ci eye-right"></div></div><div id="mouth" class="ci mouth"> <div id="upper-lip" class="ci upper-lip"></div><div id="lower-lip" class="ci lower-lip"></div></div></div><div id="shoulders" class="ci shoulders"> <div id="shoulder-left" class="ci shoulder-left"></div><div id="shoulder-right" class="ci shoulder-right"></div></div><div id="body" class="ci body"> <div id="zipper" class="ci zipper"></div></div></div><div class="cardcntnt"> ' + val["CardCntnt"] + ' </div><div class="cardlabel"> <p> ' + val["CardLabel"] + ' </p></div></div>';
                        $(cardcode).appendTo($(".cardsonhand0"));
                    }
                    // console.log("d0_onHand >> VAL for LOLPOS "+lolpos+": ");
                    // console.log(val);
                });
            } else if (key0 === "d0_onField") {
                $(".cardsonfield0").html('');
                $.each(val0, function(key, val) {
                    if (val !== null) {
                        var cardcode = '<div class="cardc" cardid="' + key + '" draggable="true" val_HP="' + val["HP"] + '" val_AlreadyUsed="' + val["AlreadyUsed"] + '" val_RoundsLeft="' + val["RoundsLeft"] + '"> <div class="cardicon ' + val["Type"] + '"> <div id="head" class="ci head"> <div id="hat" class="ci hat"> <div id="hat-top" class="ci hat-top"></div><div id="hat-bottom" class="ci hat-bottom"></div></div><div id="hair" class="ci hair"></div><div id="eyes" class="ci eyes"> <div id="eye-left" class="ci eye-left"></div><div id="eye-right" class="ci eye-right"></div></div><div id="mouth" class="ci mouth"> <div id="upper-lip" class="ci upper-lip"></div><div id="lower-lip" class="ci lower-lip"></div></div></div><div id="shoulders" class="ci shoulders"> <div id="shoulder-left" class="ci shoulder-left"></div><div id="shoulder-right" class="ci shoulder-right"></div></div><div id="body" class="ci body"> <div id="zipper" class="ci zipper"></div></div></div><div class="cardcntnt"> ' + val["CardCntnt"] + ' </div><div class="cardlabel"> <p> ' + val["CardLabel"] + ' </p></div></div>';
                        $(cardcode).appendTo($(".cardsonfield0"));
                    } else if (val === null) {
                        var cardcode = '<div class="cardc" cardid="' + key + '" draggable="true"></div>';
                        $(cardcode).appendTo($(".cardsonfield0"));
                    }
                    // console.log("d0_onField >> VAL for LOLPOS "+lolpos+": ");
                    // console.log(val);
                });
            } else if (key0 === "d0_inBlockC") {
                // Hier muss noch nen Generator hin, damit die Karten in nem Stapel angezeigt werdn
                $(".own_inBlockC").html(val0);
            } else if (key0 === "d1_MP-Left") {
                $(".opp_manapoints").html(val0);
            } else if (key0 === "d1_onHand") {
                $(".cardsonhand1").html('');
                for (var c = 0; c < val0; c++) {
                    var cardcode = '<div class="cardc" cardid="' + c + '"> <div class="cardicon "> <div id="head" class="ci head"> <div id="hat" class="ci hat"> <div id="hat-top" class="ci hat-top"></div><div id="hat-bottom" class="ci hat-bottom"></div></div><div id="hair" class="ci hair"></div><div id="eyes" class="ci eyes"> <div id="eye-left" class="ci eye-left"></div><div id="eye-right" class="ci eye-right"></div></div><div id="mouth" class="ci mouth"> <div id="upper-lip" class="ci upper-lip"></div><div id="lower-lip" class="ci lower-lip"></div></div></div><div id="shoulders" class="ci shoulders"> <div id="shoulder-left" class="ci shoulder-left"></div><div id="shoulder-right" class="ci shoulder-right"></div></div><div id="body" class="ci body"> <div id="zipper" class="ci zipper"></div></div></div><div class="cardcntnt">  </div><div class="cardlabel"> <p>  </p></div></div>';
                    $(cardcode).appendTo($(".cardsonhand1"));
                }
            } else if (key0 === "d1_onField") {
                $(".cardsonfield1").html('');
                $.each(val0, function(key, val) {
                    if (val !== null) {
                        var cardcode = '<div class="cardc" cardid="' + key + '" val_HP="' + val["HP"] + '"> <div class="cardicon ' + val["Type"] + '"> <div id="head" class="ci head"> <div id="hat" class="ci hat"> <div id="hat-top" class="ci hat-top"></div><div id="hat-bottom" class="ci hat-bottom"></div></div><div id="hair" class="ci hair"></div><div id="eyes" class="ci eyes"> <div id="eye-left" class="ci eye-left"></div><div id="eye-right" class="ci eye-right"></div></div><div id="mouth" class="ci mouth"> <div id="upper-lip" class="ci upper-lip"></div><div id="lower-lip" class="ci lower-lip"></div></div></div><div id="shoulders" class="ci shoulders"> <div id="shoulder-left" class="ci shoulder-left"></div><div id="shoulder-right" class="ci shoulder-right"></div></div><div id="body" class="ci body"> <div id="zipper" class="ci zipper"></div></div></div><div class="cardcntnt"> ' + val["CardCntnt"] + ' </div><div class="cardlabel"> <p> ' + val["CardLabel"] + ' </p></div></div>';
                        $(cardcode).appendTo($(".cardsonfield1"));
                    } else if (val === null) {
                        var cardcode = '<div class="cardc" cardid="' + key + '"></div>';
                        $(cardcode).appendTo($(".cardsonfield1"));
                    }
                    // console.log("d1_onField >> VAL for LOLPOS "+lolpos+": ");
                    // console.log(val);
                });
            } else if (key0 === "d1_inBlockC") {
                // Hier muss noch nen Generator hin, damit die Karten in nem Stapel angezeigt werdn
                $(".opp_inBlockC").html(val0);
            }
        });

        assigncarddragsndrops();
    });



    socket.on('curplayer', function(data) {
        console.log(data["curplayer"]);

        eval(data['fnc']);
        typeof FNCr === 'function' && FNCr();
    });



    var dragSrcC = null;
    var touchSrcC = null;
    var touchSrcCc = null;
    var pressSrc = null;
    var clickoff = false;

    function CGetsActive(which) {
        $(which).addClass("isActive");
    }

    function CGetsUnActive(which) {
        $(which).removeClass("isActive");
    }

    function handleDragStart(e) {
        // console.log("dragstart "+e);
        CGetsActive(this);

        dragSrcC = this;

        e.dataTransfer.effectAllowed = 'grabbing, -moz-grabbing, -webkit-grabbing';
        e.dataTransfer.setData('text/html', this.innerHTML);
    }

    function handleDragOver(e) {
        // console.log("dragover "+e);
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'grabbing, -moz-grabbing, -webkit-grabbing';

        return false;
    }

    function handleDragEnter(e) {
        // console.log("dragenter "+e);
        this.classList.add('over');
    }

    function handleDragLeave(e) {
        // console.log("dragleave "+e);
        this.classList.remove('over');
    }

    function handleDrop(e) {
        // console.log("drop "+e);
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        if (dragSrcC != this) {
            htdnd(dragSrcC, this, e);
        }

        return false;
    }

    function handleDragEnd(e) {
        // console.log("dragend "+e);
        CGetsUnActive(this);
        var coh = document.querySelectorAll(".cardsonfield0 .cardc");
        [].forEach.call(coh, function(c) {
            c.classList.remove('over');
        });
        var coh = document.querySelectorAll(".cardsonfield1 .cardc");
        [].forEach.call(coh, function(c) {
            c.classList.remove('over');
        });
    }

    function handleTouchThingy(e) {
        if (clickoff == false) {
            if (touchSrcC != null && touchSrcCc != null) {
                if (this != touchSrcC) {
                    htdnd(touchSrcC, this, "e", touchSrcCc);
                    //    CGetsActive(this);
                }
                setTimeout(function() {
                    CGetsUnActive(touchSrcC);
                    touchSrcC = null;
                    touchSrcCc = null;
                    CGetsUnActive(this);
                }, 350);
            } else if (touchSrcC == null || touchSrcCc == null) {
                if ($(this).parents(".cardsonfield1").length === 0) {
                    CGetsActive(this);
                    touchSrcC = this;
                    touchSrcCc = this.innerHTML;
                }
            } else {
                touchSrcC = null;
                touchSrcCc = null;
            }
        } else if (clickoff == true) {
            clickoff = false;
            pressSrc = null;
            touchSrcC = null;
            touchSrcCc = null;
        }
    }

    function htdnd(c1, c2, e, e2) {
        if ($(c1).parents(".cardsonhand0").length === 1 && $(c2).parents(".cardsonhand0").length === 1) {
            c1.innerHTML = c2.innerHTML;
            if (e !== "e") {
                c2.innerHTML = e.dataTransfer.getData('text/html');
            } else if (e2) {
                c2.innerHTML = e2;
            }
            socket.emit('movecard', {
                "mt": "h0-h0",
                "c1": $(c1).attr("cardid"),
                "c2": $(c2).attr("cardid")
            });
        } else if ($(c1).parents(".cardsonhand0").length === 1 && $(c2).parents(".cardsonfield0").length === 1) {
            if (e !== "e") {
                c2.innerHTML = e.dataTransfer.getData('text/html');
            } else if (e2) {
                c2.innerHTML = e2;
            }
            socket.emit('movecard', {
                "mt": "h0-f0",
                "c1": $(c1).attr("cardid"),
                "c2": $(c2).attr("cardid")
            });
        } else if ($(c1).parents(".cardsonfield0").length === 1 && $(c2).parents(".cardsonfield1").length === 1) {
            if (e !== "e") {
                c2.innerHTML = e.dataTransfer.getData('text/html');
            } else if (e2) {
                c2.innerHTML = e2;
            }
            socket.emit('movecard', {
                "mt": "f0-f1",
                "c1": $(c1).attr("cardid"),
                "c2": $(c2).attr("cardid")
            });
        }
    }

    function handlemd(e) {
        CGetsActive(this);
        pressSrc = this;
    }

    function handleLongPress(e) {
        e.preventDefault();
        if (pressSrc) {
            setTimeout(function() {
                CGetsUnActive(pressSrc);
                console.log(pressSrc);
                pressSrc = null;
                touchSrcC = null;
                touchSrcCc = null;
                clickoff = true;
            }, 500);
        }
    }
});