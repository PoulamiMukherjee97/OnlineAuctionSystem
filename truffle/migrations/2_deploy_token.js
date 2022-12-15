const StandardToken = artifacts.require("StandardToken");

module.exports = function(deployer) {
  // #2 Deploy the instance of the contract
  deployer.deploy(StandardToken, "ERC20 TOKEN",0, "ECT");//, 10);
};