const {network, ethers} = require('hardhat');
const { developmentChain, networkConfig } = require('../helper-hardhat-config');
const { storeImages, storeTokenUriMetadata } = require('../utils/uploadToPinata');
const { verify } = require('../utils/verify');

const imagesLocation = "./images/randomNft";
const metadataTemplate = {
    name: "",
    description: "",
    image: "",
    attributes: [
        {
            trait_type: "Cuteness",
            value:100
        }
    ]
}
const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("2")
module.exports = async function({getNamedAccounts, deployments}) {
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = network.config.chainId;

    let vrfCoordinatorV2Address, subscriptionId 
    if(developmentChain.includes(network.name)){
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;

        const txnResponse = await vrfCoordinatorV2Mock.createSubscription();
        const txnReceipt = await txnResponse.wait(1);

        subscriptionId = txnReceipt.events[0].args.subId

        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT)
    }else{
        vrfCoordinatorV2Address = networkConfig[chainId]['vrfCoordinator']
        subscriptionId = networkConfig[chainId]['subscriptionId'] 
    }

    log("-----------------------------------------");

    let tokenUris = [
        "ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo",
        "ipfs://QmYQC5aGZu2PTH8XzbJrbDnvhj3gVs7ya33H9mqUNvST3d",
        "ipfs://QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm",
    ]

    if(process.env.UPLOAD_TO_PINATA == "true"){
        tokenUris = await handleTokenUris();
    }

    const gasLane = networkConfig[chainId]['gasLane']
    const callbackGasLimit = networkConfig[chainId]['callbackGasLimit']
    const mintFee = networkConfig[chainId]['mintFee']

    const args = [vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit, tokenUris, mintFee]

    const randomIpfsNft = await deploy("RandomIpfsNft",{
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    });

    log("-----------------------------------------");

    if(!developmentChain.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        log("Verifying....")
        await verify(randomIpfsNft.address, args);
    }

}

async function handleTokenUris(){
    tokenUris = []

    const {responses: imageUploadResponses, files} = await storeImages(imagesLocation)

    for (imageUploadResponseIndex in imageUploadResponses){
        //create metadata
        let tokenUriMetadata = {...metadataTemplate};
        tokenUriMetadata.name = files[imageUploadResponseIndex].replace(".png", "");
        tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name}`;
        tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`;
        console.log(`Uploading  ${tokenUriMetadata.name}...`);

        //Store JSON to pinata/IPFS
        const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetadata);
        tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`);
    }
    console.log("Token URIs Uploaded!");
    return tokenUris;
}

module.exports.tags = ["all", "randomipfs", "main"]