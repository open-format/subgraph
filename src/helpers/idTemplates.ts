import { Address, BigInt, ByteArray, Bytes, crypto, ethereum } from "@graphprotocol/graph-ts";

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

export function AppFungibleTokenId(appAddress: Address, tokenAddress: Address): string {
  return appAddress.toHex() + "-" + tokenAddress.toHex();
}

export function RewardId(
  label: String,
  rewardType: String,
  metadataURI: String,
  event: ethereum.Event): string {
  const rewardHash = crypto.keccak256(ByteArray.fromUTF8(`${label}|${rewardType}|${metadataURI}`))
  return rewardHash.toHex() + "-" + event.transaction.hash.toHex() + "-" + event.logIndex.toString()
}

export function UserRewardId(appAddress: Address, userAddress: Address): string {
  return appAddress.toHex() + "-" + userAddress.toHex();
}

export function AppRewardIdTemplate(appAddress: Address, rewardId: string): string {
  const rewardHash = crypto.keccak256(ByteArray.fromUTF8(rewardId))
  return appAddress.toHex() + "-" + rewardHash.toHex();
}