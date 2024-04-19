
const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "soutien",
    description: "Configure le rôle soutien",
    aliases: ["soutiens", "soutient"],

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
                const filter = m => message.author.id === m.author.id;
                collector.on("collect", async (select) => {
                    if (select.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
                    let value = select.values[0]
                    await select.deferUpdate()
                    if (value === "active") {
                        let active = db.fetch(`${message.guild.id}.soutien.active`)
                        if (active == true) { db.delete(`${message.guild.id}.soutien.active`) } else db.set(`${message.guild.id}.soutien.active`, true)
                        update(mm)
                    }
                    if (value === "role") {
                        await message.channel.send(`📝 Veuillez mentionner le rôle soutien:`).then(async question => {
                            await message.channel.awaitMessages({ filter: filter, max: 1, time: 60000, errors: ['time'] })
                                .then(cld => {
                                    var msg = cld.first();
                                    let newrole = msg.mentions.roles.first() || msg.guild.roles.cache.get(msg.content) || msg.guild.roles.cache.find(r => r.name.toLowerCase() === msg.content.toLocaleLowerCase())
                                    if (!newrole) return message.channel.send(`:x: Rôle invalide`)
                                    const memberPosition = message.member.roles.highest.position;
                                    const authorPosition = newrole.position;
                                    if (authorPosition >= memberPosition) return message.reply(":x: Vous ne pouvez pas ajouter un rôle supérieur au votre !");
                                    let role = db.fetch(`${message.guild.id}.soutien.role`)
                                    if (!role) { db.set(`${message.guild.id}.soutien.role`, newrole.id) } else {
                                        if (role === newrole.id) { db.delete(`${message.guild.id}.soutien.role`) } else db.set(`${message.guild.id}.soutien.role`, newrole.id)
                                    }

                                    msg.delete().catch(e => { })
                                    question.delete().catch(e => { })
                                    update(mm)
                                })
                        })
                    }
                    if (value === "contenu") {
                        await message.channel.send(`🏷️ Veuillez envoyer le contenu autorisé:`).then(question => {
                            message.channel.awaitMessages({ filter: filter, max: 1, time: 60000, errors: ['time'] })
                                .then(cld => {
                                    var msg = cld.first();
                                    let statut = db.fetch(`${message.guild.id}.soutien.statut`)
                                    if (statut && statut.includes(msg.content)) {
                                        const filtered = statut.filter(e => e !== msg.content);
                                        db.set(`${message.guild.id}.soutien.statut`, filtered);
                                    } else db.push(`${message.guild.id}.soutien.statut`, msg.content)
                                    msg.delete().catch(e => { })
                                    question.delete().catch(e => { })
                                    update(mm)
                                })
                        })
                    }
                })
                collector.on("end", async () => {
                    return mm.edit({ content: "Expiré !", components: [] }).catch(() => { })
                })
            })

        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

        async function update(mm) {
            let active = db.fetch(`${message.guild.id}.soutien.active`)
            let role = db.fetch(`${message.guild.id}.soutien.role`)
            if (role) {
                role = message.guild.roles.cache.get(role)
                if (!role) {
                    db.delete(`${message.guild.id}.soutien.role`)
                    role = undefined
                }
            }
            let statut = db.fetch(`${message.guild.id}.soutien.statut`)
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
                                label: 'Modifier le rôle donné',
                                value: 'role',
                                emoji: "📝"
                            },
                            {
                                label: 'Ajouter/Retirer un message',
                                value: 'contenu',
                                emoji: "🏷️"
                            }
                        ])
                )
            const msgembed = new Discord.MessageEmbed()
                .setTitle(`📍 Soutien ${message.guild.name}`)
                .setColor(db.fetch(`${message.guild.id}.color`))
                .addFields(
                    { name: "`📩` Activé", value: active ? ":white_check_mark:" : ":x:" },
                    { name: "`👥` Rôle", value: role ? `${role}` : ":x:" },
                    { name: "`🏷️` Contenus acceptés", value: statut && statut.length > 0 ? statut.map(s => `- \`${s}\``).join("\n") : ":x:"},
                )
            await mm.edit({ embeds: [msgembed], components: [roww] })
        }
    }
}