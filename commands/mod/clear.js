const db = require("quick.db")
const Discord = require('discord.js');
var rslow = require('../../slow.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "clear",
    description: "Supprime des messages",
    aliases: ["purge", "mdelete"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message,cmd.name)
        if (perm == true) {
            if (rslow.action[message.author.id] == true) return message.channel.send(`:x: Veuillez attendre avant d'effectuer une autre action !`)
            let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.tag.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase())

            const deleteCount = (parseInt(args[member ? 1 : 0], 10) + 1);

            if (!deleteCount || deleteCount < 2 || deleteCount > 100) return message.reply(":x: Merci de préciser le nombre de message à supprimer (2 < 100)")
            let botMessages = await message.channel.messages.fetch({ limit: deleteCount })
            let messagessize = botMessages.size;
            if (member) {
                botMessages = botMessages.filter(msg => msg.author == member.user)
                messagessize = botMessages.size;
                message.channel.bulkDelete(botMessages).catch(e => {message.channel.send(`:x: Je n'ai pas pu clear certains messages !`)})
            } else message.channel.bulkDelete(deleteCount).catch(e => {message.channel.send(`:x: Je n'ai pas pu clear certains messages !`)})

            rslow.action[message.author.id] = true;
            setTimeout(() => {
                rslow.action[message.author.id] = false;
            }, db.fetch(`${message.guild.id}.actionslow`));
            let logchannel = db.fetch(`${message.guild.id}.modlogs`)
            logchannel = message.guild.channels.cache.get(logchannel)
            if (logchannel) logchannel.send({
                embeds: [new Discord.MessageEmbed()
                    .setColor(db.fetch(`${message.guild.id}.color`))
                    .setDescription(`${message.author} a **clear** ${member ? `${messagessize} messages de ${member} parmis ` : ``}${deleteCount - 1} messages dans ${message.channel}`)]
            }).catch(e => { e })
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    }
}