const db = require("quick.db")
const fetch = require('node-fetch');
const { checkperm, between } = require("../../base/functions");
module.exports = {
    name: "gif",
    description: "Recherche un gif à partir d'un mot clef",

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message,cmd.name)
        if (perm == true) {
            const query = args.join(" ")
            if (!quert || query.length > 50) return message.reply('Oups, ce que vous me demandez est trop précis pour être trouvé !');

    
            fetch(`https://api.tenor.com/v1/random?key=VMUXIB2ND575&q=${query}&limit=1`)
                .then(res => res.json())
                .then(json => message.reply(json.results[0].url))
                .catch(e => {
                    message.channel.send('Impossible de trouver un gif correspondant à votre requête');
                    
                    return;
                });
            } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    }
}