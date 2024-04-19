const db = require("quick.db")
const { MessageEmbed } = require("discord.js")
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "piconly",
    description: "Défini les salons pour les images uniquement",
    aliases: ['pic-only', 'onlypic'],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message,cmd.name)
        if (perm == true) {
            if (args[0] && args[0].toLowerCase() === "list") {
                let gpchannels = db.fetch(`${message.guild.id}.piconly`)
                for (i in gpchannels) {
                    let check = message.guild.channels.cache.get(gpchannels[i])
                    if (!check) {
                        const filtered = gpchannels.filter(e => e !== gpchannels[i]);
                        db.set(`${message.guild.id}.piconly`, filtered);
                    }
                }
                message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(db.fetch(`${message.guild.id}.color`))
                        .setTitle(`Salons piconly`)
                        .setDescription(`${gpchannels && gpchannels.length > 0 ? gpchannels.map(r => message.guild.channels.cache.get(r) ? `<#${r}>` : "").join("\n") : "Aucun salons"}\n\n_Refaites la commande \`ghostping\` en mentionnant le salon pour désactiver_`)
                        .setFooter({ text: `Je supprimerai dans ces salons les messages ne contenant pas d'images` })]
                })
                return
            }
            let m = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.channel
            if (!m || m.type !== "GUILD_TEXT") return message.reply(`:x: Salon invalide !`)
            let actual = db.fetch(`${message.guild.id}.piconly`)
            if (actual && actual.includes(m.id)) {
                const filtered = actual.filter(e => e !== m.id);
                db.set(`${message.guild.id}.piconly`, filtered);
                return message.reply(`📷 <#${m.id}> n'est plus un salon piconly !`)
            }
            db.push(`${message.guild.id}.piconly`, m.id)
            return message.reply(`📷 <#${m.id}> est maintenant un salon piconly !\n_Utilisez \`piconly list\` pour voir tous les salons piconly_`)


        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)
    }
}