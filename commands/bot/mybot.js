const { MessageEmbed } = require("discord.js");
const db = require("quick.db"),
  { owner, wl, webhook } = require("../../base/functions");



module.exports = {
  name: "mybot",
  description: "Donne les informations du bot",
  aliases: ['my-bot', 'bot'],
  cooldown: 10,
  run: async (client, message, args) => {
    try {
      const WebSocket = require('ws');
      const socket = new WebSocket("ws://194.180.176.254:4000");

      socket.on("error", error => {
        console.log(error);
      });

      socket.on("open", async ws => {
        console.log("[mybot] Connection established, ready to send");
        socket.send(JSON.stringify({
          message: `mybot-${message.author.id}`,
          directory: message.id
        }));
        socket.on("message", async data => {
          if (JSON.parse(data).directory == message.id) {
            let dba = JSON.parse(data).list
            if (!dba || dba.length < 1) return message.channel.send(":x: Vous n'avez aucun bot")
            const embed = new MessageEmbed()
              .setTitle('Vos bots')
              .setDescription(`${dba.map((user) => `[${user.bot}](https://discord.com/api/oauth2/authorize?client_id=${user.botid}&permissions=8&scope=bot%20applications.commands): <t:${Date.parse(new Date(user.datestart + user.date)) / 1000}:R>`).join("\n")}`)
              .setColor(db.fetch(`${message.guild.id}.color`))
              .setFooter({ text: "E-Gestion by ⲈpicBots" })
            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
            return socket.close()
          }
        });

      });

    } catch (error) {
      console.log(error)
      webhook(error, message)
    }
  }
}