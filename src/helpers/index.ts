import {Address} from "@graphprotocol/graph-ts";
import {NFTId, TokenBalanceId} from "./idTemplates";
import {loadNFT} from "./load";
import {
  loadOrCreateApp,
  loadOrCreateContract,
  loadOrCreateContractMetadata,
  loadOrCreateNFT,
  loadOrCreateToken,
  loadOrCreateTokenBalance,
  loadOrCreateUser
} from "./loadOrCreate";

export const ZERO_ADDRESS = Address.fromHexString(
  "0x0000000000000000000000000000000000000000"
);

export {
  loadOrCreateApp,
  loadOrCreateContract,
  loadOrCreateContractMetadata,
  loadOrCreateNFT,
  loadOrCreateToken,
  loadOrCreateTokenBalance,
  loadOrCreateUser,
  loadNFT,
  NFTId,
  TokenBalanceId
};
