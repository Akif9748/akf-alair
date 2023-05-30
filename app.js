const asb = require("./util/asb"),
  { Alair, config } = require('./util'),
  mongoose = require('mongoose'),
  { readdirSync } = require("fs"),
  client = new Alair({ intents: 1927, failIfNotExists: false });

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
    const data = dosya.data || dosya.help;
    let komutAdi = data.name, komutAdlari = [];

    if (Array.isArray(komutAdi)) {
      komutAdlari = komutAdi;
      komutAdi = komutAdi[0];
      dosya.help.name = komutAdi;
    } else
      komutAdlari = [komutAdi];

    if (dosya.run)
      komutAdlari.forEach((ad, derece) => client.commands.set(ad, derece ? komutAdi : { run: dosya.run, help: dosya.help, dosyaAdi, tur, kullanim: 0 }));

    if (data.native || dosya.runInteraction) {
      const dosya2 = { run: data.native ? dosya.run : dosya.runInteraction, data, kullanim: 0 }
      dosya2.data.type ||= 1;
      client.interactions.set(dosya2.data.name, dosya2);
    }
  }

//Toplam komut:
console.log("Toplam", client.commands.size, "komut ve", client.interactions.size, "interaction hazır!");

//MongoDB bağlantısı:
mongoose.connect(config.mongoURL)
  .then(() => client.updateBlacklist())
  .then(block => console.log("Veritabanı ile bağlandı! Karaliste:", block));

// Made by Akif9748 with inosh, Javascript and ❤