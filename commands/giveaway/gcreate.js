
const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
const ms = require("ms")
module.exports = {
    name: "gcreate",
    description: "Ouvre un panel pour lancer un giveaway",
    aliases: ["g-create", "giveaway"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, cmd.name)
        if (perm == true) {

            const embed = new Discord.MessageEmbed()
                .setColor(db.fetch(`${message.guild.id}.color`))
                .setTitle("Chargement...")
            message.reply({ embeds: [embed] }).then(mm => {
                update(mm)
                const collector = mm.createMessageComponentCollector({
                    componentType: "SELECT_MENU",
                    time: 1800000
                })
                const filter = m => message.author.id === m.author.id;
                collector.on("collect", async (select) => {
                    if (select.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
                    let value = select.values[0]
                    if (value === "duree") {
                        await select.reply(`🔑 Veuillez mentionner le rôle obligatoire pour participer:\n(\`s\` pour secondes, \`m\` pour minutes, \`h\` pour heures, \`d\` pour jours)`).then(question => {
                            message.channel.awaitMessages({ filter: filter, max: 1, time: 600000, errors: ['time'] })
                                .then(cld => {
                                    var msg = cld.first();
                                    if (!msg.content.endsWith("j") && !msg.content.endsWith("d") && !msg.content.endsWith("h") && !msg.content.endsWith("m") && !msg.content.endsWith("s")) return message.channel.send(`:x: Durée incorrecte`)
                                    db.set(`${message.guild.id}.giveaway.duree`, msg.content.replace("j", "d"))
                                    msg.delete().catch(e => { })
                                    select.deleteReply().catch(e => { })
                                    update(mm)
                                })
                        })

                    }
                    if (value === "role") {
                        await select.reply(`🔑 Veuillez mentionner le rôle obligatoire pour participer:\nEnvoyer \`off\` pour désactiver`).then(question => {
                            message.channel.awaitMessages({ filter: filter, max: 1, time: 600000, errors: ['time'] })
                                .then(cld => {
                                    var msg = cld.first();
                                    if (msg.content.toLowerCase() === "off") { db.delete(`${message.guild.id}.giveaway.role`) } else {
                                        let newrole = msg.mentions.roles.first() || msg.guild.roles.cache.get(msg.content) || msg.guild.roles.cache.find(r => r.name.toLowerCase() === msg.content.toLocaleLowerCase())
                                        if (!newrole || newrole.id === message.guild.id) return message.channel.send(`:x: Rôle invalide`)
                                        db.set(`${message.guild.id}.giveaway.role`, newrole.id)
                                        msg.delete().catch(e => { })
                                        select.deleteReply().catch(e => { })
                                    }
                                    update(mm)
                                })
                        })
                    }
                    if (value === "channel") {
                        await select.reply(`🏷️ Veuillez mentionner le salon du giveaway:`).then(question => {
                            message.channel.awaitMessages({ filter: filter, max: 1, time: 600000, errors: ['time'] })
                                .then(cld => {
                                    var msg = cld.first();
                                    let m = msg.mentions.channels.first() || message.guild.channels.cache.get(msg.content)
                                    if (!m || m.type !== "GUILD_TEXT") return message.reply(`:x: Salon invalide !`)
                                    db.set(`${message.guild.id}.giveaway.channel`, m.id)
                                    msg.delete().catch(e => { })
                                    select.deleteReply().catch(e => { })
                                    update(mm)
                                })
                        })
                    }
                    if (value === "gain") {
                        await select.reply(`🎁 Veuillez envoyer le gain du giveaway:`).then(question => {
                            message.channel.awaitMessages({ filter: filter, max: 1, time: 600000, errors: ['time'] })
                                .then(cld => {
                                    var msg = cld.first();
                                    if (msg.attachments.size > 0 || msg.content.length < 1 || msg.content.length > 1000) return message.channel.send(`:x: Contenu invalide`); update(mm)
                                    db.set(`${message.guild.id}.giveaway.gain`, msg.content)
                                    msg.delete().catch(e => { })
                                    select.deleteReply().catch(e => { })
                                    update(mm)
                                })
                        })
                    }
                    if (value === "gagnants") {
                        await select.reply(`🥂 Veuillez envoyer le nombre de gagnants:`).then(question => {
                            message.channel.awaitMessages({ filter: filter, max: 1, time: 600000, errors: ['time'] })
                                .then(cld => {
                                    var msg = cld.first();
                                    if (isNaN(msg.content) || msg.content.length < 1 || msg.content.length > message.guild.memberCount) return message.reply(`:x: Vous devez préciser un nombre de gagnant valide entre 1 et ${message.guild.memberCount} !`)

                                    db.set(`${message.guild.id}.giveaway.gagnants`, msg.content)
                                    msg.delete().catch(e => { })
                                    select.deleteReply().catch(e => { })
                                    update(mm)
                                })
                        })
                    }
                    if (value === "react") {
                        await select.reply(`🔴 Veuillez envoyer la nouvelle réaction du bouton:`).then(question => {
                            message.channel.awaitMessages({ filter: filter, max: 1, time: 600000, errors: ['time'] })
                                .then(cld => {
                                    var msg = cld.first();
                                    cld.first().react(msg.content).then(() => {
                                        db.set(`${message.guild.id}.giveaway.react`, msg.content)
                                        msg.delete().catch(e => { })
                                        select.deleteReply().catch(e => { })
                                        update(mm)
                                    }).catch((e) => {
                                        update(mm)
                                        return message.channel.send(`:x: Je n'ai pas accès à cet emoji !`)
                                    })
                                })
                        })
                    }
                    if (value === "impose") {
                        await select.reply(`🕵️ Veuillez **mentionner** les gagnants imposés, si il est inférieur au nombre de gagnant configuré les autres membres seront tirés au hasard:`).then(question => {
                            message.channel.awaitMessages({ filter: filter, max: 1, time: 600000, errors: ['time'] })
                                .then(cld => {
                                    var msg = cld.first();
                                    let size = db.fetch(`${message.guild.id}.giveaway.impose`)
                                    if (!size || isNaN(size)) {
                                        db.set(`${message.guild.id}.giveaway.gagnants`, 1)
                                        size = 1
                                    }
                                    let ii = 0
                                    db.delete(`${message.guild.id}.giveaway.impose`)
                                    for (const rawMentions of msg.mentions.users) {
                                        ii++
                                        if (parseInt(ii) <= parseInt(size)) {
                                            db.push(`${message.guild.id}.giveaway.impose`, rawMentions[0])
                                        }
                                    }
                                    msg.delete().catch()
                                    select.deleteReply().catch()
                                    update(mm)
                                })
                        })
                    }
                    if (value === "voc") {
                        let voc = db.fetch(`${message.guild.id}.giveaway.voc`)
                        if (voc) {
                            db.delete(`${message.guild.id}.giveaway.voc`)
                        } else {
                            db.set(`${message.guild.id}.giveaway.voc`, true)
                        }
                        select.deferUpdate()
                        update(mm)
                    }
                })
                collector.on("end", async () => {
                    return mm.edit({ content: "Expiré !", components: [] }).catch(() => { })
                })
                const collectorr = mm.createMessageComponentCollector({
                    componentType: "BUTTON",
                    time: 1800000
                })
                collectorr.on("collect", async (i) => {
                    if (i.user.id !== message.author.id) return i.reply({ content: "Désolé, mais vous n'avez pas la permission d'utiliser ces boutons !", ephemeral: true }).catch(() => { })

                    if (i.customId === 'valid') {
                        i.reply(`Je lance le giveaway... !`).then(m => {
                            let duree = db.fetch(`${message.guild.id}.giveaway.duree`)
                            if (!duree) return message.channel.send(`:x: Vous n'avez pas précisé de durée`)

                            let role = db.fetch(`${message.guild.id}.giveaway.role`)

                            let gain = db.fetch(`${message.guild.id}.giveaway.gain`)
                            if (!gain || gain.length < 1) return message.channel.send(`:x: Vous n'avez pas précisé de gain`)

                            let gagnants = db.fetch(`${message.guild.id}.giveaway.gagnants`)
                            if (!gagnants || isNaN(gagnants)) gagnants = 1


                            let channel = db.fetch(`${message.guild.id}.giveaway.channel`)
                            if (channel) {
                                channel = message.guild.channels.cache.get(channel)
                                if (!channel) return message.channel.send(`:x: Salon invalide`)
                            }

                            let react = db.fetch(`${message.guild.id}.giveaway.react`)
                            if (!react) react = "🎉"

                            let impose = db.fetch(`${message.guild.id}.giveaway.impose`)

                            let voc = db.fetch(`${message.guild.id}.giveaway.voc`)
                            let errored = false
                            channel.send({
                                embeds: [new Discord.MessageEmbed()
                                    .setTitle(`:tada: Giveaway: ${gain}`)
                                    .setDescription(`Réagissez avec ${react} pour participer
Nombre de gagnants: ${gagnants}\n${voc ? "Présence en vocal obligatoire :white_check_mark:\n" : ""}${role ? `Vous devez avoir le rôle <@&${role}> :white_check_mark:\n` : ""}
Nombre de participants: 0
Se termine dans <t:${Date.parse(new Date(Date.now() + ms(duree))) / 1000}:R> (<t:${Date.parse(new Date(Date.now() + ms(duree))) / 1000}:F>)`)
                                    .setFooter({ text: "Lancé par " + message.author.tag })
                                    .setColor(db.fetch(`${message.guild.id}.color`))]
                            }).catch(e => {
                                errored = true
                                return message.channel.send(`:x: Je ne peux pas envoyer de message dans ce salon`)
                            }).then(async msg => {
                                if (!errored) {
                                    mm.edit({ components: [] }).catch()
                                    let button = new Discord.MessageButton().setStyle('PRIMARY').setCustomId(`giveaway-${msg.id}`).setEmoji(react)
                                    let butto_row = new Discord.MessageActionRow().addComponents([button])
                                    msg.edit({ components: [butto_row] })
                                    await db.set(`${message.guild.id}.giveaway.${msg.id}`, { msgid: msg.id, channelid: channel.id, startdate: Date.now(), duration: duree, gain: gain, gagnants: gagnants, impose: impose, vocal: voc, react: react, role: role, author: message.author.tag })
                                    db.set(`${message.guild.id}.last-giveaway.${channel.id}`, msg.id)
                                    message.channel.send(`Giveaway lancé ${channel}`)
                                }
                            })
                        })
                    }
                })
            })

        } else if (perm === false) if (!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

        function update(mm) {
            let duree = db.fetch(`${message.guild.id}.giveaway.duree`)

            let role = db.fetch(`${message.guild.id}.giveaway.role`)
            if (role) {
                role = message.guild.roles.cache.get(role)
                if (!role) {
                    db.delete(`${message.guild.id}.giveaway.role`)
                    role = undefined
                }
            }
            let gain = db.fetch(`${message.guild.id}.giveaway.gain`)
            if (!gain || gain.length < 1) {
                db.delete(`${message.guild.id}.giveaway.gain`)
                gain = undefined
            }

            let gagnants = db.fetch(`${message.guild.id}.giveaway.gagnants`)
            if (!gagnants || isNaN(gagnants)) {
                db.set(`${message.guild.id}.giveaway.gagnants`, 1)
                gagnants = 1
            }

            let channel = db.fetch(`${message.guild.id}.giveaway.channel`)
            if (channel) {
                channel = message.guild.channels.cache.get(channel)
                if (!channel) {
                    db.delete(`${message.guild.id}.giveaway.channel`)
                    channel = undefined
                }
            }

            let react = db.fetch(`${message.guild.id}.giveaway.react`)
            if (!react) {
                db.set(`${message.guild.id}.giveaway.react`, "🎉")
                react = "🎉"
            }

            let impose = db.fetch(`${message.guild.id}.giveaway.impose`)
            if (impose && impose.length < 1) {
                db.delete(`${message.guild.id}.giveaway.impose`)
                impose = null
            } else if (impose) {
                impose = impose.map(m => `<@${m}>`).join(", ")
            }
            let voc = db.fetch(`${message.guild.id}.giveaway.voc`)
            if (voc) {
                voc = true
            } else {
                voc = undefined
            }

            const roww = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageSelectMenu()
                        .setCustomId('config')
                        .setPlaceholder('Modifier un paramètre')
                        .addOptions([
                            {
                                label: 'Durée',
                                value: 'duree',
                                emoji: "⏰"
                            },
                            {
                                label: 'Salon',
                                value: 'channel',
                                emoji: "🏷️"
                            },
                            {
                                label: 'Gain',
                                value: 'gain',
                                emoji: "🎁"
                            },
                            {
                                label: 'Nombre de gagnants',
                                value: 'gagnants',
                                emoji: "🥂"
                            },
                            {
                                label: 'Réaction',
                                value: 'react',
                                emoji: "🔴"
                            },
                            {
                                label: 'Gagnant imposé',
                                value: 'impose',
                                emoji: "🕵️"
                            },
                            {
                                label: 'Présence en vocal obligatoire',
                                value: 'voc',
                                emoji: "🔊"
                            },
                            {
                                label: 'Rôle Obligatoire',
                                value: 'role',
                                emoji: "🔑"
                            }
                        ])
                )
            let button1 = new Discord.MessageButton().setStyle('SUCCESS').setCustomId('valid').setLabel("✔️ Lancer le giveaway")
            let button_row = new Discord.MessageActionRow().addComponents([button1])
            const msgembed = new Discord.MessageEmbed()
                .setAuthor({ name: `🎉 Configuration Giveaway` })
                .setColor(db.fetch(`${message.guild.id}.color`))
                .addField("`⏰` Durée", duree ? `${duree}` : ":x:", true)
                .addField("`🏷️` Salon", channel ? `${channel}` : ":x:", true)
                .addField("`🎁` Gain", gain ? `${gain}` : ":x:", true)
                .addField("`🥂` Nombre de gagnant", gagnants ? `${gagnants}` : "1", true)
                .addField("`🔴` Réaction", react ? `${react}` : ":x:", true)
                .addField("`🕵️` Gagnant imposé", impose ? `${impose}` : ":x:", true)
                .addField("`🔊` Présence en vocal obligatoire", voc ? `:white_check_mark:` : ":x:", true)
                .addField("`🔑` Rôle Obligatoire", role ? `${role}` : ":x:", true)
            mm.edit({ embeds: [msgembed], components: [roww, button_row] })
        }
    }
}