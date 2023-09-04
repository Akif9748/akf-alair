const { MessageEmbed } = require("discord.js");
const os = require("os");
const { alpha } = require("../util/config");

/**
 * Alair alt katman dosyası / ready.js
 * @param {Client} client 
 */
module.exports = async client => {
  require("../server")(client);
  client.logger.log("HAZIR", client.guilds.cache.size, "sunucu ve", client.users.cache.size, "kişi ile hazır!");

  client.user.setStatus("dnd");
  const fun = () => client.user.setActivity(client.guilds.cache.size + " sunucuya `/yardım` ediyor", { type: 4 });
  fun();
  setInterval(fun, 60_000 * 10);

  if (!alpha) return;

  const embed = new MessageEmbed().setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() })
    .setTitle(`Tekrardan hazır!`).setColor("Green").setDescription(`${os.cpus()[0].model} üzerinde, \`${Date.now() - client.ayarlar.start}ms\` içinde hazırlandı!`)

  await client.wh.kontrolcu.send({ embeds: [embed] })


}
