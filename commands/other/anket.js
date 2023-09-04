const Discord = require('discord.js');
const emojiler = ["0️⃣", '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
const { delay } = require("../../util")

exports.run = async (client, message, args) => {

  let sayı, anket, kanal = message.channel;
  if (message.options) {
    sayı = message.options.getInteger("şıksayısı");
    anket = message.options.getString("anket");
    kanal = message.options.getChannel("kanal") || message.channel;
  } else {
    sayı = parseInt(args[0]);
    anket = args.slice(1).join(" ");
  }

  if (!sayı || !anket)
    return message.hata(`Şık sayısını veya anketi unuttun! Unutma, en az 1, en fazla 9 şık seçeneğin var.`);

  if (sayı > 9 || sayı < 1) return message.hata("En fazla 9 şık seçeneğin var.");

  const embed = new Discord.MessageEmbed()
    .setTitle(message.author.username + ' başlattığı oylama:')
    .setDescription("```" + anket + "```")
    .setName("Anket sistemi");
  await message.reply(`Anket başarıyla başlatıldı!`);

  if (sayı === 1) {
    const msg = await kanal.send({ embeds: [embed.setFooter({ text: ' ✅ Haydi oyla! ⛔ ' })] })
    await msg.react('✅')
    await msg.react('⛔')
    await delay(1000)

  } else {

    const msg = await kanal.send({ embeds: [embed.setFooter({ text: '🔢Haydi oyla!🔢' })] });
    for (let i = 1; i <= sayı; i++)
      await msg.react(emojiler[i]);

    await delay(1000);

  }

};
exports.help = {
  native: true,
  options: [
    {
      name: "şıksayısı", description: "Anketin şık sayısı.", type: 4, required: true, choices: [
        {
          name: "Evet/Hayır anketi",
          value: 1
        },
        { name: "2 şıklı anket", value: 2 }, { name: "3 şıklı anket", value: 3 }, { name: "4 şıklı anket", value: 4 }, { name: "5 şıklı anket", value: 5 }, { name: "6 şıklı anket", value: 6 }, { name: "7 şıklı anket", value: 7 }, { name: "8 şıklı anket", value: 8 }, { name: "9 şıklı anket", value: 9 }
      ]
    },
    {
      name: "anket", description: "Anketin içeriği.", type: 3, required: true
    },
    { name: "kanal", description: "Anketin gönderileceği kanal.", type: 7, required: false }],
  names: ['anket', "oyla"],
  description: 'Anket oluşturur!',
  usage: 'anket <şık sayısı> [anket]'
};
