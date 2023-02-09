import {
  BatchMinted,
  ERC721Base as ERC721BaseContract,
  Minted,
  Transfer,
} from "../generated/ERC721Base/ERC721Base";

import { loadOrCreateNFT } from "./helpers";

export function handleMinted(event: Minted): void {
  // const boundContract = ERC721BaseContract.bind(event.address);
  // @TODO: Swap timestamp for tokenId
  let NFT = loadOrCreateNFT(
    event.address,
    event.block.timestamp.toString()
  );

  NFT.owner = event.params.to;
  NFT.metadataURI = event.params.tokenURI;

  NFT.createdAt = event.block.timestamp;
  NFT.contract = event.address.toHex();

  NFT.save();
}

export function handleBatchMinted(event: BatchMinted): void {
  //@TODO: We need tokenURI each for each NFT
  // This requires a for loop
}
export function handleTransfer(event: Transfer): void {
  // let NFT = loadOrCreateNFT(
  //   event.address,
  //   event.block.timestamp.toString()
  // );
  // NFT.owner = event.params.to;
  // NFT.save();
}
