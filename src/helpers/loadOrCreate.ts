import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import {
  Action,
  ActionMetadata,
  App,
  AppFungibleToken,
  Badge,
  BadgeToken,
  Charge,
  FungibleToken,
  FungibleTokenBalance,
  FungibleTokenMetadata,
  Mission,
  MissionFungibleToken,
  MissionMetadata,
  RequiredTokenBalance,
  User,
  Reward
} from "../../generated/schema";
import { RewardId, ActionId, AppFungibleTokenId, BadgeId, ChargeId, MissionId, RequiredTokenBalanceId, TokenBalanceId } from "./idTemplates";
import { Zero } from "./numbers";

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
  }
  _User.updatedAt = event.block.timestamp;
  _User.updatedAtBlock = event.block.number;

  return _User as User;
}

export function loadOrCreateReward(
  label: String,
  rewardType: String,
  URI: String,
  event: ethereum.Event
): Reward {
  const id = RewardId(label, rewardType, URI, event);
  let reward = Reward.load(id);

  if (!reward) {
    reward = new Reward(id);
    reward.transactionHash = event.transaction.hash.toHex()
    reward.createdAt = event.block.timestamp;
    reward.createdAtBlock = event.block.number;
  }

  return reward as Reward
}

// TODO: remove when action entity is removed from schema
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


// TODO: remove when action entity is removed from schema
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


// TODO: remove when mission entity is removed from schema
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


// TODO: remove when mission entity is removed from schema
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

// TODO: remove when mission entity is removed from schema
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

// Charge is immutable so only need create
export function createCharge(
  transactionHash: Bytes,
  logIndex: BigInt,
  event: ethereum.Event
): Charge {
  let id = ChargeId(transactionHash, logIndex)
  let charge = new Charge(id);

  charge.createdAt = event.block.timestamp;
  charge.createdAtBlock = event.block.number;

  return charge as Charge;
}

export function loadOrCreateRequiredTokenBalance(
  contractAddress: Address,
  tokenAddress: Address,
  event: ethereum.Event
): RequiredTokenBalance {
  const id = RequiredTokenBalanceId(contractAddress, tokenAddress);
  let requiredTokenBalance = RequiredTokenBalance.load(id);

  if (!requiredTokenBalance) {
    requiredTokenBalance = new RequiredTokenBalance(id);
    requiredTokenBalance.createdAt = event.block.timestamp;
    requiredTokenBalance.createdAtBlock = event.block.number;
  }

  requiredTokenBalance.updatedAt = event.block.timestamp;
  requiredTokenBalance.updatedAtBlock = event.block.number;

  return requiredTokenBalance as RequiredTokenBalance;
}

export function loadOrCreateAppFungibleToken(
  appAddress: Address,
  tokenAddress: Address
): AppFungibleToken {
  const id = AppFungibleTokenId(appAddress, tokenAddress);
  let appFungibleToken = AppFungibleToken.load(id);

  if (!appFungibleToken) {
    appFungibleToken = new AppFungibleToken(id);
    appFungibleToken.app = appAddress.toHex();
    appFungibleToken.token = tokenAddress.toHex();
  }

  return appFungibleToken as AppFungibleToken;
}