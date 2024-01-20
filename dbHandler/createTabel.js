const { text } = require('express')
const {DataTypes} = require('sequelize')
const { sequelize } = require('./database.js')
const Sequelize = require('./database.js').sequelize

const User = Sequelize.define('user',{
    name: {
        type:DataTypes.STRING(10),

    },
    password: {
        type:DataTypes.STRING
    },
    tanggalLahir: {
        type:DataTypes.DATE
    },
    jenisKelamin: {
        type:DataTypes.STRING
    },
    emailUser: {
        type:DataTypes.STRING
    },
    token: {
        type:DataTypes.STRING
    }
    
},{
    freezeTableName:true
})

const Product = Sequelize.define(
  "product",
  {
    name: {
      type: DataTypes.STRING,
    },
    stok: {
      type: DataTypes.INTEGER(5),
    },
    harga: {
      type: DataTypes.INTEGER(30),
    },
    category: {
      type: DataTypes.STRING(30),
    },
    image: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
    }
  },{
    freezeTableName: true,
  }
);

  module.exports={User, Product}
// (async()=> {await Sequelize.sync()
// })();