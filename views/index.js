<script language="JavaScript" type="text/JavaScript">
function erc20ToErc20() {
	const {assertEqualBN} = require('./helper/assert')
const {
  bufToStr,
  htlcERC20ArrayToObj,
  isSha256Hash,
  newSecretHashPair,
  nowSeconds,
  random32,
  txContractId,
  txLoggedArgs,
} = require('./helper/utils')

const HashedTimelockERC20 = artifacts.require('./HashedTimelockERC20.sol')
const AliceERC20 = artifacts.require('./helper/AliceERC20.sol')

const hourSeconds = 3600
const timeLock1Hour = nowSeconds() + hourSeconds
const tokenAmount = 5


contract('HashedTimelock swap between two ERC20 tokens', accounts => {
  const Alice = accounts[1] // owner of AliceERC20 and wants swap for BobERC20
  const Bob = accounts[2] // owner of BobERC20 and wants to swap for AliceERC20

  const tokenSupply = 1000
  const senderInitialBalance = 100

  let htlc
  let AliceERC20
  let BobERC20
  let hashPair // shared b/w the two swap contracts in both directions
  let a2bSwapId // swap contract ID for Alice -> Bob in the AliceERC20
  let b2aSwapId // swap contract ID for Bob -> Alice in the BobERC20
  // use a variable to track the secret Bob will have learned from Alice's withdraw transaction
  // to make the flow more explicitly reflect the real world sequence of events
  let learnedSecret

  before(async () => {
    // if both tokens run on the same chain, they can share the HTLC contract to
    // coordinate the swap. They can also use separate instances on the same chain,
    // or even separate instances on different chains.
    // The key is the HTLC contract must be running on the same chain
    // that the target Token to be transferred between the two counterparties runs on
    htlc = await HashedTimelockERC20.new()

    AliceERC20 = await AliceERC20TokenContract.new(tokenSupply)
    BobERC20 = await BobERC20TokenContract.new(tokenSupply)
    await AliceERC20.transfer(Alice, senderInitialBalance) // so Alice has some tokens to trade
    await BobERC20.transfer(Bob, senderInitialBalance) // so Bob has some tokens to trade

    hashPair = newSecretHashPair()
  })
  
   timeLockSeconds = nowSeconds() + 2
   const newASwapTx = await newSwap(AliceERC20, htlc, {hashlock: hashPair.hash, timelock: timeLockSeconds}, Alice, Bob)
   a2bSwapId = txContractId(newASwapTx)
   
   
   timeLockSeconds = nowSeconds() + 2
   const newBSwapTx = await newSwap(BobERC20, htlc, {hashlock: hashPair.hash, timelock: timeLockSeconds}, Bob, Alice)
   b2aSwapId = txContractId(newBSwapTx)
   
   
   await htlc.withdraw(b2aSwapId, hashPair.secret, {
      from: Alice,
    })
   
    learnedSecret = contract.preimage
    
    await htlc.withdraw(a2bSwapId, learnedSecret, {
      from: Bob,
    })
}
}
