const token = "",
	clientId = "";
const { REST } = require('@discordjs/rest');
const fs = require("fs")
const commands = [];
for (const command of fs.readdirSync("./interactions"))
	commands.push(require("./interactions/" + command).data)


//REST APİYE 9. versiyon üzerinden token veriliyor
const rest = new REST({ version: '9' }).setToken(token);


//Asenkron olarak!
(async () => {
	try {
		console.log('Yükleme işlemi başladı!');
		const data = await rest.get(`/applications/${clientId}/commands`)
		console.log(data)
		//REST APİ'ye komut aktarımı:
		await rest.put(
			`/applications/${clientId}/commands`,
			{ body: commands }
		);

		console.log('REST APİYE başarıyla yüklendi!');
	} catch (error) {
		console.error(error);
	}
})();
