
function SendBidButton(props) {

    async function sendBid(ID) {
        document.getElementById('project_' + props.project_id).innerHTML = 'در حال ارسال پیشنهاد';
        const response = await fetch(`http://localhost:3030/project/send/?project_id=${encodeURIComponent(ID)}`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
            },
        });


        const result = await response.json(); 

        if (result.error === false) {
            document.getElementById('project_' + props.project_id).innerHTML = 'پیشنهاد ارسال شد به ' + props.project_id;

        }

        return result;



    } 



    return (
        <>

            <button onClick={() => sendBid(props.project_id)} aria-label={props.project_id} className="green">
                ارسال درخواست
            </button>


        </>
    );
}

export default SendBidButton;
