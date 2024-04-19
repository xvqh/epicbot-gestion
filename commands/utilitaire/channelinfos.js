const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "channelinfos",
    description: "Affiche les informations d'un salon",
    aliases: ["ci", "channelinfo"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message,"info")
        if (perm == true) {


            var channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel


            if (!channel) return message.channel.send(`:x: Veuillez mentionner un salon valide`)

            if (channel.type === 'GUILD_TEXT' || channel.type === 'GUILD_STORE' || channel.type === 'GUILD_NEWS') {

                const embed = new Discord.MessageEmbed()
                    .setColor(db.fetch(`${message.guild.id}.color`))
                    .setTitle(`${channel.name}`)
                    .setURL(message.guild.iconURL({ dynamic: true }))
                    .setTimestamp(channel.createdAt)
                    .setFooter({ text: "Créé le" })
                    .addFields(
                        {
                            name: `Description`,
                            value: channel.topic ? `${channel.topic}` : 'Aucune',
                            inline: false
                        },
                        {
                            name: `Mention du salon`,
                            value: `${channel}`,
                            inline: true
                        },
                        {
                            name: `ID`,
                            value: `${channel.id}`,
                            inline: true
                        },
                        {
                            name: `Type de salon`,
                            value: `${channel.type}`,
                            inline: true
                        },
                        {
                            name: `NSFW`,
                            value: channel.nsfw ? `oui` : `non`,
                            inline: true
                        },
                        {
                            name: `Membres ayant accès au salon`,
                            value: `${message.guild.members.cache.filter(m => channel.permissionsFor(m).has("VIEW_CHANNEL")).size}`,
                            inline: true
                        },
                        {
                            name: `Catégorie`,
                            value: `${channel.parent ? channel.parent : 'non-catégorisé'}\n${channel.parentID ? `(${channel.parentID})` : ''}`,
                            inline: true
                        },
                        {
                            name: `Slowmode`,
                            value: `${channel.rateLimitPerUser}`,
                            inline: true
                        }
                    );


                return message.reply({ embeds: [embed] });;
            };



            //si c'est une catégorie
            if (channel.type === 'GUILD_CATEGORY') {


                const embed = new Discord.MessageEmbed()
                    .setColor(db.fetch(`${message.guild.id}.color`))
                    .setTitle(`${channel.name}`)
                    .setURL(message.guild.iconURL({ dynamic: true }))
                    .setTimestamp(channel.createdAt)
                    .setFooter({ text: "Créé le" })
                    .addFields(
                        {
                            name: `Mention du salon`,
                            value: `${channel}`,
                            inline: true
                        },
                        {
                            name: `ID`,
                            value: `${channel.id}`,
                            inline: true
                        },
                        {
                            name: `Type de salon`,
                            value: `${channel.type}`,
                            inline: true
                        },
                        {
                            name: `Salons`,
                            value: `${channel.children.size}`,
                            inline: true
                        }
                    );




                return message.reply({ embeds: [embed] });
            };



            //si c'est un channel vocal
            if (channel.type === 'GUILD_VOICE') {


                const embed = new Discord.MessageEmbed()
                    .setColor(db.fetch(`${message.guild.id}.color`))
                    .setTitle(`${channel.name}`)
                    .setURL(message.guild.iconURL({ dynamic: true }))
                    .setTimestamp(channel.createdAt)
                    .setFooter({ text: "Créé le" })
                    .addFields(
                        {
                            name: `Mention du salon`,
                            value: `${channel}`,
                            inline: true
                        },
                        {
                            name: `ID`,
                            value: `${channel.id}`,
                            inline: true
                        },
                        {
                            name: `Type de salon`,
                            value: `${channel.type}`,
                            inline: true
                        },
                        {
                            name: 'Débit binaire (bitrate)',
                            value: `${channel.bitrate / 1000}` + 'kbps',
                            inline: true
                        },
                        {
                            name: `Membres connectés`,
                            value: `${channel.members.size}`,
                            inline: true
                        },
                        {
                            name: `Limite d'utilisateur connecté`,
                            value: channel.userLimit === 0 ? 'aucune' : `${channel.userLimit}`,
                            inline: true
                        }
                    );


                return message.reply({ embeds: [embed] });
            };

        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`info\` !`)

    }
}

