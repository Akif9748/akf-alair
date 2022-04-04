exports.run =  (client, message, args) => {

    let member = message.mentions.users.first() || message.author;

    let avatar = member.displayAvatarURL({ size: 256, format: "jpg" });


    return message.channel.send({
        files: ["https://api.codare.fun/cerceve/rte?avatar=" + avatar]
      });


};

exports.help = {
    name: 'rte',
    description: 'RTE çerçevesi ekler.',
    usage: 'rte @birisi'
};