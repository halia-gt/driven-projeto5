let serverMessages = [];

const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
promise.then(getMessages);

function getMessages(answer) {
    serverMessages = answer.data;
    displayMessages();
}

function displayMessages () {
    const main = document.querySelector('main');

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
        main.innerHTML += messageTemplate;
    }

    lastMessage = document.querySelector('.message-container:last-child');
    lastMessage.scrollIntoView();
}f