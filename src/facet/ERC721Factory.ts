import {DataSourceContext} from "@graphprotocol/graph-ts";
import {ERC721Base, ERC721LazyMint} from "../../generated/templates";
import {Created} from "../../generated/templates/ERC721FactoryFacet/ERC721Factory";
import {One, loadOrCreateStats, loadOrCreateTransaction} from "../helpers";

export function handleCreated(event: Created): void {
  let ERC721Context = new DataSourceContext();

  if (event.params.implementationId.toString() == "LazyMint") {
    ERC721Context.setString("ERC721ContractLazyMint", event.params.id.toHex());
    ERC721LazyMint.createWithContext(event.params.id, ERC721Context);
  } else {
    ERC721Context.setString("ERC721Contract", event.params.id.toHex());
    ERC721Base.createWithContext(event.params.id, ERC721Context);
  }

  let transaction = loadOrCreateTransaction(event, "Create ERC721");
  transaction.save();

  let stats = loadOrCreateStats();
  stats.ERC721Count = stats.ERC721Count.plus(One);
  stats.save();
}
