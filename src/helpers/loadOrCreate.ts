import {Address, BigInt, Bytes, ethereum} from "@graphprotocol/graph-ts";
import {
  AccessKey,
  Action,
  ActionMetadata,
  Badge,
  BadgeToken,
  Constellation,
  FungibleToken,
  FungibleTokenBalance,
  FungibleTokenMetadata,
  Mission,
  MissionFungibleToken,
  MissionMetadata,
  Star,
  StarStats,
  User,
} from "../../generated/schema";
import {ActionId, BadgeId, MissionId, TokenBalanceId} from "./idTemplates";

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
  tokenId: BigInt,
  event: ethereum.Event
): BadgeToken {
  const id = BadgeId(contractAddress, tokenId.toHex());
  let _BadgeToken = BadgeToken.load(id);

  if (!_BadgeToken) {
    _BadgeToken = new BadgeToken(id);
    _BadgeToken.createdAt = event.block.timestamp;
    _BadgeToken.createdAtBlock = event.block.number;
    _BadgeToken.tokenId = tokenId;
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

export function loadOrCreateActionMetadata(
  transactionHash: Bytes,
  logIndex: BigInt
): ActionMetadata {
  const id = ActionId(transactionHash, logIndex);
  let _ActionMetadata = ActionMetadata.load(id);

  if (!_ActionMetadata) {
    _ActionMetadata = new ActionMetadata(id);
  }

  return _ActionMetadata as ActionMetadata;
}

export function loadOrCreateAction(
  transactionHash: Bytes,
  logIndex: BigInt,
  event: ethereum.Event
): Action {
  const id = ActionId(transactionHash, logIndex);
  let _Action = Action.load(id);

  if (!_Action) {
    _Action = new Action(id);
    _Action.createdAt = event.block.timestamp;
    _Action.createdAtBlock = event.block.number;
  }

  return _Action as Action;
}

export function loadOrCreateMission(
  transactionHash: Bytes,
  event: ethereum.Event
): Mission {
  const id = transactionHash.toHex();
  let _Mission = Mission.load(id);

  if (!_Mission) {
    _Mission = new Mission(id);
    _Mission.createdAt = event.block.timestamp;
    _Mission.createdAtBlock = event.block.number;
    _Mission.badges = [];
  }

  return _Mission as Mission;
}

export function loadOrCreateMissionFungibleToken(
  transactionHash: Bytes,
  tokenAddress: Address
): MissionFungibleToken {
  const id = transactionHash.toHex() + "-" + tokenAddress.toHex();
  let _MissionFungibleToken = MissionFungibleToken.load(id);

  if (!_MissionFungibleToken) {
    _MissionFungibleToken = new MissionFungibleToken(id);
  }

  return _MissionFungibleToken as MissionFungibleToken;
}

export function loadOrCreateMissionMetadata(
  transactionHash: Bytes,
  logIndex: BigInt
): MissionMetadata {
  const id = MissionId(transactionHash, logIndex);
  let _MissionMetadata = MissionMetadata.load(id);

  if (!_MissionMetadata) {
    _MissionMetadata = new MissionMetadata(id);
  }

  return _MissionMetadata as MissionMetadata;
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

export function loadOrCreateAccessKey(
  tokenId: BigInt,
  event: ethereum.Event
): AccessKey {
  const id = tokenId.toHex();
  let _AccessKey = AccessKey.load(id);

  if (!_AccessKey) {
    _AccessKey = new AccessKey(id);
    _AccessKey.createdAt = event.block.timestamp;
    _AccessKey.createdAtBlock = event.block.number;
  }

  _AccessKey.updatedAt = event.block.timestamp;
  _AccessKey.updatedAtBlock = event.block.number;

  return _AccessKey as AccessKey;
}

export function loadOrCreateStarStats(
  starId: Address,
  event: ethereum.Event
): StarStats {
  const id = starId.toHex();
  let _StarStats = StarStats.load(id);

  if (!_StarStats) {
    _StarStats = new StarStats(id);
    _StarStats.createdAt = event.block.timestamp;
    _StarStats.createdAtBlock = event.block.number;
    _StarStats.totalActionsComplete = BigInt.fromI32(0);
    _StarStats.totalMissionsComplete = BigInt.fromI32(0);
    _StarStats.totalRewardTokensAwarded = BigInt.fromI32(0);
    _StarStats.totalBadgesAwarded = BigInt.fromI32(0);
    _StarStats.totalXPAwarded = BigInt.fromI32(0);
    _StarStats.uniqueUsersCount = BigInt.fromI32(0);
  }

  _StarStats.updatedAt = event.block.timestamp;
  _StarStats.updatedAtBlock = event.block.number;

  return _StarStats as StarStats;
}
