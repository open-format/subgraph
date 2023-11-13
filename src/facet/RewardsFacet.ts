import {Address, BigInt, dataSource} from "@graphprotocol/graph-ts";
import {ERC721Base as BadgeContract} from "../../generated/templates/ERC721Base/ERC721Base";
import {
  BadgeMinted,
  BadgeTransferred,
  TokenMinted,
  TokenTransferred,
} from "../../generated/templates/RewardsFacet/RewardsFacet";
import {loadBadgeToken} from "../helpers";
import {
  loadOrCreateAction,
  loadOrCreateActionMetadata,
  loadOrCreateBadgeToken,
  loadOrCreateMission,
  loadOrCreateMissionFungibleToken,
  loadOrCreateMissionMetadata,
  loadOrCreateStarStats,
  loadOrCreateUser,
} from "../helpers/loadOrCreate";

let context = dataSource.context();
let starAddress = Address.fromString(context.getString("Star"));

export function handleTokenMinted(event: TokenMinted): void {
  let user = loadOrCreateUser(event.params.to, event);

  if (event.params.activityType.toString() == "ACTION") {
    let action = loadOrCreateAction(
      event.transaction.hash,
      event.logIndex,
      event
    );

    let actionMetadata = loadOrCreateActionMetadata(
      event.transaction.hash,
      event.logIndex
    );

    let starStats = loadOrCreateStarStats(starAddress, event);

    actionMetadata.name = event.params.id.toString();
    actionMetadata.URI = event.params.uri;

    action.user = user.id;
    action.xp_rewarded = event.params.amount;
    action.star = starAddress.toHex();
    action.metadata = actionMetadata.id;

    starStats.totalXPAwarded = starStats.totalXPAwarded.plus(
      action.xp_rewarded
    );
    starStats.totalActionsComplete = starStats.totalActionsComplete.plus(
      BigInt.fromI32(1)
    );

    if (starStats.uniqueUsers == null) {
      starStats.uniqueUsers = new Array<string>();
    }

    // Explicitly cast to non-nullable type
    let uniqueUsers = starStats.uniqueUsers as Array<string>;

    if (uniqueUsers.indexOf(user.id) == -1) {
      uniqueUsers.push(user.id);
      starStats.uniqueUsersCount = starStats.uniqueUsersCount.plus(
        BigInt.fromI32(1)
      );
    }

    starStats.uniqueUsers = uniqueUsers;

    actionMetadata.save();
    action.save();
    starStats.save();
  } else {
    let mission = loadOrCreateMission(
      event.transaction.hash,
      event.params.id,
      event
    );

    let missionMetadata = loadOrCreateMissionMetadata(
      event.transaction.hash,
      event.params.id
    );

    let missionFungibleToken = loadOrCreateMissionFungibleToken(
      event.transaction.hash,
      event.params.id,
      event.params.token
    );

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
    user.save();
  }
}
export function handleTokenTransferred(event: TokenTransferred): void {
  let mission = loadOrCreateMission(
    event.transaction.hash,
    event.params.id,
    event
  );

  let missionMetadata = loadOrCreateMissionMetadata(
    event.transaction.hash,
    event.params.id
  );

  let missionFungibleToken = loadOrCreateMissionFungibleToken(
    event.transaction.hash,
    event.params.id,
    event.params.token
  );

  let user = loadOrCreateUser(event.params.to, event);
  let starStats = loadOrCreateStarStats(starAddress, event);

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

  starStats.totalMissionsComplete = starStats.totalMissionsComplete.plus(
    BigInt.fromI32(1)
  );

  starStats.totalRewardTokensAwarded = starStats.totalRewardTokensAwarded.plus(
    event.params.amount
  );

  mission.save();
  starStats.save();
}
export function handleBadgeMinted(event: BadgeMinted): void {
  let mission = loadOrCreateMission(
    event.transaction.hash,
    event.params.id,
    event
  );

  let boundContract = BadgeContract.bind(event.params.token);

  let missionMetadata = loadOrCreateMissionMetadata(
    event.transaction.hash,
    event.params.id
  );
  let user = loadOrCreateUser(event.params.to, event);
  let starStats = loadOrCreateStarStats(starAddress, event);
  let totalSupply = boundContract.totalSupply();
  let quantity = event.params.quantity;
  let missionBadges = mission.badges;

  //@DEV currently, if the same Badge gets rewarded in more that one mission in a single transactions
  //we can't calculate the tokenId.

  for (let i = 0; i < quantity.toI32(); i++) {
    let tokenId = totalSupply.minus(quantity).plus(BigInt.fromI32(i));
    let missionBadge = loadOrCreateBadgeToken(
      event.params.token,
      tokenId,
      event
    );

    missionBadge.badge = event.params.token.toHex();
    missionBadge.metadataURI = event.params.uri;
    missionBadge.owner = user.id;
    missionBadge.save();

    missionBadges.push(missionBadge.id);
  }

  missionMetadata.name = event.params.id.toString();
  missionMetadata.URI = event.params.uri;

  mission.user = user.id;
  mission.star = starAddress.toHex();
  mission.metadata = missionMetadata.id;
  mission.badges = missionBadges;

  starStats.totalBadgesAwarded = starStats.totalBadgesAwarded.plus(quantity);

  starStats.save();
  missionMetadata.save();
  mission.save();
}
export function handleBadgeTransferred(event: BadgeTransferred): void {
  let mission = loadOrCreateMission(
    event.transaction.hash,
    event.params.id,
    event
  );

  let missionMetadata = loadOrCreateMissionMetadata(
    event.transaction.hash,
    event.params.id
  );

  let missionBadge = loadBadgeToken(event.params.token, event.params.tokenId);

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
