const ws = new WebSocket("ws://localhost:8080");
// console.log(ws.readyState); CONNECTING
ws.onopen = () => console.log('connection to server is open');
// console.log(ws.readyState); OPEN
const sendMessage = () => {
    // console.log(ws.readyState); OPEN
    ws.send($(':input').val());
};