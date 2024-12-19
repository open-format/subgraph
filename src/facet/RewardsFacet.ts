import { Address, BigInt, dataSource, ethereum } from "@graphprotocol/graph-ts";
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
import { associateAppWithBadge, associateAppWithToken, createRewardData, saveUserRewardData, Zero } from "../helpers";
import {
  DEPRECATED_handleBadgeMinted,
  DEPRECATED_handleERC721Minted,
  DEPRECATED_handleBadgeMintedLegacy,
  DEPRECATED_handleBadgeTransferred,
  DEPRECATED_handleTokenMinted,
  DEPRECATED_handleTokenTransferred
} from "./DEPRECATED_RewardsFacet";
import { Badge } from "../../generated/schema";

export function handleTokenMinted(event: TokenMinted): void {
  DEPRECATED_handleTokenMinted(event)

  let context = dataSource.context();
  let appAddress = Address.fromString(context.getString("App"));
  let user = loadOrCreateUser(event.params.to, event);

  associateAppWithToken(appAddress, event.params.token, event)
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

  let rewardData = createRewardData(event)
  rewardData.appId = appAddress.toHex()
  rewardData.rewardId = event.params.id.toString()
  rewardData.rewardType = event.params.activityType.toString()
  rewardData.metadataURI = event.params.uri
  rewardData.userId = user.id
  rewardData.tokenId = token.id
  rewardData.tokenAmount = event.params.amount
  rewardData.badgeCount = 0
  rewardData.save()

  saveUserRewardData(appAddress, event.params.to, event);
}

export function handleTokenTransferred(event: TokenTransferred): void {
  DEPRECATED_handleTokenTransferred(event)

  let context = dataSource.context();
  let appAddress = Address.fromString(context.getString("App"));
  let user = loadOrCreateUser(event.params.to, event);

  associateAppWithToken(appAddress, event.params.token, event)
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

  let rewardData = createRewardData(event)
  rewardData.appId = appAddress.toHex()
  rewardData.rewardId = event.params.id.toString()
  rewardData.rewardType = event.params.activityType.toString()
  rewardData.metadataURI = event.params.uri
  rewardData.userId = user.id
  rewardData.tokenId = token.id
  rewardData.tokenAmount = event.params.amount
  rewardData.badgeCount = 0
  rewardData.save()

  saveUserRewardData(appAddress, event.params.to, event);
}

// handles ERC721 tokens being rewarded with the uri being emitted from the event
export function handleERC721Minted(event: ERC721Minted): void {
  DEPRECATED_handleERC721Minted(event)

  let context = dataSource.context();
  let appAddress = Address.fromString(context.getString("App"))
  let user = loadOrCreateUser(event.params.to, event)

  associateAppWithBadge(appAddress, event.params.token, event)
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

  let badgeTokens = indexBadgeTokens(badge, event.params.quantity, user.id, event.params.uri.toString(), event)
  reward.badge = badge.id
  reward.badgeTokens = badgeTokens
  reward.badgeCount = badgeTokens.length
  reward.tokenAmount = Zero

  user.save()
  reward.save()

  let rewardData = createRewardData(event)
  rewardData.appId = appAddress.toHex()
  rewardData.rewardId = event.params.id.toString()
  rewardData.rewardType = event.params.activityType.toString()
  rewardData.metadataURI = event.params.uri
  rewardData.userId = user.id
  rewardData.badgeId = badge.id
  rewardData.badgeCount = badgeTokens.length
  rewardData.tokenAmount = Zero
  rewardData.save()

  saveUserRewardData(appAddress, event.params.to, event);
}

// handles ERC721 badge tokens being rewarded with the uri on the contract
export function handleBadgeMinted(event: BadgeMinted): void {
  DEPRECATED_handleBadgeMinted(event)

  let context = dataSource.context();
  let appAddress = Address.fromString(context.getString("App"))
  let user = loadOrCreateUser(event.params.to, event)

  associateAppWithBadge(appAddress, event.params.token, event)
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

  let badgeTokens = indexBadgeTokens(badge, event.params.quantity, user.id, event.params.data.toString(), event)
  reward.badge = badge.id
  reward.badgeTokens = badgeTokens
  reward.badgeCount = badgeTokens.length
  reward.tokenAmount = Zero

  user.save()
  reward.save()

  let rewardData = createRewardData(event)
  rewardData.appId = appAddress.toHex()
  rewardData.rewardId = event.params.activityId.toString()
  rewardData.rewardType = event.params.activityType.toString()
  rewardData.metadataURI = event.params.data.toString()
  rewardData.userId = user.id
  rewardData.badgeId = badge.id
  rewardData.badgeCount = badgeTokens.length
  rewardData.tokenAmount = Zero
  rewardData.save()

  saveUserRewardData(appAddress, event.params.to, event);
}

// TODO: Remove as event no longer emitted from contracts, and only needed to maintain arbitrum-sepolia history
// handles ERC721 tokens being rewarded with the uri being emitted from the event
// but with the event named BadgeMinted
export function handleBadgeMintedLegacy(event: BadgeMinted1): void {
  DEPRECATED_handleBadgeMintedLegacy(event)
}

export function handleBadgeTransferred(event: BadgeTransferred): void {
  DEPRECATED_handleBadgeTransferred(event)

  let context = dataSource.context()
  let appAddress = Address.fromString(context.getString("App"))
  let user = loadOrCreateUser(event.params.to, event)

  associateAppWithBadge(appAddress, event.params.token, event)
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

  let badgeToken = loadOrCreateBadgeToken(
    event.params.token,
    event.params.tokenId,
    event
  )
  badgeToken.badge = badge.id
  badgeToken.owner = user.id
  badgeToken.save()

  reward.badge = badge.id
  reward.badgeTokens = [badgeToken.id]
  reward.badgeCount = 1
  reward.tokenAmount = Zero

  user.save()
  reward.save()

  let rewardData = createRewardData(event)
  rewardData.appId = appAddress.toHex()
  rewardData.rewardId = event.params.id.toString()
  rewardData.rewardType = event.params.activityType.toString()
  rewardData.metadataURI = event.params.uri
  rewardData.userId = user.id
  rewardData.badgeId = badge.id
  rewardData.badgeCount = 1
  rewardData.tokenAmount = Zero
  rewardData.save()

  saveUserRewardData(appAddress, event.params.to, event);
}

function indexBadgeTokens(badge: Badge, quantity: BigInt, user: string, metadataURI: string, event: ethereum.Event): Array<string> {
  let badgeTokens: Array<string> = []
  let badgeAddress = Address.fromString(badge.id)
  let boundContract = BadgeContract.bind(badgeAddress)
  let totalSupply = boundContract.totalSupply()
  for (let i = 0; i < quantity.toI32(); i++) {
    let id = totalSupply.minus(quantity).plus(BigInt.fromI32(i))
    let badgeToken = loadOrCreateBadgeToken(
      badgeAddress,
      id,
      event
    )

    badgeToken.badge = badge.id
    badgeToken.owner = user
    badgeToken.metadataURI = badge.metadataURI ? null : metadataURI
    badgeToken.save()

    badgeTokens.push(badgeToken.id)
  }

  return badgeTokens
}
