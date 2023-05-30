const Discord = require('discord.js');
const emojiler = ["0️⃣", '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
const { delay } = require("../../util")

exports.run = async (client, message, args) => {

  const sayı = parseInt(args[0]), anket = args.slice(1).join(" ")

  if (!sayı || !anket)
    return message.hata(`Şık sayısını veya anketi unuttun! Unutma, en az 1, en fazla 9 şık seçeneğin var.`);

  const embed = new Discord.MessageEmbed()
    .setTitle(message.author.tag + ' başlattığı oylama:')
    .setDescription("```" + anket + "```")
    .setName("Anket sistemi");

  if (sayı == 1) {
    const msg = await message.channel.send({ embeds: [embed.setFooter({ text: ' ✅ Haydi oyla! ⛔ ' })] })
    await msg.react('✅')
    await msg.react('⛔')
    await delay(1000)
    return await message.delete();

  } else if (9 >= sayı && sayı >= 1) {

    const msg = await message.channel.send({ embeds: [embed.setFooter({ text: '🔢Haydi oyla!🔢' })] })
    for (let i = 1; i <= sayı; i++)
      await msg.react(emojiler[i])

    await delay(1000)
    return await message.delete();

  } else return message.reply('Şık sayısı sadece 1 ve 9 arasındaki rakamlar olabilir.');


};
exports.help = {
  name: ['anket', "oyla"],
  description: 'Anket oluşturur!',
  usage: 'anket <şık sayısı> [anket]'
};
