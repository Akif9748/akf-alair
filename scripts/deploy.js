const { token, clientID, serverID, alpha } = require("../util/config");
const { join } = require("path");
const { REST } = require('@discordjs/rest');
const fs = require("fs");

const rest = new REST().setToken(token);
const path = `/applications/${clientID}/${alpha ? "" : `guilds/${serverID}`}/commands`;
const body = [];
const interactions = new Map();
for (const tur of fs.readdirSync(join(__dirname, "../commands")))
    for (const dosya of fs.readdirSync(join(__dirname, "../commands/", tur)).map(d => require(join(__dirname, "../commands/", tur, d)))) {
        if (dosya.data) {
            body.push(dosya.data);
        } else {
            if (dosya.help) 
                dosya.help.name = dosya.help.names[0];
            
            if (dosya.help?.subcommand) {
                if (!interactions.has(dosya.help.subcommand))
                    interactions.set(dosya.help.subcommand, { name: dosya.help.subcommand, description: `/${dosya.help.subcommand} komutu, subcommandlarıyla kullanılır`, type: 1, options: [] });

                interactions.get(dosya.help.subcommand)
                    .options.push({ type: 1, ...dosya.help });
            }
            else if (dosya.help?.native) {
                body.push({ type: 1, ...dosya.help });
            }
        }

    }

body.push(...interactions.values());

(async () => {
    console.log("Yükleme işlemi başladı!");
    try {
        await rest.put(path, { body });
        console.log("REST API'ye başarıyla yüklendi!");
    } catch (e) {
        console.error(e, e.rawError.errors);
    }
})();