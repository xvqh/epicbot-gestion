const Discord = require('discord.js')
const db = require("quick.db");
let { permsize } = require("../../config")
permsize = permsize + 2
var { defaultperm } = require("../../perm.json")
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "helpall",
    description: "Affiche les commandes par permission",
    aliases: ["help-all"],

    run: async (client, message, args, cmd) => {
        try {
            let perm = await checkperm(message, "help")
            if (perm == true) {
                let button_next = new Discord.MessageButton().setStyle('PRIMARY').setCustomId('next').setEmoji("▶️")
                let button_back = new Discord.MessageButton().setStyle('PRIMARY').setCustomId('back').setEmoji("◀️")

                let button_row = new Discord.MessageActionRow().addComponents([button_back, button_next])
                
                let apage = 0
                const embed = new Discord.MessageEmbed()
                    .setColor(db.fetch(`${message.guild.id}.color`))
                    .setTitle(`Liste des commandes par permission`)
                    .setDescription(`Chargement...`)
                    .setFooter({ text: `Page ${apage}/${permsize} | By Millenium is here#4444`, iconURL: client.user.displayAvatarURL() })

                await message.reply({
                    embeds: [embed],
                    components: [button_row],
                    allowedMentions: { repliedUser: false }
                }).then(async msg => {
                    await permission(msg, apage, embed)
                    const collector = msg.createMessageComponentCollector({
                        componentType: "BUTTON",
                        time: 7200000
                    })
                    collector.on("collect", async (i) => {
                        if (i.user.id !== message.author.id) return i.reply({ content: "Désolé, mais vous n'avez pas la permission d'utiliser ces boutons !", ephemeral: true }).catch(() => { })
                        await i.deferUpdate()
                        if (i.customId === 'next') {
                            if (apage >= permsize) { apage = 0 } else {
                                apage++
                            }
                            permission(msg, apage, embed)
                        }

                        if (i.customId === 'back') {
                            if (apage <= 0) { apage = permsize } else {
                                apage--
                            }
                            permission(msg, apage, embed)
                        }
                    })

                    collector.on("end", async () => {
                        button_row.components[0].setDisabled(true);
                        button_row.components[1].setDisabled(true);
                        return msg.edit({ components: [button_row] }).catch(() => { })
                    })
                })
            } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`help\` !`)
        } catch (error) {
            console.log(error)
        }
        function permission(msg, number, embed) {
            let page = number
            let array = []
            if (number === permsize - 1) number = "owner"
            if (number === permsize) number = "buyer"
            for (i in defaultperm) {
                let check = db.fetch(`${message.guild.id}.change.${defaultperm[i].name}`)
                if (!check) {
                    db.set(`${message.guild.id}.change.${defaultperm[i].name}`, defaultperm[i].perm)
                }
                if (check === number) array.push(`\`${defaultperm[i].name}\``)
            }
            if (number === "owner") {
                embed.setDescription(`**__Permission owner:__**\n${array.length > 0 ? array.map(item => `\`${item}\``).join("\n") : "Pas de commandes :x:"}`)
                embed.setFooter({ text: `Page ${page}/${permsize} | By Millenium is here#4444`, iconURL: client.user.displayAvatarURL() })
            } else if (number === "buyer") {
                embed.setDescription(`**__Permission buyer:__**\n${array.length > 0 ? array.map(item => `\`${item}\``).join("\n") : "Pas de commandes :x:"}`)
                embed.setFooter({ text: `Page ${page}/${permsize} | By Millenium is here#4444`, iconURL: client.user.displayAvatarURL() })
            } else {
                embed.setDescription(`**__Permission ${number}:__**\n${array.length > 0 ? array.map(item => `\`${item}\``).join("\n") : "Pas de commandes :x:"}`)
                embed.setFooter({ text: `Page ${page}/${permsize} | By Millenium is here#4444`, iconURL: client.user.displayAvatarURL() })
            }
            return msg.edit({ embeds: [embed] })
        }
    }

}

