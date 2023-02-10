import { BigInt } from "@graphprotocol/graph-ts";
import {
  BatchMinted,
  ERC721Base as ERC721BaseContract,
  Minted,
  Transfer,
} from "../generated/ERC721Base/ERC721Base";

import { loadNFT, loadOrCreateNFT } from "./helpers";

export function handleMinted(event: Minted): void {
  const boundContract = ERC721BaseContract.bind(event.address);
  const totalSupply = boundContract
    .totalSupply()
    .minus(BigInt.fromI32(1));

  let NFT = loadOrCreateNFT(event.address, totalSupply.toString());

  NFT.owner = event.params.to;
  NFT.metadataURI = event.params.tokenURI;
  NFT.tokenId = totalSupply;

  NFT.createdAtBlock = event.block.number;
  NFT.createdAt = event.block.timestamp;
  NFT.contract = event.address.toHex();

  NFT.save();
}

export function handleBatchMinted(event: BatchMinted): void {
  //@TODO: update when startTokenId is added to BatchMinted event
  const boundContract = ERC721BaseContract.bind(event.address);
  const totalSupplyBeforeMint = boundContract
    .totalSupply()
    .minus(event.params.quantity);
  for (let i = 0; i < event.params.quantity.toI32(); i++) {
    const tokenId = totalSupplyBeforeMint.plus(BigInt.fromI32(i));

    let NFT = loadOrCreateNFT(event.address, tokenId.toString());
    NFT.owner = event.params.to;
    NFT.metadataURI = event.params.baseURI + tokenId.toString();
    NFT.tokenId = tokenId;
    NFT.createdAtBlock = event.block.number;
    NFT.createdAt = event.block.timestamp;
    NFT.contract = event.address.toHex();
    NFT.save();
  }
}

export function handleTransfer(event: Transfer): void {
  const boundContract = ERC721BaseContract.bind(event.address);
  const totalSupply = boundContract
    .totalSupply()
    .minus(BigInt.fromI32(1));

  let NFT = loadNFT(event.address, totalSupply.toString());
  if (NFT) {
    NFT.owner = event.params.to;
    NFT.save();
  }
}
