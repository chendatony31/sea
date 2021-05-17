import { BigInt } from "@graphprotocol/graph-ts"
import {
  SeascapeNft,
  Approval,
  ApprovalForAll,
  Minted,
  OwnershipTransferred,
  Transfer as TransferEvent
} from "../generated/SeascapeNft/SeascapeNft"
import { Nft, Transaction, Transfer } from "../generated/schema"

export function handleApproval(event: Approval): void { }

export function handleApprovalForAll(event: ApprovalForAll): void { }

export function handleMinted(event: Minted): void {
  let nft = new Nft(event.params.id.toString())
  nft.owner = event.params.owner;
  nft.save()
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void { }

export function handleTransfer(event: TransferEvent): void {

  let transactionHash = event.transaction.hash.toHexString()

  // transaction
  let transaction = Transaction.load(transactionHash);
  if (transaction === null) {
    transaction = new Transaction(transactionHash)
    transaction.blockNumber = event.block.number
    transaction.timestamp = event.block.timestamp
    transaction.transfer = [];
  }

  let transfers = transaction.transfer;

  let transfer = new Transfer(event.transaction.hash
    .toHexString()
    .concat('-')
    .concat(BigInt.fromI32(transfers.length).toString()))

  // timestamp: BigInt!
  // from: Bytes!
  // to: Bytes!
  // logIndex: BigInt
  // tokenId: ID!

  transfer.timestamp = event.block.timestamp;
  transfer.from = event.params.from;
  transfer.to = event.params.to;
  transfer.tokenId = event.params.tokenId.toString();
  transfer.logIndex = event.logIndex;

  transfer.save()

  transfers.push(transfer.id);
  transaction.transfer = transfers;
  transaction.save();

  // nft
  let nft = Nft.load(event.params.tokenId.toString());
  if (!nft) {
    nft = new Nft(event.params.tokenId.toString());
    nft.owner = event.params.to;
    nft.save();
  }
  else {
    nft.owner = event.params.to;
    nft.save();
  }
}
