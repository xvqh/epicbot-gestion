
const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "ginfos",
    description: "Donne les informations du giveaway",
    aliases: ["ginfo", "gi"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message,cmd.name)
        if (perm == true) {
            let gwid = args[0] || db.fetch(`${message.guild.id}.last-giveaway.${message.channel.id}`)
            let giveaway =  db.fetch(`${message.guild.id}.giveaway.${gwid}`)
            if(!giveaway) return message.reply(`:x: Je ne trouve pas ce giveaway !`)
            let parti = db.fetch(`${message.guild.id}.participants-giveaway.${gwid}`)
            if (!parti || parti.length < 1) {
                return message.reply(":x: Personne ne participe au giveaway")
            } else {
            let count = 0
            let member = parti.map(x => {
                count++
                return `<@${x}>`
            });

                let embeds = {};
                let page = 0;

                const size = 10;
                let memberarray = [];

                for (let i = 0; i < member.length; i += size) {
                    const allMembers = member.slice(i, i + size);
                    memberarray.push(allMembers);
                }
                memberarray.forEach((chunk, i) => embeds[i] = chunk);

                const row = new Discord.MessageActionRow().addComponents([
                    new Discord.MessageButton()
                        .setStyle('PRIMARY')
                        .setEmoji('⬅️')
                        .setCustomId('left'),

                    new Discord.MessageButton()
                        .setStyle('PRIMARY')
                        .setEmoji('➡️')
                        .setCustomId('right'),
                ])

                let embed = new Discord.MessageEmbed()
                embed.setTitle(`${member.length > 1 ? `Voici la liste des participants du giveaway ${giveaway.gain} (${member.length})` : `Voici le participant pour le giveaway ${giveaway.gain} (1)`}`)
                embed.setColor(client.config.color)
                embed.setFooter({ text: `Page ${page + 1}/${memberarray.length}` })
                embed.setDescription(embeds[0].join('\n'));

                if (memberarray.length === 1) {
                    await message.channel.send({
                        embeds: [embed],
                    }).catch(() => null)
                } else {
                    await message.channel.send({
                        embeds: [embed],
                        components: [row]
                    }).then(mes => {

                    const collector = mes.createMessageComponentCollector({
                        componentType: "BUTTON",
                        time: 60000,
                    })
                    collector.on("collect", async (interaction) => {
                        if (interaction.user.id !== message.author.id) return interaction.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
                        await interaction.deferUpdate();

                        if (interaction.customId === "left") {
                            if (page == parseInt(Object.keys(embeds).shift())) page = parseInt(Object.keys(embeds).pop())
                            else page--;
                            embed.setDescription(embeds[page].join('\n'))
                            embed.setFooter({ text: `Page ${page + 1}/${memberarray.length}` })

                            mes.edit({
                                embeds: [embed],
                                components: [row]
                            }).catch(() => null)
                        }

                        if (interaction.customId === "right") {
                            if (page == parseInt(Object.keys(embeds).pop())) page = parseInt(Object.keys(embeds).shift())
                            else page++;
                            embed.setDescription(embeds[page].join('\n'))
                            embed.setFooter({ text: `Page ${page + 1}/${memberarray.length}` })

                            mes.edit({
                                embeds: [embed],
                                components: [row]
                            }).catch(() => null)
                        }
                    });

                    collector.on("end", async () => {
                        return mes.edit({ content: "Expiré !", components: [] }).catch(() => { })
                      })
                    })
                    }
                }

        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)
    }
}