const db = require("quick.db");
module.exports = {
    name: 'guildMemberAdd',

    run: async (client, member) => {
        if (member.user.bot) return
        let gpchannels = db.fetch(`${member.guild.id}.ghostping`)
        for (i in gpchannels) {
            let check = member.guild.channels.cache.get(gpchannels[i])
            if (check) {
                setTimeout(async () => {
                    if(member) check.send({ content: `<@${member.id}>` }).then(m => { setTimeout(async () => { m.delete().catch(e => { }) }, 1500) }).catch(e =>{})
                }, 1500)
            }
        }
    }
}