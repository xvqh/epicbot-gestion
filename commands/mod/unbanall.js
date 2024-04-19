const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
var rslow = require('../../slow.js');

module.exports = {
  name: "unbanall",
  description: "Unban tous les membres banni",
  aliases: ["unban-all"],

  run: async (client, message, args, cmd) => {
    let perm = await checkperm(message, cmd.name)
    if (perm == true) {
      if (rslow.action[message.author.id] == true) return message.channel.send(`:x: Veuillez attendre avant d'effectuer une autre action !`)
      let size = 0
      let count = 0
      message.guild.bans.fetch().then(async bans => {
        size = bans.size
        message.reply(`Je suis en train de unban ${size} utilisateurs...`)
        await bans.forEach(ban => {
          count++
          message.guild.members.unban(ban.user.id).catch()
          if (count === size) message.channel.send(`${size} utilisateurs ont été débanni !`)
        });
      })
      rslow.action[message.author.id] = true;
      setTimeout(() => {
        rslow.action[message.author.id] = false;
      }, db.fetch(`${message.guild.id}.actionslow`));
      let logchannel = db.fetch(`${message.guild.id}.modlogs`)
      logchannel = message.guild.channels.cache.get(logchannel)
      if (logchannel) logchannel.send({
        embeds: [new Discord.MessageEmbed()
          .setColor(db.fetch(`${message.guild.id}.color`))
          .setDescription(`${message.author} a **unbanall** ${size} membres !`)]
      }).catch(e => { e })
    } else if(perm === false) if (!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)
  }
}