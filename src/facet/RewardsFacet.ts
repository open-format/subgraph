import { Address, BigInt, dataSource } from "@graphprotocol/graph-ts";
import { ERC721Base as BadgeContract } from "../../generated/templates/ERC721Base/ERC721Base";
import {
  BadgeMinted,
  BadgeMinted1,
  ERC721Minted,
  BadgeTransferred,
  TokenMinted,
  TokenTransferred,

} from "../../generated/templates/RewardsFacet/RewardsFacet";
import {
  loadOrCreateBadge,
  loadOrCreateBadgeToken,
  loadOrCreateFungibleToken,
  loadOrCreateReward,
  loadOrCreateUser,
} from "../helpers/loadOrCreate";
import { Zero } from "../helpers";
import {
  DEPRECATED_handleBadgeMinted,
  DEPRECATED_handleERC721Minted,
  DEPRECATED_handleBadgeMintedLegacy,
  DEPRECATED_handleBadgeTransferred,
  DEPRECATED_handleTokenMinted,
  DEPRECATED_handleTokenTransferred
} from "./DEPRECATED_RewardsFacet";

export function handleTokenMinted(event: TokenMinted): void {
  DEPRECATED_handleTokenMinted(event)

  let context = dataSource.context();
  let appAddress = Address.fromString(context.getString("App"));
  let user = loadOrCreateUser(event.params.to, event);
  let token = loadOrCreateFungibleToken(event.params.token, event)

  let reward = loadOrCreateReward(
    event.params.id.toString(),
    event.params.activityType.toString(),
    event.params.uri,
    event
  )

  reward.app = appAddress.toHex()
  reward.rewardId = event.params.id.toString()
  reward.rewardType = event.params.activityType.toString()
  reward.metadataURI = event.params.uri
  reward.user = user.id

  reward.token = token.id
  reward.tokenAmount = event.params.amount

  reward.badgeCount = 0

  user.save()
  token.save()
  reward.save()
}

export function handleTokenTransferred(event: TokenTransferred): void {
  DEPRECATED_handleTokenTransferred(event)

  let context = dataSource.context();
  let appAddress = Address.fromString(context.getString("App"));
  let user = loadOrCreateUser(event.params.to, event);
  let token = loadOrCreateFungibleToken(event.params.token, event)

  let reward = loadOrCreateReward(
    event.params.id.toString(),
    event.params.activityType.toString(),
    event.params.uri,
    event
  )

  reward.app = appAddress.toHex()
  reward.rewardId = event.params.id.toString()
  reward.rewardType = event.params.activityType.toString()
  reward.metadataURI = event.params.uri
  reward.user = user.id

  reward.token = token.id
  reward.tokenAmount = event.params.amount

  reward.badgeCount = 0

  user.save()
  token.save()
  reward.save()
}

// handles ERC721 tokens being rewarded with the uri being emitted from the event
export function handleERC721Minted(event: ERC721Minted): void {
  DEPRECATED_handleERC721Minted(event)

  let context = dataSource.context();
  let appAddress = Address.fromString(context.getString("App"));
  let user = loadOrCreateUser(event.params.to, event);
  let badge = loadOrCreateBadge(event.params.token, event)

  let reward = loadOrCreateReward(
    event.params.id.toString(),
    event.params.activityType.toString(),
    event.params.uri.toString(),
    event
  )

  reward.app = appAddress.toHex()
  reward.rewardId = event.params.id.toString()
  reward.rewardType = event.params.activityType.toString()
  reward.metadataURI = event.params.uri.toString()
  reward.user = user.id

  reward.badge = badge.id
  let badges: Array<string> = []
  let boundContract = BadgeContract.bind(event.params.token)
  let totalSupply = boundContract.totalSupply()
  let quantity = event.params.quantity
  for (let i = 0; i < quantity.toI32(); i++) {
    let id = totalSupply.minus(quantity).plus(BigInt.fromI32(i))
    let badgeToken = loadOrCreateBadgeToken(
      event.params.token,
      id,
      event
    )

    badgeToken.badge = badge.id
    badgeToken.owner = user.id
    badgeToken.metadataURI = badge.metadataURI ? null : event.params.uri.toString()
    badgeToken.save()

    badges.push(badgeToken.id)
  }
  reward.badges = badges
  reward.badgeCount = badges.length

  reward.tokenAmount = Zero

  user.save()
  badge.save()
  reward.save()
}

// TODO: Remove as event no longer emitted from contracts, and only needed to maintain testnet history
// handles ERC721 tokens being rewarded with the uri being emitted from the event
// but with the event named BadgeMinted
export function handleBadgeMintedLegacy(event: BadgeMinted1): void {
  DEPRECATED_handleBadgeMintedLegacy(event)
}

// handles ERC721 badge tokens being rewarded with the uri on the contract
export function handleBadgeMinted(event: BadgeMinted): void {
  DEPRECATED_handleBadgeMinted(event)

  let context = dataSource.context();
  let appAddress = Address.fromString(context.getString("App"));
  let user = loadOrCreateUser(event.params.to, event);
  let badge = loadOrCreateBadge(event.params.token, event)

  let reward = loadOrCreateReward(
    event.params.activityId.toString(),
    event.params.activityType.toString(),
    event.params.data.toString(),
    event
  )

  reward.app = appAddress.toHex()
  reward.rewardId = event.params.activityId.toString()
  reward.rewardType = event.params.activityType.toString()
  reward.metadataURI = event.params.data.toString()
  reward.user = user.id

  reward.badge = badge.id
  let badges: Array<string> = []
  let boundContract = BadgeContract.bind(event.params.token)
  let totalSupply = boundContract.totalSupply()
  let quantity = event.params.quantity
  for (let i = 0; i < quantity.toI32(); i++) {
    let id = totalSupply.minus(quantity).plus(BigInt.fromI32(i))
    let badgeToken = loadOrCreateBadgeToken(
      event.params.token,
      id,
      event
    )

    badgeToken.badge = badge.id
    badgeToken.owner = user.id
    badgeToken.metadataURI = badge.metadataURI ? null : event.params.data.toString()
    badgeToken.save()

    badges.push(badgeToken.id)
  }
  reward.badges = badges
  reward.badgeCount = badges.length

  reward.tokenAmount = Zero

  user.save()
  badge.save()
  reward.save()
}

export function handleBadgeTransferred(event: BadgeTransferred): void {
  DEPRECATED_handleBadgeTransferred(event)

  let context = dataSource.context();
  let appAddress = Address.fromString(context.getString("App"));
  let user = loadOrCreateUser(event.params.to, event);
  let badge = loadOrCreateBadge(event.params.token, event)

  let reward = loadOrCreateReward(
    event.params.id.toString(),
    event.params.activityType.toString(),
    event.params.uri.toString(),
    event
  )

  reward.app = appAddress.toHex()
  reward.rewardId = event.params.id.toString()
  reward.rewardType = event.params.activityType.toString()
  reward.metadataURI = event.params.uri.toString()
  reward.user = user.id

  reward.badge = badge.id
  let badgeToken = loadOrCreateBadgeToken(
    event.params.token,
    event.params.tokenId,
    event
  )
  badgeToken.badge = badge.id
  badgeToken.owner = user.id

  reward.badges = [badgeToken.id]
  reward.badgeCount = 1

  reward.tokenAmount = Zero

  user.save()
  reward.save()
  badge.save()
  badgeToken.save()
}
