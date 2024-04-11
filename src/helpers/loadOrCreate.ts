import {Address, BigInt, Bytes, ethereum} from "@graphprotocol/graph-ts";
import {
  AccessKey,
  Action,
  ActionMetadata,
  App,
  AppStats,
  Badge,
  BadgeToken,
  FungibleToken,
  FungibleTokenBalance,
  FungibleTokenMetadata,
  Mission,
  MissionFungibleToken,
  MissionMetadata,
  Stats,
  User,
} from "../../generated/schema";
import {ActionId, BadgeId, MissionId, TokenBalanceId} from "./idTemplates";
import {Zero} from "./numbers";

export function loadOrCreateApp(
  appAddress: Address,
  event: ethereum.Event
): App {
  const id = appAddress.toHex();
  let _app = App.load(id);

  if (!_app) {
    _app = new App(id);
    _app.createdAt = event.block.timestamp;
    _app.createdAtBlock = event.block.number;
  }

  _app.updatedAt = event.block.timestamp;
  _app.updatedAtBlock = event.block.number;

  return _app as App;
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

    const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

    if (_User.id != ZERO_ADDRESS) {
      let stats = loadOrCreateStats();
      stats.uniqueUsers = stats.uniqueUsers.plus(BigInt.fromI32(1));
      stats.save();
    }
  }

  _User.updatedAt = event.block.timestamp;
  _User.updatedAtBlock = event.block.number;

  return _User as User;
}

export function loadOrCreateStats(): Stats {
  let stats = Stats.load("STATS_SINGLETON");

  // If the Stats entity doesn't exist, create it and set uniqueUsers to 0.
  if (!stats) {
    stats = new Stats("STATS_SINGLETON");
    stats.uniqueUsers = BigInt.fromI32(0);
    stats.save();
  }

  return stats as Stats;
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
  actionId: Bytes,
  event: ethereum.Event
): Mission {
  const id = MissionId(transactionHash, actionId);
  let _Mission = Mission.load(id);

  if (!_Mission) {
    _Mission = new Mission(id);
    _Mission.xp_rewarded = Zero;
    _Mission.createdAt = event.block.timestamp;
    _Mission.createdAtBlock = event.block.number;
    _Mission.badges = [];
  }

  return _Mission as Mission;
}

export function loadOrCreateMissionFungibleToken(
  transactionHash: Bytes,
  missionId: Bytes,
  tokenAddress: Address
): MissionFungibleToken {
  const id =
    transactionHash.toHex() +
    "-" +
    missionId.toHex() +
    "-" +
    tokenAddress.toHex();
  let _MissionFungibleToken = MissionFungibleToken.load(id);

  if (!_MissionFungibleToken) {
    _MissionFungibleToken = new MissionFungibleToken(id);
  }

  return _MissionFungibleToken as MissionFungibleToken;
}

export function loadOrCreateMissionMetadata(
  transactionHash: Bytes,
  actionId: Bytes
): MissionMetadata {
  const id = MissionId(transactionHash, actionId);
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
  const id = tokenId.toString();
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

export function loadOrCreateAppStats(
  appId: Address,
  event: ethereum.Event
): AppStats {
  const id = appId.toHex();
  let _AppStats = AppStats.load(id);

  if (!_AppStats) {
    _AppStats = new AppStats(id);
    _AppStats.createdAt = event.block.timestamp;
    _AppStats.createdAtBlock = event.block.number;
    _AppStats.totalActionsComplete = BigInt.fromI32(0);
    _AppStats.totalMissionsComplete = BigInt.fromI32(0);
    _AppStats.totalBadgesAwarded = BigInt.fromI32(0);
    _AppStats.totalXPAwarded = BigInt.fromI32(0);
    _AppStats.uniqueUsersCount = BigInt.fromI32(0);
  }

  _AppStats.updatedAt = event.block.timestamp;
  _AppStats.updatedAtBlock = event.block.number;

  return _AppStats as AppStats;
}
