
const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "avatar",
    description: "Affiche l'image de profil du membre mentionné",
    aliases: ["pp", "pic"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message,cmd.name)
        if (perm == true) {
            let member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.tag.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member
            if (!member || member.bot) return message.channel.send(`:x: Utilisateur invalide !`)
            let avatarembed = new Discord.MessageEmbed()
            .setImage(member.displayAvatarURL({dynamic: true, size: 512}))
            .setColor(db.fetch(`${message.guild.id}.color`))
            .setTitle("Avatar de "+member.user.username)
            .setFooter({text: "Demandé par " + message.author.tag})
            .setDescription("[Lien de l'avatar]("+ member.displayAvatarURL({dynamic: true, size: 512}) +")")
        

            message.reply({embeds: [avatarembed]})
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    }
}