const db = require("quick.db");
const { sanction, ownersend } = require("../../base/functions");
const Discord = require("discord.js")
module.exports = {
    name: 'roleUpdate',

    run: async (client, oldRole, newRole) => {
        let check = db.fetch(`${newRole.guild.id}.anti.roleupdate`)
        if (check === "max") {
        const entry = await newRole.guild.fetchAuditLogs({ limit: 1,type: 'roleUpdate' }).then(audit => audit.entries.first()).catch()
        
        if (entry.executor.id !== client.user.id) {
        if (!newRole.guild.me.permissions.has("VIEW_AUDIT_LOG") || !newRole.guild.me.permissions.has("MANAGE_ROLES")) {
            let logchannel = db.fetch(`${newRole.guild.id}.raidlogs`)
            logchannel = newRole.guild.channels.cache.get(logchannel)
            if (logchannel) logchannel.send({
                embeds: [new Discord.MessageEmbed()
                    .setColor(db.fetch(`${newRole.guild.id}.color`))
                    .setTitle(`📑 Modification d'un rôle`)
                    .setDescription(`Le rôle ${newRole} vient d'être modifié\n:warning: Je n'ai pas la permission VIEW_AUDIT_LOG ou MANAGE_ROLES, je n'ai donc pas pu agir`)]
            }).catch(e => { e })
        }
            let memberr = newRole.guild.members.cache.get(entry.executor.id)
            
            let sctn = db.fetch(`${newRole.guild.id}.punition.roleupdate`)
            if (!sctn) sctn = client.perms.antiraid.roleupdate
         
                if (!entry.executor) return
                let o = db.fetch(`bot.owner`)
                if (o && o.includes(entry.executor.id)) return
                if(oldRole.permissions !== newRole.permissions) newRole.setPermissions(oldRole.permissions)
                if(oldRole.name !== newRole.name) newRole.guild.roles.edit(newRole.id, { name: oldRole.name })
                if(oldRole.color !== newRole.color) newRole.guild.roles.edit(newRole.id, { color: oldRole.color })
                sanction(memberr, newRole.guild, sctn, `[automod] Anti-RoleUpdate`)
                let logchannel = db.fetch(`${newRole.guild.id}.raidlogs`)
                logchannel = newRole.guild.channels.cache.get(logchannel)
                if (logchannel) logchannel.send({
                    embeds: [new Discord.MessageEmbed()
                        .setColor(db.fetch(`${newRole.guild.id}.color`))
                        .setDescription(`${entry.executor} a été ${sctn ? `\`${isNaN(sctn) ? `${sctn}` : `Timeout [${sctn}sec]`}\`` : "sanctionné"} pour avoir modifié le rôle ${newRole} (je l'ai remodifié) !`)]
                }).catch(e => { e })
            }
            if (check === "on") {
                if (!entry.executor) return
                let o = db.fetch(`bot.owner`)
                if (o && o.includes(entry.executor.id)) return
                let oo = db.fetch(`${newRole.guild.id}.botwhitelist`)
                if (oo && oo.includes(newRole.author.id)) return
                if(oldRole.permissions !== newRole.permissions) newRole.setPermissions(oldRole.permissions)
                if(oldRole.name !== newRole.name) newRole.guild.roles.edit(newRole.id, { name: oldRole.name })
                if(oldRole.color !== newRole.color) newRole.guild.roles.edit(newRole.id, { color: oldRole.color })
                console.log("go 2")
                sanction(memberr, newRole.guild, sctn, `[automod] Anti-RoleUpdate`)
                let logchannel = db.fetch(`${newRole.guild.id}.raidlogs`)
                logchannel = newRole.guild.channels.cache.get(logchannel)
                if (logchannel) logchannel.send({
                    embeds: [new Discord.MessageEmbed()
                        .setColor(db.fetch(`${newRole.guild.id}.color`))
                        .setDescription(`${entry.executor} a été ${sctn ? `\`${isNaN(sctn) ? `${sctn}` : `Timeout [${sctn}sec]`}\`` : "sanctionné"} pour avoir modifié le rôle ${newRole} (je l'ai remodifié) !`)]
                }).catch(e => { e })
            }
        }
    }
}