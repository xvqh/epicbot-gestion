const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "roleinfos",
    description: "Affiche les informations d'un rôle",
    aliases: ["ri", "roleinfo"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, "info")
        if (perm == true) {
            
            var role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.member.roles.highest
            if (!role) return message.channel.send(`:x: Veuillez mentionner un rôle valide`)
            let roleEmbed = new Discord.MessageEmbed()
                .setColor(db.fetch(`${message.guild.id}.color`))
                .setTitle(role.name)
                .setURL(message.guild.iconURL({ dynamic: true }))
                .addFields(
                    {
                        name: "Nom",
                        value: role.name,
                        inline: true
                    },
                    {
                        name: "ID",
                        value: `${role.id}`,
                        inline: true
                    },
                    {
                        name: "Membres possédant le rôle",
                        value: `${role.members.size}`,
                        inline: true
                    },
                    {
                        name: "Couleur",
                        value: `${role.hexColor === "#000000" ? "Classique" : role.hexColor}`,
                        inline: true
                    },
                    {
                        name: "Mentionnable",
                        value: `${role.mentionable ? "Oui" : "Non"}`,
                        inline: true
                    },
                    {
                        name: "Affiché séparément",
                        value: `${role.hoist ? "Oui" : "Non"}`,
                        inline: true
                    },
                    {
                        name: "Géré par une intégration",
                        value: `${role.managed ? "Oui" : "Non"}`,
                        inline: true
                    },
                    {
                        name: "Permission administrateur",
                        value: `${role.permissions.has("ADMINISTRATOR") ? "Oui" : "Non"}`,
                        inline: true
                    }
                )
                .setFooter({ text: `Création du rôle` })
                .setTimestamp(role.createdAt)

            message.reply({ embeds: [roleEmbed] })

        } else if (perm === false) if (!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`info\` !`)

    }
}

