var request = require("request-promise").defaults({ jar: true });
const cheerio = require("cheerio");
const Functions = require('./Functions');
const FileDB = require("../../filedb/FileDB");

const DB = new FileDB();


class Core {


    constructor() {

        this.username = DB.get('profile_username');
        this.password = DB.get('profile_password');

        this.parsCodersUrl = 'https://parscoders.com';

        this.FunctionsClass = new Functions();
    }




    async oldTheme() {

        try {
            await request(`${this.parsCodersUrl}/theme/set-old`);
            console.log('Website theme changed!');
            return true;
        } catch (error) {
            return false;
        }
    }








    async auth() {

        await this.oldTheme();
        var authOptions = { 
            'method': 'POST',
            'url': `${this.parsCodersUrl}/login`,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            form: {
                'username': this.username,
                'password': this.password,
            },
            simple: false,
            followAllRedirects: true,
        }; // Set request authOptions
        console.log('Trying to login with: ', authOptions.form);
        await request.post(authOptions);


    }






    async scrapeData(url) {

        return request(url, function (error, response) {
            if (!error && response.statusCode === 200) {
                return response.body;
            } else {
                return false;
            }
        });
    }





    async send(options) {

        await this.auth()
            .then(result => {
            })
            .catch(error => {
                return error;
            });
        try {
            return await request(options);

        } catch (error) {
            return error;
        }


    }









    async getProjectsRow(filter = {}) {


        let projects = []; // Define projects array/object
        let collectOptions, collectData, collectBody;
        // Collect data from project-search


        console.log('Trying to load filter:' , filter);

        collectOptions = {
            'method': 'POST',
            'url': `${this.parsCodersUrl}/project/ajax/project-search`,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            form: JSON.stringify(filter),
            simple: false,
            followAllRedirects: true,
        };
        console.log('a');

        collectData = await request(collectOptions);

        console.log('b');

        console.log();
        console.log(collectData);
        if (typeof collectData !== 'object') {
            return false;
        }

        collectData = JSON.parse(collectData);
        collectBody = collectData['project-row'];


        const $ = cheerio.load(collectBody);
        const projectsDiv = $(".project-list-item");


        for (let projectKey = 0; projectKey < projectsDiv.length; projectKey++) {
            const project = projectsDiv[projectKey];
            
            let project_id = $(project).attr("id").match(/\d/g).join(""); // find and filter project-id
            let project_url = $(project).find(".project--link").attr("href"); // find and filter project-url

            if (project_id && project_url) { // Validate collected data
                const projectData = {
                    id: project_id,
                    title: $(project).find(".project--link").text().replace(/\n/g, ' ').replace(/\s+/g, ' '),
                    price: ($(project).find(".ms-1").text()) ? $(project).find(".ms-1").text().match(/\d/g).join("").replace(/\s/g, ",") : '',
                    url: `${this.parsCodersUrl}${project_url}`,
                };

                projects.push(projectData); // Push in projects variable

            }

        }

        return projects; // Shuffle projects and return

    }










    async getPage(title = '' , skills = '' , budget = '' , page = 1) {
        //

        const projects = []; // Define projects array
        //filter = filter.join(','); // Define filter query

        if (title !== '' && title) {
            title = `/title/${title}`;
        }
        if (skills !== '' && skills) {
            skills = `/skills/${skills}`;
        }
        if (budget !== '' && budget) {
            budget = `/budget/${budget}`;
        }

        var SEARCH_BASE_URL = `${this.parsCodersUrl}/project${budget + skills + title}/only-available/1/?page=${page}`;


        await this.auth().then(authResult => {
        }).catch(error => {
            return error;
        }); // Login for access to scrap data

        let requestBody; // Define some variable

        console.log(SEARCH_BASE_URL);

        await request(SEARCH_BASE_URL, function (error, response, body) {
            requestBody = body;
        }); // Send request for collect data


        const $ = cheerio.load(requestBody);

        let id;

        $('.todo-tasklist-item').each((index, element) => {
            const project = {};

            id = ($(element).find('.todo-tasklist-item-title a').attr('href')) ? $(element).find('.todo-tasklist-item-title a').attr('href').replace(/\D/g, '') : false;


            //#project-445677-row > div.todo-tasklist-controls.pull-left.margin-bottom-10 > span:nth-child(2)
            if (id) {
                // Scrap title
                project.id = id;
                project.title = $(element).find('.todo-tasklist-item-title a').text();
                project.url = this.parsCodersUrl + $(element).find('.todo-tasklist-item-title a').attr('href');
                project.price = $(element).find('.todo-tasklist-controls.pull-left.margin-bottom-10 > span:nth-child(2)').text().replace(/\D/g, '');

            }

            projects.push(project);
        });

        return projects; // Return

    }






    async getNewProjects(filter = [], page = 1) {


        const projects = []; // Define projects array
        //filter = filter.join(','); // Define filter query

        await this.auth().then(authResult => {
        }).catch(error => {
            return error;
        }); // Login for access to scrap data

        let requestBody, url; // Define some variable

        url = `${this.parsCodersUrl}/project/only-available/${page}/skills/${filter}`; // Make URL
        console.log(url.green);
        await request(url, function (error, response, body) {
            requestBody = body;
        }); // Send request for collect data


        const $ = cheerio.load(requestBody);

        let id;

        $('.todo-tasklist-item').each((index, element) => {
            const project = {};

            id = ($(element).find('.todo-tasklist-item-title a').attr('href')) ? $(element).find('.todo-tasklist-item-title a').attr('href').replace(/\D/g, '') : false;

            if (id) {
                // Scrap title
                project.id = id;
                project.url = this.parsCodersUrl + $(element).find('.todo-tasklist-item-title a').attr('href');

            }

            projects.push(project);
        });

        return projects; // Return

    }













    async fetchBid(bid) {
        if (bid.id === undefined && bid === undefined) {
            return;
        }

        try {


            await this.auth().then(authResult => {
            }).catch(error => {
                return error;
            }); // Login for access to scrap data


            var bid_page = await this.scrapeData(`${this.parsCodersUrl}/project/${bid.id}`);
            const $ = cheerio.load(bid_page);

            if ($('body > div.page-container > div.page-content-wrapper > div > div.row.sticky-container > div.col-md-4.quick-access-column > div > div > div.portlet-body > div:nth-child(1) > div > ul > li:nth-child(4) > span').text() === '') {
                console.log('Can Not Fetch:', bid.id);
                return;
            }

            let title = $(".page-title").text().replace(/\n/g, ' ').replace(/\s+/g, ' ');

            let desc = $("#detail_tab > div.project-description").text().replace(/\n/g, ' ').replace(/\s+/g, ' ');
            let deadline = $('body > div.page-container > div.page-content-wrapper > div > div.row.sticky-container > div.col-md-4.quick-access-column > div > div > div.portlet-body > div:nth-child(1) > div > ul > li:nth-child(5) > span').text().replace(/\D/g, '');
            let expertise = $('body > div.page-container > div.page-content-wrapper > div > div.row.sticky-container > div.col-md-4.quick-access-column > div > div > div.portlet-body > div:nth-child(1) > div > ul > li:nth-child(6) > span').text().replace(/\D/g, '');
            let views = $('body > div.page-container > div.page-content-wrapper > div > div.row.sticky-container > div.col-md-4.quick-access-column > div > div > div.portlet-body > div:nth-child(1) > div > ul > li:nth-child(7) > span').text().replace(/\D/g, '');
            let status = ($('body > div.page-container > div.page-content-wrapper > div > div.row.sticky-container > div.col-md-4.quick-access-column > div > div > div.portlet-body > div:nth-child(1) > div > ul > li:nth-child(8) > span').text().includes('باز')) ? true : false;

            let minPrice = $('body > div.page-container > div.page-content-wrapper > div > div.row.sticky-container > div.col-md-4.quick-access-column > div > div > div.portlet-body > div:nth-child(1) > div > ul > li:nth-child(3) > span').text().replace(/\D/g, '');
            let maxPrice = $('body > div.page-container > div.page-content-wrapper > div > div.row.sticky-container > div.col-md-4.quick-access-column > div > div > div.portlet-body > div:nth-child(1) > div > ul > li:nth-child(4) > span').text().replace(/\D/g, '');

            bid.title = title;
            bid.desc = desc;
            bid.deadline = deadline;
            bid.expertise = expertise;
            bid.views = views;
            bid.status = status;
            bid.minPrice = minPrice;
            bid.maxPrice = maxPrice;

            console.log(`BID ${bid.id} Fetch!`);

            console.log('Scrapped bid data: ' , bid.id);
            return bid;


        } catch (error) {

            if (error.statusCode === 404) {
                console.log('Can Not Scrap: ' , bid.id);
                return;
            }
            return error;
        }






    }



















    async sendBid(project_data, r_price, r_prepay, r_deadline, r_valid_day, r_message, r_chance) {

        if (project_data.id === undefined || !project_data.id) {
            return false;
        }


        /* 
                let bidOptions =  {
                    'init_message[bidAmount]': r_price,
                    'init_message[deadline]': r_deadline,
                    'init_message[initEscrowPercent]': r_prepay,
                    'init_message[expertGuaranteePercent]': r_chance,
                    'init_message[validDays]': r_valid_day,
                    'init_message[message]': r_message,
                    'files[]': '',
                }
                var options = {
                    'method': 'POST',
                    'url': `${this.parsCodersUrl}/conversation/init/${project_data.id}`,
                    'headers': {
                        'authority': 'parscoders.com',
                        "accept-language": "en-US,en;q=0.9",
                        "cache-control": "max-age=0",
                        "content-type": "application/x-www-form-urlencoded",
                        'Referer': `${this.parsCodersUrl}/conversation/init/${project_data.id}`,
                        "Referrer-Policy": "origin-when-cross-origin"
        
                    },
                    body: encodeURI(JSON.stringify(bidOptions))
            };
        
        
                await this.FunctionsClass.sleep(1000);
        
        
        
                await this.auth().then(authResult => {
                }).catch(error => {
                    return error;
                }); // Login for access to scrap data
        
                await request(options, function (error, response, body) {
                    console.log(body);
                }); // Send request for collect data
        
        
         */
        var options = {
            'method': 'POST',
            'url': `${this.parsCodersUrl}/conversation/init/${project_data.id}`,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: {
                'init_message[bidAmount]': r_price,
                'init_message[deadline]': r_deadline,
                'init_message[initEscrowPercent]': r_prepay,
                'init_message[expertGuaranteePercent]': r_chance,
                'init_message[validDays]': r_valid_day,
                'init_message[message]': r_message,
                'files[]': '',
                'files[]': '',
            },
        };
        request(options).then(result => {

            if (result.error) {
                const $ = cheerio.load(result.error);
                let conversation_url = $("a").text();
                if (conversation_url.includes('conversation')) {

                    if (conversation_url.includes('conversation')) {
                        console.log('+ BID/' + project_data.id + ' started successfuly')
                        console.log('Url: ' + project_data.url);
                        console.log('Cost: ' + r_price);
                        console.log('Deadline: ' + r_deadline);
                        console.log('Expertise: ' + project_data.expertise);
                        console.log('Views: ' + project_data.views);
                        console.log('Chat: ' + this.parsCodersUrl + conversation_url);
                        console.log('   ');

                    }

                }
            }


        })
            .catch(error => {

                return;

            });


    }







    async sendBidSilent(project_data) {

        let fetch_data = await this.fetchBid(project_data);
        if (fetch_data && fetch_data.id) {
        } else {
            return;
        }



        let message = DB.get("profile_bid_message");


        let options = {
            'method': 'POST',
            'url': `${this.parsCodersUrl}/conversation/init/${project_data.id}`,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: {
                'init_message[bidAmount]': ((fetch_data.maxPrice * parseInt(DB.get("profile_bid_percentage"))) / 100),
                'init_message[deadline]': fetch_data.deadline,
                'init_message[initEscrowPercent]': 100,
                'init_message[expertGuaranteePercent]': fetch_data.expertise,
                'init_message[validDays]': DB.get("profile_bid_expire"),
                'init_message[message]': message,
                'files[]': '',
                'files[]': '',
            },
        };
        await request(options).then(result => {

            if (result.error) {
                const $ = cheerio.load(result.error);
                let conversation_url = $("a").text();
                if (conversation_url.includes('conversation')) {

                    if (conversation_url.includes('conversation')) {
                        console.log('+ BID/' + project_data.id + ' started successfuly')
                        return true;
                    }

                }
            }


        })
            .catch(error => {

                return;

            });


    }


















    async automaticProjectCaller(filter) {


        // Define some variables
        const allProjects = [];
        const uniqueProjects = [];
        const fetchProjects = [];

        let newProjects, newFetch;

        for (let skill_index = 0; skill_index < filter.length; skill_index++) {
            const skill = filter[skill_index];
            newProjects = await this.getNewProjects(skill)
            allProjects.push(newProjects);
        }




        allProjects.forEach((item) => { // Filter and delete duplicated items (just in case)

            if (!uniqueProjects.includes(item) && item.length > 0) {
                uniqueProjects.push(item);
            }
        });





        const flatedProjects = uniqueProjects.flat(10);
        for (let index = 0; index < flatedProjects.length; index++) { // Fetch full data for bids

            const project = flatedProjects[index];


            if (project.url != undefined) {

                newFetch = await this.fetchBid(project);
                fetchProjects.push(newFetch);

            }


        }




        return fetchProjects; // Return


    }










    async lunchProgram(skills, recommend_message) {


        const Projects = await this.automaticProjectCaller(skills)

        var r_message;


        for (let project = 0; project < Projects.length; project++) {



            let project_obj = Projects[project];
            //const project_id = project.id;
            let price = Math.round(((parseInt(project_obj.maxPrice) * 80) / 100));

            this.FunctionsClass.sleep(250);
            await this.sendBid(project_obj,
                `${price}`,
                '10',
                `${project_obj.deadline}`,
                '15',
                r_message,
                '0'

            );



        }




    }








}


module.exports = Core;