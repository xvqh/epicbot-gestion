const { checkperm } = require("../../base/functions");
const db = require('quick.db')
module.exports = {
    name: "playto",
    description: "Modifie le statut en _joue à_",
    aliases: ["play"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, "activity")
        if (perm == true) {
            let content = args.join(" ")
            if(!content) return message.reply("Veuillez préciser le contenu du statut !")
            db.set(`bottype`, "PLAYING")
            db.set(`botactivity`, content)
            client.user.setActivity(content, { type: "PLAYING", url: "https://www.twitch.tv/coinsbot" })
            message.reply(`Je joue maintenant à \`${content}\` !`)
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`activity\` !`)
    }

}