const getNow = () => { return { time: new Date().toLocaleString("en-GB", { timeZone: "Europe/Paris", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }), }; }
const db = require("quick.db")
module.exports = {
    name: 'messageDelete',

    run: async (client, message) => {
        if (message.author) {
            client.snipes.set(message.channel.id, {

                content: message.content,
                profilephoto: message.author.displayAvatarURL({ dynamic: true }),
                author: message.author.tag,
                date: message.createdTimestamp,
                image: message.attachments.first() ? message.attachments.first().proxyURL : null
            })
            if (message.author.bot) return;
            let str_chan = db.fetch(`${message.guild.id}.messagelogs`)
            str_chan = message.guild.channels.cache.get(str_chan)
            if (str_chan)  return str_chan.send({ embeds: [{ description: `Message de **${message.author.username}**#${message.author.discriminator} (\`${message.author.id}\`) supprimé dans [\`${message.channel.name}\`](https://discord.com/channels/${message.guild.id}/${message.channel.id}) \n  \`\`\`${message.content}\`\`\``, color: db.fetch(`${message.guild.id}.color`), author: { name: "❌ Suppression" }, footer: { text: `🕙 ${getNow().time}` } }] })
        }
    }
}