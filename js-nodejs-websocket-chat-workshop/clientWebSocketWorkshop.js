const ws = new WebSocket('ws://localhost:8181');

let nickname;

/*
    incoming message from server:
    {
        "nickname": nickname,
        "message": message
    }
    
    on message: hint: onmessage
    1. init nickname, hint: initNickname
    1. push notification to the board, hint: pushNotification
 */

/*
    on close: hint: onclose
    push notification with message 'Logout'
 */

const sendMessage = () => {
    const message = document.getElementById('message');
    
    // if websocket is open, send value of message element
    // hint: readyState, WebSocket.OPEN, ws.send, message.value
    
    // if websocket is closed, print 'connection closed' to console
    // hint: readyState, WebSocket.CLOSED, console.log, 'connection closed'
    
    message.value = '';
    message.focus();
};

const logout = () => {
    // close websocket, hint: ws.close()
};