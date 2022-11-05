const { token } = require("./util/config.json"),
	clientId = "";
const { REST } = require('@discordjs/rest');
const fs = require("fs")
const body = fs.readdirSync("./interactions").map(command => require("./interactions/" + command).data);


//REST APIYE 10. versiyon üzerinden token veriliyor
const rest = new REST().setToken(token);


//Asenkron olarak!
(async () => {
	try {
		console.log('Yükleme işlemi başladı!');
		const data = await rest.get(`/applications/${clientId}/commands`)
		console.log(data)
		//REST API'ye komut aktarımı:
		await rest.put(
			`/applications/${clientId}/commands`,
			{ body }
		);

		console.log('REST APIYE başarıyla yüklendi!');
	} catch (error) {
		console.error(error);
	}
})();
