import {
  Address,
  BigInt,
  dataSource,
  DataSourceContext,
} from "@graphprotocol/graph-ts";
import { ERC721Base, ERC721LazyMint, ERC721Badge } from "../../generated/templates";
import { Created } from "../../generated/templates/ERC721FactoryFacet/ERC721Factory";
import {
  loadOrCreateApp,
  loadOrCreateBadge,
  loadOrCreateUser,
  One,
  Zero,
} from "../helpers";

let context = dataSource.context();
let appAddress = Address.fromString(context.getString("App"));

export function handleCreated(event: Created): void {
  let ERC721Context = new DataSourceContext();

  let implementationId = event.params.implementationId.toString();
  if (implementationId == "LazyMint") {
    ERC721Context.setString("ERC721ContractLazyMint", event.params.id.toHex());
    ERC721LazyMint.createWithContext(event.params.id, ERC721Context);
  } else if (implementationId == "Badge") {
    ERC721Context.setString("ERC721ContractBadge", event.params.id.toHex());
    ERC721Badge.createWithContext(event.params.id, ERC721Context);
  } else {
    ERC721Context.setString("ERC721Contract", event.params.id.toHex());
    ERC721Base.createWithContext(event.params.id, ERC721Context);
  }

  let badge = loadOrCreateBadge(event.params.id, event);
  let user = loadOrCreateUser(event.params.creator, event);
  let app = loadOrCreateApp(appAddress, event);

  badge.name = event.params.name;
  badge.symbol = event.params.symbol;
  badge.royaltyBps = BigInt.fromI32(event.params.royaltyBps);
  badge.royaltyRecipient = event.params.royaltyRecipient;
  badge.app = appAddress.toHex();
  badge.totalAwarded = Zero;
  badge.totalAvailable = Zero;

  app.badgeCount = app.badgeCount.plus(One);

  app.save();
  badge.save();
  user.save();
}
