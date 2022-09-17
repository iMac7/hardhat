// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, run, network } = require("hardhat")
require("dotenv").config({ path: "../.env" })

async function main() {
  //DEPLOYING THE CONTRACT
  //hardhat ethers knows the file is in contracts folder
  const contractFactory = await ethers.getContractFactory("Contract1")
  const contract1 = await contractFactory.deploy()
  await contract1.deployed()
  const address = contract1.address
  console.log("Contract address", address)

  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    await contract1.deployTransaction.wait(6) //waited to be sure changes are picked up
    await verify(address, [])
  }
}

//VERIFYING DEPLOYED CONTRACT
//or on cli: yarn hardhat verify --network  <e.g. goerli>  <address e.g. 0x98EB92A3AF2f27a0B129e10aC4B402778b8002Cc>
async function verify(address, args) {
  //trycatch because the contract is possibly already verified by hardhat due to similarity in bytecode
  try {
    await run("verify:verify", {
      address: address,
      constructorArguments: args,
    })
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified"))
      console.log("Already verified!")
    else {
      console.log(error.message)
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
