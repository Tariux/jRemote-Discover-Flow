const rp = require('request-promise');
const FileDB = require('../filedb/FileDB');

const DB = new FileDB();



class TelegramScript {
    token;

    channel_id;

    constructor(token) {
        this.token = DB.get("profile_telegram_token");
        this.channel_id = DB.get("profile_telegram_chat_id");
    }
    async request(apiUrl, data) {

        const options = {
            url: apiUrl,
            method: 'POST',
            json: true,
            formData: data,
            followAllRedirects: true,

        };

        let request_promise = new Promise(function (resolve, reject) {

            rp(options, (error, response, body) => {

                if (error) return reject(error)

                try {
 
                    resolve(body)

                } catch (error) {

                    reject(error)

                }

            })

        })

        return request_promise;

    }
    async send(data) {

        const apiUrl = DB.get("profile_google_script");
        data.token = this.token;
        return await this.request(apiUrl, data).then(

            function (success) {

                /* code if successful */
                if (success.data) {
                    return JSON.parse(success.data).result;

                } else {
                    console.log(success);
                    return success;
                }

            },

            function (error) {

                /* code if some error */
                console.error(error)
                return false;
            }

        );

    }


    async getUpdates(chat_id, limit = '', offset = '', timeout = '') {
        const data = {
            chat_id: chat_id,
            timeout: timeout,
            limit: limit,
            offset: offset,
            method: 'getUpdates',
        };
        var updates = this.send(data);
        return updates;
    }


    async sendMessage(chat_id, text = '') {
        const data = {
            chat_id: chat_id,
            text: text,
            method: 'sendMessage',
        };
        var send = this.send(data);
        return send;
    }

    async sendPhoto(chat_id, photo, text = '') {
        const data = {
            chat_id: chat_id,
            text: text,
            photo: photo,
            method: 'sendPhoto',
        };
        var send = this.send(data);
        return send;
    }

    async getFileDownload(chat_id, file_id) {
        const data = {
            chat_id: chat_id,
            file_id: file_id,
            method: 'getFile',
        };
        var get = await this.send(data);
        var file_link = `https://api.telegram.org/file/bot${this.token}/${get.file_path}`;

        return file_link;
    }

    async getLastMessage(chat_id) {
        var last = await this.getUpdates(chat_id, '1', '-1');
        if (last) {
            return last[0];
        }
    }

    getMessageFile(update) {
        if (update.message.photo) {
            return update.message.photo;
        }
    }
}
module.exports = TelegramScript;
 