const { checkperm } = require("../../base/functions");
const db = require('quick.db')
module.exports = {
    name: "dnd",
    description: "Modifie la présence en _ne pas déranger_",

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, "activity")
        if (perm == true) {

            db.set(`botpres`, "dnd")

            client.user.setStatus('dnd')
            message.reply(`Je suis maintenant en ne pas déranger !`)
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`activity\` !`)
    }

}