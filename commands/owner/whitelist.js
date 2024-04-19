const db = require("quick.db")
const Discord = require("discord.js");
const { checkperm } = require("../../base/functions");
module.exports = {
  name: "whitelist",
  description: "Ajoute un membre à la whitelist",
  usage: "whtielist <@member/id>",
  aliases: ['wl'],

  run: async (client, message, args, cmd) => {

    try {
      let perm = await checkperm(message, cmd.name)
      if (perm == true) {
        const color = db.fetch(`${message.guild.id}.color`)
        if (args[0] === "clear") {
          db.delete(`${message.guild.id}.botwhitelist`)
          db.push(`${message.guild.id}.botwhitelist`, message.author.id)
          return message.reply(`:recycle: Les whitelist ont bien été clear !`)

        } else if (!args[0]) {
          let difarr = db.fetch(`${message.guild.id}.botwhitelist`)

          let finallb = ""
          let allmemberlen = ""
          if (!difarr || difarr.length < 1) { finallb = "Aucun whitelist" } else {
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
            .setTitle(`Voici la liste des whitelist`)
            .setDescription(finallb)
            .setColor(color)
            .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })

          return message.reply({ embeds: [owner], allowedMentions: { repliedUser: false } })

        } else {
          let m = message.mentions.members.first() || message.guild.members.cache.get(args[0])
          if (!m || m.bot) return message.channel.send(`Aucun membre trouvé pour: \`${args[0] || "rien"}\``)

          let difarr = db.fetch(`${message.guild.id}.botwhitelist`)

          let allmemberlen = ""
          if (difarr === null || difarr === undefined) {
            console.log(db.fetch(`${message.guild.id}.botwhitelist`))
            db.push(`${message.guild.id}.botwhitelist`, m.user.id)
            return message.channel.send(`:white_check_mark: ${m.user.username} est maintenant whitelist\n_Il ne sera pas affecté par les anti-raid sur \`on\`_`)

          } else {

            allmemberlen = difarr.length

            for (let i = 0; i < allmemberlen; i++) {

              if (m.user.id === difarr[i]) return message.channel.send(`${m.user.username} est déjà whitelist`)

            }
            db.push(`${message.guild.id}.botwhitelist`, m.user.id)
            return message.channel.send(`:white_check_mark: ${m.user.username} est maintenant whitelist\n_Il ne sera pas affecté par les anti-raid sur \`on\`_`)


          }
        }
      } else if(perm === false) if (!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)
    } catch (error) {
      console.log(error)
    }
  }
}