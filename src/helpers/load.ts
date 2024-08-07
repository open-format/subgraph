import {Address, BigInt, Bytes} from "@graphprotocol/graph-ts";
import {ActionId, BadgeId} from ".";
import {
  Action,
  ActionMetadata,
  App,
  Badge,
  BadgeToken,
  FungibleToken,
  MissionMetadata,
} from "../../generated/schema";

export function loadBadgeToken(
  contractAddress: Address,
  tokenId: BigInt
): BadgeToken | null {
  const id = BadgeId(contractAddress, tokenId.toHex());
  let _BadgeToken = BadgeToken.load(id);

  return _BadgeToken;
}

export function loadAction(
  transactionHash: Bytes,
  actionId: Bytes
): Action | null {
  const id = ActionId(transactionHash, actionId);
  return Action.load(id);
}
export function loadBadge(contractAddress: Address): Badge | null {
  return Badge.load(contractAddress.toHex());
}

export function loadStar(contractAddress: Address): App | null {
  return App.load(contractAddress.toHex());
}

export function loadFungibleToken(
  contractAddress: Address
): FungibleToken | null {
  return FungibleToken.load(contractAddress.toHex());
}

export function loadActionMetadata(CID: string): ActionMetadata | null {
  const id = CID;
  return ActionMetadata.load(id);
}

export function loadMissionMetadata(CID: string): MissionMetadata | null {
  const id = CID;
  return MissionMetadata.load(id);
}
