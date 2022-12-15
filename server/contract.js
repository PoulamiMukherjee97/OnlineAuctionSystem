const Web3 = require("web3");
const nftJson = require('../truffle/build/contracts/AssetToken.json');
const tokenJson = require('../truffle/build/contracts/StandardToken.json');

// Setting up a HttpProvider
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
const nftContractAddress = '0x79574339C2deD5c89130dae8D7aE60c64A221c5A';
let nftAbi  = nftJson.abi;
const tokenContractAddress = '0x9b56E1Df55a3Babb10Aeb3C1830CD3a4e9F3A3e9';
let tokenAbi  = tokenJson.abi;

const nftContract = new web3.eth.Contract(nftAbi,nftContractAddress);
const tokenContract = new web3.eth.Contract(tokenAbi,tokenContractAddress);

let accountDetails = async() => {
    let accounts = await web3.eth.getAccounts();
    return accounts;
}


module.exports= {accountDetails, nftContract, tokenContract, web3};