import {Address} from "@graphprotocol/graph-ts";

export function NFTId(contractAddress: Address, tokenId: string): string {
  return contractAddress.toHex() + "-" + tokenId;
}

export function TokenId(
  contractAddress: Address,
  userAddress: Address
): string {
  return contractAddress.toHex() + "-" + userAddress.toHex();
}
