const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm, between } = require("../../base/functions");
module.exports = {
    name: "gay",
    description: "Calcul le pourcentage d'homosexualité du membre",

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message,cmd.name)
        if (perm == true) {
            let member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.tag.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member
            if (!member || member.user.bot) return message.channel.send(`:x: Utilisateur invalide !`)

            const randomnumber = between(1, 100)
            const random = new Discord.MessageEmbed()
                .setTitle(member.user.username + ` est gay à ${randomnumber}% :rainbow_flag:`)
                .setColor(db.fetch(`${message.guild.id}.color`))
                .setImage(`https://i.imgur.com/MRpzCqz.gif?noredirect`)
                .setFooter({text:"⚠️ Le pourcentage peut changer selon les pulsions du membre"})

            message.reply({embeds: [random]})
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    }
}