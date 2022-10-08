# ALAIR-MINOR
Küçültülmüş / Altyapı versiyon.
## KURULUM TALIMATLARI:
- `util/config.json` dosyasını ayarlayın.
- `index.js` içinde mongoose için bir veritabanı ayarlayın.
- `util/wh` içine ASB ve kontrolcu için bir webhook ayarlayın.
- `util/index.js` kategorileri komut kategorileri ekleyip sildiğinizde işe yarar. Yardım komutu için.
- Konsola `npm i` yazın.
- Sonra `node .` yazınca çalışmalıdır.

## Kanlı canlı versiyonunu eklemek için:
https://akif9748.me/alair

## Özellik bildirimleri:
Tamamen özelleştirilebilir. Alair baz sistemden getirilen bazı özellikler:
- **Alair-Client**, **Alair-Embed** aktarıldı. 
- `ana / alt katmanlar` `app.js` Komut, interaction ve event yükleyicileri.
- `index.js` **ASB - Kontrolcü**: Botun çökme vs. tüm hata, bilgilendirmelerini size gösterir.
- **Blokerler**: (küfür, reklam, caps) engeller.
- **butonrol**: Butonlarla rol verir.
- **custom**: Özel komutlar eklersiniz.
- **oto_cevap 1. katman**: Basit oto cevap sistemi (aç kapa var)
- **oto_cevap 2. katman**: Bu ise botun `sor` komutu için. (minor)
- **Sunucuya katılınca atılan mesaj.** Minor. Merkez sunucuya gelene verilen rol yok.
- **Rank** sistemi. Tüm özellikleriyle. Sunucudakilerin rankını sıralama da dahil.
- **Ekonomi** (minor) sistem. Para ve sıralaması var.
- **Komuta göre otomatik renderleyen yardım komutu**
- **Bot-Bilgi**
- **Çeşitli** komutlardan 2 tane bizim modüllerimizle yapılan komut, `ara` ve `tdk`.
- **Karaliste** sistemi: Kanalda komut kullanımı kapatmak.
- **Black** sistemi: Sahip komutu, botu bazı kişilere karşı kapatmak.
- **Reset ve eval**.
- **prefix** değiştirme.

## Sistem yapılandırması:

1. **Ana/alt katman** => `index.js` / `app.js` / `package.json` => En hızlı ve hayati önem taşıyan katman. Kontrolcü + bot.
Kontrolcü es geçilerek çalıştırılabilir! *Client dosyadan doğrudan asla çıkamaz.*

2. **Alt katmanlar** => `events/` => içindeki eventler, /util dahil değil... *Direkt client eventlerine bağlı.*

3. **Üst katmanlar** => `komutlar/` & `interactions/` & `buttons/` => kullanıcıyla direkt iletişim halinde olan katmanlar, 
ayrıca util/ altındaki bazı dosyalar da bu katmana dahil, mesela kullanıcıyla doğrudan erişime geçen zekanın dosyası. *En çok hatanın meydana geldiği mekan*

4. **Orta katmanlar** => `events/util/` => altındaki kalan dosyalar, kelime oyunu gibi, alt-üst katman kombinasyonunu içeren dosyalar. *Üst katmanlara göre daha sıkı yönetilen, ama en az 1 alt katman üzerinden erişilen yerler.*

5. **Çeşitli/Ara katmanlar** => `util/` => klasör içindeki tüm destek yapıları. Bunlar `alt/üst/ana` katmanların hepsiyle bağlantılıdır. *Tüm katmanlara destek veren, modeller, classes, ve fonksionlar, ayrıca **CONSTANTLAR**, config yapıları vs.*

## Güvenlik:
2 katmanlık güvenlik sistemi var! 2 parça webhookdan oluşur, **kontrolcu** (halka açık) ve **ASB** (Alair Savunma Bölümü).
- *uncaughtException* (kritik-ana-sistem), *event listener hatası* (alt katmanlar), ve *messageCreate* (üst katman komut hataları) hatalarında **ASB** kullanılır, detaylı log verir.
- **Kontrolcü**, yüzeysel bilgiler verir. Kapanmalar, resetler, ve kritik ana sistem hataları.

## Sürüm notları (Major):
- V7.X.X MemberModel iptali!
- V6.X.X AlairClient yazıldı, Embedler AlairEmbed yapıldı.
- V5.X.X komut => interaction aktarımı
- V4.X.X V13 geçişi
- V3.X.X events klasörü, index.js baya boşaltıldı
- V2.X.X Tüm komutlara return eklendi
- V1.X.X handler yenilenmesi/help bilgisinin tekrar yazılması, tüm komutlara
- V0.X.X Alair Bot-Bro olarak doğdu


## Ana/alt katman iç yapılandırması:
- Sonuna kadar hız için ayarlı.
- `index.js` kontrolcüsü var, bot çökerse hızlı yeniden başlatan bir yönetici. Webhookla bilgi veriyor kendi çökerse.
- `app.js` asıl ana dosya. Veritabanına bağlantı, Client kurulumu, komutlar, eventler başlatımı burada olur.
### **Daha fazla açıklama:**
- Cliente komutlar, ve interactionları koyar. 

#### **Handlerler:**
- Event handler doğrudan orada dosya adlarıyla bağlanır.
- interaction handler dosyadaki SlashCommandBuilder verisinden alınan bilgilerle anahtarlanıp, run ile de keylenir.
- command handler bir dosyayı nasıl kaydeder?
#### KEY:
komutadı
#### VALUE:
Eğer 1. allias ise komutun kendisi, eğer diğer allias ise 1. allias'ın keyi.
```js
const dosya = { 
    help: { 
        name: [ "ana isim", "allias1", ...alliasesler ],
        description: 'Yardımda renderlenecek açıklama',
        usage: 'komut özel yardımdaki kullanım...',
        gizli: true // renderlenmeyecek ve gizli çalışan
                    // typingsiz komutlar için
        
    },
    tur: "other", // komut türü, klasör ismiyle aynı
    run: (client, message, args, guild) => { /* return Message || void */ },
    sayi:0
    // sayi ise kaçıncı allias olduğunu gösterir.
    // sadece 0. allias renderlenir. 
}
```
