const db = require("quick.db")
const Discord = require("discord.js");
module.exports = {
    name: "owner",
    description: "Ajoute un membre aux owner",
    aliases: ['owner-add'],

  run: async (client, message, args) => {

    try {
      const founder = client.config.owners
      if (founder.includes(message.author.id)) {
        const color = db.fetch(`${message.guild.id}.color`)
        if (args[0] === "clear") {
          db.delete(`bot.owner`)
          db.push(`bot.owner`, message.author.id)
          return message.reply(`:recycle: Les owner ont bien été clear !`)

        } else if (!args[0]) {
          let difarr = db.fetch(`bot.owner`)

          let finallb = ""
          let allmemberlen = ""
          if (difarr === null || difarr === undefined) { finallb = "Aucun owner" } else {
            allmemberlen = difarr.length
            let people = 0;
            let peopleToShow = 31;

            let mes = [];

            for (let i = 0; i < allmemberlen; i++) {
              if (difarr === null) continue;
              let g = client.users.cache.get(difarr[i])

              if (!g) {
                g = `<@${difarr[i]}> (id: ${difarr[i]})`
              } else {
                g = `<@${difarr[i]}>`
              }
              mes.push({
                name: g
              });
            }

            const realArr = []
            for (let k = 0; k < mes.length; k++) {
              people++
              if (people >= peopleToShow) continue;
              realArr.push(`${k + 1}) ${mes[k].name}`);
            }
            finallb = realArr.join("\n")
            let p = 1000 - mes.length;
            if (p < 0) {
              p = p * (-1);
            }
          }
          let owner = new Discord.MessageEmbed()
          .setColor(db.fetch(`${message.guild.id}.color`))
            .setTitle(`Voici la liste des owners`)
            .setDescription(finallb)
            .setColor(color)
            .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })

          return message.reply({ embeds: [owner], allowedMentions: { repliedUser: false } })

        } else {
          let m = message.mentions.members.first() || message.guild.members.cache.get(args[0])
          if (!m || m.bot) return message.channel.send(`Aucun membre trouvé pour: \`${args[0] || "rien"}\``)

          let difarr = db.fetch(`bot.owner`)
          let allmemberlen = ""
          if (difarr === null || difarr === undefined) {
            db.push(`bot.owner`, m.user.id)
            return message.channel.send(`:white_check_mark: ${m.user.username} est maintenant owner du bot`)

          } else {

            allmemberlen = difarr.length

            for (let i = 0; i < allmemberlen; i++) {

              if (m.user.id === difarr[i]) return message.channel.send(`${m.user.username} est déjà owner`)

            }
            db.push(`bot.owner`, m.user.id)
            return message.channel.send(`:white_check_mark: ${m.user.username} est maintenant owner du bot`)


          }
        }
      } return message.reply(`:x: Vous devez être propriétaire du bot !`)
    } catch (error) {
      console.log(error)
    }
  }
}