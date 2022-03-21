//Modules
const axios = require('axios').default;
const discord = require('discord.js');
const bot = new discord.Client();
const fs = require('fs');
const path = require('path');
const Time = require('date-and-time');
const request = require('request');
const dotenv = require('dotenv').config({
  path: path.resolve('password.env'),
});

//Bot constants
const basicAuth = process.env.BASIC_AUTH
const uri = 'umd.instructure.com/api/v1/users/self'
const PREFIX = '?';

bot.on('ready', function() {
    console.log("It's Working");
});


bot.on('message', function(msg) {
    
    let args = msg.content.substring(PREFIX.length).split(" "); //returns the text after the prefix
    var arg = ((args[0].toString()).toLowerCase());
    if(msg.content.charAt(0) != PREFIX) {
        return;
    }

    if(arg == 'missing') {
        msg.channel.send("🅜🅘🅢🅢🅘🅝🅖")
        msg.channel.send("____________")
        axios.get('https://umd.instructure.com/api/v1/users/self/todo', {headers: { 'Authorization': basicAuth}})
        .then(res => {
            //console.log(res.data)
            var key = "name"
            for(assign of res.data) {
                if(assign.assignment.hasOwnProperty(key)) {
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
    if (arg =='destroy') {
        msg.channel.send("Bot Restarting...")
        bot.destroy();
        bot.login(process.env.BOT_TOKEN);
    }

    if (arg == 'test') {
        msg.channel.send("Bot running");
    }

    if (arg == 'help') {
        msg.channel.send("Availible commands are (?date, ?test, ?git) and some question based commands for fun!");
    }

    if (arg == 'git') {
        msg.channel.send("https://github.com/amruth21")
    }

    if (arg == "who" || arg == "whose" || arg == "which") {
        //msg.channel.send("testing");
        var GuildMembers = msg.guild.members;
        //console.log(lengthy);
        var mems = [];
        var nicks = GuildMembers.map(g => g.nickname)
        var lengthy = nicks.length;
        var i;
        for (i = 0; lengthy > i; i++) {
            if (typeof(nicks[i]) === "string") {
                //console.log("test");
                if (nicks[i] != "oRgAnIc BeAnA" && nicks[i] != "irrelevant") {
                    mems.push(nicks[i]);
                }
            }
        }
        console.log(mems);
        var person = mems[Math.floor(Math.random() * mems.length)];
        msg.channel.send(person);
    }

    if (arg == "is" || arg == "will" || arg == "did") {
        var answer;
        if (Math.floor(Math.random() * 10) >= 5) {
            answer = "yes";
        } else {
            answer = "no";
        }
        msg.channel.send(answer);
    }
    

});

bot.login(process.env.BOT_TOKEN);


/*
var filePath = path.join(__dirname, 'secret.txt'); //sike u aint getting that
var token = fs.readFileSync(filePath, "utf8");

fs.readFile(filePath, 'utf8', function(err, contents) {
    if(err){
        console.log('error!');
    }
    else{ 
        token = contents;
        console.log(contents);
    }
});
*/