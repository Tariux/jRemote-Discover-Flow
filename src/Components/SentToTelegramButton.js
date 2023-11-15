
function SendToTelegramButton(props) {

    async function makeItTelegram(project_id) {

        const response = await fetch(`http://localhost:3030/project/get/?project_id=${encodeURIComponent(project_id)}`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
            },
        });

        let result = await response.json();

        if(typeof result !== 'object') {
            return false;
        }

        let project_data = result.bid;

        let display_id = parseInt(project_data.id) * 2;

        if (result.bid) {

            let title = `<i><b>🗂  ${project_data.title.replace(/\s+/g,' ').trim()}</b></i>`;
            let deadline = `⏰  مدت زمان: ${project_data.deadline}`;
            let display_id_tag = `🆔  کد پروژه: #P${display_id}`;

            let copyright = `<i>👨‍💻  توضیحات بیشتر: <u><b>@jRemoteAdmin</b></u></i>`;

            let message = `${title}\n\n${deadline}\n${display_id_tag}\n\n${copyright}`;

            return message;
        } else {
            return false;
        }

    }

    async function sendMessage(project_id) {

        const message = await makeItTelegram(project_id);

        if (message === false) {
            return false;
        }

        const response = await fetch(`http://localhost:3030/telegram/message/?message=${encodeURIComponent(message)}`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
            },
        });


        const result = await response.json();

        return result;

    }



    return (
        <>

            <button onClick={() => sendMessage(props.project_id)} className="orange">
                اشتراک گذاری
            </button>


        </>
    );
}

export default SendToTelegramButton;
