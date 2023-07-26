import {Address, ethereum} from "@graphprotocol/graph-ts";
import {
  Badge,
  BadgeToken,
  Constellation,
  FungibleToken,
  FungibleTokenBalance,
  FungibleTokenMetadata,
  Star,
  User
} from "../../generated/schema";
import {BadgeId, TokenBalanceId} from "./idTemplates";

export function loadOrCreateStar(
  appAddress: Address,
  event: ethereum.Event
): Star {
  const id = appAddress.toHex();
  let _star = Star.load(id);

  if (!_star) {
    _star = new Star(id);
    _star.createdAt = event.block.timestamp;
    _star.createdAtBlock = event.block.number;
  }

  _star.updatedAt = event.block.timestamp;
  _star.updatedAtBlock = event.block.number;

  return _star as Star;
}

export function loadOrCreateConstellation(
  constellationAddress: Address,
  event: ethereum.Event
): Constellation {
  const id = constellationAddress.toHex();
  let _constellation = Constellation.load(id);

  if (!_constellation) {
    _constellation = new Constellation(id);
    _constellation.createdAt = event.block.timestamp;
    _constellation.createdAtBlock = event.block.number;
  }

  _constellation.updatedAt = event.block.timestamp;
  _constellation.updatedAtBlock = event.block.number;

  return _constellation as Constellation;
}

export function loadOrCreateBadge(
  badgeAddress: Address,
  event: ethereum.Event
): Badge {
  const id = badgeAddress.toHex();
  let _badge = Badge.load(id);

  if (!_badge) {
    _badge = new Badge(id);
    _badge.createdAt = event.block.timestamp;
    _badge.createdAtBlock = event.block.number;
  }

  _badge.updatedAt = event.block.timestamp;
  _badge.updatedAtBlock = event.block.number;

  return _badge as Badge;
}

export function loadOrCreateBadgeToken(
  contractAddress: Address,
  tokenId: string,
  event: ethereum.Event
): BadgeToken {
  const id = BadgeId(contractAddress, tokenId);
  let _BadgeToken = BadgeToken.load(id);

  if (!_BadgeToken) {
    _BadgeToken = new BadgeToken(id);
    _BadgeToken.createdAt = event.block.timestamp;
    _BadgeToken.createdAtBlock = event.block.number;
  }

  _BadgeToken.updatedAt = event.block.timestamp;
  _BadgeToken.updatedAtBlock = event.block.number;

  return _BadgeToken as BadgeToken;
}

export function loadOrCreateUser(
  userAddress: Address,
  event: ethereum.Event
): User {
  const id = userAddress.toHex();
  let _User = User.load(id);

  if (!_User) {
    _User = new User(id);
    _User.createdAt = event.block.timestamp;
    _User.createdAtBlock = event.block.number;
  }

  _User.updatedAt = event.block.timestamp;
  _User.updatedAtBlock = event.block.number;

  return _User as User;
}

export function loadOrCreateFungibleToken(
  tokenAddress: Address,
  event: ethereum.Event
): FungibleToken {
  const id = tokenAddress.toHex();
  let _FungibleToken = FungibleToken.load(id);

  if (!_FungibleToken) {
    _FungibleToken = new FungibleToken(id);
    _FungibleToken.createdAt = event.block.timestamp;
    _FungibleToken.createdAtBlock = event.block.number;
  }

  _FungibleToken.updatedAt = event.block.timestamp;
  _FungibleToken.updatedAtBlock = event.block.number;

  return _FungibleToken as FungibleToken;
}

export function loadOrCreateFungibleTokenMetadata(
  tokenAddress: Address,
  event: ethereum.Event
): FungibleTokenMetadata {
  const id = tokenAddress.toHex();
  let _FungibleTokenMetadata = FungibleTokenMetadata.load(id);

  if (!_FungibleTokenMetadata) {
    _FungibleTokenMetadata = new FungibleTokenMetadata(id);
    _FungibleTokenMetadata.createdAt = event.block.timestamp;
    _FungibleTokenMetadata.createdAtBlock = event.block.number;
  }

  _FungibleTokenMetadata.updatedAt = event.block.timestamp;
  _FungibleTokenMetadata.updatedAtBlock = event.block.number;

  return _FungibleTokenMetadata as FungibleTokenMetadata;
}

// export function loadOrCreateToken(
//   contractAddress: Address,
//   event: ethereum.Event
// ): Token {
//   const id = contractAddress.toHex();
//   let _Token = Token.load(id);

//   if (!_Token) {
//     _Token = new Token(id);
//     _Token.createdAt = event.block.timestamp;
//     _Token.createdAtBlock = event.block.number;
//   }

//   _Token.updatedAt = event.block.timestamp;
//   _Token.updatedAtBlock = event.block.number;

//   return _Token as Token;
// }

export function loadOrCreateFungibleTokenBalance(
  contractAddress: Address,
  userAddress: Address,
  event: ethereum.Event
): FungibleTokenBalance {
  const id = TokenBalanceId(contractAddress, userAddress);
  let _FungibleTokenBalance = FungibleTokenBalance.load(id);

  if (!_FungibleTokenBalance) {
    _FungibleTokenBalance = new FungibleTokenBalance(id);
    _FungibleTokenBalance.createdAt = event.block.timestamp;
    _FungibleTokenBalance.createdAtBlock = event.block.number;
  }

  _FungibleTokenBalance.updatedAt = event.block.timestamp;
  _FungibleTokenBalance.updatedAtBlock = event.block.number;

  return _FungibleTokenBalance as FungibleTokenBalance;
}
