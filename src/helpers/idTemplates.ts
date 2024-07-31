import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";

export function BadgeId(contractAddress: Address, tokenId: string): string {
  return contractAddress.toHex() + "-" + tokenId;
}

export function ActionId(transactionHash: Bytes, logIndex: BigInt): string {
  return transactionHash.toHex() + "-" + logIndex.toHex();
}

export function MissionId(transactionHash: Bytes, missionId: Bytes): string {
  return transactionHash.toHex() + "-" + missionId.toHex();
}

export function ChargeId(transactionHash: Bytes, logIndex: BigInt): string {
  return transactionHash.toHex() + "-" + logIndex.toHex();
}

export function RequiredTokenBalanceId(appAddress: Address, tokenAddress: Address): string {
  return appAddress.toHex() + "-" + tokenAddress.toHex();
}

export function TokenBalanceId(
  contractAddress: Address,
  userAddress: Address
): string {
  return contractAddress.toHex() + "-" + userAddress.toHex();
}
