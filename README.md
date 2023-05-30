# Alair
akf-alair-v13, baz system.

## KURULUM TALIMATLARI:
- `util/json/config.json` & `util/json/config_beta.json` dosyalarını ayarlayın. Ana config bot linuxda çalışırken çalışacaktır, beta config ise diğer işletim sistemlerinde. Davranışı değiştirmek için `util/config.js` dosyasını konfigure edin. Kontrolcü davranışı üzerinde değişiklik yapmak için `index.js`'yi değiştirin.
- `util/index.js` kategorileri komut kategorileri ekleyip sildiğinizde işe yarar. Yardım komutu için.
- Konsola `npm i` yazın.
- `node deploy` yazarak komutları deploy edebilirsiniz.
- Sonra `npm start` (production) / `npm test` (development) yazınca çalışmalıdır.

## Kanlı canlı versiyonunu eklemek için:
https://akif9748.github.io/alair

## Komut yardım açıklamaları:
```
prefix + komutadi + <> = zorunlu | [] = isteğe bağlı

Örnek:
!ban <@kullanıcı | id> [sebep]
```

## Sistem yapılandırması:

1. **Ana/alt katman:** `index.js` / `app.js` => En hızlı ve hayati önem taşıyan katman. Kontrolcü + bot. Kontrolcü es geçilerek çalıştırılabilir! 
*Client dosyadan doğrudan asla çıkamaz.*

2. **Alt katmanlar:** `events/` => events içindeki `.js` dosyaları.
*Direkt client eventlerine bağlı.*
    - **Alt/Webserver katmanı:** `server/` => events içi `ready` eventi ile devreye girer.

3. **Orta (alt-üst) katman:** `events/util/` => altındaki kalan dosyalar, kelime oyunu gibi, alt-üst katman kombinasyonunu içeren dosyalar. 
*Üst katmanlara göre daha sıkı yönetilen, ama en az 1 alt katman üzerinden erişilen yerler.*

4. **Üst katmanlar:**  `commands/` & `interactions/` & `buttons/` => kullanıcıyla direkt iletişim halinde olan katmanlar. 
*En çok hatanın meydana göz ardı edildiği yer*

5. **Destek katmanı:**  `util/` => klasör içindeki tüm destek yapıları. Bunlar tüm katmanlar ile bağlantılıdır. 
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
- **interaction handler:** dosyadaki SlashCommandBuilder verisinden alınan bilgilerle anahtarlanıp, dosya ile keylenir.
- **command/interaction handler:**
    - KEY: komutadı
    - VALUE: Eğer 1. dereceden ise komutun kendisi, eğer diğer derecelerden ise 1. derecenin adı.
    - Eğer komut dosyasında interaction da varsa, onu da interactionlara kaydeder
#### Dosya yapısı:
```js
const dosya = { 
    help: { 
        native:true, // interaction destekliyor ise
        name: ["ana isim/interaction ismi", "allias1", ...alliasesler ],
        description: 'Yardımda renderlenecek açıklama',
        usage: 'komut özel yardımdaki kullanım...',
        options: {}, // INTERACTION ICIN: options vs gibi alanlar, interaction içeren komut için.
        gizli: true // renderlenmeyecek ve gizli çalışan, typingsiz komutlar için
    },

    data: {}, // INTERACTION ICIN: helpden bağımsız ise, burası çözer
    runInteraction(client, interaction) { }, // INTERACTION ICIN: eğer komutta interaction varsa, çalışması için
    fonksiyon: () => { }, // INTERACTION ICIN: komutun fonksiyonu kendinden ayrı ise.

    tur: "other", // komut türü, klasör ismiyle aynı
    dosyaAdi: "dosya.js", // hangi dosya oldugu
    run (client, message, args, guild) { return Message || void; },
    derece: 0// derece ise kaçıncı allias olduğunu gösterir.sadece 0. allias renderlenir. 
}
```
