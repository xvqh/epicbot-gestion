const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "tempvoc",
    description: "Configure les vocaux temporaire",
    aliases: ["temp-voc"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, cmd.name)
        if (perm == true) {

            let dureefiltrer = m => message.author.id === m.author.id;

            message.channel.send(`Chargement en cours...`).then(async m => {
                await update(m)
                const collector = m.createMessageComponentCollector({
                    componentType: "SELECT_MENU",
                    time: 1800000
                })
                collector.on("collect", async (select) => {
                    if (select.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
                    let value = select.values[0]
                    await select.deferUpdate()
                    if (value === "auto") {
                        message.channel.send(` ✨ Création de la catégorie des salons personnalisé en cours..`).then(msg => {
                            m.guild.channels.create('Salon temporaire', {
                                type: 'GUILD_CATEGORY',
                                permissionsOverwrites: [{
                                    id: message.guild.id,
                                    allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK']
                                }]
                            }).then(c => {
                                db.set(`${message.guild.id}.tempvoc.category`, c.id)
                                c.guild.channels.create('➕ Crée ton salon', {
                                    type: 'GUILD_VOICE',
                                    parent: c.id,
                                    permissionOverwrites: [
                                        {
                                            id: message.guild.id,
                                            allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK']
                                        },
                                    ],
                                }).then(v => {
                                    db.set(`${message.guild.id}.tempvoc.channel`, v.id)
                                    db.set(`${message.guild.id}.tempvoc.emoji`, "🕙")
                                    update(m)
                                    msg.edit(`✨ Création de la catégorie des salons personnalisé effectué avec succès !`)
                                });
                            })
                        })
                    } else if (value === "catego") {
                        message.channel.send(`📖 Veuillez entrée l'ID de la catégorie:`).then(mp => {
                            mp.channel.awaitMessages({ filter: dureefiltrer,max: 1, time: 30000, errors: ['time'] })
                                .then(cld => {
                                    var msg = cld.first();
                                    var category = message.guild.channels.cache.get(msg.content)
                                    if (!category) return message.channel.send(` 📖 Catégorie incorrect !`);
                                    if (category.type !== "GUILD_CATEGORY") return message.channel.send(` 📖 Ce n'est pas une catégorie !`);
                                    db.set(`${message.guild.id}.tempvoc.category`, category.id)
                                    message.channel.send(`📖 Vous avez changé le salon de la catégorie à \`${category.name}\``)
                                    update(m)
                                    mp.delete()
                                });
                        });
                    } else if (value === "channel") {
                        message.channel.send(`🏷️ Veuillez envoyer le salon vocal à rejoindre:`).then(mp => {
                            mp.channel.awaitMessages({filter: dureefiltrer, max: 1, time: 30000, errors: ['time'] })
                                .then(cld => {
                                    var msg = cld.first();
                                    var category = msg.mentions.channels.first() || message.guild.channels.cache.get(msg.content)
                                    if (!category) return message.channel.send(`🏷️ Salon incorrect.`);
                                    console.log(category.type)
                                    if (category.type !== "GUILD_VOICE" && category.type !== "GUILD_STAGE") return message.channel.send(`🏷️ Ce n'est pas un salon vocal !`);
                                    db.set(`${message.guild.id}.tempvoc.channel`, category.id)
                                    message.channel.send(`🏷️ Vous avez changé le salon de création à \`${category.name}\``)
                                    update(m)
                                    mp.delete()
                                });
                        });
                    } else if (value === "emoji") {
                        message.channel.send(`🎗️ Veuillez envoyer l'emoji/prefix du salon que vous souhaitez:`).then(mp => {
                            mp.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000, errors: ['time'] })
                                .then(cld => {
                                    var msg = cld.first();
                                    db.set(`${message.guild.id}.tempvoc.emoji`, msg.content)
                                    message.channel.send(` 🎗️ Vous avez modifié l'emoji à \`${msg.content}\` !`)
                                    update(m)
                                    mp.delete()
                                });
                        });
                    } else if (value === "active") {
                        let actual = db.fetch(`${message.guild.id}.tempvoc.active`)
                        if(!actual) {db.set(`${message.guild.id}.tempvoc.active`, true)} else db.delete(`${message.guild.id}.tempvoc.active`)
                        update(m)
                    } 
                });
                collector.on("end", async () => {
                    return m.edit({ content: "Expiré !", components: [] }).catch(() => { })
                })
            });


        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

        function update(m) {
        let category = db.fetch(`${message.guild.id}.tempvoc.category`)
        category = message.guild.channels.cache.get(category)
        let channel = db.fetch(`${message.guild.id}.tempvoc.channel`)
        channel = message.guild.channels.cache.get(channel)
        let emoji = db.fetch(`${message.guild.id}.tempvoc.emoji`)
        let actual = db.fetch(`${message.guild.id}.tempvoc.active`)
            const msgembed = new Discord.MessageEmbed()
                .setTitle(`🕙 Modification des salons temporaires de ${message.guild.name}`)
                .setColor(db.fetch(`${message.guild.id}.color`))
                .addField("`📩` Activé", actual ? ":white_check_mark:" : ":x:", true)
                .addField("`📖` Catégorie", category ? category.name : ":x:", true)
                .addField("`🏷️` Salon", channel ? `<#${channel.id}>` : ":x:", true)
                .addField("`🎗️` Emoji", emoji ? emoji : ":x:", true)

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
                                label: 'Créer automatiquement',
                                value: 'auto',
                                emoji: "✨"
                            },
                            {
                                label: 'Modifier la catégorie',
                                value: 'catego',
                                emoji: "📖"
                            },
                            {
                                label: 'Modifier le salon',
                                value: 'channel',
                                emoji: "🏷️"
                            },
                            {
                                label: 'Modifier l\'emoji',
                                value: 'emoji',
                                emoji: "🎗️"
                            }
                        ])
                )

                m.edit({content: " ", embeds: [msgembed], components: [roww]})
        }
    }
}