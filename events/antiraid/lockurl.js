const db = require("quick.db");
const { sanction } = require("../../base/functions");
const creq = require("request")
const Discord = require('discord.js');
module.exports = {
  name: 'guildUpdate',

  run: async (client, oldGuild, newGuild) => {
    if (newGuild.features.includes('VANITY_URL')) {
      let check = db.fetch(`${newGuild.id}.anti.url`)
      if (check && (newGuild.vanityURLCode !== oldGuild.vanityURLCode)) {
        let lockedurl = db.fetch(`${newGuild.id}.lockedurl`)
        if (lockedurl && newGuild.vanityURLCode !== lockedurl) {

          if (!newGuild.me.permissions.has("MANAGE_GUILD")) {
            let logchannel = db.fetch(`${newGuild.id}.raidlogs`)
            logchannel = newGuild.channels.cache.get(logchannel)
            if (logchannel) logchannel.send({
              content: "@here",
                embeds: [new Discord.MessageEmbed()
                    .setColor(db.fetch(`${newGuild.id}.color`))
                    .setDescription(`Changement d'URL\n:warning: Je n'ai pas la permission MANNAGE_GUILD, je n'ai donc pas pu agir`)]
            }).catch(e => { e })
        }

          const url = {
            url: `https://discord.com/api/v9/guilds/${newGuild.id}/vanity-url`,
            body: {
              code: lockedurl
            },
            json: true,
            method: 'patch',
            headers: {
              "Authorization": `Bot ${client.config.token}`
            }
          };
          creq(url, (err, res, body) => {
            if (err) {
              return console.log(err);
            }
          })
          let sctn = db.fetch(`${newGuild.id}.punition.lockurl`)
          if (!sctn) sctn = client.perms.antiraid.lockurl
          const entry = await newGuild.fetchAuditLogs({ type: 'GUILD_UPDATE' }).then(audit => audit.entries.first()).catch()
          if (entry.executor.id !== client.user.id) {
            if (entry.executor) {
              let memberr = newGuild.members.cache.get(entry.executor.id)
              sanction(memberr, newGuild, sctn, `[automod] Lockurl`)

              let logchannel = db.fetch(`${newGuild.id}.raidlogs`)
            logchannel = newGuild.channels.cache.get(logchannel)
            if (logchannel) logchannel.send({
              content: "@everyone",
                embeds: [new Discord.MessageEmbed()
                    .setColor(db.fetch(`${newGuild.id}.color`))
                    .setDescription(`${entry.executor.toString()} a tenté de ${newGuild.vanityURLCode && newGuild.vanityURLCode !== oldGuild.vanityURLCode ? `modifier l'URL du serveur en \`${newGuild.vanityURLCode}\`` : "retirer l'URL du serveur"} !`)]
            }).catch(e => { e })
            }
          }
        }
      }
    }
  }

}