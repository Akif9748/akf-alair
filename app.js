const asb = require("./util/lib/asb"),
  { Alair, config } = require('./util'),
  mongoose = require('mongoose'),
  { readdirSync } = require("fs"),
  client = new Alair();

process.on("SIGTERM", () => asb.sigterm(client));

//EVENT HANDLER:
for (const file of readdirSync('./events'))
  client.on(file.replace(".js", ""), async (..._) => {
    try {
      await require(`./events/${file}`)(..._);
    } catch (err) {
      asb.event(file, err, _);
    }
  });

// COMMAND/INTERACTION HANDLER:
for (const tur of readdirSync('./commands'))
  for (const dosyaAdi of readdirSync(`./commands/${tur}/`)) {
    const dosya = require(`./commands/${tur}/${dosyaAdi}`);
    const anaKomutAdi = dosya.help ? (Array.isArray(dosya.help.name) ? dosya.help.name[0] : dosya.help.name) : dosya.data?.name;
    if (!anaKomutAdi) continue;

    if (dosya.run) [dosya.help.name].flat().forEach((ad, derece) =>
      client.commands.set(ad, derece ? anaKomutAdi : { run: dosya.run, help: dosya.help, dosyaAdi, tur, kullanim: 0 })
    );

    if (dosya.data)
      client.interactions.set(anaKomutAdi, { run: dosya.runInteraction, data: dosya.data, kullanim: 0 });
    else if (dosya.help?.native || dosya.runInteraction)
      client.interactions.set(anaKomutAdi, { run: dosya.runInteraction || dosya.run, data: { type: 1, ...dosya.help }, kullanim: 0 });

  }

//Toplam komut:
console.log("Toplam", client.commands.size, "komut ve", client.interactions.size, "interaction hazır!");

//MongoDB bağlantısı:
mongoose.connect(config.mongoURL)
  .then(() => client.updateBlacklist())
  .then(block => console.log("Veritabanı ile bağlandı! Karaliste:", block));

// Made by Akif9748 with inosh, Javascript and ❤