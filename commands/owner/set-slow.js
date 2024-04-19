const db = require("quick.db")
const ms = require("ms")
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "set-slow",
    description: "Modifie le temps entre les différentes actions",
    aliases: ["setslow"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, cmd.name)
        if (perm == true) {
            let dure = args[0]
            if (!dure || !dure.endsWith("s") && !dure.endsWith("m") || !dure.match(/^\d/)) return message.channel.send(`:timer: Merci de préciser un format de temps valide! (s/m)`)
            dure = ms(dure)

            db.set(`${message.guild.id}.actionslow`, dure)
            message.reply(`:white_check_mark: Le temps entre chaque action est maintenant de ${args[0]} !`)

        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)
    }
}