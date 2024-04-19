const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "wasted",
    description: "Arrête un membre",

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message,cmd.name)
        if (perm == true) {
            let member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.tag.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member
            if (!member || member.user.bot) return message.channel.send(`:x: Utilisateur invalide !`)
            let kiss = ['https://thumbs.gfycat.com/ArtisticLikableIrishredandwhitesetter-size_restricted.gif', "https://c.tenor.com/IPwsGJUGI4YAAAAd/teletubbies-lala.gif", "https://thumbs.gfycat.com/AmbitiousValidEmperorpenguin-size_restricted.gif", "https://media3.giphy.com/media/AHMHuF12pW4b6/giphy.gif", "http://i.imgur.com/2NBjpYU.gif", "https://c.tenor.com/gaULP-fkgX8AAAAC/wasted.gif", "https://c.tenor.com/XSn5KNsFqiYAAAAd/deafgamerstv-wasted.gif", "https://i.pinimg.com/originals/9b/58/fa/9b58fa8a88d5df96ba38bd822cd445ea.gif", "https://64.media.tumblr.com/6a6b038b4ba891731d4b69b72e826e90/tumblr_py9uv8uD5T1tcpc1oo1_400.gifv", "http://i.imgur.com/XSuTVIv.gif", "https://thumbs.gfycat.com/FalseImperfectBlackrussianterrier-size_restricted.gif", "https://64.media.tumblr.com/38327cb6e450fb541e90c46fb516a78c/tumblr_n5w4jqpZu31qiirkeo1_400.gifv"]
            var randomkiss = kiss[Math.floor(Math.random()*kiss.length)]
            var embed = new Discord.MessageEmbed()
                .setDescription(`⛔️ **${message.author.username}** a arrêté **${member.user.username}**`)
                .setImage(randomkiss)
                .setColor(db.fetch(`${message.guild.id}.color`))
            message.reply({embeds: [embed]})

        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    }
}