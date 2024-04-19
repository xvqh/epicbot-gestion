const { checkperm } = require("../../base/functions");
const db = require('quick.db')
module.exports = {
    name: "set",
    description: "Modifie l'apparence du bot (name/pic)",
    usage: "set <name/pic> <new>",

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, "setprofil")
        if (perm == true) {
            if (args[0]) {
                if (args[0].toLowerCase() === "name") {
                    if (!args[1] || message.attachments.size > 0) return message.reply(":x: Vous devez préciser un nouveau pseudo !")
                    if (args.slice(1).join(" ").length > 35) return message.reply(":x: Le pseudo est trop long !")

                    client.user.setUsername(args.slice(1).join(" ")).then(async () => {
                        message.reply(`:white_check_mark: Je m'appelle désormais \`${args.slice(1).join(" ")}\` !`)
                    }).catch(async (err) => {
                        return message.reply(`:warning: Je n'ai pas pu modifier mon pseudo, Discord m'en empêche...\nPatiente un peu !`)
                    })

                }
                if (args[0].toLowerCase() === "pic" || args[0].toLowerCase() === "avatar") {
                    console.log(message.attachments.size)
                    if (message.attachments.size > 0 || args[1]) {
                        let url
                        if (message.attachments.size > 0) { url = message.attachments.first().url } else url = args[1]
                        client.user.setAvatar(url).then(async () => {
                            message.reply(`:white_check_mark: J'ai changé mon image de profil !`)
                        }).catch(async (err) => {
                            return message.reply(`:warning: Je n'ai pas pu modifier mon image de profil, Discord m'en empêche...\nPatiente un peu !`)
                        })
                    } else return message.reply(":x: Vous devez préciser une nouvelle image de profil !")
                }
            } else message.reply(`:x: Vous devez préciser ce que vous souhaitez modifier (\`name\`/\`pic\`) !`)
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`setprofil\` !`)
    }

}