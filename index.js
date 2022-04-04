const { Client, Collection } = require('discord.js'),//Client ve Collection Discorddan importlandı.
  { readdirSync } = require("fs"), /* Dosya sistemi / classes dosyası: */
  { ayarlar, token, ingilizce, intents } = require("./util/classes"),
  client = new Client({ intents, partials: ["CHANNEL"] });//client

client.ayarlar = ayarlar;
client.renk = ayarlar.renk;
client.commands = new Collection();
client.interactions = new Collection();

//EVENT HANDLER:
for (const file of readdirSync('./events'))
  client.on(file.replace(".js", ""), (...args) => require(`./events/${file}`)(...args));

//INTERACTION HANDLER:
for (const file of readdirSync('./interactions')) {
  const dosya = require(`./interactions/${file}`);
  if (!dosya.data.type) dosya.data.type = 1;
  client.interactions.set(dosya.data.name, dosya);
}

//COMMAND HANDLER:
for (const tur of readdirSync('./commands'))
  for (const file of readdirSync(`./commands/${tur}/`)) { 
    const dosya = require(`./commands/${tur}/${file}`);
    let adlar = dosya.help.name;
    if (!Array.isArray(adlar)) adlar = [adlar];
    for (let sayi = 0; sayi < adlar.length; sayi++)
      client.commands.set(adlar[sayi], { ...dosya, sayi, tur });
  };

//Toplam komut:
console.log("Toplam", client.commands.size, "komut ve", client.interactions.size, "interaction hazır!");

//MongoDB bağlantısı:
const mongoose = require('mongoose');

mongoose.connect('databasen', { useNewUrlParser: true }, () => console.log("Veritabanı bağlandı!"));

//İngilizce çevirme fonksiyonu.
String.prototype.toEn = ingilizce;

//Token girişi, son. Made with Javascript and ❤
client.login(token);
