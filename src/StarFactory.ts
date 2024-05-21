import {DataSourceContext} from "@graphprotocol/graph-ts";
import {Created} from "../generated/StarFactory/StarFactory";
import {ERC20FactoryFacet, ERC721FactoryFacet} from "../generated/templates";
import {One, loadOrCreateStats, loadOrCreateTransaction} from "./helpers";

export function handleCreated(event: Created): void {
  let context = new DataSourceContext();

  ERC721FactoryFacet.createWithContext(event.params.id, context);
  ERC20FactoryFacet.createWithContext(event.params.id, context);

  let transaction = loadOrCreateTransaction(event, "Create dApp");
  transaction.save();

  let stats = loadOrCreateStats();
  stats.starCount = stats.starCount.plus(One);
  stats.save();
}
