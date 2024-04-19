const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm, msToTime } = require("../../base/functions");
const ms = require("ms")
module.exports = {
    name: "permdesac",
    description: "Désactive les permissions de votre choix pendant la durée de votre choix",
    aliases: ["desacperm", "desac"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, cmd.name)
        if (perm == true) {
            const row = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageSelectMenu()
                        .setCustomId('select')
                        .setPlaceholder('Désactiver un permission')
                        .addOptions([
                            {
                                label: 'Permission Administrateur',
                                value: 'ADMINISTRATOR',
                                emoji: "👑"
                            }, {
                                label: 'Permission Rôle',
                                value: 'MANAGE_ROLES',
                                emoji: "🔧"
                            }, {
                                label: 'Permission Modifier Serveur',
                                value: 'MANAGE_GUILD',
                                emoji: "☄️"
                            }, {
                                label: 'Permission Salons',
                                value: 'MANAGE_CHANNELS',
                                emoji: "📕"
                            }, {
                                label: 'Permission Ban',
                                value: 'BAN_MEMBERS',
                                emoji: "🔨"
                            }, {
                                label: 'Permission Kick',
                                value: 'KICK_MEMBERS',
                                emoji: "💥"
                            },
                        ])
                )
            const roww = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageSelectMenu()
                        .setCustomId('selectt')
                        .setPlaceholder('Modifier une option')
                        .addOptions([
                            {
                                label: 'Change la durée avant la réactivation automatique',
                                value: 'duree',
                                emoji: "⏰"
                            }
                        ])
                )
            let duree = db.fetch(`${message.guild.id}.desac.time`)
            const embed = new Discord.MessageEmbed()
                .setColor(db.fetch(`${message.guild.id}.color`))
                .setDescription(`Choisissez la permission à désactiver !\n\n**La permission sera automatiquement réactivée au bout de ${duree && !isNaN(duree) ? msToTime(duree) : "jamais"}**`)
            message.reply({ embeds: [embed], components: [row, roww] }).then(msg => {
                const collector = msg.createMessageComponentCollector({
                    componentType: "SELECT_MENU",
                    time: 1800000
                })
                const filter = m => message.author.id === m.author.id;
                collector.on("collect", async (select) => {
                    if (select.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
                    let value = select.values[0]
                    await select.deferUpdate()
                    if (value === "duree") {
                        await message.channel.send(`⏰ Veuillez envoyer la durée avant la réactivation automatique des permissions (\`s\` pour secondes, \`m\` pour minutes, \`h\` pour heures):\nEnvoyer \`off\` pour désactiver`).then(question => {
                            message.channel.awaitMessages({ filter: filter, max: 1, time: 600000, errors: ['time'] })
                                .then(cld => {
                                    var mm = cld.first();
                                    if (mm.content.toLowerCase() === "off") { db.delete(`${message.guild.id}.desac.time`) } else {
                                        if (!mm.content.endsWith("h") && !mm.content.endsWith("m") && !mm.content.endsWith("s")) return message.channel.send(`:x: Durée incorrecte`); update(msg)
                                        if (ms(mm.content) < 5000 || ms(mm.content) > 86400000) return message.channel.send(`:x: la durée doit être comprise entre 5 secondes et 1 jour !`); update(msg)
                                        db.set(`${message.guild.id}.desac.time`, ms(mm.content))
                                    }
                                    mm.delete().catch(e => { })
                                    question.delete().catch(e => { })
                                    update(msg)
                                })
                        })
                    }
                    permission(value)
                })
                collector.on("end", async () => {
                    return msg.edit({ content: "Collector expiré !", components: [] }).catch(() => { })
                })
            })

        } else if (perm === false) if (!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

        async function permission(perm) {
            message.guild.roles.fetch()
            let pi = 0
            let duree = db.fetch(`${message.guild.id}.desac.time`)
            await message.guild.roles.cache.filter(r => r.permissions.has(perm)).forEach(r =>{
              if(r.position < r.guild.me.roles.highest.position) {
              r.setPermissions(r.permissions.remove([ perm ])).catch(e => {})
              pi++
              if(duree && !isNaN(duree)){
              setTimeout(() => {
                r.setPermissions(r.permissions.add([ perm ])).catch(e => {})
            }, parseInt(duree));}
          }
            })
    message.channel.send(`:shield: J'ai désactivé ${pi} permissions ${perm} !`)
    if(duree && !isNaN(duree)){
        setTimeout(() => {
            message.channel.send(`:shield: J'ai réactivé les permissions ${perm} !`)
      }, parseInt(duree));}
        }

        function update(msg){
            let duree = db.fetch(`${message.guild.id}.desac.time`)
            const embed = new Discord.MessageEmbed()
                .setColor(db.fetch(`${message.guild.id}.color`))
                .setDescription(`Choisissez la permission à désactiver !\n\n**La permission sera automatiquement réactivée au bout de ${duree && !isNaN(duree) ? msToTime(duree) : "jamais"}**`)
            msg.edit({embeds: [embed]})
        }
    }
}