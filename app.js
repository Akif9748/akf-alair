// ASB ZONE
const { asb } = require("./util/wh");

process.on("uncaughtException", err => {

  if (err.message.includes("abort") || err.message.includes("YouTube")) return;

  console.error("[uncaughtException]", err);

  asb.send(`🔴**YAKALANAMAYAN KRİTİK HATA**\n\`\`\`js\n${err.stack || err}\`\`\``).then(m => process.exit(1)).catch(e => {
    console.error("[webhook-hatası]", e);
    process.exit(1);
  });

});


const { Alair } = require('./util'),
  mongoose = require('mongoose'), //Database
  { readdirSync } = require("fs"), // FileSystem, for handlers and Classes import
  client = new Alair({ intents: 1923, failIfNotExists: false }),//Client with intents
  heroku = process.platform === "linux"; //Is bot on hosting?

//EVENT HANDLER:
for (const file of readdirSync('./events'))
  client.on(file.replace(".js", ""), async (..._) => {
    try {
      await require(`./events/${file}`)(..._);
    } catch (err) {
      console.error("[Event Yakalayıcısı Hatası]", err, "\nEk Bilgi:", _);

      asb.send(`🟡**EVENT YAKALAYICISI ALTINDA HATA**\n**DOSYA:**\`${file}\`
      \`\`\`js\n${err.stack || err}\`\`\``).catch(_ => _)
    }
  });

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
    adlar.forEach((ad, sayi) => client.commands.set(ad, sayi ? adlar[0] : { ...dosya, file, sayi, tur }));
  };

//Toplam komut:
console.log("Toplam", client.commands.size, "komut ve", client.interactions.size, "interaction hazır!");

//MongoDB bağlantısı:
mongoose.connect(`mongodb+srv://<buraya biseyler yazsan?>@alairdb.smhc6.mongodb.net/Alair${heroku ? "" : "Beta"}DB?retryWrites=true&w=majority`, { useNewUrlParser: true }, async () => console.log("Veritabanı bağlandı! Karaliste:\n", await client.userBlock()));

// Made by Akif9748 with inosh, Javascript and ❤