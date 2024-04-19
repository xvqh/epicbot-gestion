const db = require("quick.db");
const Discord = require("discord.js")
module.exports = {
    name: 'guildMemberUpdate',

    run: async (client, oldMember, newMember) => {
        if (!newMember.guild.me.permissions.has("VIEW_AUDIT_LOG")) return
        const entry = await newMember.guild.fetchAuditLogs({ type: 'MEMBER_ROLE_UPDATE' }).then(audit => audit.entries.first()).catch()
        if (!entry) return
        if (entry.executor.id === client.user.id) return;
        let newroles = null;
        entry.changes.forEach(r => {
            newroles = r.new
        });
        if (oldMember.roles.cache.size < newMember.roles.cache.size) {

            let logchannel = db.fetch(`${newMember.guild.id}.rolelogs`)
                logchannel = newMember.guild.channels.cache.get(logchannel)
                if (logchannel) logchannel.send({
                    embeds: [new Discord.MessageEmbed()
                        .setColor(db.fetch(`${newMember.guild.id}.color`))
                        .setDescription(`${entry.executor} a ajouté ${newroles && newroles.size > 0 ? "les rôles" : "le rôle"} \`${newroles.map(r => r.name).join(", ")}\` à ${newMember} !`)]
                }).catch(e => { e })
        } else if (oldMember.roles.cache.size > newMember.roles.cache.size){
            let logchannel = db.fetch(`${newMember.guild.id}.rolelogs`)
                logchannel = newMember.guild.channels.cache.get(logchannel)
                if (logchannel) logchannel.send({
                    embeds: [new Discord.MessageEmbed()
                        .setColor(db.fetch(`${newMember.guild.id}.color`))
                        .setDescription(`${entry.executor} a retiré ${newroles && newroles.size > 0 ? "les rôles" : "le rôle"} \`${newroles.map(r => r.name).join(", ")}\` à ${newMember} !`)]
                }).catch(e => { e })
        }
    }
}