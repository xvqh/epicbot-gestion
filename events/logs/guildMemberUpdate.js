const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js')
const d = require("quick.db")
module.exports = {
    name: 'guildMemberUpdate',

    run: async (client, oldMember, newMember) => {
        try {
            if (oldMember.guild.me.permissions.has("VIEW_AUDIT_LOG")) {
                const fetchedLogs = await oldMember.guild.fetchAuditLogs({
                    limit: 1,
                    type: 'MEMBER_ROLE_UPDATE',
                }).catch(e => { return console.log(e) })

                const deletionLog = fetchedLogs.entries.first();
                if (!deletionLog) return console.log("no deletetion");

                /*PREVNAME
                
                if (oldMember.tag !== newMember.tag) {
                    database.query(`UPDATE user SET date = "${Date.now()}", prevnames = "${newMember.tag}" WHERE id = "${message.author.id}"`);
                    console.log(client.table1.get(`${newMember.id}.prevnames`))
                }*/
                if (oldMember.roles.cache.size < newMember.roles.cache.size) {

                    let newroles = null;
                    deletionLog.changes.forEach(r => {
                        newroles = r.new
                    });

                    const { executor } = deletionLog;
                    if (executor.id === client.user.id) return
                    if (newMember.permissions.has(`ADMINISTRATOR`) && !oldMember.permissions.has(`ADMINISTRATOR`)) {

                        let lologs = d.fetch(`${newMember.guild.id}.adminlogs`)
                        lologs = newMember.guild.channels.cache.get(lologs)
                        if (lologs) {
                            let button = new Discord.MessageButton().setStyle('DANGER').setCustomId('derank').setLabel("DERANK")
                            let button_row = new Discord.MessageActionRow().addComponents([button])
                            const embed = new MessageEmbed()
                                .setDescription(`Un rôle ayant la permissions administrateur a été ajouté\nJ'ai mentionné everyone car le rôle a les permissions administrateur !`)
                                .setTitle(`:warning: Permission administrateur ajoutée`)
                                .setColor(d.fetch(`${newMember.guild.id}.color`))
                                .addField(`:dagger: Modérateur:`, "```" + executor.tag + "```")
                                .addField(`:inbox_tray: Receveur:`, "```" + newMember.user.tag + "```")
                                .addField(`:information_source: Rôle(s) ajouté(s):`, "```" + newroles.map(r => r.name).join(", ") + "```")
                            lologs.send({ content: "@everyone", embeds: [embed], components: [button_row] }).then(msg => {
                                const collector = msg.createMessageComponentCollector({
                                    time: 150000
                                });

                                collector.on('collect', async (button) => {
                                    if (button.isButton()) {
                                        await button.deferUpdate();
                                        if (button.customId === 'derank') {
                                            try {
                                                if (executor.id !== newMember.guild.ownerId) {
                                                    if (newMember.user.id === newMember.guild.ownerId) {
                                                        return button.followUp({ content: `${executor} est l'owner du serveur, il ne peut pas être derank`, ephemeral: true })
                                                    }


                                                    if (newMember.roles.highest.position >= newMember.guild.me.roles.highest.position) {
                                                        return button.followUp({ content: `Je ne posséde pas assez de permission pour derank **${newMember.user.username}**`, ephemeral: true })
                                                    }
                                                    let exec = newMember.guild.members.cache.get(button.user.id)
                                                    if (exec) {
                                                        if (newMember.roles.highest.position >= exec.roles.highest.position) {
                                                            return button.followUp({ content: `Vous n'avez pas assez de permission pour derank **${newMember.user.username}**`, ephemeral: true })
                                                        } else return
                                                    }
                                                }
                                                newMember.roles.set([], `[antiadmin] by ${button.user.tag}`)

                                                const embed2 = new Discord.MessageEmbed()
                                                    .setColor(db.fetch(`${newMember.guild.id}.color`))
                                                    .setDescription(`${newMember.user} a bien été **derank** par \`${button.user.tag}\``)
                                                    .setColor('#5533FF')
                                                button.channel.send({ embeds: [embed2], ephemeral: true })
                                                msg.edit({ embeds: [embed], components: [] })
                                            } catch (error) {
                                                console.log(error)
                                            }


                                        }
                                    }
                                })
                            })
                        }
                    }

                    let difarr = d.fetch(`${newMember.guild.id}.blr`)
                    let allmemberlen = ""
                    if (difarr === null || difarr === undefined) return;
                    allmemberlen = difarr.length



                    for (let i = 0; i < allmemberlen; i++) {
                        if (difarr[i] === newMember.user.id) {

                            let difar = d.fetch(`${newMember.guild.id}.erole`)
                            if (difar === null || difar === undefined) {
                                for (let i = 0; i < newroles.length; i++) {
                                    newMember.roles.remove(newroles[i].id)
                                }
                            } else {
                                for (let l = 0; l < difar.length; l++) {
                                    for (let i = 0; i < newroles.length; i++) {
                                        if (difar[l] === newroles[i].id) return;
                                        newMember.roles.remove(newroles[i].id)
                                    }
                                }
                            }


                            const value = deletionLog;

                            if (value && value.executor) {



                                let logs = d.fetch(`${newMember.guild.id}.logs`)
                                logs = newMember.guild.channels.cache.get(logs)
                                if (logs) {
                                    const embed = new MessageEmbed()
                                        .setDescription(`Un rôle a été ajouté\nJe l'ai retiré car le membre est blacklist rank !`)
                                        .setTitle(`:warning: Rôle Ajouté`)
                                        .addField(`:dagger: Modérateur:`, "```" + executor.tag + "```")
                                        .addField(`:inbox_tray: Receveur:`, "```" + newMember.user.tag + "```")
                                        .addField(`:information_source: Rôle(s) ajouté(s):`, "```" + newroles.map(r => r.name).join(", ") + "```")
                                    logs.send({ embeds: [embed] })
                                }

                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
}