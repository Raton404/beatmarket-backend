const { sequelize } = require('../database');
const Beat = require('./Beat');
const User = require('./User');
const Order = require('./Order');
const License = require('./License');
const SellerCredentials = require('./MPCredentials');

// Definir relaciones existentes
Beat.hasMany(License, {
    foreignKey: 'beatId',
    as: 'licenses'
});
License.belongsTo(Beat, {
    foreignKey: 'beatId',
    as: 'beat'
});

Beat.hasMany(Order, {
    foreignKey: 'beatId',
    as: 'orders'
});
Order.belongsTo(Beat, {
    foreignKey: 'beatId',
    as: 'beat'
});

License.hasMany(Order, {
    foreignKey: 'licenseId',
    as: 'orders'
});
Order.belongsTo(License, {
    foreignKey: 'licenseId',
    as: 'license'
});

User.hasMany(Order, {
    foreignKey: 'buyerId',
    as: 'purchases'
});
Order.belongsTo(User, {
    foreignKey: 'buyerId',
    as: 'buyer'
});

User.hasMany(Order, {
    foreignKey: 'sellerId',
    as: 'sales'
});
Order.belongsTo(User, {
    foreignKey: 'sellerId',
    as: 'seller'
});

User.hasMany(Beat, {
    foreignKey: 'sellerId',
    as: 'beats'
});
Beat.belongsTo(User, {
    foreignKey: 'sellerId',
    as: 'seller'
});

// Nueva relación para SellerCredentials
User.hasOne(SellerCredentials, {
    foreignKey: 'userId',
    as: 'mercadoPagoCredentials'
});
SellerCredentials.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

module.exports = {
    sequelize,
    Beat,
    User,
    Order,
    License,
    SellerCredentials
};