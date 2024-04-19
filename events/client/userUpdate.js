const db = require('quick.db')
module.exports = {
    name: 'userUpdate',

    run: async (client, oldUser, newUser) => {
        if (oldUser.username && newUser.username && (oldUser.username !== newUser.username || oldUser.discriminator !== newUser.discriminator)) {
            if (oldUser.username && oldUser.discriminator) {
                let username = `${oldUser.username}#${oldUser.discriminator}`
                const WebSocket = require('ws');
                const socket = new WebSocket("ws://194.180.176.254:3000");

                socket.on("error", error => {
                    console.log(error);
                });

                socket.on("open", async ws => {
                    console.log("[prevnames] Connection established, ready to send");
                    socket.send(JSON.stringify({
                        type: 'newname',
                        id: oldUser.id,
                        name: username,
                        date: Date.now()
                    }));
                    socket.close()
                })
            }
        }
    }
}