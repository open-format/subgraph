import { Address } from "@graphprotocol/graph-ts";
import { NFT } from "../../generated/schema";
import { NFTId } from "../helpers";

export function loadNFT(
  contractAddress: Address,
  tokenId: string
): NFT | null {
  const id = NFTId(contractAddress, tokenId);
  let _NFT = NFT.load(id);

  return _NFT;
}
