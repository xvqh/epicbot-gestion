const db = require("quick.db")
const Discord = require('discord.js');
var rslow = require('../../slow.js');
const { checkperm } = require("../../base/functions");
module.exports = {
  name: "delwarn",
  description: "Supprime le warn du membre mentionné",

  run: async (client, message, args, cmd) => {
    let perm = await checkperm(message,cmd.name)
    if (perm == true) {
      if (rslow.action[message.author.id] == true) return message.channel.send(`:x: Veuillez attendre avant d'effectuer une autre action !`)
      let member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.tag.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase())
      if (!member || member.bot) return message.channel.send(`:x: Utilisateur invalide !`)

      const memberPosition = member.roles.highest.position;
      const authorPosition = message.member.roles.highest.position;

      if (authorPosition <= memberPosition) return message.reply(":x: Vous ne pouvez pas delwarn un membre avec un rôle supérieur au vôtre !");
      const sanctions = db.fetch(`${message.guild.id}.${member.user.id}.warns`)
      let number = args[1]
      if (!number || number !== "all" && isNaN(number)) return message.reply(`:x: Veuillez précisez le numéro de la sanction à supprimer !`)
      if (number === "all") {
        db.delete(`${message.guild.id}.${member.user.id}.warns`)
        message.reply(`**${member.user.username}** a perdu tous ses warns !`)


        rslow.action[message.author.id] = true;
        setTimeout(() => {
          rslow.action[message.author.id] = false;
        }, db.fetch(`${message.guild.id}.actionslow`));
        let logchannel = db.fetch(`${message.guild.id}.modlogs`)
        logchannel = message.guild.channels.cache.get(logchannel)
        if (logchannel) logchannel.send({
          embeds: [new Discord.MessageEmbed()
            .setDescription(`${message.author} a **retiré tous les warns** de ${member.toString()} !`)]
        }).catch(e => { e })
        return;
      }
      number = parseInt(number)

      let sanction = sanctions[number - 1]
      if (!sanction) return message.reply(`:x: Cette sanction n'existe pas !`)
      const filtered = sanctions.filter(e => e !== sanction);
      db.set(`${message.guild.id}.${member.user.id}.warns`, filtered);
      message.reply(`**${member.user.username}** a été unwarn !`)


      rslow.action[message.author.id] = true;
      setTimeout(() => {
        rslow.action[message.author.id] = false;
      }, db.fetch(`${message.guild.id}.actionslow`));
      let logchannel = db.fetch(`${message.guild.id}.modlogs`)
      logchannel = message.guild.channels.cache.get(logchannel)
      if (logchannel) logchannel.send({
        embeds: [new Discord.MessageEmbed()
          .setColor(db.fetch(`${message.guild.id}.color`))
          .setDescription(`${message.author} a **retiré le warn** de ${member.toString()} qui était \`\`${sanction}\`\``)]
      }).catch(e => { e })
    } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

  }
}