const db = require("quick.db")
const Discord = require('discord.js');
var rslow = require('../../slow.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "vocal",
    description: "Affiche les statistiques vocales du serveur",
    aliases: ["vc", "vocale"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message,cmd.name)
        if (perm == true) {
            if (!args[0]) {
                await client.guilds.fetch(message.guild.id)

                const embed = new Discord.MessageEmbed()
                    .setTitle(`🎙️ Statistiques vocal de ` + message.guild.name)
                    .setColor(db.fetch(`${message.guild.id}.color`))
                    .setDescription(`👥 Membres : ${message.guild.memberCount}
🟢 En ligne : ${message.guild.members.cache.filter(({ presence }) => presence && presence.status !== 'offline').size}
🔊 En vocal : ${message.guild.members.cache.filter(m => m.voice.channel).size}`)
                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                    .setFooter({ text: `©️ ${message.guild.name}` })
                return message.reply({ embeds: [embed] })

            } else {
                let m = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.tag.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;
                if (!m || m.bot) return message.channel.send(`:x: Utilisateur invalide !`)
                let voice = m.voice.channel

                if (!voice || voice === null || voice === undefined) { voice = `:mute: **${m.user.username}** n'est pas en vocal` } else {
                    voice = `:loud_sound: **${m.user.username}** est dans le salon vocal <#${voice.id}>`
                }
                if (message.guild.me.permissions.has("SEND_MESSAGES")) {
                    if (message.guild.me.permissions.has("EMBED_LINKS")) {

                        const embeds = new Discord.MessageEmbed()
                            .setDescription(voice + " \n\n")
                            .setColor(db.fetch(`${message.guild.id}.color`))
                            .setFooter({ text: `©️ ${client.config.botname}` })
                            .addFields(
                                { name: 'Mute Micro', value: m.voice.selfMute ? ":white_check_mark:" : ":x:", inline: true },
                                { name: 'Mute Casque', value: m.voice.selfDeaf ? ":white_check_mark:" : ":x:", inline: true },
                                { name: 'En stream', value: m.voice.streaming ? ":white_check_mark:" : ":x:", inline: true },
                                { name: 'Caméra', value: m.voice.selfVideo ? ":white_check_mark:" : ":x:", inline: true },
                            );
                        message.reply({ embeds: [embeds] });
                    } else {
                        message.reply(voice)
                    }
                } else {
                    const embeds = new Discord.MessageEmbed()
                        .setDescription(voice)
                        .setColor(db.fetch(`${message.guild.id}.color`))
                    message.author.send({ embeds: [embeds] });
                }
            }
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    }
}
