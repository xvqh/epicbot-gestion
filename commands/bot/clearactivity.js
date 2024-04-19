const { checkperm } = require("../../base/functions");
const db = require('quick.db')
module.exports = {
    name: "clearactivity",
    description: "Retire le contenu du statut",

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, "activity")
        if (perm == true) {
            db.set(`botactivity`, null)
            db.set(`bottype`, null)
            client.user.setActivity(null)
            client.user.setStatus('online')
            message.reply(`Je n'ai plus de statut !`)
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`activity\` !`)
    }

}