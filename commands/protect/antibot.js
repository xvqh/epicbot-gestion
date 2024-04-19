const db = require("quick.db")
const Discord = require('discord.js');
var rslow = require('../../slow.js');
const { checkperm } = require("../../base/functions");
module.exports = {
        name: "antibot",
        description: "Configure l'anti-bot",
        usage: "antibot <off/on/max>",
        aliases: ["anti-bot"],

        run: async (client, message, args, cmd) => {
            let b = db.fetch(`${message.guild.id}.botowner`)
            let perm = await checkperm(message, "anti")
            if (perm == true || b && b.includes(message.author.id)) {
            if (rslow.action[message.author.id] == true) return message.channel.send(`:x: Veuillez attendre avant d'effectuer une autre action !`)
            if (args[0] === "on") { db.set(`${message.guild.id}.anti.bot`, "on") } else
                if (args[0] === "off") { db.delete(`${message.guild.id}.anti.bot`) } else
                    if (args[0] === "max") { db.set(`${message.guild.id}.anti.bot`, "max") } else return message.reply(`L'antibot est sur \`${db.fetch(`${message.guild.id}.anti.bot`) || "off"}\` !`)

            message.reply(`:shield: L'\`antibot\` est désormais sur \`${args[0]}\`${args[0] === "on" ? " (_les membres wl sont ignorés_)" : ""}`)

            rslow.action[message.author.id] = true;
            setTimeout(() => {
                rslow.action[message.author.id] = false;
            }, db.fetch(`${message.guild.id}.actionslow`));
            let logchannel = db.fetch(`${message.guild.id}.raidlogs`)
            logchannel = message.guild.channels.cache.get(logchannel)
            if (logchannel) logchannel.send({
                embeds: [new Discord.MessageEmbed()
                    .setColor(db.fetch(`${message.guild.id}.color`))
                    .setDescription(`${message.author} a modifié l'antibot sur \`${args[0]}\` !`)]
            }).catch(e => { e })
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`anti\` !`)

    }
}