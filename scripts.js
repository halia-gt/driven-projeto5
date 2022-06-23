let serverMessages = [];
let serverUsers = [];
let username, ul;

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
        if (message.type === 'message' || message.type === 'status' || (message.type === 'private_message' && message.to === username)) {
            main.innerHTML += messageTemplate;
        }
    }

    lastMessage = document.querySelector('.message-container:last-child');
    lastMessage.scrollIntoView();
}

function displayUsers() {
    ul = document.querySelector('.modal .modal-content ul');

    for ( let i = 0 ; i < serverUsers.length ; i++ ) {
        const userTemplate = `
            <li class="user">
                <ion-icon name="person-circle"></ion-icon>
                <span>${serverUsers[i].name}</span>
                <img src="./images/vector.png">
            </li>
        `
        ul.innerHTML += userTemplate;
    }
}

function getUsername() {
    username = document.querySelector('.enter-screen input').value;

    const userObjetct = {
        name: username
    }

    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', userObjetct);
    promise.catch(wrongUsername);
    promise.then(enterRoom);
    
}

function wrongUsername(error) {
    const errorMessage = document.querySelector('.enter-screen p');
    errorMessage.innerHTML = 'Usuário inválido, digite outro nome.';
}

function enterRoom() {
    const enterScreen = document.querySelector('.enter-screen');
    enterScreen.classList.add('hidden');
    abilityClicks();
    getMessages();
    getUsers();
}


function abilityClicks() {
    const peopleIcon = document.querySelector('header ion-icon');
    peopleIcon.addEventListener('click', openModal);

    const planeButton = document.querySelector('footer ion-icon');
    planeButton.addEventListener('click', sendMessage);
}

function openModal() {
    const modal = document.querySelector('.modal');
    modal.classList.remove('hidden');

    abilityClicksModal();
}

function abilityClicksModal() {
    const users = document.querySelectorAll('.user');
    users.forEach(user => {user.addEventListener('click', selectUser)});

    const type = document.querySelectorAll('.type');
    type.forEach(user => {user.addEventListener('click', selectType)});

    const modal = document.querySelector('.modal');
    modal.addEventListener('click', closeModal);
}

function selectUser() {
    const previousCheckmark = document.querySelector('.user img.checkmark-green');
    previousCheckmark.classList.remove('checkmark-green');
    const checkmark = this.querySelector('img');
    checkmark.classList.add('checkmark-green');
}

function selectType() {
    const previousCheckmark = document.querySelector('.type img.checkmark-green');
    previousCheckmark.classList.remove('checkmark-green');
    const checkmark = this.querySelector('img');
    checkmark.classList.add('checkmark-green');
}

function closeModal() {
    const modal = document.querySelector('.modal');
    modal.classList.add('hidden');
}

let message;
let messageObject;

function sendMessage() {
    message = document.querySelector('footer input').value;

    messageObject = {
        from: username,
        to: 'Todos',
        text: message,
        type: 'message'
    }

    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', messageObject);
    promise.then(getMessages);
}

document.querySelector('.enter-screen button').addEventListener('click', getUsername);