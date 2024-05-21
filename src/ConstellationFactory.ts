import {DataSourceContext} from "@graphprotocol/graph-ts";
import {Created} from "../generated/ConstellationFactory/ConstellationFactory";
import {ERC20Base} from "../generated/templates";
import {One, loadOrCreateStats, loadOrCreateTransaction} from "./helpers";

export function handleCreated(event: Created): void {
  let context = new DataSourceContext();
  let ERC20Context = new DataSourceContext();
  context.setString("constellation", event.params.id.toHex());
  ERC20Context.setString("ERC20Contract", event.params.id.toHex());
  ERC20Base.createWithContext(event.params.id, ERC20Context);

  let transaction = loadOrCreateTransaction(event, "Create Constellation");
  transaction.save();

  let stats = loadOrCreateStats();
  stats.constellationCount = stats.constellationCount.plus(One);
  stats.save();
}
