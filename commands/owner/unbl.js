
const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "unbl",
    description: "Retire de la blacklist un membre du serveur",
    aliases: ["unblacklsit"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, cmd.name)
        if (perm == true) {

            let member
            if (isNaN(args[0])) {
                member = message.mentions.users.first()
            } else {
                member = await client.users.fetch(args[0])
            }
            if (!member) return message.reply(":x: Utilisateur invalide !")
            let actualbl = db.fetch("bot.bl")
            if (actualbl && actualbl.includes(member.id)) {
                const filtered = actualbl.filter(e => e !== member.id);
                db.set(`bot.bl`, filtered);
                message.guild.members.unban(member.id)
                message.reply(`${member.username} a été retire de la blacklist et a été unban de ce serveur !`)
            } else return message.reply(`:x: Le membre n'est pas blacklist`)
            let logchannel = db.fetch(`${message.guild.id}.raidlogs`)
            logchannel = message.guild.channels.cache.get(logchannel)
            if (logchannel) logchannel.send({
                embeds: [new Discord.MessageEmbed()
                    .setColor(db.fetch(`${message.guild.id}.color`))
                    .setDescription(`${message.author} a **unblacklist** ${member.toString()}`)]
            }).catch(e => { e })

        } else if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    }
}