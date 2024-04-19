const db = require("quick.db")
const Discord = require('discord.js');
var rslow = require('../../slow.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "unmassiverole",
    description: "Retire un rôle à tous les membres du serveur",
    aliases: ["unmassrole"],
    usage: "unmassiverole <@role>",

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, cmd.name)
        if (perm == true) {
            if (rslow.action[message.author.id] == true) return message.channel.send(`:x: Veuillez attendre avant d'effectuer une autre action !`)
            let role = await message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name.toLowerCase().includes(args.slice(1).join(" ").toLocaleLowerCase()))
            if (!role || role.id === message.guild.id) return message.reply(`:x: Veuillez préciser un rôle valide`)
            const memberPosition = message.member.roles.highest.position;
            const authorPosition = role.position;
            if (authorPosition >= memberPosition) return message.reply(":x: Vous ne pouvez pas retirer un rôle supérieur au votre !");
            let membersize = message.guild.members.cache.filter(m => m.roles.cache.some(r => r.id === role.id))
            let count = 0
            message.reply(`Le rôle **${role.name}** va être retiré à ${membersize.size} membres...\nCe processus peut prendre du temps en fonction de la taille de votre serveur`)
            await membersize.forEach(async member => {
                count++
                await member.roles.remove(role).catch()
            if (0 === member.guild.members.cache.filter(m => m.roles.cache.some(r => r.id === role.id)).size) return message.channel.send(`Le rôle a bien été retiré à ${membersize.size} membres !`)
            
            })
            rslow.action[message.author.id] = true;
            setTimeout(() => {
                rslow.action[message.author.id] = false;
            }, db.fetch(`${message.guild.id}.actionslow`));
            let logchannel = db.fetch(`${message.guild.id}.modlogs`)
            logchannel = message.guild.channels.cache.get(logchannel)
            if (logchannel) logchannel.send({
                embeds: [new Discord.MessageEmbed()
                    .setColor(db.fetch(`${message.guild.id}.color`))
                    .setDescription(`${message.author} a **unmassiverole** le rôle ${role} à ${membersize.size} membres !`)]
            }).catch(e => { e })
        } else if (perm === false) if (!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    }
}
