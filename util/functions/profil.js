const Canvas = require("@napi-rs/canvas");
const { parsenum } = require("..");
const invert = require('invert-color');

const margin = 20, m = 4; // ilerleme margin

module.exports = async (user, kul) => {
    // user aslında üye
    const member = kul.member(user.guild.id);
    const canvas = Canvas.createCanvas(650, 450);
    const context = canvas.getContext('2d');

    const ANA_RENK = user.displayHexColor;
    const ON_RENK = invert(ANA_RENK, { threshold: 0.4 });
    // background
    context.fillStyle = ANA_RENK;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // ÇİZGİLER:
    context.fillStyle = ON_RENK;

    // ayraç çizgisi
    context.fillRect(0, 200, canvas.width, 10);

    // ilerleme alt
    const alt_genis = canvas.width - (200 + margin * 2);
    const alt_kalın = 30;
    context.fillRect(margin, 165, alt_genis, alt_kalın);

    // ilerleme üst
    const ilerleme = (alt_genis - m * 2) * (member.xp / (100 + 50 * member.seviye));
    context.fillStyle = ANA_RENK;

    context.fillRect(margin + m, 165 + m, ilerleme, alt_kalın - m * 2);
    context.fillStyle = ON_RENK;

    // avatar
    const avatar = await Canvas.loadImage(user.displayAvatarURL({ size: 256, format: "jpg" }));
    context.drawImage(avatar, canvas.width - 200, margin, 180, 180);

    // isim
    context.strokeRect(0, 0, canvas.width, canvas.height);
    context.font = '40px Arial';
    context.textAlign = "center";

    context.fillText(user.user.tag, 250, 50);

    // başlıklar
    context.textAlign = "start";
    context.font = '35px Nimbus Sans';

    context.fillText("• Sunucu Profili", margin, 100);
    context.fillText(`• Global Profil`, margin, 250);

    context.font = '30px Nimbus Sans';
    context.fillText(`• Seviye: ${member.seviye}       • XP: ${member.xp} / ${100 + 50 * member.seviye}`, margin, 150);

    context.fillText(`• Seviye: ${kul.seviye}       • XP: ${kul.xp}`, margin, 300);
    context.fillText(`• Arduinolar: ${kul.arduino}       • Para: ${parsenum(kul.para)}`, margin, 350);

    if (kul.manita?.isim)
        context.fillText(`${kul.manita.isim} ile evliler ❤`, margin, 400);


    return canvas.toBuffer('image/png');

}
