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
  loadOrCreateAppStats,
  loadOrCreateUser,
} from "./helpers";

export function handleCreated(event: Created): void {
  let context = new DataSourceContext();
  context.setString("App", event.params.id.toHex());

  ERC721FactoryFacet.createWithContext(event.params.id, context);
  ERC20FactoryFacet.createWithContext(event.params.id, context);
  RewardsFacet.createWithContext(event.params.id, context);

  let app = loadOrCreateApp(event.params.id, event);
  let user = loadOrCreateUser(event.params.owner, event);
  let appStats = loadOrCreateAppStats(event.params.id, event);

  app.owner = user.id;
  app.name = event.params.name;
  app.badgeCount = Zero;
  app.badgesAwarded = Zero;
  app.stats = appStats.id;
  appStats.app = app.id;

  appStats.save();
  app.save();
  user.save();
}
