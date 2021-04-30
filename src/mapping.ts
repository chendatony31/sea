import { BigInt } from "@graphprotocol/graph-ts"
import {
  SeascapeNft,
  Approval,
  ApprovalForAll,
  Minted,
  OwnershipTransferred,
  Transfer
} from "../generated/SeascapeNft/SeascapeNft"
import { NFT } from "../generated/schema"

export function handleApproval(event: Approval): void {}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleMinted(event: Minted): void {
  let nft = new NFT(event.params.id.toString())
  nft.owner = event.params.owner;
  nft.save()
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleTransfer(event: Transfer): void {
  let nft = NFT.load(event.params.tokenId.toString());
  if (!nft) {
    nft = new NFT(event.params.tokenId.toString());
    nft.owner = event.params.to;
    nft.save();
  }
}
