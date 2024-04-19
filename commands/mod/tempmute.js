const db = require("quick.db")
const Discord = require('discord.js');
var rslow = require('../../slow.js');
const { checkperm } = require("../../base/functions");
const ms = require("ms")
module.exports = {
  name: "tempmute",
  description: "Mute temporairement le membre mentionné du serveur",
  aliases: ["temp-mute", "tmute"],

  run: async (client, message, args, cmd) => {
    let perm = await checkperm(message,cmd.name)
    if (perm == true) {
      if (rslow.action[message.author.id] == true) return message.channel.send(`:x: Veuillez attendre avant d'effectuer une autre action !`)
      let member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.tag.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase())
      if (!member || member.user.bot) return message.channel.send(`:x: Utilisateur invalide !`)

      const memberPosition = member.roles.highest.position;
      const authorPosition = message.member.roles.highest.position;

      if (authorPosition <= memberPosition) return message.reply(":x: Vous ne pouvez pas tempmute un membre avec un rôle supérieur au vôtre !");

      if (!args[1] || !args[1].endsWith("h") && !args[1].endsWith("m") && !args[1].endsWith("d") && !args[1].endsWith("s") || !args[1].match(/^\d/)) return message.channel.send(`:timer: Merci de préciser un format de temps valide! (m/h/d)`)
      let duree = ms(args[1])
      let reason = args.slice(2).join(" ");

      member.timeout(duree, `${reason ? `${reason} ` : ""}[${message.author.tag}]`).then(m => {
        message.reply(`**${m.user.username}** a bien été tempmute pendant \`${args[1]}\` !`)
      })
        .catch(e => {
          console.log(e)
          message.reply(`**ERREUR**: Je n'ai pas pu le timeout`)
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
          .setDescription(`${message.author} a **tempmute** ${member.toString()} pendant \`${args[1]}\`${reason ? ` pour \`\`${reason}\`\`` : ""}`)]
      }).catch(e => { e })
    } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

  }
}