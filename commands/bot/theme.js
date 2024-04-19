
const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "theme",
    description: "Change le couleur des embeds du bot",
    aliases: ["embedcolor", "thème"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message,cmd.name)
        if (perm == true) {
            if (!args[0]) return message.reply(":x: Vous n'avez pas précisé de couleur !")
            let embed
            try {
             embed = new Discord.MessageEmbed()
                .setTitle("Les embeds seront désormais de cette couleur")
                .setDescription(`L'embed n'a pas de couleur ? C'est ta faute, pas la nôtre :/\nCliques [ici](https://htmlcolorcodes.com/fr/) pour voir toutes les couleurs !`)
                .setColor(args[0])
            } catch {
                return message.channel.send(":x: Cette couleur n'existe pas !")
            }
            let button_next = new Discord.MessageButton().setStyle('PRIMARY').setCustomId('cancel').setEmoji("❌")
            let button_reset = new Discord.MessageButton().setStyle('PRIMARY').setCustomId('reset').setEmoji("♻️")
            let button_back = new Discord.MessageButton().setStyle('PRIMARY').setCustomId('valid').setEmoji("✔️")
            let button_row = new Discord.MessageActionRow().addComponents([button_back, button_reset, button_next])
            message.reply({ embeds: [embed], components: [button_row] }).then(msg => {
                const collector = msg.createMessageComponentCollector({
                    componentType: "BUTTON",
                    time: 60000
                })
                collector.on("collect", async (i) => {
                    if (i.user.id !== message.author.id) return i.reply({ content: "Désolé, mais vous n'avez pas la permission d'utiliser ces boutons !", ephemeral: true }).catch(() => { })
                    await i.deferUpdate()

                    if (i.customId === 'valid') {
                        message.channel.send(`:white_check_mark: La couleur des embed a bien été modifiée !`)
                        db.set(`${message.guild.id}.color`, args[0])
                    }
                    if (i.customId === 'reset') {
                        message.channel.send(`♻️ La couleur des embed a bien été reset !`)
                        db.set(`${message.guild.id}.color`, client.config.color)
                    }
                    if (i.customId === 'cancel') {
                        message.channel.send(`:white_check_mark: Action annulée !`)
                    }
                    collector.stop()
                })
                collector.on("end", async () => {
                    return msg.edit({ components: [] }).catch(() => { })
                })
            })

        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    }
}