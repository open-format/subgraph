import { Address, ethereum } from "@graphprotocol/graph-ts";
import { Badge, FungibleToken } from "../../generated/schema";
import { createExternalBadge, createExternalFungibleToken } from "./create";
import { loadOrCreateAppFungibleToken } from "./loadOrCreate";
import { log } from "matchstick-as";

export function associateAppWithToken(appAddress: Address, tokenAddress: Address, event: ethereum.Event): void {
  // Check token exists
  let fungibleToken = FungibleToken.load(tokenAddress.toHex())
  if (!fungibleToken) {
    createExternalFungibleToken(tokenAddress, event)
  }
  // Ensure app has an association with fungibleToken
  let appFungibleToken = loadOrCreateAppFungibleToken(appAddress, tokenAddress)
  appFungibleToken.save()
}

export function associateAppWithBadge(appAddress: Address, badgeAddress: Address, event: ethereum.Event): void {
  // Check badge exists
  let badge = Badge.load(badgeAddress.toHex())
  if (!badge) {
    badge = createExternalBadge(badgeAddress, event)
  }

  /*
    TODO: make app-badge a many to many relationship, replace below if statement with the following:
  // Ensure app has an association with badge
  let appBadge = loadOrCreateAppBadge(appAddress, badgeAddress)
  appBadge.save()
  */

  log.debug('badge.app: {}', [badge.app])
  log.debug('app: {}', [appAddress.toHex()])

  if (!badge.app) {
    badge.app = appAddress.toHex()
  }

  badge.save()
}