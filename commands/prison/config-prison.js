
const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "config-prison",
    description: "Configure le système prison",
    aliases: ["cprison", "configprison", "prisonconfig"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message,cmd.name)
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
                const collector2 = mm.createMessageComponentCollector({
                    componentType: "BUTTON",
                    time: 1800000
                })
                const filter = m => message.author.id === m.author.id;
                collector.on("collect", async (select) => {
                    if (select.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
                    let value = select.values[0]
                    await select.deferUpdate()
                    if (value === "active") {
                        let active = db.fetch(`${message.guild.id}.prison.active`)
                        if (active == true) { db.delete(`${message.guild.id}.prison.active`) } else {
                            let role = db.fetch(`${message.guild.id}.prison.role`)
                            role = message.guild.roles.cache.get(role)
                            if (role) {
                                db.set(`${message.guild.id}.prison.active`, true)
                                message.channel.send(`:white_check_mark: Système activé !`)
                            } else return message.reply(`:x: Pas de rôle prisonnier configuré !`)
                        }
                        update(mm)
                    }
                    if (value === "role") {
                        await message.channel.send(`🔪 Veuillez mentionner le rôle prisonnier:`).then(question => {
                            message.channel.awaitMessages({ filter: filter, max: 1, time: 60000, errors: ['time'] })
                                .then(cld => {
                                    var msg = cld.first();
                                    let newrole = msg.mentions.roles.first() || msg.guild.roles.cache.get(msg.content) || msg.guild.roles.cache.find(r => r.name.toLowerCase() === msg.content.toLocaleLowerCase())
                                    if (!newrole) return message.channel.send(`:x: Rôle invalide`)
                                    const memberPosition = message.member.roles.highest.position;
                                    const authorPosition = newrole.position;
                                    if (authorPosition >= memberPosition) return message.reply(":x: Vous ne pouvez pas ajouter un rôle supérieur au votre !");
                                    let role = db.fetch(`${message.guild.id}.prison.role`)
                                    if (!role) { db.set(`${message.guild.id}.prison.role`, newrole.id) } else {
                                        if (role === newrole.id) { db.delete(`${message.guild.id}.prison.role`) } else db.set(`${message.guild.id}.prison.role`, newrole.id)
                                    }

                                    msg.delete().catch(e => { })
                                    question.delete().catch(e => { })
                                    update(mm)
                                })
                        })
                    }
                    if (value === "channels") {
                        await message.channel.send(`🏷️ Veuillez mentionner un salon prison:`).then(question => {
                            message.channel.awaitMessages({ filter: filter, max: 1, time: 60000, errors: ['time'] })
                                .then(cld => {
                                    var msg = cld.first();
                                    let newchan = msg.mentions.channels.first() || msg.guild.channels.cache.get(msg.content) || msg.guild.channels.cache.find(r => r.name.toLowerCase() === msg.content.toLocaleLowerCase()) || msg.guild.channels.cache.find(r => r.name.toLowerCase() === msg.content.toLocaleLowerCase())
                                    if (!newchan) return message.channel.send(`:x: Salon invalide`)
                                    let statut = db.fetch(`${message.guild.id}.prison.channels`)
                                    if (statut && statut.includes(newchan.id)) {
                                        const filtered = statut.filter(e => e !== newchan.id);
                                        db.set(`${message.guild.id}.prison.channels`, filtered);
                                    } else db.push(`${message.guild.id}.prison.channels`, newchan.id)
                                    msg.delete().catch(e => { })
                                    question.delete().catch(e => { })
                                    update(mm)
                                })
                        })
                    }
                    if (value === "logs") {
                        await message.channel.send(`📃 Veuillez mentionner le salon logs:`).then(question => {
                            message.channel.awaitMessages({ filter: filter, max: 1, time: 60000, errors: ['time'] })
                                .then(cld => {
                                    var msg = cld.first();
                                    let newchan = msg.mentions.channels.first() || msg.guild.channels.cache.get(msg.content) || msg.guild.channels.cache.find(r => r.name.toLowerCase() === msg.content.toLocaleLowerCase()) || msg.guild.channels.cache.find(r => r.name.toLowerCase() === msg.content.toLocaleLowerCase())
                                    if (!newchan) return message.channel.send(`:x: Salon invalide`)
                                    let statut = db.fetch(`${message.guild.id}.prison.logs`)
                                    if (statut && statut.includes(newchan.id)) {
                                        const filtered = statut.filter(e => e !== newchan.id);
                                        db.set(`${message.guild.id}.prison.logs`, filtered);
                                    } else db.set(`${message.guild.id}.prison.logs`, newchan.id)
                                    msg.delete().catch(e => { })
                                    question.delete().catch(e => { })
                                    update(mm)
                                })
                        })
                    }
                })
                collector2.on("collect", async (i) => {
                    if (i.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
                    await i.deferUpdate()
                    if (i.customId === 'valid') {
                        let role = db.fetch(`${message.guild.id}.prison.role`)
                        role = message.guild.roles.cache.get(role)
                        if (role) {
                            let channels = db.fetch(`${message.guild.id}.prison.channels`)
                            if (channels && channels.length > 0) {
                                message.guild.channels.cache.forEach(ch => {
                                    if (channels.includes(ch.id)) {
                                        ch.permissionOverwrites.edit(message.guild.id, {
                                            VIEW_CHANNEL: false,
                                            SEND_MESSAGES: true
                                        }).catch(e => { })
                                        ch.permissionOverwrites.edit(role.id, {
                                            VIEW_CHANNEL: true,
                                            SEND_MESSAGES: true,
                                            READ_MESSAGE_HISTORY: true
                                        }).catch(e => { })
                                    } else {
                                        ch.permissionOverwrites.edit(role.id, {
                                            VIEW_CHANNEL: false
                                        }).catch(e => { })
                                    }
                                });
                            } else return message.channel.send(`:x: Pas de salons prison configurés`)
                            message.channel.send(`:white_check_mark: Système configuré avec succès`)
                        } else return message.reply(`:x: Pas de rôle prisonnier configuré !`)
                    }
                })
            })

        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

        function update(mm) {
            let active = db.fetch(`${message.guild.id}.prison.active`)
            let logs = db.fetch(`${message.guild.id}.prison.logs`)
            if (logs) {
                logs = message.guild.channels.cache.get(logs)
                if (!logs) {
                    db.delete(`${message.guild.id}.prison.logs`)
                    logs = undefined
                }
            }
            let role = db.fetch(`${message.guild.id}.prison.role`)
            if (role) {
                role = message.guild.roles.cache.get(role)
                if (!role) {
                    db.delete(`${message.guild.id}.prison.role`)
                    role = undefined
                }
            }
            let channels = db.fetch(`${message.guild.id}.prison.channels`)
            for (i in channels) {
                let channel = message.guild.channels.cache.get(channels[i])
                if (!channel) {
                    const filtered = channels.filter(e => e !== channels[i]);
                    db.set(`${message.guild.id}.prison.channels`, filtered);
                }
            }
            channels = db.fetch(`${message.guild.id}.prison.channels`)
            const roww = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageSelectMenu()
                        .setCustomId('config')
                        .setPlaceholder('Modifier un paramètre')
                        .addOptions([
                            {
                                label: 'Activer/Désactiver le module',
                                value: 'active',
                                emoji: "📩"
                            },
                            {
                                label: 'Modifier le rôle prisonnier',
                                value: 'role',
                                emoji: "🔪"
                            },
                            {
                                label: 'Ajouter/Retirer un salon',
                                value: 'channels',
                                emoji: "🏷️"
                            },
                            {
                                label: 'Modifier le salon de logs',
                                value: 'logs',
                                emoji: "📃"
                            }
                        ])
                )
            let button1 = new Discord.MessageButton().setStyle('SUCCESS').setCustomId('valid').setLabel("✔️ Modifier les salons")
            let button_row = new Discord.MessageActionRow().addComponents([button1])
            const msgembed = new Discord.MessageEmbed()
                .setAuthor({ name: `Système Prison` })
                .setColor(db.fetch(`${message.guild.id}.color`))
                .addField("`📩` Activé", active ? ":white_check_mark:" : ":x:")
                .addField("`🔪` Rôle Prisonnier", role ? `${role}` : ":x:")
                .addField("`🏷️` Salons prisons", channels && channels.length > 0 ? channels.map(s => `- <#${s}>`).join("\n") : ":x:")
                .addField("`📃` Salon logs", logs ? `${logs}` : ":x:")
            mm.edit({ embeds: [msgembed], components: [roww, button_row] })
        }
    }
}