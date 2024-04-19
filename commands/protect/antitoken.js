const db = require("quick.db")
const Discord = require('discord.js');
var rslow = require('../../slow.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "antitoken",
    description: "Configure l'anti-token",
    usage: "antitoken <off/on/max> <join/time>",
    aliases: ["anti-token"],

    run: async (client, message, args, cmd) => {
        let b = db.fetch(`${message.guild.id}.botowner`)
        let perm = await checkperm(message, "anti")
        if (perm == true || b && b.includes(message.author.id)) {
            if (rslow.action[message.author.id] == true) return message.channel.send(`:x: Veuillez attendre avant d'effectuer une autre action !`)
            let sensibilite = args[1]
            let slash = 1
            if(sensibilite) slash = sensibilite.indexOf("/")
            if (args[0] === "on") {
                if (args[1] && (isNaN(sensibilite.substring(0, slash)) || sensibilite[slash] !== "/" || isNaN(sensibilite.substring(slash+1, args[1].length)))) return message.reply(`:x: Veuillez préciser la sensibilité\nExemple: \`antitoken <on/max> 10/10\``)
                db.set(`${message.guild.id}.anti.token`, "on")
                if (sensibilite) db.set(`${message.guild.id}.anti.token_sensi`, args[1] ? args[1] : "10/10")
            } else
            if (args[0] === "off") { db.delete(`${message.guild.id}.anti.token`) } else
            if (args[0] === "max") {
                if (args[1] && (isNaN(sensibilite.substring(0, slash)) || sensibilite[slash] !== "/" || isNaN(sensibilite.substring(slash+1, args[1].length)))) return message.reply(`:x: Veuillez préciser la sensibilité\nExemple: \`antitoken <on/max> 10/10\``)
                db.set(`${message.guild.id}.anti.token`, "max")
                if (sensibilite) db.set(`${message.guild.id}.anti.token_sensi`, args[1] ? args[1] : "10/10")
            } else return message.reply(`L'antitoken est sur \`${db.fetch(`${message.guild.id}.anti.token`) || "off"}\` !`)
            message.reply(`:shield: L'\`antitoken\` est désormais sur \`${args[0]}\`${sensibilite ? " - \`" + sensibilite + "\`" : ""}${args[0] === "on" ? " (_les membres wl sont ignorés_)" : ""} `)

            rslow.action[message.author.id] = true;
            setTimeout(() => {
                rslow.action[message.author.id] = false;
            }, db.fetch(`${message.guild.id}.actionslow`));
            let logchannel = db.fetch(`${message.guild.id}.raidlogs`)
            logchannel = message.guild.channels.cache.get(logchannel)
            if (logchannel) logchannel.send({
                embeds: [new Discord.MessageEmbed()
                    .setColor(db.fetch(`${message.guild.id}.color`))
                    .setDescription(`${message.author} a modifié l'antitoken sur \`${args[0]}\` !`)]
            }).catch(e => { e })
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`anti\` !`)

    }
}