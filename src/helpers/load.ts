import {Address} from "@graphprotocol/graph-ts";
import {BadgeId} from ".";
import {BadgeToken, Constellation} from "../../generated/schema";

export function loadBadgeToken(
  contractAddress: Address,
  tokenId: string
): BadgeToken | null {
  const id = BadgeId(contractAddress, tokenId);
  let _BadgeToken = BadgeToken.load(id);

  return _BadgeToken;
}

export function loadConstellation(
  constellationAddress: Address
): Constellation | null {
  return Constellation.load(constellationAddress.toHex());
}
