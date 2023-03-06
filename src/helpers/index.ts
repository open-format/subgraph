import {Address} from "@graphprotocol/graph-ts";
import {NFTId, TokenId} from "./idTemplates";
import {loadNFT} from "./load";
import {
  loadOrCreateApp,
  loadOrCreateContract,
  loadOrCreateContractMetadata,
  loadOrCreateNFT,
  loadOrCreateToken,
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
  loadOrCreateUser,
  loadNFT,
  NFTId,
  TokenId
};
