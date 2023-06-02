const { token, clientID, serverID, alpha } = require("./util/config");
const { REST } = require('@discordjs/rest');
const fs = require("fs")
const rest = new REST().setToken(token);
const path = `/applications/${clientID}/${alpha ? "" : `guilds/${serverID}`}/commands`;
const body = [];

for (const tur of fs.readdirSync('./commands'))
    for (const dosyaAdi of fs.readdirSync(`./commands/${tur}/`)) {
        const dosya = require(`./commands/${tur}/${dosyaAdi}`);

        if (dosya.data) {
            body.push(dosya.data);
        } else if (dosya.help?.native || dosya.runInteraction) {
            if (Array.isArray(dosya.help.name))
                dosya.help.name = dosya.help.name[0];
            body.push({ type: 1, ...dosya.help });
        }
    }

(async () => {
    console.log("Yükleme işlemi başladı!");
    try {
        await rest.put(path, { body });
        console.log("REST API'ye başarıyla yüklendi!");
    } catch (e) {
        console.error(e, e.rawError.errors);
    }
})();