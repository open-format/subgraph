import {
  Address,
  BigInt,
  dataSource,
  DataSourceContext,
} from "@graphprotocol/graph-ts";
import { Created } from "../../generated/ERC721Factory/ERC721Factory";
import { ERC721Base } from "../../generated/templates";
import {
  loadOrCreateContract,
  loadOrCreateContractMetadata,
} from "../helpers";

let context = dataSource.context();
let appAddress = Address.fromString(context.getString("app"));

export function handleCreated(event: Created): void {
  let context = new DataSourceContext();
  context.setString("ERC721Contract", event.params.id.toHex());
  ERC721Base.createWithContext(event.params.id, context);

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
  contract.app = appAddress.toHex();

  contractMetadata.name = event.params.name;
  contractMetadata.symbol = event.params.symbol;
  contractMetadata.royaltyBps = BigInt.fromI32(
    event.params.royaltyBps
  );
  contractMetadata.royaltyRecipient = event.params.royaltyRecipient;

  contract.save();
  contractMetadata.save();
}
