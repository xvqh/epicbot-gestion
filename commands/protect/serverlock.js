const db = require("quick.db")
const Discord = require('discord.js');
var rslow = require('../../slow.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "serverlock",
    description: "Expulse les nouveaux membre rejoignants le serveur",
    aliases: ["lockserver", "raidmode"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, cmd.name)
        if (perm == true) {
            if (rslow.action[message.author.id] == true) return message.channel.send(`:x: Veuillez attendre avant d'effectuer une autre action !`)
            if (args[0] === "on" || args[0] === "max") {
                let check = db.fetch(`${message.guild.id}.serverlock`)
                if(check) return message.reply(`:x: La protection est déjà activé !`)
                db.set(`${message.guild.id}.serverlock`, "on")
                message.reply(`:lock: Le serveur est désormais fermé !`)
            } else 
            if (args[0] === "off") {
                db.delete(`${message.guild.id}.serverlock`)
                message.reply(`:unlock: Le serveur est désormais ouvert !`)
            } else return message.reply(db.fetch(`${message.guild.id}.serverlock`) ? `:lock: Le serveur est lock, les novueaux membres seront expulsés !`: `:unlock: Le serveur est ouvert !`)


            rslow.action[message.author.id] = true;
            setTimeout(() => {
                rslow.action[message.author.id] = false;
            }, db.fetch(`${message.guild.id}.actionslow`));
            let logchannel = db.fetch(`${message.guild.id}.raidlogs`)
            logchannel = message.guild.channels.cache.get(logchannel)
            if (logchannel) logchannel.send({
                content: (args[0] === "on" || args[0] === "max") ? "@everyone" : " ",
                embeds: [new Discord.MessageEmbed()
                    .setColor(db.fetch(`${message.guild.id}.color`))
                    .setDescription(`${message.author} a modifié le lockserver sur \`${args[0]}\` !`)]
            }).catch(e => { e })
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)
    }
}