# discord-college-bot
A discord programmed using Node.js to handle various commands for UMD college students
![alt text](https://img.shields.io/github/languages/top/amruth21/discord-college-bot "test")
![alt text](https://img.shields.io/appveyor/build/amruth21/discord-college-bot "test")
![alt text](https://img.shields.io/github/stars/amruth21/discord-college-bot?style=social "test")

## Description

Discord Canvas Bot that utilizes the Canvas API to fetch user data for classes and send it to their respective discord server. Configured to send messages at 9:00am and 9:30am EST with recently graded and todo assignments for the day.

## Getting Started

### Dependencies

* NodeJS
* Axios
* Heroku
* discord.js
* dotenv
* CronJob

### Installing

```
git clone https://github.com/amruth21/discord-college-bot
```

### Executing program

* Locally running the bot

```
npm install
```
```
npm run start
```
* Setting up remote hosting
    1. Create a Heroku application
    2. Set buildpack to Nodejs
    3. Configure environment variables(BOT_TOKEN, USERID, Basic_AUTH)
    4. Set up automatic deploys from GitHub main branch repository  

## Authors

Amruth Nare (amruthnare.1@gmail.com)

## MIT License
