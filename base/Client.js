const Discord = require('discord.js');
const fs = require('fs')
const snipes = new Map();
const guildInvites = new Map();
const { Player } = require("discord-music-player");
//const createConnextion = mysql.createPool({ host: config.mysql.host, port: config.mysql.port, user: config.mysql.user, password: config.mysql.password, database: config.mysql.database, waitForConnections: true, connectionLimit: 1, queueLimit: 0 });

module.exports = class client extends Discord.Client {
    constructor () {
		super({
            fetchAllMembers: true,
            intents: 32767,
            partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_PRESENCES', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', 'USER']
        })

        this.commands = new Discord.Collection()
        this.aliases = new Discord.Collection()
        this.cooldowns = new Discord.Collection()
        this.config = require('../config')
        this.perms = require('../perm.json')
        this.snipes = snipes
        this.player = new Player(this, {
            leaveOnEmpty: false, 
        });
        this.guildInvites = guildInvites

        this.login(this.config.token)

        this.initCommands()
        this.initEvents()
        this.initHandler()
    }

    initCommands() {
        const subFolders = fs.readdirSync('./commands')
        for (const category of subFolders) {
            const commandsFiles = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'))
            for (const commandFile of commandsFiles) {
                const command = require(`../commands/${category}/${commandFile}`)
                this.commands.set(command.name, command)
                if (command.aliases && command.aliases.length > 0) {
                    command.aliases.forEach(alias => this.aliases.set(alias, command))
                }
            }
        }
    }
    /*async database() {
        var promiseDB = await createConnextion.promise();
        return promiseDB;
    }*/
    initEvents(){
        fs.readdirSync(`./events`).forEach(dirs => {
            const events = fs.readdirSync(`./events/${dirs}/`).filter(files => files.endsWith(".js"));
        //const events = fs.readdirSync(`./events`).filter(file => file.endsWith('.js'))
            for(const ev of events){
                const event = require(`../events/${dirs}/${ev}`)
                if(!event) return
                this.on(event.name, (...args) => event.run(this, ...args))
        }
    })
    }
    initHandler(){
        const handlers = fs.readdirSync(`./base/handler`).filter(file => file.endsWith('.js'))
            for(const ev of handlers){
                const handler = require(`../base/handler/${ev}`)
                if(!handler) return
                this.on(handler.name, (...args) => handler.run(this, ...args))
        }

        
    }
}