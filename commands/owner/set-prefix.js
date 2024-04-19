const db = require("quick.db");
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "set-prefix",
    description: "Modifie le prefix du bot",
    aliases: ['setprefix'],
    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, cmd.name)
        if (perm == true) {
            if (args.length) {
                let str_content = args.join(" ")
                db.set(`prefix.${message.guild.id}`, str_content)
                message.channel.send(`:white_check_mark: Vous avez défini le préfix de ce serveur en \`${str_content}\` `);
            } else {
                message.channel.send(`:white_check_mark: Vous n'avez fournie aucune valeur, veuillez refaire la commande en incluant un prefix.`);
            }

        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)



    }


}