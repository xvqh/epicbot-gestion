const db = require("quick.db")
const Discord = require('discord.js');
var rslow = require('../../slow.js');
const { checkperm } = require("../../base/functions");
module.exports = {
        name: "antirole",
        description: "Configure l'anti ajout rôle",
        usage: "antirole <off/on/max>",
        aliases: ["anti-role"],

        run: async (client, message, args, cmd) => {
            let b = db.fetch(`${message.guild.id}.botowner`)
            let perm = await checkperm(message, "anti")
            if (perm == true || b && b.includes(message.author.id)) {
            if (rslow.action[message.author.id] == true) return message.channel.send(`:x: Veuillez attendre avant d'effectuer une autre action !`)
            if (args[0] === "on") { db.set(`${message.guild.id}.anti.role`, "on") } else
                if (args[0] === "off") { db.delete(`${message.guild.id}.anti.role`) } else
                    if (args[0] === "max") { db.set(`${message.guild.id}.anti.role`, "max") } else return message.reply(`L'antirole est sur \`${db.fetch(`${message.guild.id}.anti.role`) || "off"}\` !`)

            message.reply(`:shield: L'\`antirole\` est désormais sur \`${args[0]}\`${args[0] === "on" ? " (_les membres wl sont ignorés_)" : ""}`)

            rslow.action[message.author.id] = true;
            setTimeout(() => {
                rslow.action[message.author.id] = false;
            }, db.fetch(`${message.guild.id}.actionslow`));
            let logchannel = db.fetch(`${message.guild.id}.raidlogs`)
            logchannel = message.guild.channels.cache.get(logchannel)
            if (logchannel) logchannel.send({
                embeds: [new Discord.MessageEmbed()
                    .setColor(db.fetch(`${message.guild.id}.color`))
                    .setDescription(`${message.author} a modifié l'antirole sur \`${args[0]}\` !`)]
            }).catch(e => { e })
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`anti\` !`)

    }
}