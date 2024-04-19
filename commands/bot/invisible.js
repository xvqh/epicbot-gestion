const { checkperm } = require("../../base/functions");
const db = require('quick.db')
module.exports = {
    name: "invisible",
    description: "Modifie la présence en _invisible_",

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, "activity")
        if (perm == true) {
            let type = db.fetch(`bottype`)
            if (!type) type = "WATCHING"
            let content = db.fetch(`botactivity`)
            if (!content) content = client.config.statut
            db.set(`botpres`, "invisible")

            client.user.setStatus('invisible')
            message.reply(`Je suis maintenant invisible !`)
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`activity\` !`)
    }

}