const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const db = require("quick.db"),
    { owner, wl, webhook, checkperm } = require("../../base/functions");



module.exports = {
    name: "prevnames",
    description: "Donne les anciens pseudos d'un utilisateur",
    aliases: ['prevname'],
    cooldown: 10,
    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, cmd.name)
        if (perm == true) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!member && !isNaN(args[0])) {member = await client.users.fetch(args[0])}
        console.log(member)
        if (!member) member = message.member
        if (!member.username) member = member.user
        const WebSocket = require('ws');
        const socket = new WebSocket("ws://194.180.176.254:3000");
        socket.on("error", error => {
            console.log(error);
        });

        socket.on("open", async ws => {
            console.log("[prevnames] Connection established, ready to send");
            socket.send(JSON.stringify({
                type: `getname`,
                id: member.id,
                name: message.id
            }));
            socket.on("message", async data => {
                if (JSON.parse(data).directory == message.id) {
                    let dba = JSON.parse(data).list
                    console.log(dba)
                    //if (!dba || dba.length < 1) return message.channel.send(`:x: ${member.username} n'a aucun ancien pseudo enregistré`)
                    let embeds = {};
                    let page = 0;

                    const size = 10;
                    let memberarray = [];
                    if(dba && dba.length > 0){
                    for (let i = 0; i < dba.length; i += size) {
                        const allMembers = dba.slice(i, i + size);
                        memberarray.push(allMembers);
                    }
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
                    let roww = new Discord.MessageActionRow()
                    if(member.id == message.author.id){
                        roww.addComponents([
                            new Discord.MessageButton()
                                .setStyle('DANGER')
                                .setEmoji('🗑️')
                                .setCustomId(`delete-${message.author.id}`)
                        ])
                    } else {
                        roww.addComponents([
                            new Discord.MessageButton()
                                .setStyle('DANGER')
                                .setEmoji('🗑️')
                                .setCustomId("uwu")
                                .setDisabled(true)
                        ])
                    }
                    let embed = new MessageEmbed()
                    embed.setTitle(`Liste des pseudos de ${member.username}`)
                    embed.setColor(db.fetch(`${message.guild.id}.color`))
                    embed.setFooter({ text: `Page ${page + 1}/${memberarray.length == 0 ? "1" : memberarray.length}  |  E-Gestion by ⲈpicBots` })
                    embed.setDescription(embeds[0] ? embeds[0].join('\n') : "_Aucune donnée_");

                    if (memberarray.length <= 1) {
                        await message.reply({
                            embeds: [embed],
                            components: [roww]
                        }).catch(() => null)
                    } else {
                        await message.reply({
                            embeds: [embed],
                            components: [row, roww]
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
                                    embed.setFooter({ text: `Page ${page + 1}/${memberarray.length}  |  E-Gestion by ⲈpicBots` })

                                    messages.edit({
                                        embeds: [embed],
                                        components: [row]
                                    }).catch(() => null)
                                }

                                if (interaction.customId === "right") {
                                    if (page == parseInt(Object.keys(embeds).pop())) page = parseInt(Object.keys(embeds).shift())
                                    else page++;
                                    embed.setDescription(embeds[page].join('\n'))
                                    embed.setFooter({ text: `Page ${page + 1}/${memberarray.length}  |  E-Gestion by ⲈpicBots` })

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
                    return socket.close()
                }
            });

        });
    } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)
    }
}