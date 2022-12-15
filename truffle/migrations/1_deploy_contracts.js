const AssetToken = artifacts.require("AssetToken");

module.exports = function(deployer) {
  // #2 Deploy the instance of the contract
  deployer.deploy(AssetToken, "AssetToken", "AST");//, 10);
};