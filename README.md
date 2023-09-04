# Alair
akf-alair-v14, baz system.

## KURULUM TALIMATLARI:
- `util/json/config.json` & `util/json/config_beta.json` dosyalarını ayarlayın. Ana config bot linuxda çalışırken çalışacaktır, beta config ise diğer işletim sistemlerinde. Davranışı değiştirmek için `util/config.js` dosyasını konfigure edin. Kontrolcü davranışı üzerinde değişiklik yapmak için `index.js`'yi değiştirin.
- `util/index.js` kategorileri komut kategorileri ekleyip sildiğinizde işe yarar. Yardım komutu ve site için.
- Konsola `npm i` yazın.
- `npm run deploy` yazarak komutları deploy edebilirsiniz.
- Sonra `npm start` (production) / `npm test` (development) yazınca çalışmalıdır.

## Kanlı canlı versiyonunu eklemek için:
https://akif9748.github.io/alair

## Komut yardım açıklamaları:
```
prefix + komutadi + <> = zorunlu | [] = isteğe bağlı

Örnek:
!ban <@kullanıcı | id> [sebep]
```

## Özellik bildirimleri:
Tamamen özelleştirilebilir. Alair baz sistemden getirilen bazı özellikler:
- **Alair-Client**, **Alair-Embed** aktarıldı. 
- **Webpanel**
- `ana / alt katmanlar` `app.js` Komut, interaction ve event yükleyicileri.
- `index.js` **ASB - Kontrolcü**: Botun çökme vs. tüm hata, bilgilendirmelerini size gösterir.
- **Blokerler**: (küfür, caps) engeller.
- **butonrol**: Butonlarla rol verir.
- **custom**: Özel komutlar eklersiniz.
- **oto_cevap 1. katman**: Basit oto cevap sistemi (aç kapa var)
- **oto_cevap 2. katman**: Bu ise botun `sor` komutu için. (minor)
- **Sunucuya katılınca atılan mesaj.** Minor. Merkez sunucuya gelene verilen rol yok.
- **Rank** sistemi. Tüm özellikleriyle. Sunucudakilerin rankını sıralama da dahil.
- **Ekonomi** (minor) sistem. Para, arduino al sat, bahis, gönder, günlük ve sıralaması var.
- **Komuta göre otomatik renderleyen yardım komutu**
- **Bot-Bilgi**
- **Çeşitli** komutlardan 2 tane bizim modüllerimizle yapılan komut, `ara` ve `tdk`.
- **Karaliste** sistemi: Kanalda komut kullanımı kapatmak.
- **Black** sistemi: Sahip komutu, botu bazı kişilere karşı kapatmak.
- **Reset ve eval**.
- **prefix** değiştirme.
- **Rank** açma ve kapatma
- **Telemetri**

## Sistem yapılandırması:

1. **Ana/alt katman:** `index.js` / `app.js` => En hızlı ve hayati önem taşıyan katman. Kontrolcü + bot. Kontrolcü es geçilerek çalıştırılabilir! 
*Client dosyadan doğrudan asla çıkamaz.*

2. **Alt katmanlar:** `events/` => events içindeki `.js` dosyaları.
*Direkt client eventlerine bağlı.*
    - **Alt/Webserver katmanı:** `server/` => events içi `ready` eventi ile devreye girer.

3. **Orta (alt-üst) katman:** `events/util/` => altındaki kalan dosyalar, kelime oyunu gibi, alt-üst katman kombinasyonunu içeren dosyalar. 
*Üst katmanlara göre daha sıkı yönetilen, ama en az 1 alt katman üzerinden erişilen yerler.*

4. **Üst katmanlar:**  `commands/` & `interactions/` => kullanıcıyla direkt iletişim halinde olan katmanlar. 
*En çok hatanın meydana gelip göz ardı edildiği yer*

5. **Ara/Destek katmanı:**  `util/` => klasör içindeki tüm destek yapıları. Bunlar tüm katmanlar ile bağlantılıdır. 
*Tüm katmanlara destek veren, **Alair-Core**, **ASB**, modeller, fonksionlar, resimler, sabitler, config/json yapıları vs.*

## Güvenlik:
2 katmanlık güvenlik sistemi var! 2 parça webhookdan oluşur.
- **ASB:** Alair Savunma Birimi
    - `uncaughtException` (kritik-ana-sistem), *event listener hatası* (alt katmanlar), 
    - `messageCreate & interactionCreate` (üst katman komut hataları) 
    
    hatalarında **ASB** kullanılır, detaylı log verir. 
    *Ayrıca ratelimit'ler, oturum sonu -telemetri-, **ASB** bünyesindedir.*

- **Kontrolcü** (halka açık), yüzeysel bilgiler verir. Kapanmalar, resetler, ve kritik ana sistem hataları.

## Sürüm notları (Major):
- V11.X.X Tüm komutlar interactiona çevirildi. Handlere subcommands eklendi.
- V10.X.X V14 geçişi. Müzik webpaneli & Distube ile daha iyi müzikler.
- V9.X.X Komut-interaction birleştirildi!
- V8.X.X Webpanel!
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
- `app.js` asıl ana dosya. Veritabanına bağlantı, Client kurulumu, komutların işlenmesi (handler), eventler başlatımı burada olur.

### **Handlerler:**
- **Event handler:** doğrudan alt katmandaki dosyaların adlarıyla bağlanır.
- **COMMAND/INTERACTION HANDLER:**
    - Eğer komut dosyasında interaction da varsa, onu da interactionlara kaydeder
    - **command:**
        - KEY: Komutun adı
        - VALUE: Eğer 1. dereceden ise komutun `(aşağıda)` kendisi, eğer diğer derecelerden ise 1. derecenin adı.

#### Komutun dosya yapısı:
```js
const dosya = { 
    help: { 
        native:true, // interaction destekliyor ise
        subcommand:"maincommand", // interaction ise, subcommand moduna geçirir.
        names: ["ana isim/interaction ismi", "allias1", ...alliasesler ],
        description: 'Yardımda renderlenecek açıklama',
        usage: 'komut özel yardımdaki kullanım...',
        options: {}, // INTERACTION ICIN: options vs gibi alanlar, interaction içeren komut için.
        gizli: true // renderlenmeyecek ve gizli çalışan, typingsiz komutlar için
    },

    data: {}, // INTERACTION ICIN: helpden bağımsız ise, burası çözer (sadece interaction çalışan komutlar için)
    async runInteraction(client, interaction, guild) { }, // INTERACTION ICIN: eğer komutta interaction varsa, çalışması için (sadece interaction çalışan komutlar için)

    tur: "other", // komut türü, klasör ismiyle aynı
    dosyaAdi: "dosya.js", // hangi dosya oldugu
    kullanim: 0, // telemetri için kullanım verisi.
    async run (client, message, args, guild) { return Message || void; }
}
```

- **interaction handler:**
Hybrid çalışır. 

Eğer dosyada `data` varsa `runInteraction` üzerinden `data` verisiyle çalışır.

Eğer dosyada `native: true` ibaresi varsa, `run` üzerinden `help` verisiyle çalışır.

Eğer dosyada `subcommand:` ibaresi varsa, `subcommand` modunda çalışır.
Bu modda interaction içine interaction açılmış olur.
`native: true` ibaresine göre `runInteraction` veya `run` ile çalışır. 1. katmandaki interactionda `run` yerine `subcommands` olur. Handler 2. katmandaki `subcommands`dan normal bir interaction gibi veriyi çekerek çalışır. Fakat telemetri ve ratelimitler `subcommands`a göre değil, ana komuta göre çalışır.