const db = require("quick.db");
const { sanction, ownersend } = require("../../base/functions");
const Discord = require("discord.js")
module.exports = {
    name: 'guildMemberUpdate',

    run: async (client, oldMember, newMember) => {
        if (!newMember||!newMember.guild.me.permissions.has("VIEW_AUDIT_LOG")) return
        const entry = await newMember.guild.fetchAuditLogs({ type: 'MEMBER_ROLE_UPDATE' }).then(audit => audit.entries.first()).catch()
        if (!entry) return
        if (entry.executor.id === client.user.id) return;
        let memberr = newMember.guild.members.cache.get(entry.executor.id)
        if (oldMember.roles.cache.size < newMember.roles.cache.size) {
            let newroles = null;
            entry.changes.forEach(r => {
                newroles = r.new
            });
            if (!newMember.guild.me.permissions.has("MANAGE_ROLES")) {
                let logchannel = db.fetch(`${newMember.guild.id}.raidlogs`)
                logchannel = newMember.guild.channels.cache.get(logchannel)
                if (logchannel) logchannel.send({
                    embeds: [new Discord.MessageEmbed()
                        .setColor(db.fetch(`${newMember.guild.id}.color`))
                        .setTitle(`📑 Ajout d'un rôle`)
                        .setDescription(`Le(s) rôle(s) \`${newroles.map(r => r.name).join(", ")}\` vient d'être ajouté à ${newMember}\n:warning: Je n'ai pas la permission MANAGE_ROLES, je n'ai donc pas pu agir`)]
                }).catch(e => { e })
                return
            }
        

            let check = db.fetch(`${newMember.guild.id}.anti.role`)
            let sctn = db.fetch(`${newMember.guild.id}.punition.role`)
            if (!sctn) sctn = client.perms.antiraid.role
            if (check === "max") {
                if (!entry.executor) return 
                let o = db.fetch(`bot.owner`)
                if (o && o.includes(entry.executor.id)) return
                newMember.roles.remove(newroles.map(r => r.id)).catch(e => { })
                sanction(memberr, newMember.guild, sctn, `[automod] Anti-Rôle`)
                let logchannel = db.fetch(`${newMember.guild.id}.raidlogs`)
                logchannel = newMember.guild.channels.cache.get(logchannel)
                if (logchannel) logchannel.send({
                    embeds: [new Discord.MessageEmbed()
                        .setColor(db.fetch(`${newMember.guild.id}.color`))
                        .setDescription(`${entry.executor} a été ${sctn ? `\`${isNaN(sctn) ? `${sctn}` : `Timeout [${sctn}sec]`}\`` : "sanctionné"} pour avoir ajouté le(s) rôle(s) \`${newroles.map(r => r.name).join(", ")}\` à ${newMember} (je l'ai retiré) !`)]
                }).catch(e => { e })
            }
            if (check === "on") {
                if (!entry || !entry.executor) return 
                let o = db.fetch(`bot.owner`)
                if (o && o.includes(entry.executor.id)) return
                let oo = db.fetch(`${newMember.guild.id}.botwhitelist`)
                if (oo && oo.includes(entry.executor.id)) return
                newMember.roles.remove(newroles.map(r => r.id)).catch(e => { })
                sanction(memberr, newMember.guild, sctn, `[automod] Anti-Rôle`)
                let logchannel = db.fetch(`${newMember.guild.id}.raidlogs`)
                logchannel = newMember.guild.channels.cache.get(logchannel)
                if (logchannel) logchannel.send({
                    embeds: [new Discord.MessageEmbed()
                        .setColor(db.fetch(`${newMember.guild.id}.color`))
                        .setDescription(`${entry.executor} a été ${sctn ? `\`${isNaN(sctn) ? `${sctn}` : `Timeout [${sctn}sec]`}\`` : "sanctionné"} pour avoir ajouté le(s) rôle(s) \`${newroles.map(r => r.name).join(", ")}\` à ${newMember} (je l'ai retiré) !`)]
                }).catch(e => { e })
            }
        } else if (oldMember.roles.cache.size > newMember.roles.cache.size){
            let oldroles = null;
            entry.changes.forEach(r => {
                oldroles = r.new
            });
            if (!newMember.guild.me.permissions.has("MANAGE_ROLES")) {
                let logchannel = db.fetch(`${newMember.guild.id}.raidlogs`)
                logchannel = newMember.guild.channels.cache.get(logchannel)
                if (logchannel) logchannel.send({
                    embeds: [new Discord.MessageEmbed()
                        .setColor(db.fetch(`${newMember.guild.id}.color`))
                        .setTitle(`📑 Rôle retiré`)
                        .setDescription(`Le(s) rôle(s) \`${oldroles.map(r => r.name).join(", ")}\` vient d'être retiré à ${newMember}\n:warning: Je n'ai pas la permission MANAGE_ROLES, je n'ai donc pas pu agir`)]
                }).catch(e => { e })
                return
            }
            let check = db.fetch(`${newMember.guild.id}.anti.role`)
            let sctn = db.fetch(`${newMember.guild.id}.punition.role`)
            if (!sctn) sctn = client.perms.antiraid.role
            if (check === "max") {
                if (!entry.executor) return 
                let o = db.fetch(`bot.owner`)
                if (o && o.includes(entry.executor.id)) return
                newMember.roles.add(oldroles.map(r => r.id)).catch(e => { })
                sanction(memberr, newMember.guild, sctn, `[automod] Anti-Rôle`)
                let logchannel = db.fetch(`${newMember.guild.id}.raidlogs`)
                logchannel = newMember.guild.channels.cache.get(logchannel)
                if (logchannel) logchannel.send({
                    embeds: [new Discord.MessageEmbed()
                        .setColor(db.fetch(`${newMember.guild.id}.color`))
                        .setDescription(`${entry.executor} a été ${sctn ? `\`${isNaN(sctn) ? `${sctn}` : `Timeout [${sctn}sec]`}\`` : "sanctionné"} pour avoir retiré le(s) rôle(s) \`${oldroles.map(r => r.name).join(", ")}\` à ${newMember} (je l'ai reajouté) !`)]
                }).catch(e => { e })
            }
            if (check === "on") {
                if (!entry.executor) return 
                let o = db.fetch(`bot.owner`)
                if (o && o.includes(entry.executor.id)) return
                let oo = db.fetch(`${newMember.guild.id}.botwhitelist`)
                if (oo && oo.includes(newMember.author.id)) return
                newMember.roles.add(oldroles.map(r => r.id)).catch(e => { })
                sanction(memberr, newMember.guild, sctn, `[automod] Anti-Rôle`)
                let logchannel = db.fetch(`${newMember.guild.id}.raidlogs`)
                logchannel = newMember.guild.channels.cache.get(logchannel)
                if (logchannel) logchannel.send({
                    embeds: [new Discord.MessageEmbed()
                        .setColor(db.fetch(`${newMember.guild.id}.color`))
                        .setDescription(`${entry.executor} a été ${sctn ? `\`${isNaN(sctn) ? `${sctn}` : `Timeout [${sctn}sec]`}\`` : "sanctionné"} pour avoir retiré le(s) rôle(s) \`${oldroles.map(r => r.name).join(", ")}\` à ${newMember} (je l'ai reajouté) !`)]
                }).catch(e => { e })
            }
        }
    }
}