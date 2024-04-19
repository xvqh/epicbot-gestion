const db = require("quick.db");
const Discord = require("discord.js");
const getNow = () => { return { time: new Date().toLocaleString("en-GB", { timeZone: "Europe/Paris", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }), }; }
module.exports = {
    name: 'voiceStateUpdate',

    run: async (client, oldState, newState) => {

        if (oldState.member.id === client.user.id || newState.member.id === client.user.id) return
        if (oldState.channel === null || oldState.channel !== null && newState.channel ) {
            let members = db.fetch(`${newState.guild.id}.antijoin_${newState.channel.id}`)
            if (members) {
                if (newState.channel.members.size <= 1) {
                    db.delete(`${newState.guild.id}.antijoin_${newState.channel.id}`)
                }
                members = db.fetch(`${newState.guild.id}.antijoin_${newState.channel.id}`)
                if (members && !members.includes(newState.member.id)) {
                    const keke = new Discord.MessageEmbed()
                        .setTitle(`Anti-Join`)
                        .setColor(db.fetch(`${newState.guild.id}.color`))
                        .setDescription(`L'anti-join est activé dans le salon <#${newState.channel.id}> configuré par <@${db.fetch(`${newState.guild.id}.antijoinowner_${newState.channel.id}`)}> !\n Pour plus d'informations rejoignez [notre support](https://discord.gg/U54fQNHycG)`)
                    newState.member.send({ embeds: [keke] }).catch(e => { })
                    newState.member.voice.setChannel(null, "Anti-Join");
                }
            }
        }

        let gld
        if (oldState) {
            gld = oldState.guild.id
        } else if (newState) {
            gld = newState.guild.id
        }
        if (oldState.channel !== null && newState.channel !== null) {
            if (oldState.member.id === client.user.id) {
                newState.channel.leave()
                oldState.channel.members.forEach(m => {
                    m.voice.setChannel(newState.channel.id).catch()
                })
            }
        }

        let logchannel = db.fetch(`${gld}.voicelogs`)
        let str_chan = newState.guild.channels.cache.get(logchannel)
        if (logchannel) {
            // -- Mute

            if (oldState.channel && newState && oldState.streaming !== newState.streaming) {
                if (oldState.streaming === false && newState.streaming) {
                    str_chan.send({ embeds: [{ description: `**${newState.member.user.username}**#${newState.member.user.discriminator} (\`${newState.id}\`) partage son écran dans [\`${newState.channel.name}\`](https://discord.com/channels/${newState.guild.id}/${newState.channel.id})`, color: db.fetch(`${gld}.color`), author: { name: "📽️ Un stream a commencé" }, footer: { text: `🕙 ${getNow().time}` } }] })
                } else {
                    str_chan.send({ embeds: [{ description: `**${newState.member.user.username}**#${newState.member.user.discriminator} (\`${newState.id}\`) ne partage plus son écran dans [\`${newState.channel.name}\`](https://discord.com/channels/${newState.guild.id}/${newState.channel.id})`, color: db.fetch(`${gld}.color`), author: { name: "🎞️ Un stream est fini" }, footer: { text: `🕙 ${getNow().time}` } }] })

                }
            }else if (oldState.selfMute === true && newState.selfMute === false) {
                str_chan.send({ embeds: [{ description: `**${oldState.member.user.username}**#${oldState.member.user.discriminator} (\`${oldState.id}\`) a réactivé son micro dans [\`${newState.channel.name}\`](https://discord.com/channels/${newState.guild.id}/${newState.channel.id})`, color: db.fetch(`${gld}.color`), author: { name: "🎙️ Unmute d'un membre" }, footer: { text: `🕙 ${getNow().time}` } }] })
                    if (oldState.selfDeaf === true && newState.selfDeaf === false) {
                        str_chan.send({ embeds: [{ description: `**${oldState.member.user.username}**#${oldState.member.user.discriminator} (\`${oldState.id}\`) a réactivé son micro et son casque dans [\`${newState.channel.name}\`](https://discord.com/channels/${newState.guild.id}/${newState.channel.id})`, color: db.fetch(`${gld}.color`), author: { name: "🎙️ Unmute d'un membre" }, footer: { text: `🕙 ${getNow().time}` } }] })
                    } 
                } else if (oldState.selfMute === false && newState.selfMute === true) {
                    if (oldState.selfDeaf === false && newState.selfDeaf === true) {
                        str_chan.send({ embeds: [{ description: `**${oldState.member.user.username}**#${oldState.member.user.discriminator} (\`${oldState.id}\`) a mute son micro et son casque dans [\`${newState.channel.name}\`](https://discord.com/channels/${newState.guild.id}/${newState.channel.id})`, color: db.fetch(`${gld}.color`), author: { name: "🔇 Mute d'un membre" }, footer: { text: `🕙 ${getNow().time}` } }] })
                } else str_chan.send({ embeds: [{ description: `**${oldState.member.user.username}**#${oldState.member.user.discriminator} (\`${oldState.id}\`) a mute son micro dans [\`${newState.channel.name}\`](https://discord.com/channels/${newState.guild.id}/${newState.channel.id})`, color: db.fetch(`${gld}.color`), author: { name: "🎙️ Mute d'un membre" }, footer: { text: `🕙 ${getNow().time}` } }] })
                } else if (oldState.channel && newState && oldState.serverMute !== newState.serverMute) {

                var fetchedLogs = await newState.guild.fetchAuditLogs({
                    limit: 1,
                    type: 'MEMBER_UPDATE',
                }),
                    deletionLog = fetchedLogs.entries.first();
                if (!deletionLog) return;
                var { executor, target } = deletionLog;
                if (target.id !== oldState.member.user.id) return;
                let oldstate = null,
                    newstate = null;
                deletionLog.changes.forEach(s => {
                    newstate = s.new
                    oldstate = s.old
                });

                if (oldstate === false && newstate === true) {
                    str_chan.send({ embeds: [{ description: `**${executor.username}**${executor.discriminator} (\`${executor.id}\`) a retiré la permissions de parler a **${oldState.member.user.username}**#${oldState.member.user.discriminator} (\`${oldState.id}\`) dans le salon [\`${newState.channel.name}\`](https://discord.com/channels/${newState.guild.id}/${newState.channel.id})`, color: db.fetch(`${gld}.color`), author: { name: "🤫 Mute d'un membre" }, footer: { text: `🕙 ${getNow().time}` } }] })
                } else {
                    str_chan.send({ embeds: [{ description: `**${executor.username}**${executor.discriminator} (\`${executor.id}\`) a donné la permissions de parler a **${oldState.member.user.username}**#${oldState.member.user.discriminator} (\`${oldState.id}\`) dans le salon [\`${newState.channel.name}\`](https://discord.com/channels/${newState.guild.id}/${newState.channel.id})`, color: db.fetch(`${gld}.color`), author: { name: "🎙️ Demute d'un membre" }, footer: { text: `🕙 ${getNow().time}` } }] })
                }
            } else if (oldState.channel && newState && oldState.serverDeaf !== newState.serverDeaf) {

                var fetchedLogs = await newState.guild.fetchAuditLogs({
                    limit: 1,
                    type: 'MEMBER_UPDATE',
                }),
                    deletionLog = fetchedLogs.entries.first();
                if (!deletionLog) return;
                var { executor, target } = deletionLog;
                if (target.id !== oldState.member.user.id) return;
                let oldstate = null,
                    newstate = null;
                deletionLog.changes.forEach(s => {
                    newstate = s.new
                    oldstate = s.old
                });

                if (oldstate === false && newstate === true) {
                    str_chan.send({ embeds: [{ description: `**${executor.username}**${executor.discriminator} (\`${executor.id}\`) a retiré la permissions de d'écouter a **${oldState.member.user.username}**#${oldState.member.user.discriminator} (\`${oldState.id}\`) dans le salon [\`${newState.channel.name}\`](https://discord.com/channels/${newState.guild.id}/${newState.channel.id})`, color: db.fetch(`${gld}.color`), author: { name: "🔇 Mute d'un membre" }, footer: { text: `🕙 ${getNow().time}` } }] })
                } else {
                    str_chan.send({ embeds: [{ description: `**${executor.username}**${executor.discriminator} (\`${executor.id}\`) a donné la permissions de d'écouter a **${oldState.member.user.username}**#${oldState.member.user.discriminator} (\`${oldState.id}\`) dans le salon [\`${newState.channel.name}\`](https://discord.com/channels/${newState.guild.id}/${newState.channel.id})`, color: db.fetch(`${gld}.color`), author: { name: "🔊 Demute d'un membre" }, footer: { text: `🕙 ${getNow().time}` } }] })
                }
            } else if (oldState.channel === null) {
                str_chan.send({ embeds: [{ description: `**${newState.member.user.username}**#${newState.member.user.discriminator} (\`${newState.id}\`) s'est connecté au salon [\`${newState.channel.name}\`](https://discord.com/channels/${newState.guild.id}/${newState.channel.id})`, color: db.fetch(`${gld}.color`), author: { name: "✔️ Connexion" }, footer: { text: `🕙 ${getNow().time}` } }] })
            } else if (newState.channel === null) {
                if (!oldState.channel) return;
                str_chan.send({ embeds: [{ description: `**${oldState.member.user.username}**#${oldState.member.user.discriminator} (\`${oldState.id}\`) a quitté le salon [\`${oldState.channel.name}\`](https://discord.com/channels/${oldState.guild.id}/${oldState.channel.id})`, color: db.fetch(`${gld}.color`), author: { name: "❌ Déconnexion" }, footer: { text: `🕙 ${getNow().time}` } }] })
            } else if (oldState.channel !== null && newState.channel !== null) {
                if (oldState.selfMute !== newState.selfMute) return;
                if (oldState.selfDeaf !== newState.selfDeaf) return;

                var fetchedLogs = await newState.guild.fetchAuditLogs({
                    limit: 1,
                    type: 'MEMBER_MOVE',
                }),
                    deletionLog = fetchedLogs.entries.first();

                if (!deletionLog) return str_chan.send({ embeds: [{ description: `**${oldState.member.user.username}**#${oldState.member.user.discriminator} (\`${oldState.id}\`) s'est déplace du salon [\`${oldState.channel.name}\`](https://discord.com/channels/${oldState.guild.id}/${oldState.channel.id}) à [\`${newState.channel.name}\`](https://discord.com/channels/${newState.guild.id}/${newState.channel.id})`, color: db.fetch(`${gld}.color`), author: { name: "➰ Déplacement" }, footer: { text: `🕙 ${getNow().time}` } }] });
                var { executor, extra } = deletionLog;


                if (newState.channel && newState.channel.id === extra.channel.id) {

                    str_chan.send({ embeds: [{ description: `**${executor.username}**${executor.discriminator} (\`${executor.id}\`) a déplacé **${oldState.member.user.username}**#${oldState.member.user.discriminator} (\`${oldState.id}\`) du salon [\`${oldState.channel.name}\`](https://discord.com/channels/${oldState.guild.id}/${oldState.channel.id}) à [\`${newState.channel.name}\`](https://discord.com/channels/${newState.guild.id}/${newState.channel.id})`, color: db.fetch(`${gld}.color`), author: { name: "➰ Déplacement" }, footer: { text: `🕙 ${getNow().time}` } }] })
                }
            }
        }
    }
}
