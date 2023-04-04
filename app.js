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

//INTERACTION HANDLER:
for (const file of readdirSync('./interactions')) {
  const dosya = require(`./interactions/${file}`);
  dosya.data.type ||= 1;
  dosya.kullanim = 0;
  client.interactions.set(dosya.data.name, dosya);
}

//COMMAND HANDLER:
for (const tur of readdirSync('./commands'))
  for (const file of readdirSync(`./commands/${tur}/`)) {
    const dosya = require(`./commands/${tur}/${file}`);
    let adlar = dosya.help.name;
    if (!Array.isArray(adlar)) adlar = [adlar];
    adlar.forEach((ad, sayi) => client.commands.set(ad, sayi ? adlar[0] : { ...dosya, file, sayi, tur, kullanim: 0 }));
  }

//Toplam komut:
console.log("Toplam", client.commands.size, "komut ve", client.interactions.size, "interaction hazır!");

//MongoDB bağlantısı:
mongoose.connect(config.mongoURL, { useNewUrlParser: true })
  .then(() => client.updateBlacklist())
  .then(block => console.log("Veritabanı ile bağlandı! Karaliste:", block));

// Made by Akif9748 with inosh, Javascript and ❤