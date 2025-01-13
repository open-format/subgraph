/*
  All functions in this file are related to deprecated entities.
  TODO: remove when actions/missions entities are removed from schema
*/

import { Address, BigInt, Bytes, ByteArray, dataSource, ethereum } from "@graphprotocol/graph-ts";
import { ERC721Base as BadgeContract } from "../../generated/templates/ERC721Base/ERC721Base";
import {
  BadgeMinted,
  BadgeMinted1,
  BadgeTransferred,
  ERC721Minted,
  TokenMinted,
  TokenTransferred,
} from "../../generated/templates/RewardsFacet/RewardsFacet";
import { 
  loadBadgeToken,
  loadOrCreateAction,
  loadOrCreateActionMetadata,
  loadOrCreateBadge,
  loadOrCreateBadgeToken,
  loadOrCreateMission,
  loadOrCreateMissionFungibleToken,
  loadOrCreateMissionMetadata,
  loadOrCreateUser,
  associateAppWithToken
} from "../helpers";

export function DEPRECATED_handleTokenMinted(event: TokenMinted): void {
  let context = dataSource.context();
  let appAddress = Address.fromString(context.getString("App"));
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

    actionMetadata.name = event.params.id.toString();
    actionMetadata.URI = event.params.uri;

    action.user = user.id;
    action.xp_rewarded = event.params.amount;
    action.app = appAddress.toHex();
    action.metadata = actionMetadata.id;

    actionMetadata.save();
    action.save();
    user.save();
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

    associateAppWithToken(appAddress, event.params.token, event);

    // TODO: this looks like if a any token is rewarded as part of a mission it will wrongly count as xp
    mission.xp_rewarded = event.params.amount;

    missionFungibleToken.amount_rewarded = event.params.amount;
    missionFungibleToken.mission = mission.id;
    missionFungibleToken.token = event.params.token.toHex();

    missionMetadata.name = event.params.id.toString();
    missionMetadata.URI = event.params.uri;

    mission.user = user.id;
    mission.app = appAddress.toHex();
    mission.metadata = missionMetadata.id;

    missionFungibleToken.save();
    missionMetadata.save();
    mission.save();
    user.save();
  }
}
export function DEPRECATED_handleTokenTransferred(event: TokenTransferred): void {
  let context = dataSource.context();
  let appAddress = Address.fromString(context.getString("App"));
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

  associateAppWithToken(appAddress, event.params.token, event);

  let user = loadOrCreateUser(event.params.to, event);

  missionFungibleToken.amount_rewarded = event.params.amount;
  missionFungibleToken.mission = mission.id;
  missionFungibleToken.token = event.params.token.toHex();

  missionMetadata.name = event.params.id.toString();
  missionMetadata.URI = event.params.uri;

  mission.user = user.id;
  mission.app = appAddress.toHex();
  mission.metadata = missionMetadata.id;

  missionFungibleToken.save();
  missionMetadata.save();

  mission.save();
  user.save();
}


// handles ERC721 tokens being rewarded with the uri being emitted from the event
export function DEPRECATED_handleERC721Minted(event: ERC721Minted): void {
  handleERC721MintedEvent(new BadgeMintedParams(
    event.params.token,
    event.params.quantity,
    event.params.to,
    event.params.id,
    event.params.activityType,
    Bytes.fromByteArray(ByteArray.fromUTF8(event.params.uri))
  ), event)
}

// handles ERC721 tokens being rewarded with the uri being emitted from the event
// but with the event named BadgeMinted
export function DEPRECATED_handleBadgeMintedLegacy(event: BadgeMinted1): void {
  handleERC721MintedEvent(new BadgeMintedParams(
    event.params.token,
    event.params.quantity,
    event.params.to,
    event.params.id,
    event.params.activityType,
    Bytes.fromByteArray(ByteArray.fromUTF8(event.params.uri))
  ), event)
}

// handles ERC721 badge tokens being rewarded with the uri on the contract
export function DEPRECATED_handleBadgeMinted(event: BadgeMinted): void {
  handleERC721MintedEvent(new BadgeMintedParams(
    event.params.token,
    event.params.quantity,
    event.params.to,
    event.params.activityId,
    event.params.activityType,
    event.params.data
  ), event)
}

// takes a common param interface for erc721 minted events and indexes them
// {
//   token: Address;
//   to: Address;
//   quantity: BigInt;
//   activityId: Bytes;
//   activityType: Bytes;
//   data: Bytes;
// }
function handleERC721MintedEvent(
  params: BadgeMintedParams
  , event: ethereum.Event): void {
  let context = dataSource.context();
  let appAddress = Address.fromString(context.getString("App"));

  let mission = loadOrCreateMission(
    event.transaction.hash,
    params.activityId,
    event
  );

  let boundContract = BadgeContract.bind(params.token);

  let missionMetadata = loadOrCreateMissionMetadata(
    event.transaction.hash,
    params.activityId
  );
  let user = loadOrCreateUser(params.to, event);
  let badge = loadOrCreateBadge(params.token, event);
  let badgeMetadataURI = badge.metadataURI
  let totalSupply = boundContract.totalSupply();
  let quantity = params.quantity;
  let missionBadges = mission.badges;

  //@DEV currently, if the same Badge gets rewarded in more that one mission in a single transactions
  //we can't calculate the tokenId.

  for (let i = 0; i < quantity.toI32(); i++) {
    let tokenId = totalSupply.minus(quantity).plus(BigInt.fromI32(i));
    let missionBadge = loadOrCreateBadgeToken(
      params.token,
      tokenId,
      event
    );

    missionBadge.badge = params.token.toHex();
    missionBadge.owner = user.id;
    missionBadge.metadataURI = badgeMetadataURI ? null : params.data.toString();

    missionBadge.save();

    missionBadges.push(missionBadge.id);
  }

  missionMetadata.URI = params.data.toString();
  missionMetadata.name = params.activityId.toString();

  mission.user = user.id;
  mission.app = appAddress.toHex();
  mission.metadata = missionMetadata.id;
  mission.badges = missionBadges;

  missionMetadata.save();
  mission.save();
  user.save();
}

export function DEPRECATED_handleBadgeTransferred(event: BadgeTransferred): void {
  let context = dataSource.context();
  let appAddress = Address.fromString(context.getString("App"));

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
  mission.app = appAddress.toHex();
  mission.metadata = missionMetadata.id;

  let missionBadges = mission.badges;

  if (missionBadges && missionBadge) {
    missionBadges.push(missionBadge.id);
    mission.badges = missionBadges;
  }

  missionMetadata.save();
  mission.save();
  user.save();
}

export class BadgeMintedParams {
  _token: Address
  _quantity: BigInt
  _to: Address
  _activityId: Bytes
  _activityType: Bytes
  _data: Bytes

  constructor(
    token: Address,
    quantity: BigInt,
    to: Address,
    activityId: Bytes,
    activityType: Bytes,
    data: Bytes
  ) {
    this._token = token
    this._quantity = quantity
    this._to = to
    this._activityId = activityId
    this._activityType = activityType
    this._data = data
  }

  get token(): Address {
    return this._token;
  }

  get quantity(): BigInt {
    return this._quantity;
  }

  get to(): Address {
    return this._to;
  }

  get activityId(): Bytes {
    return this._activityId;
  }

  get activityType(): Bytes {
    return this._activityType;
  }

  get data(): Bytes {
    return this._data;
  }
}
