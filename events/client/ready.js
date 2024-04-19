const colors = require('colors');
const db = require("quick.db");
const config = require("../../config")
var { defaultperm } = require("../../perm.json")
module.exports = {
   name: 'ready',

   run: async (client, guild) => {
      client.guilds.cache.forEach(async g => {
         let cmds = defaultperm
         for (i in cmds) {
            let check = db.fetch(`${g.id}.change.${defaultperm[i].name}`)
            if (!check && check !== 0) {
               db.set(`${g.id}.change.${defaultperm[i].name}`, defaultperm[i].perm)
            }
         }
         /*g.channels.cache.forEach(async ch => {
            if(ch.messages){
            await ch.messages.fetch({limit:35}).catch(e => console.log(e))
            }
         })*/
      });

      let tyype = db.fetch(`bottype`)
      if (!tyype && tyype !== null) tyype = "WATCHING"
      let aactivity = db.fetch(`botactivity`)
      if (!aactivity && aactivity !== null) aactivity = config.statut
      let presence = db.fetch(`botpres`)
      if (!presence) presence = "online"
      client.user.setActivity(aactivity, { type: tyype, url: "https://www.twitch.tv/epictools" })
      client.user.setStatus(presence)

      setInterval(() => {
         let tyype = db.fetch(`bottype`)
      if (!tyype && tyype !== null) tyype = "WATCHING"
      let aactivity = db.fetch(`botactivity`)
      if (!aactivity && aactivity !== null) aactivity = config.statut
      let presence = db.fetch(`botpres`)
      if (!presence) presence = "online"
         client.user.setActivity(aactivity, { type: tyype, url: "https://www.twitch.tv/epictools" })
      }, 10000000);

      console.log(
         `Connected has ${client.user.tag} \n`.bgBlue.black
     +`Client Id: ${client.user.id} \n `.bgBlack.black
     +`Invite: https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=0 \n`.bgGreen.black
     )


      for(let i = 0; i< config.owners.length; i++){

         let access = db.fetch(`bot.owner`)
         if(!access || !access.includes(config.owners[i])) 
         db.push("bot.owner", config.owners[i])   
     }
 
   }
} 
