const db = require("quick.db")
const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js")
const { checkperm } = require("../../base/functions");
const counters = 4
module.exports = {
    name: "counters",
    description: "Configure les salons compteurs",
    aliases: ['compteur', 'compteurs', 'counter'],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, cmd.name)
        if (perm == true) {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('select')
                        .setPlaceholder('Modifier un compteur'));
            const msgembed = new MessageEmbed()
                .setColor(db.fetch(`${message.guild.id}.color`))
                .setTitle("📊 Paramètre des compteurs")
                .setFooter({ text: `Les compteurs s'actualisent toutes les 7 minutes, patientez 😉` });
            for (let i = 1; i < counters + 1; i++) {
                let number = `${i}`
                let chan = db.fetch(`${message.guild.id}.counters${i}.channel`)
                let check = message.guild.channels.cache.get(chan)
                if (!check) {
                    db.delete(`${message.guild.id}.counters${i}.channel`)
                    db.delete(`${message.guild.id}.counters${i}.type`)
                    chan = db.fetch(`${message.guild.id}.counters${i}.channel`)
                }
                msgembed.addField(`${number.replace("1", "1️⃣").replace("2", "2️⃣").replace("3", "3️⃣").replace("4", "4️⃣")} **Compteur ${i}**`, check ? `<#${chan}>` : "Non paramétré")
                row.components[0].addOptions([{
                    label: `Compteur ${i}`,
                    value: `${i}`,
                    emoji: number.replace("1", "1️⃣").replace("2", "2️⃣").replace("3", "3️⃣").replace("4", "4️⃣")
                }]);

            }
            let dureefiltrer = response => { return response.author.id === message.author.id };
            message.reply({ embeds: [msgembed], components: [row] }).then(m => {
                const collector = m.createMessageComponentCollector({
                    componentType: "SELECT_MENU",
                    time: 500000
                })
                collector.on("collect", async (select) => {
                    if (select.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
                    const value = select.values[0]
                    await select.deferUpdate()
                    let channel = db.fetch(`${message.guild.id}.counters${parseInt(value)}.channel`)
                    let type = db.fetch(`${message.guild.id}.counters${parseInt(value)}.type`)
                    let format = "membres"
                    if (type) format = db.fetch(`${message.guild.id}.counters${parseInt(value)}.${type}.format`)
                    const roww = new MessageActionRow()
                        .addComponents(
                            new MessageSelectMenu()
                                .setCustomId('config')
                                .setPlaceholder('Configurer le compteur ' + value)
                                .addOptions([
                                    {
                                        label: 'Salon',
                                        value: 'salon',
                                        emoji: "🏷️"
                                    },
                                    {
                                        label: 'Compteur de membres',
                                        value: 'membres',
                                        emoji: "🚶‍♂️"
                                    },
                                    {
                                        label: 'Compteur de membres en ligne',
                                        value: 'online',
                                        emoji: "🟢"
                                    },
                                    {
                                        label: 'Compteur de membres en vocal',
                                        value: 'vocal',
                                        emoji: "🔊"
                                    },
                                    {
                                        label: 'Compteur de salons',
                                        value: 'channels',
                                        emoji: "📘"
                                    },
                                    {
                                        label: 'Compteur de rôles',
                                        value: 'roles',
                                        emoji: "💈"
                                    },
                                    {
                                        label: 'Compteur de membres ayant un rôle',
                                        value: 'membersrole',
                                        emoji: "🍀"
                                    },
                                    {
                                        label: 'Compteur de boosts',
                                        value: 'boosts',
                                        emoji: "🔮"
                                    }
                                ]),
                        );
                    if (type) {
                        roww.components[0].addOptions([{
                            label: `Format`,
                            value: `format`,
                            emoji: "⚙️"
                        }]);
                    }
                    let button1 = new MessageButton().setStyle('PRIMARY').setCustomId('createvoice').setLabel("🔊 Créer un salon vocal")
                    let button2 = new MessageButton().setStyle('PRIMARY').setCustomId('createtext').setLabel("💬 Créer un salon textuel")
                    let button3 = new MessageButton().setStyle('SUCCESS').setCustomId('valid').setLabel("✔️ Valide le compteur")
                    let button4 = new MessageButton().setStyle('DANGER').setCustomId('delete').setLabel("❌ Supprime le compteur")
                    let button_row = new MessageActionRow().addComponents([button1, button2])
                    let button_row2 = new MessageActionRow().addComponents([button3, button4])

                    const embed = new MessageEmbed()
                        .setColor(db.fetch(`${message.guild.id}.color`))
                        .setTitle("Paramètres du compteur " + value)
                        .setFooter({ text: `Les compteurs s'actualisent toutes les 7 minutes, patientez 😉` })
                        .setDescription(`**Salon:** ${channel ? `<#${channel}>` : ":x:"}\n**Type:** ${type ? type.replace(`membres`, `Compteur de membres`).replace(`online`, `Compteur de membres en ligne`).replace(`vocal`, `Compteur de membres en vocal`).replace(`channels`, `Compteur de salons`).replace(`roles`, `Compteur de rôles`).replace(`boosts`, `Compteur de boosts`) : ":x:"}
**Format:** ${type ? format.replace("<count>", type.replace(`membres`, message.guild.memberCount).replace(`online`, message.guild.members.cache.filter(({ presence }) => presence && presence.status !== 'offline').size).replace(`vocal`, message.guild.members.cache.filter(m => m.voice.channel).size).replace(`channels`, message.guild.channels.cache.size).replace(`roles`, message.guild.roles.cache.size).replace(`boosts`, message.guild.premiumSubscriptionCount)) : ":x:"}`)
                    message.channel.send({ embeds: [embed], components: [button_row, button_row2, roww] }).then(mm => {
                        const collector2 = mm.createMessageComponentCollector({
                            componentType: "SELECT_MENU",
                            time: 500000
                        })
                        const collector3 = mm.createMessageComponentCollector({
                            componentType: "BUTTON",
                            time: 500000
                        })
                        collector3.on("collect", async (i) => {
                            if (i.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
                            await i.deferUpdate()
                            type = db.fetch(`${message.guild.id}.counters${parseInt(value)}.type`)
                            channel = db.fetch(`${message.guild.id}.counters${parseInt(value)}.channel`)
                            if (i.customId === 'createtext') {
                                if (type) {
                                    format = db.fetch(`${message.guild.id}.counters${parseInt(value)}.${type}.format`)
                                }
                                message.guild.channels.create(type ? format.replace("<count>", type.replace(`membres`, message.guild.memberCount).replace(`online`, message.guild.members.cache.filter(({ presence }) => presence && presence.status !== 'offline').size).replace(`vocal`, message.guild.members.cache.filter(m => m.voice.channel).size).replace(`channels`, message.guild.channels.cache.size).replace(`roles`, message.guild.roles.cache.size).replace(`boosts`, message.guild.premiumSubscriptionCount)) : "Compteur " + value
                                    , {
                                        type: 'GUILD_TEXT',
                                    }).then(channel => {
                                        db.set(`${message.guild.id}.counters${parseInt(value)}.channel`, channel.id)
                                        mupdate(message, mm, parseInt(value))
                                    }).catch(e => { console.log(e) })
                            }
                            if (i.customId === 'createvoice') {
                                if (type) {
                                    format = db.fetch(`${message.guild.id}.counters${parseInt(value)}.${type}.format`)
                                }
                                message.guild.channels.create(type ? format.replace("<count>", type.replace(`membres`, message.guild.memberCount).replace(`online`, message.guild.members.cache.filter(({ presence }) => presence && presence.status !== 'offline').size).replace(`vocal`, message.guild.members.cache.filter(m => m.voice.channel).size).replace(`channels`, message.guild.channels.cache.size).replace(`roles`, message.guild.roles.cache.size).replace(`boosts`, message.guild.premiumSubscriptionCount)) : "Compteur " + value
                                    , {
                                        type: 'GUILD_VOICE',
                                    }).then(channel => {
                                        db.set(`${message.guild.id}.counters${parseInt(value)}.channel`, channel.id)
                                        mupdate(message, mm, parseInt(value))
                                    }).catch(e => { console.log(e) })
                            }
                            if (i.customId === 'valid') {
                                princip(message, m)
                                collector2.stop()
                                collector3.stop()
                                mm.delete().catch()
                            }
                            if (i.customId === 'delete') {
                                db.delete(`${message.guild.id}.counters${parseInt(value)}.channel`)
                                db.delete(`${message.guild.id}.counters${parseInt(value)}.type`)
                                mupdate(message, mm, parseInt(value))
                            }
                        })
                        collector2.on("collect", async (select) => {
                            if (select.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
                            let value2 = select.values[0]
                            type = db.fetch(`${message.guild.id}.counters${parseInt(value)}.type`)
                            channel = db.fetch(`${message.guild.id}.counters${parseInt(value)}.channel`)
                            if (value2 === "salon") {
                                await select.reply(`🏷️ Veuillez envoyer le salon du compteur:`).then(question => {
                                    message.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 60000, errors: ['time'] })
                                        .then(cld => {
                                            var msg = cld.first();
                                            let newchan = msg.mentions.channels.first() || msg.guild.channels.cache.get(msg.content) || msg.guild.channels.cache.find(r => r.name.toLowerCase() === msg.content.toLocaleLowerCase()) || msg.guild.channels.cache.find(r => r.name.toLowerCase() === msg.content.toLocaleLowerCase())
                                            if (!newchan) return message.channel.send(`:x: Salon invalide`)
                                            channel = db.fetch(`${message.guild.id}.counters${parseInt(value)}.channel`)
                                            if (channel && (channel === newchan.id)) { db.delete(`${message.guild.id}.counters${parseInt(value)}.channel`) } else
                                                db.set(`${message.guild.id}.counters${parseInt(value)}.channel`, newchan.id)
                                            msg.delete().catch(e => { })
                                            select.deleteReply().catch(e => { })
                                            mupdate(message, mm, parseInt(value))
                                        })
                                })
                            }
                            if (value2 === "membres") {
                                await select.deferUpdate()
                                db.set(`${message.guild.id}.counters${parseInt(value)}.type`, "membres")
                                db.set(`${message.guild.id}.counters${parseInt(value)}.membres.format`, "👥・Membres: <count>")
                                mupdate(message, mm, parseInt(value))
                            }
                            if (value2 === "online") {
                                await select.deferUpdate()
                                db.set(`${message.guild.id}.counters${parseInt(value)}.type`, "online")
                                db.set(`${message.guild.id}.counters${parseInt(value)}.online.format`, "🟢・En Ligne: <count>")
                                mupdate(message, mm, parseInt(value))
                            }
                            if (value2 === "membersrole") {
                                await select.reply(`🍀 Veuillez envoyer le rôle à compter:`).then(question => {
                                    message.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 60000, errors: ['time'] })
                                        .then(cld => {
                                            var msg = cld.first();
                                            let newchan = msg.mentions.roles.first() || msg.guild.roles.cache.get(msg.content) || msg.guild.roles.cache.find(r => r.name.toLowerCase() === msg.content.toLocaleLowerCase())
                                            if (!newchan) return message.channel.send(`:x: Rôle invalide`)
                                            channel = db.fetch(`${message.guild.id}.counters${parseInt(value)}.rolemembers`)
                                            if (channel && (channel === newchan.id)) { db.delete(`${message.guild.id}.counters${parseInt(value)}.membersrole`) } else
                                                db.set(`${message.guild.id}.counters${parseInt(value)}.membersrole`, newchan.id)
                                            msg.delete().catch(e => { })
                                            select.deleteReply().catch(e => { })
                                            db.set(`${message.guild.id}.counters${parseInt(value)}.type`, "rolemembers")
                                            db.set(`${message.guild.id}.counters${parseInt(value)}.rolemembers.format`, `🍀・${newchan.name} : <count>`)
                                            mupdate(message, mm, parseInt(value))
                                        })
                                })
                            }
                            if (value2 === "vocal") {
                                await select.deferUpdate()
                                db.set(`${message.guild.id}.counters${parseInt(value)}.type`, "vocal")
                                db.set(`${message.guild.id}.counters${parseInt(value)}.vocal.format`, "🔊・Vocal: <count>")
                                mupdate(message, mm, parseInt(value))
                            }
                            if (value2 === "channels") {
                                await select.deferUpdate()
                                db.set(`${message.guild.id}.counters${parseInt(value)}.type`, "channels")
                                db.set(`${message.guild.id}.counters${parseInt(value)}.channels.format`, "📘・Channels: <count>")
                                mupdate(message, mm, parseInt(value))
                            }
                            if (value2 === "roles") {
                                await select.deferUpdate()
                                db.set(`${message.guild.id}.counters${parseInt(value)}.type`, "roles")
                                db.set(`${message.guild.id}.counters${parseInt(value)}.roles.format`, "💈・Rôles: <count>")
                                mupdate(message, mm, parseInt(value))
                            }
                            if (value2 === "boosts") {
                                await select.deferUpdate()
                                db.set(`${message.guild.id}.counters${parseInt(value)}.type`, "boosts")
                                db.set(`${message.guild.id}.counters${parseInt(value)}.boosts.format`, "🔮・Boosts: <count>")
                                mupdate(message, mm, parseInt(value))
                            }
                            if (value2 === "format") {
                                type = db.fetch(`${message.guild.id}.counters${parseInt(value)}.type`)
                                await select.reply(`⚙️ Veuillez envoyer le format du compteur en intégrant \`<count>\` pour représenter la donnée:`).then(question => {
                                    message.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 60000, errors: ['time'] })
                                        .then(cld => {
                                            var msg = cld.first();
                                            if (msg.content.includes('<count>')) {
                                                db.set(`${message.guild.id}.counters${parseInt(value)}.${type}.format`, msg.content)
                                                msg.delete()
                                                select.deleteReply()
                                                mupdate(message, mm, parseInt(value))
                                            } else message.channel.send(`:x: Vous devez mettre \`<count>\` dans le format`)
                                        })
                                })
                            }
                        })
                    })
                })
            })


        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)
    }
}


function mupdate(message, msgtoedit, value) {
    let channel = db.fetch(`${message.guild.id}.counters${value}.channel`)
    let type = db.fetch(`${message.guild.id}.counters${value}.type`)
    let format = "membres"
    if (type) format = db.fetch(`${message.guild.id}.counters${value}.${type}.format`)
    const roww = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('config')
                .setPlaceholder('Configurer le compteur ' + value)
                .addOptions([
                    {
                        label: 'Salon',
                        value: 'salon',
                        emoji: "🏷️"
                    },
                    {
                        label: 'Compteur de membres',
                        value: 'membres',
                        emoji: "🚶‍♂️"
                    },
                    {
                        label: 'Compteur de membres en ligne',
                        value: 'online',
                        emoji: "🟢"
                    },
                    {
                        label: 'Compteur de membres en vocal',
                        value: 'vocal',
                        emoji: "🔊"
                    },
                    {
                        label: 'Compteur de salons',
                        value: 'channels',
                        emoji: "📘"
                    },
                    {
                        label: 'Compteur de rôles',
                        value: 'roles',
                        emoji: "💈"
                    },
                    {
                        label: 'Compteur de membres ayant un rôle',
                        value: 'membersrole',
                        emoji: "🍀"
                    },
                    {
                        label: 'Compteur de boosts',
                        value: 'boosts',
                        emoji: "🔮"
                    }
                ]),
        );
    if (type) {
        roww.components[0].addOptions([{
            label: `Format`,
            value: `format`,
            emoji: "⚙️"
        }]);
    }
    let button1 = new MessageButton().setStyle('PRIMARY').setCustomId('createvoice').setLabel("🔊 Créer un salon vocal")
    let button2 = new MessageButton().setStyle('PRIMARY').setCustomId('createtext').setLabel("💬 Créer un salon textuel")
    let button3 = new MessageButton().setStyle('SUCCESS').setCustomId('valid').setLabel("✔️ Valide le compteur")
    let button4 = new MessageButton().setStyle('DANGER').setCustomId('delete').setLabel("❌ Supprime le compteur")
    let button_row = new MessageActionRow().addComponents([button1, button2])
    let button_row2 = new MessageActionRow().addComponents([button3, button4])
    let rolem
    if (type === "rolemembers") {
        rolem = db.fetch(`${message.guild.id}.counters${value}.membersrole`)
        rolem = message.guild.roles.cache.get(rolem)
        if (rolem) { rolem = rolem.members.size } else rolem = 0


    }

    const embed = new MessageEmbed()
        .setColor(db.fetch(`${message.guild.id}.color`))
        .setTitle("Paramètres du compteur " + value)
        .setFooter({ text: `Les compteurs s'actualisent toutes les 7 minutes, patientez 😉` })
        .setDescription(`**Salon:** ${channel ? `<#${channel}>` : ":x:"}\n**Type:** ${type ? type.replace(`membres`, `Compteur de membres`).replace(`online`, `Compteur de membres en ligne`).replace(`vocal`, `Compteur de membres en vocal`).replace(`channels`, `Compteur de salons`).replace(`roles`, `Compteur de rôles`)
            .replace(`rolemembers`, "Compteur de membres ayant un rôle").replace(`boosts`, `Compteur de boosts`) : ":x:"}
**Format:** ${type ? format.replace("<count>", type.replace(`membres`, message.guild.memberCount).replace(`online`, message.guild.members.cache.filter(({ presence }) => presence && presence.status !== 'offline').size).replace(`vocal`, message.guild.members.cache.filter(m => m.voice.channel).size)
                .replace(`rolemembers`, rolem).replace(`channels`, message.guild.channels.cache.size).replace(`roles`, message.guild.roles.cache.size).replace(`boosts`, message.guild.premiumSubscriptionCount)) : ":x:"}`)
    return msgtoedit.edit({ embeds: [embed], components: [button_row, button_row2, roww] })
}

function princip(message, msgtoedit) {
    const msgembed = new MessageEmbed()
        .setColor(db.fetch(`${message.guild.id}.color`))
        .setTitle("📊 Paramètre des compteurs")
        .setFooter({ text: `Les compteurs s'actualisent toutes les 7 minutes, patientez 😉` });
    for (let i = 1; i < counters + 1; i++) {
        let number = `${i}`
        let chan = db.fetch(`${message.guild.id}.counters${i}.channel`)
        let check = message.guild.channels.cache.get(chan)
        if (!check) {
            db.delete(`${message.guild.id}.counters${i}.channel`)
            db.delete(`${message.guild.id}.counters${i}.type`)
            chan = db.fetch(`${message.guild.id}.counters${i}.channel`)
        }
        msgembed.addField(`${number.replace("1", "1️⃣").replace("2", "2️⃣").replace("3", "3️⃣").replace("4", "4️⃣")} **Compteur ${i}**`, check ? `<#${chan}>` : "Non paramétré")

    }
    msgtoedit.edit({embeds: [msgembed]}).catch()
}