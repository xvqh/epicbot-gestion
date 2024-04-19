const db = require("quick.db")
const Discord = require('discord.js');
var rslow = require('../../slow.js');
const { checkperm } = require("../../base/functions");
module.exports = {
  name: "unban",
  description: "Retire le ban d'un membre banni du serveur",

  run: async (client, message, args, cmd) => {
    let perm = await checkperm(message,cmd.name)
    if (perm == true) {
      if (rslow.action[message.author.id] == true) return message.channel.send(`:x: Veuillez attendre avant d'effectuer une autre action !`)
      let member = await args[0]
      if (!member) return message.channel.send(`:x: Veuillez préciser une ID ou un pseudo valide !`)


      let bannedMemberInfo = await message.guild.bans.fetch()

      let bannedMember = bannedMemberInfo.find(b => b.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || bannedMemberInfo.get(args[0]) || bannedMemberInfo.find(bm => bm.user.tag.toLowerCase() === args[0].toLocaleLowerCase());
      if (!bannedMember) return message.reply(":x: Cette utilisateur n'est pas ban !")
      message.guild.members.unban(bannedMember.user.id)
      message.reply(`**${bannedMember.user.username + `#` + bannedMember.user.discriminator}** a été unban !`)
      rslow.action[message.author.id] = true;
      setTimeout(() => {
        rslow.action[message.author.id] = false;
      }, db.fetch(`${message.guild.id}.actionslow`));
      let logchannel = db.fetch(`${message.guild.id}.modlogs`)
      logchannel = message.guild.channels.cache.get(logchannel)
      if (logchannel) logchannel.send({
        embeds: [new Discord.MessageEmbed()
          .setColor(db.fetch(`${message.guild.id}.color`))
          .setDescription(`${message.author} a **unban** ${bannedMember.user.toString()}`)]
      }).catch(e => { e })
    } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

  }
}