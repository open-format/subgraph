import { BigInt } from "@graphprotocol/graph-ts";
import { Created } from "../generated/ERC721Factory/ERC721Factory";
import {
  loadOrCreateContract,
  loadOrCreateContractMetadata,
} from "./helpers";

export function handleCreated(event: Created): void {
  let contract = loadOrCreateContract(event.params.id);
  let contractMetadata = loadOrCreateContractMetadata(
    event.params.id
  );

  //@dev The type needs to come from the contract
  contract.type = "ERC721";
  contract.createdAtBlock = event.block.number;
  contract.createdAt = event.block.timestamp;
  contract.creator = event.params.creator;
  contract.metadata = contractMetadata.id;
  contract.app = event.address.toHex();

  contractMetadata.name = event.params.name;
  contractMetadata.symbol = event.params.symbol;
  contractMetadata.royaltyBps = BigInt.fromI32(
    event.params.royaltyBps
  );
  contractMetadata.royaltyRecipient = event.params.royaltyRecipient;

  contract.save();
  contractMetadata.save();
}
