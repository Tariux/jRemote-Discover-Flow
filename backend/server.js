const express = require('express');

const Parscoders = require('./libs/scrapper/module/Parscoders');
const TelegramScript = require('./libs/telegram/Telegram');
const FileDB = require('./libs/filedb/FileDB');
var app = express();

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
 
const DB = new FileDB();

const ParscodersCLass = new Parscoders();
const Telegram = new TelegramScript('6331367030:AAGEQ3XFiVBu5kwwinKVQ_gmhAYij-Z2tD8');

async function fetchBid(id) {

    let bid = await ParscodersCLass.fetchBid({ id: id });

    return bid;
}
 

async function sendBid(id) {

    let search = await ParscodersCLass.sendBidSilent({ id: id });

    return search;
}

async function sendMessageToChannel(message) {

    const send = await Telegram.sendMessage(Telegram.channel_id, message);

    return send;
}




app.get('/', async (req, res) => {
    res.send({ bid: '' })

});




app.get('/project/get', async function (req, res) {

    let project_id = req.query.project_id;
    if (project_id) {

        res.send({
            bid: await fetchBid(project_id),
            error: false,
        })

    } else {

        res.send({
            error: true,
        })

    }
});





app.get('/project/send', async function (req, res) {


    let project_id = req.query.project_id;
    if (project_id) {

        res.send({
            bid: await sendBid(project_id),
            error: false,
        })

    } else {

        res.send({
            error: true,
        })

    }
});



app.get('/telegram/message', async function (req, res) {

    let message = req.query.message;

    message = message.replace(/^[ ]+/g, "").replace(/[ ]+$/g, "");


    res.send({
        message: await sendMessageToChannel(message),
        error: false,
    })

});


app.get('/db', async function (req, res) {

    res.send({
        db: DB.init(),
        error: false,
    })

});

app.get('/db/append', async function (req, res) {

    let key_value = req.query.key_value;
    let value = req.query.value;

    if (!value || !key_value) {
        res.send({
            error: true,
        })
    }

    res.send({
        db: DB.append(key_value , value),
        error: false,
    })

});

app.get('/db/get', async function (req, res) {

    let key_value = req.query.key_value;
    if (key_value) {

        res.send({
            db: DB.get(key_value),
            error: false,
        })

    } else {

        res.send({
            db: DB.all(),
            error: false,
        })

    }



});


app.get('/project/search', async function (req, res) {

    let keyword = req.query.keyword;
    let budget = req.query.budget;
    let skills = req.query.skills;

    keyword = keyword.replace(/^[ ]+/g, "").replace(/[ ]+$/g, "");
    budget = budget.replace(/^[ ]+/g, "").replace(/[ ]+$/g, "");
    skills = skills.replace(/^[ ]+/g, "").replace(/[ ]+$/g, "");
    // {"title":"php","vass":["urgent","recruitment"],"budget":["5","6"],"skills":["php"],"only-available":"1"}
    let filter = {
        "title": keyword,
        "only-available": "1"
    }

    if (skills) {
        filter.skills = [skills]
    }



    if (budget) {
        filter.budget = [budget]
    } else {
        filter.budget = '1,2,3,4,5,6';
    }



    const response = await ParscodersCLass.getPage(filter.title , filter.skills , filter.budget);
    if (typeof response === 'object') {

        res.send({
            bid: response ,
            error: false,
        })
    
    } else {
        res.send({
            error: true,
        })
    
    }

});












// 444659

app.listen(3030)
