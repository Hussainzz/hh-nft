const {ethers} = require('hardhat');

const networkConfig = {
    4: {
        name: 'rinkeby',
        vrfCoordinator: '0x6168499c0cFfCaCD319c818142124B7A15E857ab',
        mintFee: ethers.utils.parseEther("0.01"),
        gasLane: '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc',
        subscriptionId: "6065",
        callbackGasLimit: "500000",
        interval: "30"
    },
    80001:{
        name: 'mumbai',
        vrfCoordinator: '0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed',
        mintFee: ethers.utils.parseEther("0.01"),
        gasLane: '0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f',
        subscriptionId: "574",
        callbackGasLimit: "500000",
        interval: "20"
    },
    137:{
        name: 'polygon',
        vrfCoordinator: '0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed'
    },
    31337:{
        name: 'hardhat',
        mintFee: ethers.utils.parseEther("0.01"),
        gasLane: '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc',
        callbackGasLimit: "500000",
        interval: "30"
    }
}

const developmentChain = ["hardhat", "localhost"]
const DECIMALS = 8
const INITIAL_ANSWER = 20000000000

module.exports = {
    networkConfig,
    developmentChain,
    DECIMALS,
    INITIAL_ANSWER
}