const { checkperm } = require("../../base/functions");
const Discord = require('discord.js')
const db = require('quick.db')
module.exports = {
    name: "setprofil",
    description: "Modifie avatar, pseudo ou encore activité du bot !",
    aliases: ['setprofile'],

    run: async (client, message, args, cmd) => {
        const color = db.fetch(`${message.guild.id}_embedcolor_${message.author.id}`)
        let perm = await checkperm(message, cmd.name)
        if (perm == true) {

            const row = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageSelectMenu()
                        .setCustomId('select')
                        .setPlaceholder('Faire une action')
                        .addOptions([
                            {
                                label: 'Nom',
                                description: 'Change le nom du bot',
                                value: 'name',
                                emoji: "✏️",
                            },
                            {
                                label: 'Avatar',
                                description: 'Change l\'image de profil du bot',
                                value: 'pp',
                                emoji: "🎬",
                            },
                            {
                                label: 'Activité',
                                description: 'Change l\'activité et le type d\'activité du bot',
                                value: 'activity',
                                emoji: "📱",
                            },
                            {
                                label: 'Valider',
                                description: 'Ferme le menu',
                                value: 'x',
                                emoji: "❌",
                            }
                        ]),
                );

            let msg = await message.reply({ content: "Chargement ...", allowedMentions: { repliedUser: false } })
            const embed = new Discord.MessageEmbed()
                .setTitle(`**__Paramètres du profil du bot__**`)
                .setTimestamp()
                .setColor(color)
                .setFooter({ text: `${client.user.username}` })
                .setDescription(`✏️・Changer le nom d'utilisateur\nActuel: ${client.user.username}\n\n🎬・Changer l'avatar\nActuel: [Clique ici](${client.user.displayAvatarURL()})\n\n📱・Changer l'activitée\nActuel: ${client.user.presence.activities[0] ? ` ${client.user.presence.activities[0].name}` : `:x:`}`)
            msg.edit({
                content: "** **", embeds: [embed],
                components: [row], allowedMentions: { repliedUser: false }
            }).then(async (m) => {


                const collector = m.createMessageComponentCollector({
                    componentType: "SELECT_MENU",
                    time: 90000
                })

                collector.on("collect", async (select) => {
                    if (select.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
                    const value = select.values[0]
                    await select.deferUpdate()
                    if (value == 'name') {

                        let question = await message.channel.send("Quel nom voulez-vous attribuer au bot ?",)
                        const filter = m => message.author.id === m.author.id;
                        message.channel.awaitMessages({
                            filter: filter,
                            max: 1,
                            time: 60000,
                            errors: ['time']
                        }).then(async (collected) => {
                            collected.first().delete()
                            question.delete()
                            client.user.setUsername(collected.first().content).then(async () => {
                                update()
                            }).catch(async (err) => {
                                console.log(err)
                                collected.first().delete()
                                message.channel.send(":x: Je n'ai pas pu changer mon pseudo :/").then((mm) => mm.delete({
                                    timeout: 5000
                                }));
                            })
                        })
                    }
                    if (value == 'pp') {
                        let question = await message.channel.send("Quel avatar voulez-vous attribuer au bot ?")
                        const filter = m => message.author.id === m.author.id;
                        message.channel.awaitMessages({
                            filter: filter,
                            max: 1,
                            time: 60000,
                            errors: ['time']
                        }).then(async (collected) => {
                            let url
                            let msg = collected.first()
                            if (msg.attachments.size > 0) { url = msg.attachments.first().url } else url = msg.content
                            collected.first().delete()
                            question.delete()
                            client.user.setAvatar(url).then(async () => {
                                update()
                            }).catch(async (err) => {
                                console.log(err)
                                collected.first().delete()
                                message.channel.send(":x: Je n'ai pas pu changer mon avatar car le lien est invalide :/").then((mm) => mm.delete({
                                    timeout: 5000
                                }));
                            })
                        })
                    }

                    if (value == 'activity') {
                        let question = await message.channel.send("Quel type d'activité voulez-vous attribuer au bot (\`play\`, \`stream\`, \`watch\`, \`listen\`)")
                        const filter = m => message.author.id === m.author.id;

                        message.channel.awaitMessages({
                            filter: filter,
                            max: 1,
                            time: 60000,
                            errors: ['time']
                        }).then(async (collected) => {
                            collected.first().delete()
                            question.delete()
                            let type = ""

                            if (collected.first().content.toLowerCase().startsWith("play")) {
                                type = "PLAYING"
                            } else if (collected.first().content.toLowerCase().startsWith("stream")) {
                                type = "STREAMING"
                            } else if (collected.first().content.toLowerCase().startsWith("listen")) {
                                type = "LISTENING"
                            } else if (collected.first().content.toLowerCase().startsWith("watch")) {
                                type = "WATCHING"
                            } else {
                                return message.channel.send(":x: Type d'activité invalide")
                            }

                            let question2 = await message.channel.send("Quel nom voulez-vous attribuer à l'activité du bot ?")

                            message.channel.awaitMessages({
                                filter: filter,
                                max: 1,
                                time: 60000,
                                errors: ['time']
                            }).then(async (collected2) => {
                                collected2.first().delete()
                                question2.delete()
                                db.set(`bottype`, type)
                                db.set(`botactivity`, collected2.first().content)
                                client.user.setActivity(collected2.first().content, { type: type, url: "https://www.twitch.tv/coinsbot" })
                                update()
                            });
                        })
                    }

                    if (value == 'x') {
                        m.delete()
                    }
                })
                function update() {
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`**__Paramètres du profil du bot__**`)
                        .setTimestamp()
                        .setFooter({ text: `${client.user.username}` })
                        .setDescription(`✏️・Changer le nom d'utilisateur\nActuel: ${client.user.username}\n\n🎬・Changer l'avatar\nActuel: [Clique ici](${client.user.displayAvatarURL()})\n\n📱・Changer l'activitée\nActuel: ${client.user.presence.activities[0] ? ` ${client.user.presence.activities[0].name}` : `:x:`}`)
                    msg.edit({ embeds: [embed] })
                }
            });
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`setprofil\` !`)
    }

}
