const db = require("quick.db");
const { sanction, ownersend } = require("../../base/functions");
const Discord = require("discord.js")
module.exports = {
    name: 'roleCreate',

    run: async (client, role) => {
        if (!role.guild.me.permissions.has("VIEW_AUDIT_LOG") || !role.guild.me.permissions.has("MANAGE_ROLES")) {
            let logchannel = db.fetch(`${role.guild.id}.raidlogs`)
            logchannel = role.guild.channels.cache.get(logchannel)
            if (logchannel) logchannel.send({
              embeds: [new Discord.MessageEmbed()
                .setColor(db.fetch(`${role.guild.id}.color`))
                .setTitle(`📑 Création d'un rôle`)
                .setDescription(`Le rôle ${role} vient d'être créé\n:warning: Je n'ai pas la permission VIEW_AUDIT_LOG ou MANAGE_ROLES, je n'ai donc pas pu agir`)]
            }).catch(e => { e })
            return
        }
        const entry = await role.guild.fetchAuditLogs({ type: 'roleCreate' }).then(audit => audit.entries.first()).catch()
        if (entry.executor.id === client.user.id) return;
        let memberr = role.guild.members.cache.get(entry.executor.id)
        let check = db.fetch(`${role.guild.id}.anti.roleupdate`)
        let sctn = db.fetch(`${role.guild.id}.punition.roleupdate`)
        if(!sctn) sctn = client.perms.antiraid.roleupdate
        if (check === "max") {
            if (!entry.executor) return role.delete().catch()
            let o = db.fetch(`bot.owner`)
            if (o && o.includes(entry.executor.id)) return
            role.delete().catch(e => {})
            sanction(memberr, role.guild, sctn, `[automod] Anti-Rôle`)
            let logchannel = db.fetch(`${role.guild.id}.raidlogs`)
            logchannel = role.guild.channels.cache.get(logchannel)
            if (logchannel) logchannel.send({
                embeds: [new Discord.MessageEmbed()
                    .setColor(db.fetch(`${role.guild.id}.color`))
                    .setDescription(`${entry.executor} a été ${sctn ? `\`${isNaN(sctn) ? `${sctn}` : `Timeout [${sctn}sec]`}\`` : "sanctionné"} pour avoir créé le rôle \`${role.name}\` (je l'ai supprimé) !`)]
            }).catch(e => { e })
        }
        if (check === "on") {
            if (!entry.executor) return role.delete().catch()
            let o = db.fetch(`bot.owner`)
            if (o && o.includes(entry.executor.id)) return
            let oo = db.fetch(`${role.guild.id}.botwhitelist`)
            if (oo && oo.includes(role.author.id)) return
            role.delete().catch(e => {})
            sanction(memberr, role.guild, sctn, `[automod] Anti-Channel`)
            let logchannel = db.fetch(`${role.guild.id}.raidlogs`)
            logchannel = role.guild.channels.cache.get(logchannel)
            if (logchannel) logchannel.send({
                embeds: [new Discord.MessageEmbed()
                    .setColor(db.fetch(`${role.guild.id}.color`))
                    .setDescription(`${entry.executor} a été ${sctn ? `\`${isNaN(sctn) ? `${sctn}` : `Timeout [${sctn}sec]`}\`` : "sanctionné"} pour avoir créé le rôle \`${role.name}\` (je l'ai supprimé) !`)]
            }).catch(e => { e })
        }
    }
}