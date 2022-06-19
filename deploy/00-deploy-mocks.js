const { network, ethers } = require("hardhat");
const { developmentChain } = require("../helper-hardhat-config");

const BASE_FEE = ethers.utils.parseEther("0.25") // it costs 0.25 LINK per request
const GAS_PRICE_LINK = 1e9 //calculated value based on the gas price of the chain

module.exports = async function ({getNamedAccounts, deployments}){
    const {deployer} = await getNamedAccounts();
    const {deploy, log} = deployments

    if(developmentChain.includes(network.name)){
        log("Local network detected deploying Mocks....")
        await deploy("VRFCoordinatorV2Mock",{
            from: deployer,
            log: true,
            args: [BASE_FEE,GAS_PRICE_LINK]
        })

        log("Mocks Deployed")
        log("------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"];
