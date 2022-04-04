const { GuildModel } = require("../models/");


/**
 * Alair'in ana guild class'ı
 */
class Guild {
    constructor(id) {

        this.guildid = id;
        this.hgrol = null;

        this.hgkanal =null
        this.log = null;

        this.prefix = "!";

        this.hgkapa = false;
        this.otokapa = false;
        this.kufur = false;
       

    }
    /**
        * Setup gibi bir şey.
        * @param {String} guild 
        * @returns 
        */

    async getId(guildid = this.guildid) {
        this.guildid = guildid;

        let bilgi = await GuildModel.findOne({ guildid }) ?? new Guild(guildid);

        if (this.guildid)
            await new GuildModel(this).save();
        
        let {
            hgrol = null,
            hgkanal = null,
            log = null,

            prefix = "!",

            hgkapa = false,
            otokapa = false,
            kufur = false
        } = bilgi;

        this.hgrol = hgrol
        this.hgkanal = hgkanal
        this.log = log;

        this.prefix = prefix;

        this.hgkapa = hgkapa;
        this.otokapa = otokapa;
        this.kufur = kufur;

        return this;
    }

    /**
       * @param {String} guild guild id ile DB'ye veri akışı
       */
    async write(guildid = this.guildid) {
        await GuildModel.findOneAndUpdate({ guildid }, this);
    }

}


module.exports = Guild;
