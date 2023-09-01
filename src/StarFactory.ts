import {DataSourceContext} from "@graphprotocol/graph-ts";
import {Created} from "../generated/StarFactory/StarFactory";
import {
  ERC20FactoryFacet,
  ERC721FactoryFacet,
  RewardsFacet
} from "../generated/templates";
import {Zero, loadOrCreateStar, loadOrCreateUser} from "./helpers";

export function handleCreated(event: Created): void {
  let context = new DataSourceContext();
  context.setString("Star", event.params.id.toHex());

  ERC721FactoryFacet.createWithContext(event.params.id, context);
  ERC20FactoryFacet.createWithContext(event.params.id, context);
  RewardsFacet.createWithContext(event.params.id, context);

  let star = loadOrCreateStar(event.params.id, event);
  let user = loadOrCreateUser(event.params.owner, event);

  star.owner = user.id;
  star.constellation = event.params.constellation.toHex();
  star.name = event.params.name;
  star.badgeCount = Zero;
  star.badgesAwarded = Zero;

  star.save();
  user.save();
}
