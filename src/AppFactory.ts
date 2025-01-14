import {DataSourceContext} from "@graphprotocol/graph-ts";
import {Created} from "../generated/AppFactory/AppFactory";
import {
  ERC20FactoryFacet,
  ERC721FactoryFacet,
  RewardsFacet,
} from "../generated/templates";
import {
  Zero,
  loadOrCreateApp,
  loadOrCreateUser,
} from "./helpers";

export function handleCreated(event: Created): void {
  let context = new DataSourceContext();
  context.setString("App", event.params.id.toHex());
  context.setBoolean("AggregationFeatureFlag", true);

  ERC721FactoryFacet.createWithContext(event.params.id, context);
  ERC20FactoryFacet.createWithContext(event.params.id, context);
  RewardsFacet.createWithContext(event.params.id, context);

  let app = loadOrCreateApp(event.params.id, event);
  let user = loadOrCreateUser(event.params.owner, event);

  app.owner = user.id;
  app.name = event.params.name;
  app.badgeCount = Zero;
  app.badgesAwarded = Zero;

  app.save();
  user.save();
}
