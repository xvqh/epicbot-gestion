const db = require("quick.db")
const Discord = require('discord.js');
var rslow = require('../../slow.js');
const { checkperm } = require("../../base/functions");
module.exports = {
  name: "mute",
  description: "Mute le membre mentionné du serveur",

  run: async (client, message, args, cmd) => {
    let perm = await checkperm(message,cmd.name)
    if (perm == true) {

      if (rslow.action[message.author.id] == true) return message.channel.send(`:x: Veuillez attendre avant d'effectuer une autre action !`)
      let member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.tag.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase())
      if (!member || member.user.bot) return message.channel.send(`:x: Utilisateur invalide !`)

      const memberPosition = member.roles.highest.position;
      const authorPosition = message.member.roles.highest.position;

      if (authorPosition > memberPosition) {

        let reason = args.slice(1).join(" ");

        member.timeout(2419200000, `${reason ? reason : ""}[${message.author.tag}]`).then(m => {
          message.reply(`**${m.user.username}** a été mute${reason ? ` pour \`\`${reason}\`\`` : ""} !`)
        }).catch(e => { })

        rslow.action[message.author.id] = true;
        setTimeout(() => {
          rslow.action[message.author.id] = false;
        }, db.fetch(`${message.guild.id}.actionslow`));
        let logchannel = db.fetch(`${message.guild.id}.modlogs`)
        logchannel = message.guild.channels.cache.get(logchannel)
        if (logchannel) logchannel.send({
          embeds: [new Discord.MessageEmbed()
            .setColor(db.fetch(`${message.guild.id}.color`))
            .setDescription(`${message.author} a **mute** ${member.toString()} pour${reason ? ` pour \`\`${reason}\`\`` : ""}`)]
        }).catch(e => { e })
      } else return message.reply(":x: Vous ne pouvez pas mute un membre avec un rôle supérieur au vôtre !");
    } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

  }
}