const db = require("quick.db");
const config = require("../../config")
var { defaultperm } = require("../../perm.json")
const { ownersend } = require("../../base/functions");
module.exports = {
    name: 'guildCreate',

    run: async (client, guild) => {
        const entry = await guild.fetchAuditLogs({ type: 'BOT_ADD' }).then(audit => audit.entries.first())
        db.set(`prefix.${guild.id}`, config.prefix)
        db.set(`${guild.id}.color`, config.color)
        let cmds = defaultperm
        for (i in cmds) {
            let check = db.fetch(`${guild.id}.change.${defaultperm[i].name}`)
            if (!check) {
                db.set(`${guild.id}.change.${defaultperm[i].name}`, defaultperm[i].perm)
            }
        }

        let owner = config.owners

        if (client.guilds.cache.size > config.max_guild) {
            if (!owner) return;
            ownersend(client, `Vous ne pouvez plus ajouter votre bot dans des serveurs il atteind le quota maximum de ${max_guild}`)
            return guild.leave()
        }
        const guildMember = await guild.members.fetch();
        let owners = db.get('bot.owner')
        let check = false
        if (owners === null || owners === undefined) { check = false } else {
            for (let i = 0; i < owners.length; i++) {
                if (owners === null) continue;
                if (guildMember.has(owners[i])) check = true
            }
        }
        let guildOwnerTag = await guild.fetchOwner().then((member) => member.user.tag);
        if (check !== true) {
            ownersend(client, `J'ai leave ${guild.name} (${guild.memberCount} membres, propriétaire : ${guildOwnerTag}) , car aucun owner n'est présent sur le serveur`);
            return guild.leave();
        }

        guildOwnerTag = await guild.fetchOwner().then((member) => member.user.tag);
        ownersend(client, `Je viens d'être ajouté sur ${guild.name} par ${entry.executor ? entry.executor.tag : "_aucune donnée_"} (${guild.memberCount} membres, propriétaire : ${guildOwnerTag})`)


    }
};
