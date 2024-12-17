import { Address, ethereum, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { ZERO_ADDRESS } from "./address";
import { Badge, FungibleToken, RewardData } from "../../generated/schema";
import { loadOrCreateUser } from "./loadOrCreate";
import { ERC20Base as ERC20BaseContract } from "../../generated/templates/ERC20Base/ERC20Base";
import { FUNGIBLE_TOKEN_TYPE_EXTERNAL } from "./enums";
import { ERC721Base } from "../../generated/templates/ERC721Base/ERC721Base";

/**
 * Use to index fungibleTokens not created by openformat contracts.
 * User balances will not be indexed and values are set to 0.
 * @dev saves entities internally
 */
export function createExternalFungibleToken(
  tokenAddress: Address,
  event: ethereum.Event
): FungibleToken {
  let fungibleToken = new FungibleToken(tokenAddress.toHex());

  // need to call token to retrieve all the details
  let boundContract = ERC20BaseContract.bind(tokenAddress);
  let zeroUser = loadOrCreateUser(Address.fromBytes(ZERO_ADDRESS), event);

  // Try to fetch the token name, symbol and decimals from contract
  // if they revert fallback to "UNKNOWN" or 18 for decimals
  let nameResult = boundContract.try_name();
  fungibleToken.name = nameResult.reverted ? "UNKNOWN" : nameResult.value;
  let symbolResult = boundContract.try_symbol();
  fungibleToken.symbol = symbolResult.reverted ? "UNKNOWN" : symbolResult.value;
  let decimalsResult = boundContract.try_decimals();
  fungibleToken.decimals = decimalsResult.reverted ? 18 : decimalsResult.value;

  fungibleToken.totalSupply = BigInt.fromI32(0);
  fungibleToken.burntSupply = BigInt.fromI32(0);
  fungibleToken.tokenType = FUNGIBLE_TOKEN_TYPE_EXTERNAL;
  fungibleToken.createdAt = event.block.timestamp;
  fungibleToken.createdAtBlock = event.block.number;
  fungibleToken.updatedAt = event.block.timestamp;
  fungibleToken.updatedAtBlock = event.block.number;

  // note: no standard way to read owner of ERC20 contract so the zero address is used
  fungibleToken.owner = zeroUser.id

  zeroUser.save();
  fungibleToken.save();

  return fungibleToken
}

/**
 * Use to index badges (NFT contracts) not created by openformat contracts.
 * @dev saves entities internally
 */
export function createExternalBadge(
  badgeAddress: Address,
  event: ethereum.Event
): Badge {
  let badge = new Badge(badgeAddress.toHex());

  // need to call token to retrieve all the details
  let boundContract = ERC721Base.bind(badgeAddress);
  let zeroUser = loadOrCreateUser(Address.fromBytes(ZERO_ADDRESS), event);

  // Try to fetch the token name, symbol and royalty info from contract
  // if they revert fallback to "UNKNOWN"
  let nameResult = boundContract.try_name();
  badge.name = nameResult.reverted ? "UNKNOWN" : nameResult.value;
  let symbolResult = boundContract.try_symbol();
  badge.symbol = symbolResult.reverted ? "UNKNOWN" : symbolResult.value;
  // TODO: read contract to get this info
  badge.royaltyBps = BigInt.fromI32(0);
  badge.royaltyRecipient = Bytes.fromHexString(zeroUser.id);

  badge.totalAwarded = BigInt.fromI32(0);
  badge.totalAvailable = BigInt.fromI32(0);

  badge.createdAt = event.block.timestamp;
  badge.createdAtBlock = event.block.number;
  badge.updatedAt = event.block.timestamp;
  badge.updatedAtBlock = event.block.number;

  zeroUser.save();
  badge.save();

  return badge
}

export function createRewardData(event: ethereum.Event): RewardData {
  let rewardData = new RewardData("auto")
  rewardData.timestamp = event.block.timestamp.toI64()
  rewardData.transactionHash = event.transaction.hash.toHex()

  return rewardData
}
