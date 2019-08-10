const ws = new WebSocket('ws://localhost:8181');

let nickname;

ws.onmessage = e => {
    const data = JSON.parse(e.data);
    initNickname(data.nickname);
    pushNotifications(data.nickname, data.message);
};

ws.onclose = () => {
    pushNotifications(nickname, 'Logout');
};

const sendMessage = () => {
    const message = document.getElementById('message');
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(message.value);
    }
    if (ws.readyState === WebSocket.CLOSED) {
        console.log('connection closed');
    }
    message.value = '';
    message.focus();
};

const logout = () => {
    ws.close();
};