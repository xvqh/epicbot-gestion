const db = require("quick.db")
const Discord = require('discord.js');
var rslow = require('../../slow.js');
const { checkperm } = require("../../base/functions");
module.exports = {
        name: "antispam",
        description: "Configure l'anti-spam",
        usage: "antispam <off/on/max/allow/deny> <msg/time>",
        aliases: ["anti-spam"],

        run: async (client, message, args, cmd) => {
            let b = db.fetch(`${message.guild.id}.botowner`)
            let perm = await checkperm(message, "anti")
            if (perm == true || b && b.includes(message.author.id)) {
            if (rslow.action[message.author.id] == true) return message.channel.send(`:x: Veuillez attendre avant d'effectuer une autre action !`)
            let sensibilite = args[1]
            let slash = 1
            if(sensibilite) slash = sensibilite.indexOf("/")
            if (args[0] === "on") {
                if (args[1] && (isNaN(sensibilite.substring(0, slash)) || sensibilite[slash] !== "/" || isNaN(sensibilite.substring(slash+1, args[1].length)))) return message.reply(`:x: Veuillez préciser la sensibilité\nExemple: \`antispam <on/max> 6/5\``)
                db.set(`${message.guild.id}.anti.spam`, "on")
                if(sensibilite) db.set(`${message.guild.id}.anti.spam_sensi`, args[1] ? args[1] : "6/5")
            } else
            if (args[0] === "off") { db.delete(`${message.guild.id}.anti.spam`) } else
            if (args[0] === "max") {
                if (args[1] && (isNaN(sensibilite.substring(0, slash)) || sensibilite[slash] !== "/" || isNaN(sensibilite.substring(slash+1, args[1].length)))) return message.reply(`:x: Veuillez préciser la sensibilité\nExemple: \`antispam <on/max> 6/5\``)
                db.set(`${message.guild.id}.anti.spam`, "max")
                if(sensibilite) db.set(`${message.guild.id}.anti.spam_sensi`, args[1] ? args[1] : "6/5")
            } else
            if (args[0] === "allow") {
                let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.channel
                db.push(`${message.guild.id}.anti.spam_allow`, channel.id)
                return message.reply(`:shield: Le salon \`${channel.name}\` est désormais ignoré par l'antispam`)
            } else
            if (args[0] === "deny") {
                let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.channel
                let channels = db.fetch(`${message.guild.id}.anti.spam_allow`)
                const filtered = channels.filter(e => e !== channel.id);
                db.set(`${message.guild.id}.anti.spam_allow`, filtered);
                return message.reply(`:shield: Le salon \`${channel.name}\` n'est plus ignoré par l'antispam`)
            } else return message.reply(`L'antispam est sur \`${db.fetch(`${message.guild.id}.anti.spam`) || "off"}\` !`)

            message.reply(`:shield: L'\`antispam\` est désormais sur \`${args[0]}\`${sensibilite ? " - \`"+sensibilite+"\`" : ""}${args[0] === "on" ? " (_les membres wl sont ignorés_)" : ""} `)

            rslow.action[message.author.id] = true;
            setTimeout(() => {
                rslow.action[message.author.id] = false;
            }, db.fetch(`${message.guild.id}.actionslow`));
            let logchannel = db.fetch(`${message.guild.id}.raidlogs`)
            logchannel = message.guild.channels.cache.get(logchannel)
            if (logchannel) logchannel.send({
                embeds: [new Discord.MessageEmbed()
                    .setColor(db.fetch(`${message.guild.id}.color`))
                    .setDescription(`${message.author} a modifié l'antispam sur \`${args[0]}\` !`)]
            }).catch(e => { e })
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`anti\` !`)

    }
}