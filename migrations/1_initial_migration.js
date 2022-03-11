var Migrations = artifacts.require("./Migrations.sol")

module.exports = function (deployer) {//this file will use in truffle
  deployer.deploy(Migrations)
}