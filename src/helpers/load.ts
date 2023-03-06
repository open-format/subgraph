import {Address} from "@graphprotocol/graph-ts";
import {NFTId} from ".";
import {NFT} from "../../generated/schema";

export function loadNFT(contractAddress: Address, tokenId: string): NFT | null {
  const id = NFTId(contractAddress, tokenId);
  let _NFT = NFT.load(id);

  return _NFT;
}
