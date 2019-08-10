const pushNotifications = (nickname, message) => {
    let preface_label = '<span class="label label-success">' + nickname + '</span>';
    const messageElem = document.createElement('li');
    messageElem.innerHTML = '<h2>' + preface_label + '&nbsp;&nbsp;' + message + '</h2>';
    document.getElementById('messages').appendChild(messageElem);
};

const initNickname = newNickname => {
    if (!nickname) {
        nickname = newNickname;
    }
};