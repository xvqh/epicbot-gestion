const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "allbots",
    description: "Envois une liste de tous les bots du serveur",
    aliases: ["bots", "botlist"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message,cmd.name)
        if (perm == true) {
            let count = 0
            let member = message.guild.members.cache.filter(m => m.user.bot).map(x => {
                count++
                return `\`\`${count}\`\` **${x.user.tag}**`
            });

            if (member.length < 1) {
                return message.reply(":x: Il n'y a pas de bots dans ce serveur")
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
                embed.setTitle(`${member.length > 1 ? `Voici la liste des bots du serveur (${member.length})` : `Voici le bot du serveur (1)`}`)
                embed.setColor(client.config.color)
                embed.setFooter({ text: `Page ${page + 1}/${memberarray.length}` })
                embed.setDescription(embeds[0].join('\n'));

                if (memberarray.length === 1) {
                    await message.reply({
                        embeds: [embed],
                    })
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
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    
    }
}