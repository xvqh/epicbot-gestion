const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "antijoin",
    description: "Configure l'antijoin dans un salon",
    aliases: ["aj-config", "anti-join"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message,cmd.name)
        if (perm == true) {
            let channel = message.member.voice.channel;
            if(!args[0]){
                return message.reply({ embeds: [new Discord.MessageEmbed()
                    .setColor(db.fetch(`${message.guild.id}.color`))
                    .setTitle(`Voici les commandes anti-join`)
                    .setDescription(`\`antijoin on\` : Active l'anti-join dans le salon actuel\n\`antijoin off\` : Désactive l'anti-join dans le salon actuel\n\`antijoin add <@member>\` : Autorise un membre à rejoindre votre salon antijoin\n\`antijoin remove <@member>\` : Retire la permission à un membre pouvant rejoindre`)
                    .setFooter({ text: `Pour un anti-join de longue durée utiliser le bot VoiceManager` })]
                }).catch(e => { e })
            }
            if (!channel) return message.channel.send(":x: Vous n'êtes pas en vocal !");
            if (args[0] === "on") {
                let kaka = db.fetch(`${message.guild.id}.antijoin_${channel.id}`)
                if (!kaka || kaka.length <1) {
                db.push(`${message.guild.id}.antijoin_${channel.id}`, message.author.id)
                db.set(`${message.guild.id}.antijoinowner_${channel.id}`, message.author.id)
                message.reply(`L'antijoin a bien été activé dans votre salon !\n_Pour le désactiver faites \`antijoin off\` ou quittez simplement le vocal_`)
            } else return message.reply(`:x: Ce salon est déjà configuré comme anti-join !`)
            }
            if (args[0] === "off") {
                let kaka = db.fetch(`${message.guild.id}.antijoin_${channel.id}`)
                if (kaka) {
                let check = db.fetch(`${message.guild.id}.antijoin_${channel.id}`)
                if (check.includes(message.author.id) || b && b.includes(message.author.id)) {
                    db.delete(`${message.guild.id}.antijoin_${channel.id}`)
                    message.reply(`L'antijoin a bien été désactivé de votre salon !`)
                } else return message.reply(`:x: Ce n'est pas votre salon`)
            } else return message.reply(`:x: Ce salon n'est pas configuré comme anti-join !`)
            }
            if (args[0] === "add") {
                let kaka = db.fetch(`${message.guild.id}.antijoin_${channel.id}`)
                if (kaka) {
                    let check = db.fetch(`${message.guild.id}.antijoinowner_${channel.id}`)
                    if (check && check === message.author.id || b && b.includes(message.author.id)) {
                        let member = await message.mentions.members.first() || message.guild.members.cache.get(args[1])
                        if (!member || member.user.id === message.author.id) return message.channel.send(`:x: Utilisateur invalide !`)
                        db.push(`${message.guild.id}.antijoin_${channel.id}`, member.user.id)
                        message.reply(`**${member.user.username}** peut désormais rejoindre votre salon !`)

                    } else return message.reply(`:x: Vous n'êtes pas propriétaire du salon (proprio: <@${check}>)`)
                } else return message.reply(`:x: Ce salon n'est pas configuré comme anti-join !\n_Utilisez \`antijoin on\` !_`)
            }
            if (args[0] === "remove") {
                let kaka = db.fetch(`${message.guild.id}.antijoin_${channel.id}`)
                if (kaka) {
                    let check = db.fetch(`${message.guild.id}.antijoinowner_${channel.id}`)
                    if (check && check === message.author.id || b && b.includes(message.author.id)) {
                        let member = await message.mentions.members.first() || message.guild.members.cache.get(args[1])
                        if (!member || member.user.id === message.author.id) return message.channel.send(`:x: Utilisateur invalide !`)
                        let members = db.fetch(`${message.guild.id}.antijoin_${channel.id}`)
                        if (members && members.includes(member.user.id)) {
                            const filtered = members.filter(e => e !== member.user.id);
                            db.set(`${message.guild.id}.antijoin_${channel.id}`, filtered);
                            message.reply(`**${member.user.username}** ne peut plus rejoindre votre vocal !`)
                            if (member.voice) member.voice.setChannel(null, "Anti-Join by " + message.author.tag);
                        } else message.reply(`:x: Le membre n'avait pas accès à votre salon`)
                    } else return message.reply(`:x: Vous n'êtes pas propriétaire du salon (proprio: <@${check}>)`)
                } else return message.reply(`:x: Ce salon n'est pas configuré comme anti-join !\n_Utilisez \`antijoin on\` !_`)
            }
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    }
}