const db = require("quick.db")
const { MessageReaction, User, MessageEmbed } = require("discord.js");
const ms = require("ms")
module.exports = {
    name: 'interactionCreate',

    run: async (client, interaction) => {
        if (interaction && interaction.isButton()) {
            const button = interaction
            if (!button || !interaction.customId.startsWith("giveaway-")) return
            if (button.message.partial) await button.message.fetch();
            if (button.partial) await button.fetch();
            const member = button.member
            if (client.user.id === member.id) return;
            if (member) {
                let gwid = interaction.customId.slice(9)
                let giveaway = db.fetch(`${member.guild.id}.giveaway.${gwid}`)
                if (giveaway) {
                    if (giveaway.startdate + ms(giveaway.duration) > Date.now()) {
                        let size = db.fetch(`${member.guild.id}.participants-giveaway.${gwid}`)
                        if (size && size.includes(member.id)) {
                            interaction.reply({ content: `:heavy_minus_sign: Vous ne participez plus au giveaway !`, ephemeral: true });
                            const filtered = size.filter(e => e !== member.id);
                            db.set(`${member.guild.id}.participants-giveaway.${gwid}`, filtered);
                            return 
                        } else {
                            if (giveaway.vocal) if (!member.voice.channel) return interaction.reply({ content: `🔊 Vous devez être en vocal et y rester pour participer !`, ephemeral: true });
                            if (giveaway.role) if (!member.roles.cache.has(giveaway.role)) return interaction.reply({ content: `🔑 Vous devez avoir le rôle <@&${giveaway.role}> pour participer !`, ephemeral: true });
                            interaction.reply({ content: `:heavy_plus_sign: Vous participez désormais au giveaway !`, ephemeral: true });
                            db.push(`${member.guild.id}.participants-giveaway.${gwid}`, member.id)
                        }
                    } else {interaction.reply({ content: `:x: Le giveaway est terminé !`, ephemeral: true });
                return button.message.edit({components: []}).catch(e => console.log(e))}
                }
            }
        }
    }
}