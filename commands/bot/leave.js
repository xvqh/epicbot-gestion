const db = require("quick.db")
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "leave",
    description: "Quitte un serveur",
    aliases: ['left'],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, cmd.name)
        if (perm == true) {
            const guildID = args[0] || message.guild.id
            if (isNaN(guildID) || !guildID) {
                return message.channel.send(`:x: Merci de préciser l'id du serveur à quitter !`);
            } else {

                const guild = client.guilds.cache.get(guildID);
                if (!guild) { return message.channel.send(':x: Ce serveur n\'existe pas.'); }
                if (!guild.available) { return message.channel.send(':x: Serveur non disponible, patientez.'); }
                if (guild.id === "857186261483257856")  return message.channel.send("Ce serveur vous permet d'avoir des emojis !"); 
                guild.leave()
                    .then(x => {
                        message.channel.send(`:white_check_mark: J'ai quitté ${x.name}`).catch((e) => { });
                    })
                    .catch(err => {
                        console.log(`:x: [ERREUR] Voici l'erreur qui s'est produite: \n${err}`);
                        console.log(err);
                    })


            }
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    }
}