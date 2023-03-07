import { Address } from "@graphprotocol/graph-ts";
import { NFTId } from "./idTemplates";
import { loadNFT } from "./loadNFT";
import { loadOrCreateApp } from "./loadOrCreateApp";
import { loadOrCreateContract } from "./loadOrCreateContract";
import { loadOrCreateContractMetadata } from "./loadOrCreateContractMetadata";
import { loadOrCreateNFT } from "./loadOrCreateNFT";

export const ZERO_ADDRESS = Address.fromHexString(
  "0x0000000000000000000000000000000000000000"
);

export {
  loadOrCreateApp,
  loadOrCreateContract,
  loadOrCreateContractMetadata,
  loadOrCreateNFT,
  loadNFT,
  NFTId,
};
