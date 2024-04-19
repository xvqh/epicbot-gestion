const db = require("quick.db")
const Discord = require("discord.js")
var rslow = require('../../slow.js');
const { checkperm } = require("../../base/functions");
module.exports = {
  name: "addrole",
  description: "Ajoute un rôle au membre mentionné",
  aliases: ["add-role"],

  run: async (client, message, args, cmd) => {
    let perm = await checkperm(message,cmd.name)
    if (perm == true) {
      if (rslow.action[message.author.id] == true) return message.channel.send(`:x: Veuillez attendre avant d'effectuer une autre action !`)

      let member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.tag.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase())
      if (!member || member.bot) return message.channel.send(`:x: Utilisateur invalide !`)
      await message.guild.roles.fetch()
      let role = await message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(r => r.name.toLowerCase().includes(args.slice(1).join(" ").toLocaleLowerCase()))
      if (!role) return message.reply(`:x: Veuillez préciser un rôle valide`)
      const memberPosition = message.member.roles.highest.position;
      const authorPosition = role.position;
      if (authorPosition >= memberPosition) return message.reply(":x: Vous ne pouvez pas ajouter un rôle supérieur au votre !");
      if (role.permissions.has("ADMINISTRATOR")) return message.reply("[A LA DEMANDE DE LA COMMUNAUTE] :x: Vous ne pouvez pas ajouter un rôle ayant la permission administrateur !");
      member.roles.add(role).catch(e => { message.channel.send(e) })
      message.reply(`**${member.user.username}** a bien reçu le rôle \`${role.name}\` !`)
      rslow.action[message.author.id] = true;
      setTimeout(() => {
        rslow.action[message.author.id] = false;
      }, db.fetch(`${message.guild.id}.actionslow`));
      let logchannel = db.fetch(`${message.guild.id}.modlogs`)
      logchannel = message.guild.channels.cache.get(logchannel)
      if (logchannel) logchannel.send({
        embeds: [new Discord.MessageEmbed()
          .setColor(db.fetch(`${message.guild.id}.color`))
          .setDescription(`${message.author} a **ajouté le rôle** ${role} à ${member}`)]
      }).catch(e => { e })
    } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)
  }
}