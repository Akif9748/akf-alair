const express = require("express"),
    path = require("path"),
    rl = require("express-rate-limit"),
    { SiteUsage } = require("../util/models"),
    { turler } = require("../util"),
    tesekkur = require("../util/json/tesekkur.json"),
    { getClientIp } = require('request-ip'),
    port = process.env.PORT || 3000;


module.exports = alair => {
    const app = express();
    app.set("views", path.join(__dirname, "views"));
    app.set("view engine", "ejs");
    app.use(express.static(path.join(__dirname, "public")),
        rl({
            windowMs: 60_000,
            max: 30,
            message: "[ASB] X-Ratelimit: Çok fazla istek gönderdiniz."
        }),
        async (req, res, next) => {
            res.reply = (file, options) => res.render(file, { alair, title: null, ...options });
            SiteUsage.findByIdAndUpdate(getClientIp(req), { $inc: { count: 1 } }, { upsert: true }).catch(console.error);
            next();
        });

    app.get("/", (req, res) => res.reply("index"));
    app.get("/sunucu", (req, res) => res.redirect(alair.sunucu));
    app.get("/davet", (req, res) => res.redirect(alair.davet));

    app.get("/tesekkur", (req, res) => res.reply("tesekkur", { tesekkur }));
    app.get("/komutlar", (req, res) => res.reply("kategoriler", { turler }));
  
    app.get("/komutlar/:kategori", (req, res) => {
      const kategori = req.params.kategori;
      if (!turler.some(t => t.klasor === kategori)) return res.redirect("/komutlar");
      res.reply("komutlar", { kategori })
    });  

    app.listen(port, () => console.log(port, "üzerinde web sayfası hazır!"))
}