/* eslint-disable no-unused-vars */
const Discord = require("discord.js");
const fs = require("fs");
const util = require("util");

let Models = require("../../util/models");
let { User, Guild } = require("../../util/");
let cp = require("child_process").execSync;

exports.run = async (client, message, args, _guild) => {
  if (!message.member.isOwner()) return;
  let user = id => client.users.cache.get(id);
  let guild = id => client.guilds.cache.get(id);
  let member = id => message.guild.members.cache.get(id);


  const embed = new Discord.MessageEmbed()
  try {
    let kod = args.join(" ");
    if (!kod) return message.reply(`Deneyebilmek için bir kod girmelisin!
    \`\`\`js
    const Discord = require("discord.js");
    const fs = require("fs");
    let Models = require("../../util/models");
    let { User, Guild } = require("../../util/");
    const cp = require("child_process").execSync;
    exports.run = async (client, message, args, _guild) => {
      if (!message.member.isOwner()) return;
      let user = id => client.users.cache.get(id);
      let guild = id => client.guilds.cache.get(id);
      let member = id => message.guild.members.cache.get(id);
    };
    \`\`\`
    `)

    let sonuc = await eval(kod);


    if (typeof sonuc !== 'string')
      sonuc = util.inspect(sonuc, { depth: 0 });


    return message.reply({
      embeds: [
        embed
          .addField('» Kod', `\`\`\`js\n${kod}\`\`\``)
          .setDescription(`\`\`\`js\n${sonuc}\n\`\`\``)
      ]
    })
  } catch (e) {
    return message.reply({ embeds: [embed.addField('» Hata', `\`\`\`js\n${e}\n\`\`\``)] });
  }
}



exports.help = {
  names: ['test', "eval", "kod"],
  description: 'Kod denemeyi sağlar.',
  usage: 'test <kod>', 
  gizli: true
};
