const db = require("quick.db")
const { checkperm } = require("../../base/functions");
module.exports = {
        name: "unwhitelist",
        description: "Retire un membre de la whitelist",
        usage: "unwhitelist <@member/id>",
        aliases: ["unwl"],
    run: async (client, message, args, cmd) => {
        try {
            let perm = await checkperm(message,cmd.name)
            if (perm == true) {
                let id
                if (isNaN(args[0])) {
                    let m = message.mentions.users.first()
                    if (!m || m.bot) return message.channel.send(`Aucun membre trouvé pour: \`${args[0] || "rien"}\``)
                    id = m.id
                } else {
                    if (args[0].length < 18 || isNaN(args[0])) return message.channel.send(`Aucun membre trouvé pour: \`${args[0] || "rien"}\``)
                    id = args[0]
                }
                let difarr = db.fetch(`${message.guild.id}.botwhitelist`)
                let allmemberlen = ""
                let mm = client.users.cache.get(id)
                if (difarr !== null || difarr !== undefined) {
                    allmemberlen = difarr.length
                    for (let i = 0; i < allmemberlen; i++) {
                        console.log(difarr[i])
                        if (id === difarr[i]) {
                            const filtered = difarr.filter(e => e !== id);
                            db.set(`${message.guild.id}.botwhitelist`, filtered);
                            return message.channel.send(`${mm ? mm.username : `<@${id}>`} n'est plus whitelist`)
                        }
                    }
                }
                return message.channel.send(`${mm.username} n'est pas dans la liste des whitelist`)
            } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)
        } catch (error) {
            console.log(error)
        }
    }
}