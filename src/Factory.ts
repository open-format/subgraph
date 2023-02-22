import { DataSourceContext } from "@graphprotocol/graph-ts";
import { Created } from "../generated/Factory/Factory";
import { ERC721FactoryFacet } from "../generated/templates";
import { loadOrCreateApp } from "./helpers";

export function handleCreated(event: Created): void {
  //ERC721 Context
  let context = new DataSourceContext();
  context.setString("app", event.params.id.toHex());
  ERC721FactoryFacet.createWithContext(event.params.id, context);

  let app = loadOrCreateApp(event.params.id);
  app.creator = event.params.owner;
  app.name = event.params.name;
  app.createdAtBlock = event.block.number;
  app.createdAt = event.block.timestamp;
  app.save();
}
