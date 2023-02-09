import { Address } from "@graphprotocol/graph-ts";
import { NFT } from "../../generated/schema";
import { NFTId } from "../helpers";

export function loadOrCreateNFT(
  contractAddress: Address,
  tokenId: string
): NFT {
  const id = NFTId(contractAddress, tokenId);
  let _NFT = NFT.load(id);

  if (!_NFT) {
    _NFT = new NFT(id);
  }

  return _NFT as NFT;
}
