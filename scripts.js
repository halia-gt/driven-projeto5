let serverMessages = [];
let username;


function getMessages() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(createArrayMessages);
}

function createArrayMessages(answer) {
    serverMessages = answer.data;
    displayMessages();
}

function displayMessages () {
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
        if (message.type === 'message' || message.type === 'Todos' || (message.type === 'private_message' && message.to === username)) {
            main.innerHTML += messageTemplate;
        }
    }

    lastMessage = document.querySelector('.message-container:last-child');
    lastMessage.scrollIntoView();
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
    errorMessage.innerHTML = 'Usuário já existente, digite outro nome.';
}

function enterRoom() {
    const enterScreen = document.querySelector('.enter-screen');
    enterScreen.classList.add('hidden');
    abilityClicks();
    getMessages();
}

document.querySelector('.enter-screen button').addEventListener('click', getUsername);