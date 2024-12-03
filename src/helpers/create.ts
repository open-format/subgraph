import { Address, ethereum, BigInt } from "@graphprotocol/graph-ts";
import { ZERO_ADDRESS } from "./address";
import { FungibleToken } from "../../generated/schema";
import { loadOrCreateUser } from "./loadOrCreate";
import { ERC20Base as ERC20BaseContract } from "../../generated/templates/ERC20Base/ERC20Base";

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
  fungibleToken.isNonTransferable = false;
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
