const { WebhookClient } = require('discord.js');
const { webhooklar: whs } = require("./config");

for (const wh in whs)
    module.exports[wh] = new WebhookClient({ url: whs[wh] });