const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "boosters",
    description: "Affiche la liste des boosters",
    aliases: ["booster", "boostlist"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, "info")
        if (perm == true) {

            let count = 0
            let member = (await message.guild.members.fetch()).filter(user => user.premiumSince).map(x => {
                count++
                return `\`\`${count}\`\` **${x.user.tag}** a boost le <t:${Math.floor(x.premiumSinceTimestamp / 1000)}:R>`
            });

            if (member.length < 1) {
                return message.reply(":x: Il n'y a pas de boosts dans ce serveur")
            } else {
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
                embed.setTitle(`${member.length > 1 ? `Voici la liste des boosters du serveur (${member.length})` : `Voici le booster du serveur (1)`}`)
                embed.setColor(client.config.color)
                embed.setFooter({ text: `Page ${page + 1}/${memberarray.length}` })
                embed.setDescription(embeds[0].join('\n'));

                if (memberarray.length === 1) {
                    await message.reply({
                        embeds: [embed],
                    }).catch(() => null)
                } else {
                    await message.reply({
                        embeds: [embed],
                        components: [row]
                    }).then(messages => {

                        const collector = messages.createMessageComponentCollector({
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

                                messages.edit({
                                    embeds: [embed],
                                    components: [row]
                                }).catch(() => null)
                            }

                            if (interaction.customId === "right") {
                                if (page == parseInt(Object.keys(embeds).pop())) page = parseInt(Object.keys(embeds).shift())
                                else page++;
                                embed.setDescription(embeds[page].join('\n'))
                                embed.setFooter({ text: `Page ${page + 1}/${memberarray.length}` })

                                messages.edit({
                                    embeds: [embed],
                                    components: [row]
                                }).catch(() => null)
                            }
                        });

                        collector.on("end", async () => {
                            return messages.edit({ content: "Expiré !", components: [] }).catch(() => { })
                        })
                    })
                }

            }
        } else if (perm === false) if (!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`info\` !`)
    }
}