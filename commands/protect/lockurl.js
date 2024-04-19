const db = require("quick.db")
const Discord = require('discord.js');
var rslow = require('../../slow.js');
const { checkperm } = require("../../base/functions");
module.exports = {
        name: "lockurl",
        description: "Bloque le vanity du serveur",
        usage: "antibot <off/on/max>",
        aliases: ["anti-bot"],

        run: async (client, message, args, cmd) => {
            let perm = await checkperm(message, cmd.name)
            if (perm == true) {
            if (rslow.action[message.author.id] == true) return message.channel.send(`:x: Veuillez attendre avant d'effectuer une autre action !`)
            if(message.guild.features.includes('VANITY_URL') || message.guild.vanityURLCode){
            if (args[0] === "on" || args[0] === "max") { db.set(`${message.guild.id}.anti.url`, "on")  
            db.set(`${message.guild.id}.lockedurl`, message.guild.vanityURLCode)
            message.reply(`:shield: L'URL est désormais bloqué sur \`${message.guild.vanityURLCode}\`\n** :pushpin: Utilisez \`lockurl off\` pour modifier de nouveau l'URL**`)
            let logchannel = db.fetch(`${message.guild.id}.raidlogs`)
            logchannel = message.guild.channels.cache.get(logchannel)
            if (logchannel) logchannel.send({
                embeds: [new Discord.MessageEmbed()
                    .setColor(db.fetch(`${message.guild.id}.color`))
                    .setDescription(`${message.author} a bloqué l'URL sur \`${message.guild.vanityURLCode}\` !`)]
            }).catch(e => { e })}
if(!args[0]) {
    let active = db.fetch(`${message.guild.id}.anti.url`) 
    let url = db.fetch(`${message.guild.id}.lockedurl`)
    return message.reply(`Le lockurl est ${active ? `activé et lock l'url \`${url ? url : "pas d'url"}\`` : `désactivé`} !`)
}
            if (args[0] === "off") { db.delete(`${message.guild.id}.anti.url`)  
            message.reply(`:shield: L'URL peut désormais être modifié !`)
            let logchannel = db.fetch(`${message.guild.id}.raidlogs`)
            logchannel = message.guild.channels.cache.get(logchannel)
            if (logchannel) logchannel.send({
                embeds: [new Discord.MessageEmbed()
                    .setColor(db.fetch(`${message.guild.id}.color`))
                    .setDescription(`${message.author} a débloqué !`)]
            }).catch(e => { e })}

            rslow.action[message.author.id] = true;
            setTimeout(() => {
                rslow.action[message.author.id] = false;
            }, db.fetch(`${message.guild.id}.actionslow`));
        } else return message.reply(`:x: Vous n'avez pas de vanity url !`)
    } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    }
}