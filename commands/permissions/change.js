const db = require("quick.db")
const Discord = require("discord.js")
var { permsize } = require("../../config")
const { checkperm } = require("../../base/functions");
var { defaultperm } = require("../../perm.json")
module.exports = {
    name: "change",
    description: `Permets de configurer une commande sur un/des rôle(s)`,
    usage: "change <command> <perm>",
    aliases: ["changes"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message,cmd.name)
        if (perm == true) {
            let command = args[0]
            let cmds = []
            for (i in defaultperm) {
                cmds.push(defaultperm[i].name)
            }
            if (command && cmds.includes(command.toLowerCase())) {
                if (!args[1]) return message.reply(`:x: Veuillez préciser le numéro de nouvelle permission`)
                if (isNaN(args[1]) && (args[1].toLowerCase() === "owner" || args[1].toLowerCase() === "buyer")) {
                    db.set(`${message.guild.id}.change.${command}`, args[1].toLowerCase())
                    return message.reply({
                        embeds: [new Discord.MessageEmbed()
                            .setColor(db.fetch(`${message.guild.id}.color`))
                            .setDescription(`📖 la commande \`${command}\` est désormais accessible dès la permission \`${args[1].toLowerCase()}\` !`)]
                    })
                } else {

                    if (parseInt(args[1]) >= 0 && parseInt(args[1]) <= permsize) {
                        db.set(`${message.guild.id}.change.${command}`, parseInt(args[1]))
                        return message.reply({
                            embeds: [new Discord.MessageEmbed()
                                .setColor(db.fetch(`${message.guild.id}.color`))
                                .setDescription(`📖 la commande \`${command}\` est désormais accessible dès la permission \`${args[1]}\` !`)]
                        })
                    } else return message.reply(`:x: Permission invalide (1 < ${permsize})`)
                }
            } else message.reply(`:x: Commande invalide`)
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)
    }
}