import {Address} from "@graphprotocol/graph-ts";
import {BadgeId} from ".";
import {
  ActionMetadata,
  Badge,
  BadgeToken,
  Constellation,
  FungibleToken,
  MissionMetadata,
  Star
} from "../../generated/schema";

export function loadBadgeToken(
  contractAddress: Address,
  tokenId: string
): BadgeToken | null {
  const id = BadgeId(contractAddress, tokenId);
  let _BadgeToken = BadgeToken.load(id);

  return _BadgeToken;
}

export function loadBadge(contractAddress: Address): Badge | null {
  return Badge.load(contractAddress.toHex());
}

export function loadStar(contractAddress: Address): Star | null {
  return Star.load(contractAddress.toHex());
}

export function loadFungibleToken(
  contractAddress: Address
): FungibleToken | null {
  return FungibleToken.load(contractAddress.toHex());
}

export function loadConstellation(
  constellationAddress: Address
): Constellation | null {
  return Constellation.load(constellationAddress.toHex());
}

export function loadActionMetadata(CID: string): ActionMetadata | null {
  const id = CID;
  return ActionMetadata.load(id);
}

export function loadMissionMetadata(CID: string): MissionMetadata | null {
  const id = CID;
  return MissionMetadata.load(id);
}
