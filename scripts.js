let serverMessages = [];
let serverUsers = [];
let username;
let sendTo = 'Todos';
let sendType = 'message';

function getMessages() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(createArrayMessages);
}

function getUsers() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    promise.then(createArrayUsers);
}

function createArrayMessages(answer) {
    serverMessages = answer.data;
    displayMessages();
}

function createArrayUsers(answer) {
    serverUsers = answer.data;
    displayUsers();
}

function displayMessages() {
    const main = document.querySelector('main');
    main.innerHTML = '';

    for ( let i = 0 ; i < serverMessages.length ; i++ ) {
        const message = serverMessages[i];
        let messageTemplate = '';
        switch (message.type) {
            case 'status':
                messageTemplate = `
                    <p class="message-container ${message.type}">
                        <span class="time">(${message.time})</span>
                        <span><strong class="name">${message.from} </strong>${message.text}</span>
                    </p>
                `
                break;
            case 'message':
                messageTemplate = `
                    <p class="message-container ${message.type}">
                        <span class="time">(${message.time})</span>
                        <span><strong class="name">${message.from} </strong>para <strong class="to">${message.to}: </strong>${message.text}</span>
                    </p>
                `
                break;
            case 'private_message':
                messageTemplate = `
                    <p class="message-container ${message.type}">
                        <span class="time">(${message.time})</span>
                        <span><strong class="name">${message.from} </strong>reservadamente para <strong class="to">${message.to}: </strong>${message.text}</span>
                    </p>
                `
                break;
        }
        if (userCanSee(message)) {
            main.innerHTML += messageTemplate;
        }
    }

    enterRoom();
    lastMessage = document.querySelector('.message-container:last-child');
    lastMessage.scrollIntoView();
}

function userCanSee(message) {
    if (message.type === 'message' || message.type === 'status' || (message.type === 'private_message' && message.from === username) || (message.type === 'private_message' && message.to === username) || message.to === 'Todos') {
        return true;
    }
    return false;
}

function enterRoom() {
    const enterScreen = document.querySelector('.enter-screen');
    if (!enterScreen.classList.contains('hidden')) {
        enterScreen.classList.add('hidden');
    }
}

function displayUsers() {
    const ul = document.querySelector('.modal .modal-content ul');
    ul.innerHTML = '';

    for ( let i = 0 ; i < serverUsers.length ; i++ ) {
        let userTemplate;
        if (sendTo === serverUsers[i].name) {
            userTemplate = `
                <li class="user">
                    <ion-icon name="person-circle"></ion-icon>
                    <span>${serverUsers[i].name}</span>
                    <img src="./images/vector.png" class="checkmark-green">
                </li>
            `
        } else {
            userTemplate = `
                <li class="user">
                    <ion-icon name="person-circle"></ion-icon>
                    <span>${serverUsers[i].name}</span>
                    <img src="./images/vector.png">
                </li>
            `
        }

        ul.innerHTML += userTemplate;
    }
    abilityClicksModal();
}

function getUsername() {
    username = document.querySelector('.enter-screen input').value;

    const userObjetct = {
        name: username
    }

    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', userObjetct);
    promise.catch(wrongUsername);
    promise.then(loading);
    
}

function wrongUsername(error) {
    const errorMessage = document.querySelector('.enter-screen p');
    errorMessage.innerHTML = 'Usuário inválido, digite outro nome.';
}

function loading() {
    const inputArea = document.querySelector('.enter-screen-input');
    inputArea.classList.add('hidden');
    const loading = document.querySelector('.enter-screen-loading');
    loading.classList.remove('hidden');

    abilityClicks();
    setInterval(getMessages, 3000);
    setInterval(getUsers, 10000);
    setInterval(connectionStatus, 4000);
}

function abilityClicks() {
    const peopleIcon = document.querySelector('header ion-icon');
    peopleIcon.addEventListener('click', openModal);

    const planeButton = document.querySelector('footer ion-icon');
    planeButton.addEventListener('click', sendMessage);

    const textarea = document.querySelector('textarea');
    textarea.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            planeButton.click();
        }
    });
}

function openModal() {
    const modal = document.querySelector('.modal');
    const body = document.querySelector('body');
    modal.classList.remove('hidden');
    body.style.overflow = 'hidden';

    abilityClicksModal();
}

function abilityClicksModal() {
    const users = document.querySelectorAll('.user');
    users.forEach(user => {user.addEventListener('click', selectUser)});

    const type = document.querySelectorAll('.type');
    type.forEach(user => {user.addEventListener('click', selectType)});

    const modal = document.querySelector('.modal-opacity');
    modal.addEventListener('click', closeModal);
}

function closeModal() {
    const modal = document.querySelector('.modal');
    const body = document.querySelector('body');
    modal.classList.add('hidden');
    body.style.overflow = 'initial';
}

function selectUser() {
    const previousCheckmark = document.querySelector('.user img.checkmark-green');
    previousCheckmark.classList.remove('checkmark-green');
    const checkmark = this.querySelector('img');
    checkmark.classList.add('checkmark-green');

    sendTo = this.querySelector('span').innerHTML;
    changeTextarea();
}

function selectType() {
    const previousCheckmark = document.querySelector('.type img.checkmark-green');
    previousCheckmark.classList.remove('checkmark-green');
    const checkmark = this.querySelector('img');
    checkmark.classList.add('checkmark-green');

    const visibility = this.querySelector('span').innerHTML;
    if (visibility === 'Público') {
        sendType = 'message';
    } else if (visibility === 'Reservadamente') {
        sendType = 'private_message';
    }
    changeTextarea();
}

function changeTextarea() {
    const reserved = document.querySelector('.textarea-send-to p');
    reserved.style.color = '#505050';

    switch (true) {
        case (sendType === 'message' && sendTo !== 'Todos'):
            reserved.innerHTML = `
                Enviando para ${sendTo}
            `;
            break;
        
        case (sendType === 'private_message'):
            reserved.innerHTML = `
                Enviando para ${sendTo} (reservadamente)
            `
            break;
        default:
            reserved.innerHTML = '';
            
    }
}

function sendMessage() {
    const message = document.querySelector('footer textarea').value;

    const messageObject = {
        from: username,
        to: sendTo,
        text: message,
        type: sendType
    }

    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', messageObject);
    document.querySelector('footer textarea').value = '';
    promise.catch(reloadPage);
    promise.then(getMessages);    
}

function reloadPage(error) {
    window.location.reload();
}

function connectionStatus() {
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', {
        name: username
    });
    promise.catch(reloadPage);
}

const button = document.querySelector('.enter-screen button');
button.addEventListener('click', getUsername);
const input = document.querySelector('.enter-screen input');
input.addEventListener('keypress', function(event) {
    if (event.key === "Enter") {
      button.click();
    }
});