const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "create",
    description: "Créer des emojis",
    aliases: ["emojiadd", "emojisadd"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message,cmd.name)
        if (perm == true) {
            if (!args.length) return message.channel.send(":x: Merci de préciser les émojis à ajouter !")
            let emojis = []
            message.channel.send(`:recycle: Création en cours...`)
            for (const rawEmoji of args) {
                const parsedEmoji = Discord.Util.parseEmoji(rawEmoji);
                if (parsedEmoji.id) {
                    const extension = parsedEmoji.animated ? ".gif" : ".png";
                    const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + extension}`;
                    await message.guild.emojis
                        .create(url, parsedEmoji.name)
                        .then((emoji) => emojis.push(emoji));
                }
            }
            message.channel.send(`${emojis.length} emoji${emojis.length > 1 ? "s": ""} créé${emojis.length > 1 ? "s": ""}${args.length - emojis.length !== 0 ? `, (je n'ai pas réussi à en créer ${args.length - emojis.length}) ` : " "}!`)

        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    }
}