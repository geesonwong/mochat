var html = '';
html += '<button id="mochat-toggle">抹茶</button>';
html += '<button id="mochat-re">重连</button>';
html += '<div id="mochat-board"></div><input type="text" id="mochat-po">';
$('body').append($(html));
$('#mochat-board').hide();
$('#mochat-po').hide();
$('#mochat-re').hide();

var socket;
var roomId;
var socketId;


var tmp_leave = false;

function init(isJoin) {
    socket = io('http://mochat.info:18080');

    setTimeout(function () {
        socket.on('join', function (data) {
            roomId = data.roomId;
            socketId = data.id;
            appendToBoard('已经连接成功，可以开始聊天，喵！', 'black');
        });

        socket.on('msg', function (data) {
            roomId = data.roomId;
            appendToBoard(data.content, 'brown');
        });

        socket.on('leave', function () {
            if (tmp_leave) { // 主动断开的不用回显
                tmp_leave = false;
                return;
            }
            appendToBoard('对方已经离开，自动找下个人…', 'black');
            socket.emit('join');
        });

        if (isJoin) {
            socket.emit('join');
        }
    }, 1000);

}

function appendToBoard(msg, color, clear) {
    $board = $('#mochat-board');
    switch (color) {
        case 'blue':
            msg = '<div class="msg"><span class="blue">你：</span>' + msg + '</div>';
            break;
        case 'brown':
            msg = '<div class="msg"><span class="brown">陌生人：</span>' + msg + '</div>';
            break;
        default:
            msg = '<div class="msg"><span class="black">系统提醒：</span>' + msg + '</div>';
            break;
    }
    $board.append(msg);
    $board.scrollTop($board[0].scrollHeight - 100);
    if (clear)$('#mochat-po').val('');
}

$('#mochat-toggle').click(function () {
    if ($('#mochat-board').is(":hidden")) {
        if (!socket) {
            init(true);
        }
        $('#mochat-board').show();
        $('#mochat-po').show();
        $('#mochat-re').show();
    } else {
        $('#mochat-board').hide();
        $('#mochat-po').hide();
        $('#mochat-re').hide();
    }
});

$('#mochat-re').click(function () {
    tmp_leave = true;
    if (roomId) {
        socket.emit('leave', {
            roomId: roomId
        });
    }
    appendToBoard('已经断开连接。自动找下个人…', 'black');
    socket.emit('join');
});

$('#mochat-po').keydown(function (event) {
    if (event.keyCode == 13 && event.ctrlKey == false) {
        var content = $(this).val();
        socket.emit('msg', {
            roomId: roomId,
            content: content
        });
        appendToBoard(content, 'blue', true);
        event.preventDefault();
    }
});