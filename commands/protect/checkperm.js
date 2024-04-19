const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "checkperm",
    description: "Verifie les permissions du serveur",
    aliases: ["cp"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message,cmd.name)
        if (perm == true) {
            const row = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageSelectMenu()
                        .setCustomId('select')
                        .setPlaceholder('Vérifier une permission')
                        .addOptions([
                            {
                                label: 'Permission Administrateur',
                                value: 'ADMINISTRATOR',
                                emoji: "👑"
                            },{
                                label: 'Permission Rôle',
                                value: 'MANAGE_ROLES',
                                emoji: "🔧"
                            },{
                                label: 'Permission Modifier Serveur',
                                value: 'MANAGE_GUILD',
                                emoji: "☄️"
                            },{
                                label: 'Permission Salons',
                                value: 'MANAGE_CHANNELS',
                                emoji: "📕"
                            },{
                                label: 'Permission Ban',
                                value: 'BAN_MEMBERS',
                                emoji: "🔨"
                            },{
                                label: 'Permission Kick',
                                value: 'KICK_MEMBERS',
                                emoji: "💥"
                            },
                        ])
                )

            const embed = new Discord.MessageEmbed()
                .setColor(db.fetch(`${message.guild.id}.color`))
                .setDescription("Choisissez la permission à vérifier !")
            message.reply({ embeds: [embed], components: [row] }).then(msg => {
                const collector = msg.createMessageComponentCollector({
                    componentType: "SELECT_MENU",
                    time: 1800000
                })
                collector.on("collect", async (select) => {
                    if (select.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
                    let value = select.values[0]
                    await select.deferUpdate()
                    permission(value)
                })
                collector.on("end", async () => {
                    return msg.edit({ content: "Collector expiré !", components: [] }).catch(() => { })
                })
            })

        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

        function permission(perm) {
            var adminslist = message.guild.members.cache.filter(m => m.permissions.has(perm) && !m.user.bot)
            let page = (adminslist.size / 10) + 1
            page = parseInt(page)

            for (let i = 1; i < page + 1; i++) {
                const embeddd = new Discord.MessageEmbed()
                    .setDescription(`*Ces membres ont la permission ${perm}*\n\n\n` + list((i - 1) * 10, i * 10))
                    .setColor(db.fetch(`${message.guild.id}.color`))
                    .setFooter({ text: `Page ${i} / ` + page })
                message.channel.send({ embeds: [embeddd] });
            }



            function list(min, max) {
                return adminslist.map(r => r)
                    .map((m, i) => i + 1 + ` - ${m.user.tag} (id: ${m.user.id})`)
                    .slice(min, max)
                    .join('\n');
            }

        }
    }
}