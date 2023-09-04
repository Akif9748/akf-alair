const fs = require('fs');
const { join } = require('path');
const list = require("../util/json/tesekkur.json");
fs.writeFileSync(join(__dirname, "../markdown/tesekkur.md"), "# Yegane destekçilerimiz ❤\n" + list.map(x =>
    `[**${x.name}**](https://discord.com/users/${x.id}) ${x.text}`).join("\n\n") + `
 
**thesportstacker**, korona komutu ve komutların ilk handleri.
*Daha buraya adı yazılmayı hak eden kaç kişi var sayamayız...*`);