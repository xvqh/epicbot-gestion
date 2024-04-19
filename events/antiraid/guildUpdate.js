const db = require("quick.db");
const { sanction } = require("../../base/functions");
const Discord = require('discord.js');
module.exports = {
    name: 'guildUpdate',

    run: async (client, oldGuild, newGuild) => {
        let check = db.fetch(`${newGuild.id}.anti.guildupdate`)
        if (check) {
            let sctn = db.fetch(`${newGuild.id}.punition.guildupdate`)
            if (!sctn) sctn = client.perms.antiraid.guildupdate
            const entry = await newGuild.fetchAuditLogs({ type: 'GUILD_UPDATE' }).then(audit => audit.entries.first())
            if (entry.executor.id !== client.user.id) {
                if (entry.executor) {
                    let memberr = newGuild.members.cache.get(entry.executor.id)
                    if (memberr) {
                        if (check === "max") {
                            let o = db.fetch(`bot.owner`)
                            if (o && o.includes(memberr.id)) return
                            update(oldGuild, newGuild)
                            sanction(memberr, newGuild, sctn, `[automod] Anti Guildupdate`)
                            let logchannel = db.fetch(`${newGuild.id}.raidlogs`)
                            logchannel = newGuild.channels.cache.get(logchannel)
                            if (logchannel) logchannel.send({
                                embeds: [new Discord.MessageEmbed()
                                    .setColor(db.fetch(`${newGuild.id}.color`))
                                    .setDescription(`${memberr} a été ${sctn ? `\`${isNaN(sctn) ? `${sctn}` : `Timeout [${sctn}sec]`}\`` : "sanctionné"} pour avoir modifié le serveur !`)]
                            }).catch(e => { console.log(e) })
                            return db.push(`${newGuild.id}.${newGuild.id}.warns`, "[automod] Anti GuildUpdate")

                        } else

                            if (check === "on") {
                                let o = db.fetch(`bot.owner`)
                                if (o && o.includes(memberr.id)) return
                                let oo = db.fetch(`${newGuild.id}.botwhitelist`)
                                if (oo && oo.includes(newGuild.id)) return
                                update(oldGuild, newGuild)
                                sanction(memberr, newGuild, sctn, `[automod] Anti Guildupdate`)
                                let logchannel = db.fetch(`${newGuild.id}.raidlogs`)
                                logchannel = newGuild.channels.cache.get(logchannel)
                                if (logchannel) logchannel.send({
                                    embeds: [new Discord.MessageEmbed()
                                        .setColor(db.fetch(`${newGuild.id}.color`))
                                        .setDescription(`${memberr} a été ${sctn ? `\`${isNaN(sctn) ? `${sctn}` : `Timeout [${sctn}sec]`}\`` : "sanctionné"} pour avoir modifié le serveur !`)]
                                }).catch(e => { console.log(e) })
                                return db.push(`${newGuild.id}.${newGuild.id}.warns`, "[automod] Anti GuildUpdate")
                            }
                    }
                }
            }
        }
        async function update(oldGuild, newGuild) {

            if (oldGuild.name === newGuild.name) {

            } else {
                await newGuild.setName(oldGuild.name)

            }
            if (oldGuild.iconURL({ dynamic: true }) === newGuild.iconURL({ dynamic: true })) {

            } else {
                await newGuild.setIcon(oldGuild.iconURL({ dynamic: true }))

            }
            if (oldGuild.bannerURL() === newGuild.bannerURL()
            ) {

            } else {
                await newGuild.setBanner(oldGuild.bannerURL())

            }
            if (oldGuild.position === newGuild.position
            ) {

            } else {
                await newGuild.setChannelPositions([{ channel: oldGuild.id, position: oldGuild.position }])

            }

            if (oldGuild.systemChannel === newGuild.systemChannel
            ) {

            } else {
                await newGuild.setSystemChannel(oldGuild.systemChannel)

            }
            if (oldGuild.systemChannelFlags === newGuild.systemChannelFlags
            ) {

            } else {
                await newGuild.setSystemChannelFlags(oldGuild.systemChannelFlags)


            }
            if (oldGuild.verificationLevel === newGuild.verificationLevel
            ) {

            } else {
                await newGuild.setVerificationLevel(oldGuild.verificationLevel)


            }
            if (oldGuild.widget === newGuild.widget
            ) {

            } else {
                await newGuild.setWidget(oldGuild.widget)


            }
            if (oldGuild.splashURL === newGuild.splashURL
            ) {

            } else {
                await newGuild.setSplash(oldGuild.splashURL)


            }
            if (oldGuild.rulesChannel === newGuild.rulesChannel
            ) {

            } else {
                await newGuild.setRulesChannel(oldGuild.rulesChannel)


            }
            if (oldGuild.publicUpdatesChannel === newGuild.publicUpdatesChannel
            ) {

            } else {
                await newGuild.setPublicUpdatesChannel(oldGuild.publicUpdatesChannel)


            }
            if (oldGuild.defaultMessageNotifications === newGuild.defaultMessageNotifications
            ) {

            } else {
                await newGuild.setDefaultMessageNotifications(oldGuild.defaultMessageNotifications)


            }
            if (oldGuild.afkChannel === newGuild.afkChannel
            ) {

            } else {
                await newGuild.setAFKChannel(oldGuild.afkChannel)


            }
            if (oldGuild.region === newGuild.region
            ) {

            } else {
                await newGuild.setRegion(oldGuild.region)


            }

            if (oldGuild.afkTimeout === newGuild.afkTimeout
            ) {

            } else {
                await newGuild.setAFKTimeout(oldGuild.afkTimeout)

            }
        }
    }
}