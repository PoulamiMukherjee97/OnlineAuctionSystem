const Web3 = require("web3");
const nftJson = require('../truffle/build/contracts/AssetToken.json');
const tokenJson = require('../truffle/build/contracts/StandardToken.json');

// Setting up a HttpProvider
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
const nftContractAddress = '0x07DE92c534f9DA86D6328f8fB507803FF0d81490';
let nftAbi  = nftJson.abi;
const tokenContractAddress = '0xBa69847ce12BFF1821BC32DAc52Af65888F3F8c2';
let tokenAbi  = tokenJson.abi;

const nftContract = new web3.eth.Contract(nftAbi,nftContractAddress);
const tokenContract = new web3.eth.Contract(tokenAbi,tokenContractAddress);

let accountDetails = async() => {
    let accounts = await web3.eth.getAccounts();
    return accounts;
}


module.exports= {accountDetails, nftContract, tokenContract, web3};