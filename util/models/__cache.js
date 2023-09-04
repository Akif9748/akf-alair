/**
 * Destek Katmanı - Alair mongoose cache oluşturucusu
 * @param {import("mongoose").Schema} schema 
 * @returns 
 */
module.exports = schema => {
    const cache = new Map();

    schema.cache = cache;
    
    cache.feed = d => {
        if (d) cache.set(d._id, d);
        return d;
    }

    schema.pre('save', function (next) {
        cache.feed(this);
        next();
    });

    return schema;
}