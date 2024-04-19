
const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "serverinfos",
    description: "Affiche les informations du serveur",
    aliases: ["serverinfo", "si"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message,"info")
        if (perm == true) {
            const embed = new Discord.MessageEmbed()
                .setColor(db.fetch(`${message.guild.id}.color`))
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setTitle(message.guild.name)
                .setURL(message.guild.iconURL({ dynamic: true }))
                .addFields(
                    {
                        name: "ID ",
                        value: message.guild.id,
                        inline: true
                    },
                    {
                        name: "Membres ",
                        value: `${message.guild.memberCount}`,
                        inline: true
                    },
                    {
                        name: "Membres en ligne ",
                        value: `${message.guild.members.cache.filter(({ presence }) => presence && presence.status !== 'offline').size}`,
                        inline: true
                    },
                    {
                        name: "Total Humains ",
                        value: `${message.guild.members.cache.filter(m => !m.user.bot).size}`,
                        inline: true
                    },
                    {
                        name: "Total Bots ",
                        value: `${message.guild.members.cache.filter(m => m.user.bot).size} `,
                        inline: true
                    },
                    {
                        name: "Membres en vocal ",
                        value: `${message.guild.members.cache.filter(m => m.voice.channel).size}`,
                        inline: true
                    },
                    {
                        name: `Owner `,
                        value: message.guild.members.cache.get(message.guild.ownerId) ? message.guild.members.cache.get(message.guild.ownerId).user.tag : `Pas de compte couronne trouvé`,
                        inline: true
                    },
                    {
                        name: "Membres sans rôle ",
                        value: `${message.guild.members.cache.filter(m => m.roles.cache.size<2).size}`,
                        inline: true
                    },
                    {
                        name: "Nombre de rôles ",
                        value: `${message.guild.roles.cache.size}`,
                        inline: true,
                    },
                    {
                        name: "Nombre de salons ",
                        value: `${message.guild.channels.cache.size}`,
                        inline: true,
                    },
                    {
                        name: 'Boosts ',
                        value: `${message.guild.premiumSubscriptionCount}`,
                        inline: true
                    },
                    {
                        name: "Emojis ",
                        value: `${message.guild.emojis.cache.size}`,
                        inline: true
                    }
                )
                .setImage(message.guild.banner ? message.guild.bannerURL({dynamic: true , size: 2048}) : "")
                .setFooter({ text: `Création du serveur` })
                .setTimestamp(message.guild.createdAt)
            message.reply({ embeds: [embed] })


        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`info\` !`)

    }
}