const { checkperm } = require("../../base/functions");
const db = require('quick.db')
module.exports = {
    name: "idle",
    description: "Modifie la présence en _inactif_",

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, "activity")
        if (perm == true) {
            db.set(`botpres`, "idle")

            client.user.setStatus('idle')
            message.reply(`Je suis maintenant inactif !`)
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`activity\` !`)
    }

}