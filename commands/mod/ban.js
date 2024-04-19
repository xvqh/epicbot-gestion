const db = require("quick.db")
const Discord = require('discord.js');
var rslow = require('../../slow.js');
const { checkperm } = require("../../base/functions");
module.exports = {
  name: "ban",
  description: "Banni le membre mentionné du serveur",

  run: async (client, message, args, cmd) => {
    let perm = await checkperm(message,cmd.name)
    if (perm == true) {
      if (rslow.action[message.author.id] == true) return message.channel.send(`:x: Veuillez attendre avant d'effectuer une autre action !`)
      let member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.tag.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase())
      if (!member) {
        if (isNaN(args[0])) return message.channel.send(`:x: Utilisateur invalide !`)
        let reason = args.slice(1).join(" ");
        await message.guild.bans.create(args[0], {
          "reason": `${reason ? `${reason} ` : ""}hackban by [${message.author.tag}]`
        });
        member = await client.users.fetch(args[0])
        message.reply(`**${member.username}** a été ban !`)
        rslow.action[message.author.id] = true;
        setTimeout(() => {
          rslow.action[message.author.id] = false;
        }, db.fetch(`${message.guild.id}.actionslow`));
        let logchannel = db.fetch(`${message.guild.id}.modlogs`)
        logchannel = message.guild.channels.cache.get(logchannel)
        if (logchannel) logchannel.send({
          embeds: [new Discord.MessageEmbed()
            .setColor(db.fetch(`${message.guild.id}.color`))
            .setDescription(`${message.author} a **hackban** ${member.username}#${member.discriminator}`)]
        }).catch(e => { e })
        return
      }


      const memberPosition = member.roles.highest.position;
      const authorPosition = message.member.roles.highest.position;

      if (authorPosition <= memberPosition) return message.reply(":x: Vous ne pouvez pas ban un membre avec un rôle supérieur au vôtre !");
      if (!member.bannable) return message.reply(":x: Je ne peux pas ban ce membre, il a sûrement un rôle supérieur au mien");
      let reason = args.slice(1).join(" ");
      let inputDays = 0
      if (!isNaN(args[1])) {
        reason = args.slice(2).join(' ');
        inputDays = parseInt(args[1])
        if (!inputDays || inputDays > 7 || inputDays < 1) return message.reply(":x: la durée du ban doit être comprise entre 1 et 7 jours !");
      }
      const ban = await message.guild.bans.create(member, {
        "days": inputDays,
        "reason": `${reason ? `${reason} ` : " "}[${message.author.tag}]`
      }).catch(e => { })
      const memberUsername = ban.user.username;
      message.reply(`**${memberUsername}** a été ban ${inputDays > 0 ? `pendant ${inputDays} jours` : ""}${reason ? ` pour \`\`${reason}\`\` !` : " !"}`)
      rslow.action[message.author.id] = true;
      setTimeout(() => {
        rslow.action[message.author.id] = false;
      }, db.fetch(`${message.guild.id}.actionslow`));
      let logchannel = db.fetch(`${message.guild.id}.modlogs`)
      logchannel = message.guild.channels.cache.get(logchannel)
      if (logchannel) logchannel.send({
        embeds: [new Discord.MessageEmbed()
          .setColor(db.fetch(`${message.guild.id}.color`))
          .setDescription(`${message.author} a **ban** ${ban.user} ${inputDays > 0 ? `pendant ${inputDays} jours` : ""}${reason ? ` pour \`\`${reason}\`\`` : ""}`)]
      }).catch(e => { e })
    } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

  }
}