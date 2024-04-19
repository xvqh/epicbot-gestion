const db = require("quick.db")
module.exports = {
    name: 'presenceUpdate',

    run: async (client, oldPresence, newPresence) => {

        if (!oldPresence) return;
        let active = db.fetch(`${newPresence.guild.id}.soutien.active`)
        if (active == true) {

            if (newPresence.activities[0] && !newPresence.activities[0].state) return;
            let role = db.fetch(`${newPresence.guild.id}.soutien.role`)
            let statut = db.fetch(`${newPresence.guild.id}.soutien.statut`)
            if (role && statut && statut.length > 0) {
                role = newPresence.guild.roles.cache.get(role)
                if (!role) db.delete(`${newPresence.guild.id}.soutien.role`)
                if (role) {
                    let give = false
                    for (i in statut) {
                        if (newPresence.activities[0] && newPresence.activities[0].state.includes(statut[i])) give = true
                    }
                    if (give == true) {
                        if (!newPresence.member.roles.cache.some(r => r.id === role.id)) {
                            newPresence.member.roles.add(role.id, "[SOUTIEN]").catch((e) => console.log(e));
                        }
                    } else {
                        if (newPresence.member.roles.cache.some(r => r.id === role.id)) {
                            newPresence.member.roles.remove(role.id).catch((e) => console.log(e));
                        }
                    }
                }
            }
        }
    }
}