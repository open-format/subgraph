import {Address, BigInt, dataSource, store} from "@graphprotocol/graph-ts";
import {
  BatchMinted,
  ERC721Base as ERC721BaseContract,
  Minted,
  Transfer
} from "../generated/templates/ERC721Base/ERC721Base";

import {
  loadNFT,
  loadOrCreateContractMetadata,
  loadOrCreateNFT,
  loadOrCreateUser,
  ZERO_ADDRESS
} from "./helpers";

let context = dataSource.context();
let contractAddress = Address.fromString(context.getString("ERC721Contract"));
const boundContract = ERC721BaseContract.bind(contractAddress);
const contractMetadata = loadOrCreateContractMetadata(contractAddress);

export function handleMinted(event: Minted): void {
  const totalSupply = boundContract
    .nextTokenIdToMint()
    .minus(BigInt.fromI32(1));

  let NFT = loadOrCreateNFT(event.address, totalSupply.toString());
  let user = loadOrCreateUser(event.params.to, event);

  NFT.owner = user.id;
  NFT.metadataURI = event.params.tokenURI;
  NFT.tokenId = totalSupply;

  NFT.createdAtBlock = event.block.number;
  NFT.createdAt = event.block.timestamp;
  NFT.contract = event.address.toHex();

  //@TODO: Move into reuseable helper;
  contractMetadata.totalSupply = boundContract.totalSupply();
  contractMetadata.save();
  NFT.save();
  user.save();
}

export function handleBatchMinted(event: BatchMinted): void {
  const totalSupplyBeforeMint = boundContract
    .totalSupply()
    .minus(event.params.quantity);
  for (let i = 0; i < event.params.quantity.toI32(); i++) {
    const tokenId = totalSupplyBeforeMint.plus(BigInt.fromI32(i));

    let NFT = loadOrCreateNFT(event.address, tokenId.toString());
    NFT.owner = event.params.to.toHex();
    NFT.metadataURI = event.params.baseURI + tokenId.toString();
    NFT.tokenId = tokenId;
    NFT.createdAtBlock = event.block.number;
    NFT.createdAt = event.block.timestamp;
    NFT.contract = event.address.toHex();
    NFT.save();
  }
  contractMetadata.totalSupply = boundContract.totalSupply();
  contractMetadata.save();
}

export function handleTransfer(event: Transfer): void {
  let NFT = loadNFT(event.address, event.params.tokenId.toString());
  if (NFT) {
    if (event.params.to == ZERO_ADDRESS) {
      //@TODO is burntSupply the correct name?
      contractMetadata.burntSupply = contractMetadata.burntSupply.plus(
        BigInt.fromU32(1)
      );
      store.remove("NFT", NFT.id);
    } else {
      NFT.owner = event.params.to.toHex();
      NFT.save();
    }
  }
  contractMetadata.totalSupply = boundContract.totalSupply();
  contractMetadata.save();
}
