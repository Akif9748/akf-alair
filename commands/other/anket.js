const Discord = require('discord.js');
const emojiler = ["0️⃣", '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];

exports.run = async (client, message, args) => {

  const sayı = Number(args[0]), anket = args.slice(1).join(" ")

  if (!sayı || !anket) return message.reply('Şık sayısını veya anketi unuttun! Unutma, en az 1, en fazla 9 şık seçeneğin var. Doğru kullanım: `!anket 2 deneme`');

  const embed = new Discord.MessageEmbed()
    .setTitle(message.author.tag + ' başlattığı oylama:')
    .setColor(client.renk)
    .setDescription(anket)
    .setAuthor({ name: `${client.user.username} • Anket sistemi`, iconURL: client.user.avatarURL() })

  if (sayı == 1) {
    const msg = await message.channel.send({ embeds: [embed.setFooter({ text: ' ✅ Haydi oyla! ⛔ ' })] })
    msg.react('✅').catch(() => { return });
    msg.react('⛔').catch(() => { return });

    return setTimeout(() => message.delete().catch(console.error), 1000);

  } else if (9 >= sayı && sayı >= 1) {

    const msg = await message.channel.send({ embeds: [embed.setFooter({ text: '🔢Haydi oyla!🔢' })] })
    for (var i = 1; i <= sayı; i++)
      msg.react(emojiler[i]).catch(console.error);

    return setTimeout(() => message.delete().catch(console.error), 1000);

  } else return message.reply('Şık sayısı sadece 1 ve 9 arasındaki rakamlar olabilir.');


};
exports.help = {
  name: 'anket',
  description: 'Anket oluşturur!',
  usage: 'anket (Şık sayısı) Deneme'
};
