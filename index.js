//modules
const axios = require('axios').default;
const discord = require('discord.js');
//const bot = new discord.Client();
//const { Client, Intents } = require('discord.js');
var CronJob = require('cron').CronJob;
const bot = new discord.Client({
    intents: [
        discord.Intents.FLAGS.GUILDS,
        discord.Intents.FLAGS.GUILD_MESSAGES
    ]
});
const fs = require('fs');
const path = require('path');
const Time = require('date-and-time');
const request = require('request');
const schedule = require('node-schedule');
const dotenv = require('dotenv').config({
    path: path.resolve('password.env'),
});

//bot constants
const basicAuth = process.env.BASIC_AUTH
const userID = process.env.USER_ID
const uri = 'https://umd.instructure.com/api/v1'
const PREFIX = '?';

bot.on('ready', function () {
    console.log("It's Working");
    const channel = bot.channels.cache.get('955971828822704158') //replace with respective discord channel id


    //SHOWS RECENTLY GRADED ASSIGNMENTS AT 9:00

    var jobGr = new CronJob('0 13 * * *', ()=> { //SET AS 13:00 BECAUSE OF HEROKU SERVERS
        channel.send("𝐆𝐑𝐀𝐃𝐄𝐃:")  
        axios.get(uri + '/users/' + userID + '/graded_submissions', { headers: { 'Authorization': basicAuth } })
            .then(res => {
                for (assign of res.data) {
                    if (assign.hasOwnProperty("entered_grade")) {
                        const grade = assign.entered_grade
                        const assignID = assign.assignment_id
                        const assignURL = assign.preview_url
                        const courseID = assignURL.substring(assignURL.indexOf("courses") + 8, assignURL.indexOf("courses") + 15)
                        //msg.channel.send(courseID)
                        axios.get('https://umd.instructure.com/api/v1/courses/' + courseID + '/assignments/' + assignID, { headers: { 'Authorization': basicAuth } })
                            .then(resp => {
                                //console.log(resp)
                                const name = resp.data.name
                                const max = resp.data.points_possible
                                channel.send(name + ": " + grade + "/" + max)
                                console.log(`statusCode: ${resp.status}`)
                            })
                            .catch(error => {
                                console.error(error)
                            });
                    }
                }

                console.log(`statusCode: ${res.status}`)
            })
            .catch(error => {
                console.error(error)
            });

    })
    jobGr.start();

    //SHOWS ASSIGNMENTS TODO AT 9:30
    var jobTD = new CronJob('30 13 * * *', ()=> { //SET AS 13:30 BECAUSE OF HEROKU SERVERS
        channel.send("𝐓𝐎-𝐃𝐎:")
        axios.get(uri + '/users/self/todo', {headers: { 'Authorization': basicAuth}})
        .then(res => {
            for(assign of res.data) {
                if(assign.assignment.hasOwnProperty("name")) {
                    if(assign.assignment.has_submitted_submissions == false) {
                        channel.send(assign.assignment.name)
                    }
                }
               
            }
            console.log(`statusCode: ${res.status}`)
        })
        .catch(error => {
            console.error(error)
        });
    })
    jobTD.start()

});


bot.on('messageCreate', function (msg) {

    let args = msg.content.substring(PREFIX.length).split(" "); //returns the text after the prefix
    var arg = ((args[0].toString()).toLowerCase());
 
    if (msg.content.charAt(0) != PREFIX) {
        return;
    }

    //RETURNS ASSIGNMENTS TODO
    if (arg == 'todo') {
        msg.channel.send("𝐓𝐎-𝐃𝐎:")
        axios.get(uri + '/users/self/todo', {headers: { 'Authorization': basicAuth}})
        .then(res => {
            for(assign of res.data) {
                if(assign.assignment.hasOwnProperty("name")) {
                    if(assign.assignment.has_submitted_submissions == false) {
                        msg.channel.send(assign.assignment.name)
                    }
                }
            }
            console.log(`statusCode: ${res.status}`)
        })
        .catch(error => {
            console.error(error)
        });

    }

    //RETURNS RECENTLY GRADED ASSIGNMENTS
    if (arg == 'graded') {
        msg.channel.send("𝐆𝐑𝐀𝐃𝐄𝐃:")  
        axios.get(uri + '/users/' + userID + '/graded_submissions', { headers: { 'Authorization': basicAuth } })
            .then(res => {
                for (assign of res.data) {
                    if (assign.hasOwnProperty("entered_grade")) {
                        const grade = assign.entered_grade
                        const assignID = assign.assignment_id
                        const assignURL = assign.preview_url
                        const courseID = assignURL.substring(assignURL.indexOf("courses") + 8, assignURL.indexOf("courses") + 15)
                        //msg.channel.send(courseID)
                        axios.get('https://umd.instructure.com/api/v1/courses/' + courseID + '/assignments/' + assignID, { headers: { 'Authorization': basicAuth } })
                            .then(resp => {
                                //console.log(resp)
                                const name = resp.data.name
                                const max = resp.data.points_possible
                                msg.channel.send(name + ": " + grade + "/" + max)
                                console.log(`statusCode: ${resp.status}`)
                            })
                            .catch(error => {
                                console.error(error)
                            });
                    }
                }
                console.log(`statusCode: ${res.status}`)
            })
            .catch(error => {
                console.error(error)
            });
    }

    //RETURNS MISSING ASSIGNMENTS 
    if (arg == 'missing') {
        const missing = true;
        msg.channel.send("𝐌𝐈𝐒𝐒𝐈𝐍𝐆:")
        axios.get(uri + '/users/' + userID + '/missing_submissions', { headers: { 'Authorization': basicAuth } })
            .then(res => {
                //console.log(res.data)
                var key = "name"
                for (assign of res.data) {
                    if (assign.hasOwnProperty(key)) {
                        if (assign.has_submitted_submissions == false) {
                            if(assign.name) {
                                missing = false
                                msg.channel.send(assign.name)
                            }
                        }
                    }

                }
                if(missing) {
                    msg.channel.send("NONE")
                }
                console.log(`statusCode: ${res.status}`)
            })
            .catch(error => {
                console.error(error)
            });

    }

    //RESTARTS BOT CLIENT
    if (arg == 'destroy') {
        msg.channel.send("Bot Restarting...")
        bot.destroy();
        bot.login(process.env.BOT_TOKEN);
    }

    //TESTS BOT CLIENT
    if (arg == 'test') {
        msg.channel.send("Bot running");
    }

    //LISTS BOT COMMANDS
    if (arg == 'help') {
        msg.channel.send("Availible commands are:");
        msg.channel.send("?todo, ?graded, ?missing, ?test, ?destroy")
        msg.channel.send("At 9:00EST the bot will post your most recently graded assignments")
        msg.channel.send("At 9:30EST the bot will post your assignments to do")

    }

});

bot.login(process.env.BOT_TOKEN);


 
