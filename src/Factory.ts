import {DataSourceContext} from "@graphprotocol/graph-ts";
import {Created} from "../generated/Factory/Factory";
import {ERC20FactoryFacet, ERC721FactoryFacet} from "../generated/templates";
import {loadOrCreateApp, loadOrCreateUser} from "./helpers";

export function handleCreated(event: Created): void {
  let context = new DataSourceContext();
  context.setString("app", event.params.id.toHex());

  ERC721FactoryFacet.createWithContext(event.params.id, context);
  ERC20FactoryFacet.createWithContext(event.params.id, context);

  let app = loadOrCreateApp(event.params.id);
  let user = loadOrCreateUser(event.params.owner, event);

  app.owner = user.id;
  app.name = event.params.name;
  app.createdAtBlock = event.block.number;
  app.createdAt = event.block.timestamp;
  app.save();
  user.save();
}
