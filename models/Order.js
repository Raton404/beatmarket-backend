const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    beatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'beats', // Cambiado a minúscula
            key: 'id'
        }
    },
    licenseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'licenses', // Cambiado a minúscula
            key: 'id'
        }
    },
    buyerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // Cambiado a minúscula
            key: 'id'
        }
    },
    sellerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // Cambiado a minúscula
            key: 'id'
        }
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
        allowNull: false
    },
    paymentId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    preferenceId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    licenseType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    licenseTerms: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'orders', // Añadido el tableName
    timestamps: true,
    indexes: [
        {
            fields: ['beatId']
        },
        {
            fields: ['licenseId']
        },
        {
            fields: ['buyerId']
        },
        {
            fields: ['sellerId']
        },
        {
            fields: ['status']
        }
    ]
});

// Definir las relaciones
Order.associate = (models) => {
    Order.belongsTo(models.Beat, {
        foreignKey: 'beatId',
        as: 'beat'
    });
    
    Order.belongsTo(models.License, {
        foreignKey: 'licenseId',
        as: 'license'
    });
    
    Order.belongsTo(models.User, {
        foreignKey: 'buyerId',
        as: 'buyer'
    });
    
    Order.belongsTo(models.User, {
        foreignKey: 'sellerId',
        as: 'seller'
    });
};

module.exports = Order;