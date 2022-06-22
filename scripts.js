let serverMessages = [
    {
        from: "João",
        to: "Todos",
        text: "entra na sala...",
        type: "status",
        time: "09:21:45"
	},
	{
		from: "João",
		to: "Todos",
		text: "Bom dia",
		type: "message",
		time: "09:22:28"
	},
    {
		from: "Maria",
		to: "João",
		text: "Oi João :)",
		type: "message",
		time: "09:22:38"
	},
	{
		from: "João",
		to: "Maria",
		text: "Oi gatinha quer tc?",
		type: "private_message",
		time: "09:22:48"
	},
    {
        from: "Maria",
        to: "Todos",
        text: "sai da sala...",
        type: "status",
        time: "09:22:58"
	},
]

// const promise = axios.get('http://mock-api.driven.com.br/api/v6/uol/messages');
// promise.then(getMessages);

// function getMessages(answer) {
//     serverMessages = answer.data;
//     displayMessages();
// }

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
        }
        main.innerHTML += messageTemplate;
    }

    lastMessage = document.querySelector('.message-container:last-child');
    lastMessage.scrollIntoView();
}

displayMessages();
