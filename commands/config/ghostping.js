const db = require("quick.db")
const { MessageEmbed } = require("discord.js")
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "ghostping",
    description: "Défini les salons de ghostping",
    aliases: ['ghost-ping', 'gp'],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message,cmd.name)
        if (perm == true) {
            if (args[0] && args[0].toLowerCase() === "list") {
                let gpchannels = db.fetch(`${message.guild.id}.ghostping`)
                for (i in gpchannels) {
                    let check = message.guild.channels.cache.get(gpchannels[i])
                    if (!check) {
                        const filtered = gpchannels.filter(e => e !== gpchannels[i]);
                        db.set(`${message.guild.id}.ghostping`, filtered);
                    }
                }
                message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(db.fetch(`${message.guild.id}.color`))
                        .setTitle(`Salons ghostping`)
                        .setDescription(`${gpchannels && gpchannels.length > 0 ? gpchannels.map(r => message.guild.channels.cache.get(r) ? `<#${r}>` : "").join("\n") : "Aucun salons"}\n\n_Refaites la commande \`ghostping\` en mentionnant le salon pour désactiver_`)
                        .setFooter({ text: `Les nouveaux membres seront ghostping dans ces salons` })]
                })
                return
            }
            let m = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.channel
            if (!m || m.type !== "GUILD_TEXT") return message.reply(`:x: Salon invalide !`)
            let actual = db.fetch(`${message.guild.id}.ghostping`)
            if (actual && actual.includes(m.id)) {
                const filtered = actual.filter(e => e !== m.id);
                db.set(`${message.guild.id}.ghostping`, filtered);
                return message.reply(`:balloon: <#${m.id}> n'est plus un salon ghostping !`)
            }
            db.push(`${message.guild.id}.ghostping`, m.id)
            return message.reply(`:balloon: <#${m.id}> est maintenant un salon ghostping !\n_Utilisez \`ghostping list\` pour voir tous les salons ghostping_`)


        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)
    }
}