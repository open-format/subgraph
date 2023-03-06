import {
  Address,
  BigInt,
  dataSource,
  DataSourceContext
} from "@graphprotocol/graph-ts";
import {ERC721Base} from "../../generated/templates";
import {Created} from "../../generated/templates/ERC721FactoryFacet/ERC721Factory";
import {
  loadOrCreateContract,
  loadOrCreateContractMetadata,
  loadOrCreateUser
} from "../helpers";

let context = dataSource.context();
let appAddress = Address.fromString(context.getString("app"));

export function handleCreated(event: Created): void {
  let ERC721Context = new DataSourceContext();

  ERC721Context.setString("ERC721Contract", event.params.id.toHex());
  ERC721Base.createWithContext(event.params.id, ERC721Context);

  let contract = loadOrCreateContract(event.params.id);
  let contractMetadata = loadOrCreateContractMetadata(event.params.id);
  let user = loadOrCreateUser(event.params.creator, event);

  contract.type = "ERC721";
  contract.createdAtBlock = event.block.number;
  contract.createdAt = event.block.timestamp;
  contract.creator = user.id;
  contract.metadata = contractMetadata.id;
  contract.app = appAddress.toHex();

  contractMetadata.name = event.params.name;
  contractMetadata.symbol = event.params.symbol;
  contractMetadata.royaltyBps = BigInt.fromI32(event.params.royaltyBps);
  contractMetadata.royaltyRecipient = event.params.royaltyRecipient;
  contractMetadata.totalSupply = BigInt.fromI32(0);

  contract.save();
  contractMetadata.save();
  user.save();
}
