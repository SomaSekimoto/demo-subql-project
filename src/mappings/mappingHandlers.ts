import { SubstrateExtrinsic, SubstrateEvent, SubstrateBlock } from "@subql/types"
import { MyObject } from "../types/models/index"
import { Balance } from "@polkadot/types/interfaces"

export async function handleBlock(block: SubstrateBlock): Promise<void> {
  //Create a new MyObject with ID using block hash
  let record = new MyObject(block.block.header.hash.toString())
  //Record block number
  record.blockNumber = block.block.header.number.toNumber()

  logger.info(
    "\nblock Number: " +
      record.blockNumber +
      "\nspecVersion: " +
      block.specVersion +
      "\ntimestamp: " +
      block.timestamp +
      "\nblock.header.parentHash: " +
      block.block.header.parentHash +
      "\nblock.header.stateRoot: " +
      block.block.header.stateRoot +
      "\nblock.header.extrinsicsRoot: " +
      block.block.header.extrinsicsRoot +
      "\nblock.header.digest: " +
      block.block.header.digest
  )
  await record.save()
}

export async function handleEvent(event: SubstrateEvent): Promise<void> {
  const {
    event: {
      data: [account, balance],
    },
  } = event
  //   let record = new MyObject(extrinsic.block.header.hash.toString())
  //Retrieve the record by its ID
  const record = await MyObject.get(event.block.block.header.hash.toString())
  record.account = account.toString()
  //Big integer type Balance of a transfer event
  record.value = (balance as Balance).toBigInt()
  await record.save()
}

export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void> {
  let record = new MyObject(extrinsic.block.block.header.hash.toString())
  //   const record = await MyObject.get(extrinsic.block.block.header.hash.toString())
  //Date type timestamp
  record.timestamp = extrinsic.block.timestamp
  //Boolean tyep
  record.success = true
  logger.info("\nblock number: " + extrinsic.block.block.header.number.toNumber())
  logger.info("\nera: " + extrinsic.extrinsic.era)
  logger.info("\nsigned: " + extrinsic.extrinsic.isSigned)
  logger.info("\nsigner: " + extrinsic.extrinsic.signer)
  await record.save()
}
