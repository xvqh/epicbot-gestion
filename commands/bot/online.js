const { checkperm } = require("../../base/functions");
const db = require('quick.db')
module.exports = {
    name: "online",
    description: "Modifie la présence en _en ligne_",

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, "activity")
        if (perm == true) {
            db.set(`botpres`, "online")

            client.user.setStatus('online')
            message.reply(`Je suis maintenant online !`)
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`activity\` !`)
    }

}