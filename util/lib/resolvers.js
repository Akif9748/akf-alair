// took from https://github.com/Androz2091/AtlantaBot/blob/master/helpers/resolvers.js
const getArg = m => m.content.split(/ +/g).filter(Boolean)[1];

/**
 * 
 * @param {object} param0 
 * @param {import("discord.js").Message} param0.message
 * @param {string} param0.search
 * @param {("text"|"voice"|"dm"|"category"|"thread")} param0.type
 * @returns 
 */
function Channel({ message, search, type }) {
	search ||= getArg(message);
	let channel = message.mentions.channels.first();

	if (!channel && search) {
		channel = message.guild.channels.cache.get(search) ||
			message.guild.channels.cache.find(r => r.name.toLowerCase() === search.toLowerCase());
	}

	if (channel)
		if (!type)
			return channel;

		else if (
			(type === "text" && channel.isTextBased() && !channel.isDMBased() && !channel.isThread()) ||
			(type === "voice" && channel.isVoiceBased()) ||
			(type === "dm" && channel.isDMBased()) ||
			(type === "category" && channel.type === 4) ||
			(type === "thread" && channel.isThread())
		)
			return channel;
}

function Member({ message, search, me = true }) {
	if (message.options)
		return me && message.member;

	search ||= getArg(message);

	let member = message.mentions.members.first();

	if (!member && search) {
		member = message.guild.members.cache.get(search) ||
			message.guild.members.cache.find(m => m.displayName.toLowerCase() === search.toLowerCase());
	}
	if (me)
		member ||= message.member;

	return member
}

function Role({ message, includes = false, search }) {
	search ||= getArg(message);

	let role = message.mentions.roles.first();
	if (!role && search) {
		role = message.guild.roles.cache.get(search) ||
			message.guild.roles.cache.find(r => r.name.toLowerCase() === search.toLowerCase());
	}
	if (includes && !role)
		role = message.guild.roles.cache.find(r => r.name.toLowerCase().includes(search.toLowerCase()));

	return role;
}

module.exports = {
	Channel,
	Member,
	Role
};