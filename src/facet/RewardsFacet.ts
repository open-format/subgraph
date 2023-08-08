import {Address, BigInt, dataSource} from "@graphprotocol/graph-ts";
import {ERC721Base as BadgeContract} from "../../generated/templates/ERC721Base/ERC721Base";
import {
  BadgeMinted,
  BadgeTransferred,
  TokenMinted,
  TokenTransferred
} from "../../generated/templates/RewardsFacet/RewardsFacet";
import {loadBadgeToken} from "../helpers";
import {
  loadOrCreateAction,
  loadOrCreateActionMetadata,
  loadOrCreateBadgeToken,
  loadOrCreateMission,
  loadOrCreateMissionFungibleToken,
  loadOrCreateMissionMetadata,
  loadOrCreateUser
} from "../helpers/loadOrCreate";

let context = dataSource.context();
let starAddress = Address.fromString(context.getString("Star"));

export function handleTokenMinted(event: TokenMinted): void {
  let action = loadOrCreateAction(
    event.transaction.hash,
    event.logIndex,
    event
  );

  let actionMetadata = loadOrCreateActionMetadata(
    event.transaction.hash,
    event.logIndex
  );

  let user = loadOrCreateUser(event.params.to, event);

  actionMetadata.name = event.params.id.toString();
  actionMetadata.URI = event.params.uri;

  action.user = user.id;
  action.xp_rewarded = event.params.amount;
  action.star = starAddress.toHex();
  action.metadata = actionMetadata.id;

  actionMetadata.save();
  action.save();
}
export function handleTokenTransferred(event: TokenTransferred): void {
  let mission = loadOrCreateMission(event.transaction.hash, event);

  let missionMetadata = loadOrCreateMissionMetadata(
    event.transaction.hash,
    event.logIndex
  );

  let missionFungibleToken = loadOrCreateMissionFungibleToken(
    event.transaction.hash,
    event.params.token
  );

  let user = loadOrCreateUser(event.params.to, event);

  missionFungibleToken.amount_rewarded = event.params.amount;
  missionFungibleToken.mission = mission.id;
  missionFungibleToken.token = event.params.token.toHex();

  missionMetadata.name = event.params.id.toString();
  missionMetadata.URI = event.params.uri;

  mission.user = user.id;
  mission.star = starAddress.toHex();
  mission.metadata = missionMetadata.id;

  missionFungibleToken.save();
  missionMetadata.save();
  mission.save();
}
export function handleBadgeMinted(event: BadgeMinted): void {
  let mission = loadOrCreateMission(event.transaction.hash, event);

  let boundContract = BadgeContract.bind(event.params.token);

  let missionMetadata = loadOrCreateMissionMetadata(
    event.transaction.hash,
    event.logIndex
  );

  let tokenId = boundContract.totalSupply().minus(BigInt.fromI32(1));

  let missionBadge = loadOrCreateBadgeToken(event.params.token, tokenId, event);

  let user = loadOrCreateUser(event.params.to, event);

  missionMetadata.name = event.params.id.toString();
  missionMetadata.URI = event.params.uri;

  mission.user = user.id;
  mission.star = starAddress.toHex();
  mission.metadata = missionMetadata.id;

  let missionBadges = mission.badges;
  missionBadges.push(missionBadge.id);
  mission.badges = missionBadges;

  missionBadge.badge = event.params.token.toHex();
  missionBadge.metadataURI = event.params.uri;
  missionBadge.owner = user.id;

  missionBadge.save();
  missionMetadata.save();
  mission.save();
}
export function handleBadgeTransferred(event: BadgeTransferred): void {
  let mission = loadOrCreateMission(event.transaction.hash, event);

  let missionMetadata = loadOrCreateMissionMetadata(
    event.transaction.hash,
    event.logIndex
  );

  let missionBadge = loadBadgeToken(
    event.params.token,
    event.params.tokenId.toHex()
  );

  let user = loadOrCreateUser(event.params.to, event);
  missionMetadata.name = event.params.id.toString();
  missionMetadata.URI = event.params.uri;

  mission.user = user.id;
  mission.star = starAddress.toHex();
  mission.metadata = missionMetadata.id;

  let missionBadges = mission.badges;

  if (missionBadges && missionBadge) {
    missionBadges.push(missionBadge.id);
  }

  missionMetadata.save();
  mission.save();
}
