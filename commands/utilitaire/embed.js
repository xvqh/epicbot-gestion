
const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
var embeding = {}
module.exports = {
    name: "embed",
    description: "Créer un embed",

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, cmd.name)
        if (perm == true) {

            const roww = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageSelectMenu()
                        .setCustomId('config')
                        .setPlaceholder('Modifier l\'embed')
                        .addOptions([
                            {
                                label: 'Modifier le titre',
                                value: 'title',
                                emoji: "✏️"
                            },
                            {
                                label: 'Modifier la description',
                                value: 'description',
                                emoji: "📝"
                            },
                            {
                                label: 'Modifier l\'auteur',
                                value: 'author',
                                emoji: "👥"
                            },
                            {
                                label: 'Modifier l\'image',
                                value: 'image',
                                emoji: "🖼"
                            },
                            {
                                label: 'Modifier le footer',
                                value: 'footer',
                                emoji: "🔻"
                            },
                            {
                                label: 'Modifier la couleur',
                                value: 'color',
                                emoji: "🎨"
                            },
                            {
                                label: 'Modifier le thumbnail',
                                value: 'thumbnail',
                                emoji: "🔲"
                            },
                            {
                                label: 'Modifier l\'URL',
                                value: 'url',
                                emoji: "🌐"
                            },
                            {
                                label: 'Ajouter un field',
                                value: 'addfield',
                                emoji: "↩️"
                            },
                            {
                                label: 'Retirer un field',
                                value: 'removefield',
                                emoji: "↪️"
                            }
                        ]))
            let button1 = new Discord.MessageButton().setStyle('SUCCESS').setCustomId('valid').setLabel("✔️ Valider l'embed")
            let button2 = new Discord.MessageButton().setStyle('DANGER').setCustomId('delete').setLabel("❌ Supprimer l'embed")
            let button_row = new Discord.MessageActionRow().addComponents([button1, button2])
            let embedd = new Discord.MessageEmbed()
                .setDescription("** **")
            const filter = m => message.author.id === m.author.id;
            await message.channel.send({ embeds: [embedd], components: [roww, button_row] }).then(mm => {

                const collector = mm.createMessageComponentCollector({
                    componentType: "SELECT_MENU",
                    time: 7200000
                })
                const collector2 = mm.createMessageComponentCollector({
                    componentType: "BUTTON",
                    time: 7200000
                })
                collector.on("collect", async (select) => {
                    if (select.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
                    let value = select.values[0]
                    await select.deferUpdate()
                    if (embeding[message.author.id] == true) return message.channel.send(`Merci de finaliser l'action en cours ou de dire \`cancel\` !`).then(m => { setTimeout(async () => { m.delete().catch(e => { }) }, 5000) })
                    if (value === "thumbnail") {
                        await message.channel.send("🔲 Veuillez envoyer le **thumbnail** de l'embed:").then(question => {
                            embeding[message.author.id] = true;
                            question.channel.awaitMessages({ filter: filter, max: 1, time: 600000, errors: ['time'] })
                                .then(async collected => {
                                    let msg = collected.first()
                                    if (msg.content.toLowerCase() === "cancel") {
                                        embeding[message.author.id] = false;
                                        question.delete().catch(e => { })
                                        collected.first().delete().catch(e => { })
                                        return message.channel.send("Action annulée").then(m => { setTimeout(async () => { m.delete().catch(e => { }) }, 3000) })
                                    }
                                    let url
                                    if (msg.attachments.size > 0) { url = msg.attachments.first().url } else url = msg.content
                                    embedd.setThumbnail(url)
                                    mm.edit({ embeds: [embedd] }).catch(e => { })
                                    embeding[message.author.id] = false;
                                    question.delete().catch(e => { })
                                    collected.first().delete().catch(e => { })
                                }).catch(collected => {
                                    message.channel.send(":x: Temps écoulé OU une erreur est subvenue.").then(m => { setTimeout(async () => { m.delete().catch(e => { }) }, 5000) })
                                    return;
                                })
                        })
                    }

                    if (value === "url") {
                        await message.channel.send("🌐 Veuillez envoyer l'**URL** de l'embed:").then(question => {
                            embeding[message.author.id] = true;
                            question.channel.awaitMessages({ filter: filter, max: 1, time: 600000, errors: ['time'] })
                                .then(async collected => {
                                    const url = collected.first().content
                                    if (url === "cancel") {
                                        embeding[message.author.id] = false;
                                        question.delete().catch(e => { })
                                        collected.first().delete().catch(e => { })
                                        return message.channel.send("Action annulée").then(m => { setTimeout(async () => { m.delete().catch(e => { }) }, 3000) })
                                    }
                                    embedd.setURL(url)
                                    mm.edit({ embeds: [embedd] }).catch(e => { })
                                    embeding[message.author.id] = false;
                                    question.delete().catch(e => { })
                                    collected.first().delete().catch(e => { })
                                }).catch(collected => {
                                    message.channel.send(":x: Temps écoulé OU une erreur est subvenue.").then(m => { setTimeout(async () => { m.delete().catch(e => { }) }, 5000) });
                                    embeding[message.author.id] = false;
                                    return;
                                })
                        })
                    }

                    if (value === "description") {
                        await message.channel.send("📝 Veuillez entrer la **description** de l'embed:").then(question => {
                            embeding[message.author.id] = true;
                            question.channel.awaitMessages({ filter: filter, max: 1, time: 600000, errors: ['time'] })
                                .then(async collected => {
                                    const description = collected.first().content
                                    if (description === "cancel") {
                                        embeding[message.author.id] = false;
                                        question.delete().catch(e => { })
                                        collected.first().delete()
                                        return message.channel.send("Action annulée").then(m => { setTimeout(async () => { m.delete().catch(e => { }) }, 3000) })
                                    }
                                    embedd.setDescription(description)
                                    mm.edit({ embeds: [embedd] }).catch(e => { })
                                    embeding[message.author.id] = false;
                                    question.delete().catch(e => { })
                                    collected.first().delete().catch(e => { })

                                }).catch(collected => {
                                    message.channel.send(":x: Temps écoulé OU une erreur est subvenue.").then(m => { setTimeout(async () => { m.delete().catch(e => { }) }, 5000) });
                                    embeding[message.author.id] = false;
                                    return;
                                })

                        })
                    }
                    if (value === "title") {
                        await message.channel.send("✏️ Veuillez envoyer le **titre** de l'embed:").then(question => {
                            embeding[message.author.id] = true;
                            question.channel.awaitMessages({ filter: filter, max: 1, time: 600000, errors: ['time'] })
                                .then(async collected => {
                                    const title = collected.first().content
                                    if (title === "cancel") {
                                        embeding[message.author.id] = false;
                                        question.delete().catch(e => { })
                                        collected.first().delete().catch(e => { })
                                        return message.channel.send("Action annulée").then(m => { setTimeout(async () => { m.delete().catch(e => { }) }, 3000) })
                                    }
                                    embedd.setTitle(title)
                                    mm.edit({ embeds: [embedd] })
                                    embeding[message.author.id] = false;
                                    question.delete().catch(e => { })
                                    collected.first().delete().catch(e => { })

                                }).catch(collected => {
                                    message.channel.send(":x: Temps écoulé OU une erreur est subvenue.").then(m => { setTimeout(async () => { m.delete().catch(e => { }) }, 5000) });
                                    embeding[message.author.id] = false;
                                    return;
                                })
                        })
                    }

                    if (value === "image") {
                        await message.channel.send("🖼 Veuillez envoyer **l'image** de l'embed:").then(question => {
                            embeding[message.author.id] = true;
                            question.channel.awaitMessages({ filter: filter, max: 1, time: 600000, errors: ['time'] })
                                .then(async collected => {
                                    const image = collected.first()
                                    if (image.content === "cancel") {
                                        embeding[message.author.id] = false;
                                        question.delete().catch(e => { })
                                        collected.first().delete().catch(e => { })
                                        return message.channel.send("Action annulée").then(m => { setTimeout(async () => { m.delete().catch(e => { }) }, 3000) })
                                    }
                                    let url
                                    if (image.attachments.size > 0) { url = image.attachments.first().url } else url = image.content
                                    embedd.setImage(url)
                                    mm.edit({ embeds: [embedd] }).catch(e => { })
                                    embeding[message.author.id] = false;
                                    question.delete().catch(e => { })
                                    collected.first().delete().catch(e => { })

                                }).catch(collected => {
                                    message.channel.send(":x: Temps écoulé OU une erreur est subvenue.").then(m => { setTimeout(async () => { m.delete().catch(e => { }) }, 5000) });
                                    embeding[message.author.id] = false;
                                    return;
                                })
                        })
                    }

                    if (value === "color") {
                        await message.channel.send("🎨 Veuillez envoyer la **couleur** de l'embed:").then(question => {
                            embeding[message.author.id] = true;
                            question.channel.awaitMessages({ filter: filter, max: 1, time: 600000, errors: ['time'] })
                                .then(async collected => {
                                    const color = collected.first().content
                                    if (color === "cancel") {
                                        embeding[message.author.id] = false;
                                        question.delete().catch(e => { })
                                        collected.first().delete().catch(e => { })
                                        return message.channel.send("Action annulée").then(m => { setTimeout(async () => { m.delete().catch(e => { }) }, 3000) })
                                    }
                                    embedd.setColor(color)
                                    mm.edit({ embeds: [embedd] }).catch(e => { })
                                    embeding[message.author.id] = false;
                                    question.delete().catch(e => { })
                                    collected.first().delete().catch(e => { })

                                }).catch(collected => {
                                    message.channel.send(":x: Temps écoulé OU une erreur est subvenue.").then(m => { setTimeout(async () => { m.delete().catch(e => { }) }, 5000) });
                                    embeding[message.author.id] = false;
                                    return;
                                })
                        })
                    }

                    if (value === "footer") {
                        await message.channel.send("🔻 Veuillez envoyer le **footer** de l'embed:").then(question => {
                            embeding[message.author.id] = true;
                            question.channel.awaitMessages({ filter: filter, max: 1, time: 600000, errors: ['time'] })
                                .then(async collected => {
                                    const footer = collected.first().content
                                    if (footer === "cancel") {
                                        embeding[message.author.id] = false;
                                        question.delete().catch(e => { })
                                        collected.first().delete().catch(e => { })
                                        return message.channel.send("Action annulée").then(m => { setTimeout(async () => { m.delete().catch(e => { }) }, 3000) })
                                    }
                                    embedd.setFooter({ text: footer })
                                    mm.edit({ embeds: [embedd] }).catch(e => { })
                                    embeding[message.author.id] = false;
                                    question.delete().catch(e => { })
                                    collected.first().delete().catch(e => { })

                                }).catch(collected => {
                                    message.channel.send(":x: Temps écoulé OU une erreur est subvenue.").then(m => { setTimeout(async () => { m.delete().catch(e => { }) }, 5000) });
                                    embeding[message.author.id] = false;
                                    return;
                                })
                        })
                    }

                    if (value === "author") {
                        await message.channel.send("👥 Veuillez envoyer **l'auteur** de l'embed:").then(question => {
                            embeding[message.author.id] = true;
                            question.channel.awaitMessages({ filter: filter, max: 1, time: 600000, errors: ['time'] })
                                .then(async collected => {
                                    const author = collected.first().content
                                    if (author === "cancel") {
                                        embeding[message.author.id] = false;
                                        question.delete().catch(e => { })
                                        collected.first().delete().catch(e => { })
                                        return message.channel.send("Action annulée").then(m => { setTimeout(async () => { m.delete().catch(e => { }) }, 3000) })
                                    }
                                    embedd.setAuthor({ name: author })
                                    mm.edit({ embeds: [embedd] }).catch(e => { })
                                    embeding[message.author.id] = false;
                                    question.delete().catch(e => { })
                                    collected.first().delete().catch(e => { })

                                }).catch(collected => {
                                    message.channel.send(":x: Temps écoulé OU une erreur est subvenue.").then(m => { setTimeout(async () => { m.delete().catch(e => { }) }, 5000) });
                                    embeding[message.author.id] = false;
                                    return;
                                })
                        })
                    }

                    if (value === "addfield") {
                        const msgQuestionField = await message.channel.send('↩️ Veuillez envoyer le **titre du field**:');
                        const titlefield = (await message.channel.awaitMessages({ filter: filter, max: 1, time: 600000 })).first();
                        if (titlefield.content === "cancel") {
                            embeding[message.author.id] = false;
                            msgQuestionField.delete().catch(e => { })
                            collected.first().delete().catch(e => { })
                            return message.channel.send("Action annulée").then(m => { setTimeout(async () => { m.delete().catch(e => { }) }, 3000) })
                        }
                        msgQuestionField.delete().catch(e => { })
                        titlefield.delete().catch(e => { })
                        const msgQuestionDescField = await message.channel.send('Merci de rentrer la **description du field**:');
                        const descfield = (await message.channel.awaitMessages({ filter: filter, max: 1, time: 600000 })).first();
                        msgQuestionDescField.delete().catch(e => { })
                        descfield.delete().catch(e => { })
                        embedd.addFields({ name: titlefield.content, value: descfield.content })
                        mm.edit({ embeds: [embedd] }).catch(e => { });

                    }

                    if (value === "removefield") {
                        const msgQuestionFieldTitle = await message.channel.send('↪️ Veuillez envoyer le titre du field à retirer');
                        const field_title = (await message.channel.awaitMessages({ filter: filter, max: 1, time: 600000 })).first();
                        if (field_title.content === "cancel") {
                            embeding[message.author.id] = false;
                            msgQuestionField.delete()
                            collected.first().delete()
                            return message.channel.send("Action annulée").then(m => { setTimeout(async () => { m.delete().catch(e => { }) }, 3000) })
                        }
                        msgQuestionFieldTitle.delete();
                        field_title.delete();
                        let indexField = '';
                        embedd.fields.map(field => {
                            if (indexField !== '') return;
                            if (field.name === field_title.content) indexField += embedd.fields.indexOf(field);
                        })
                        if (indexField === '') return message.channel.send('Aucun field trouvé').then(m => { setTimeout(async () => { m.delete().catch(e => { }) }, 5000) });
                        delete embedd.fields[indexField];
                        mm.edit({ embeds: [embedd] }).catch(e => { });
                    }

                });
                collector.on("end", async () => {
                    return mm.edit({ content: "Création de l'embed terminée !", components: [] }).catch(() => { })
                })

                collector2.on("collect", async (i) => {
                    if (i.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
                    await i.deferUpdate()
                    if (i.customId === 'valid') {
                        let button11 = new Discord.MessageButton().setStyle('PRIMARY').setCustomId('channel').setLabel("Envoyer dans un salon").setEmoji("📝")
                        let button22 = new Discord.MessageButton().setStyle('PRIMARY').setCustomId('custom').setLabel("Modifier un message existant").setEmoji("✏️")
                        let button_roww = new Discord.MessageActionRow().addComponents([button11, button22])
                        message.channel.send({
                            embeds: [new Discord.MessageEmbed()
                                .setColor(db.fetch(`${message.guild.id}.color`))
                                .setTitle(`Vou souhaitez:`)
                                .setDescription(`📝 Envoyer l'embed dans un salon\n✏️ Modifier un message du bot existant`)]
                            , components: [button_roww]
                        }).then(memsg => {
                            const collector22 = memsg.createMessageComponentCollector({
                                componentType: "BUTTON",
                                time: 7200000
                            })
                            collector22.on("collect", async (i) => {
                                if (i.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
                                await i.deferUpdate()
                                if (i.customId === 'channel') {
                                    await message.channel.send("Veuillez envoyer le **salon où je dois envoyer l'embed**:").then(question => {
                                        embeding[message.author.id] = true;
                                        question.channel.awaitMessages({ filter: filter, max: 1, time: 600000, errors: ['time'] })
                                            .then(async collected => {
                                                let cancel = collected.first()
                                                if (cancel.content === "cancel") {
                                                    embeding[message.author.id] = false;
                                                    question.delete().catch(e => { })
                                                    collected.first().delete().catch(e => { })
                                                    return message.channel.send("Action annulée").then(m => { setTimeout(async () => { m.delete().catch(e => { }) }, 3000) })
                                                }
                                                const channel = collected.first().mentions.channels.first() || collected.first().guild.channels.cache.get()
                                                channel.send({ embeds: [embedd] }).catch(e => { return message.channel.send(`ERREUR: ${e}`) }).then(m => {
                                                    message.channel.send(`Embed envoyé dans ${channel}`)
                                                })
                                                collector.stop()
                                                collector2.stop()
                                                collector22.stop()
                                                embeding[message.author.id] = false;
                                                memsg.delete().catch()
                                                question.delete().catch(e => { })
                                                collected.first().delete().catch(e => { })
                                                return;
                                            }).catch(collected => {
                                                message.channel.send(":x: Temps écoulé OU une erreur est subvenue.").then(m => { setTimeout(async () => { m.delete().catch(e => { }) }, 5000) });
                                                embeding[message.author.id] = false;
                                                return;
                                            })
                                    })
                                }
                                if (i.customId === 'custom') {
                                    await message.channel.send("Veuillez envoyer le **salon du message à modifier**:").then(question => {
                                        embeding[message.author.id] = true;
                                        question.channel.awaitMessages({ filter: filter, max: 1, time: 600000, errors: ['time'] })
                                            .then(async collected => {

                                                const channel = collected.first().mentions.channels.first() || collected.first().guild.channels.cache.get()
                                                if (!channel) return message.channel.send(`:x: Salon invalide`)
                                                await message.channel.send("Veuillez envoyer l'**id du message à modifier**:").then(question => {
                                                    embeding[message.author.id] = true;
                                                    question.channel.awaitMessages({ filter: filter, max: 1, time: 600000, errors: ['time'] })
                                                        .then(async collect => {
                                                            let msg = collect.first()
                                                            channel.messages.fetch(msg.content)
                                                            .then(msg => {
                                                              if (msg.author.id !== client.user.id) { return message.channel.send(`:x: Je dois être l'auteur du message, sinon je ne peux pas modifier le message !`) }
                                                              msg.edit({embeds: [embedd]}).catch(e => {
                                                                message.channel.send(":x: Je n'ai pas réussi à modifier le message !");
                                                              }).then(m => {message.channel.send(`Le message a bien été modifié dans ${channel}`)
                                                                collector.stop()
                                                                collector2.stop()
                                                                collector22.stop()
                                                                embeding[message.author.id] = false;
                                                                memsg.delete().catch()
                                                                question.delete().catch(e => { })
                                                                collected.first().delete().catch(e => { })
                                                                return;})
                                                            
                                                            }).catch(e => { console.log(e); message.channel.send(":x: Message introuvable"); return });
                                                        })
                                                }).catch(collected => {
                                                    message.channel.send(":x: Je n'ai pas trouvé le message.").then(m => { setTimeout(async () => { m.delete().catch(e => { }) }, 5000) });
                                                    embeding[message.author.id] = false;
                                                    return;
                                                })

                                            }).catch(collected => {
                                                message.channel.send(":x: Temps écoulé OU une erreur est subvenue.").then(m => { setTimeout(async () => { m.delete().catch(e => { }) }, 5000) });
                                                embeding[message.author.id] = false;
                                                return;
                                            })
                                    })
                                }
                            })
                        })
                    }
                    if (i.customId === 'delete') {
                        message.channel.send("Arrêt de la création de l'embed")
                        collector.stop()
                        collector2.stop()
                        return;
                    }
                })

            })
        } else if (perm === false) if (!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    }
}