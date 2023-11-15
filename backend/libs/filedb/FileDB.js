var fs = require('fs');

class FileDB {

    constructor() {
        this.init()
    }

    path() {
        return __dirname + '/../../db/default.json';
    }


    init() {

        try {
            fs.readFileSync(this.path());
        } catch (error) {
            fs.writeFileSync(this.path(), JSON.stringify({}))
        }

    }

    append(key_value, value) {

        try {
            let file_data = fs.readFileSync(this.path());
            file_data = JSON.parse(file_data);

            if (typeof value === 'object') {
                file_data[key_value] = JSON.stringify(value);
            } else {
                file_data[key_value] = value;
            }

            fs.writeFileSync(this.path(), JSON.stringify(file_data));

            return file_data;

        } catch (error) {
            return false;
        }
    }

    get(key_value) {

        try {
            let file_data = fs.readFileSync(this.path());
            file_data = JSON.parse(file_data);

            let value = file_data[key_value];

            return value;

        } catch (error) {
            return false;
        }
    }


    all() {
        try {
            let file_data = fs.readFileSync(this.path());
            file_data = JSON.parse(file_data);
            if (typeof file_data === 'object') {
                return file_data;

            } else {
                return false;
            }

        } catch (error) {
            return false;
        }

    }



}


module.exports = FileDB;
