import {
  Address,
  BigInt,
  dataSource,
  DataSourceContext,
} from "@graphprotocol/graph-ts";
import {ERC721Base, ERC721LazyMint} from "../../generated/templates";
import {Created} from "../../generated/templates/ERC721FactoryFacet/ERC721Factory";
import {
  loadOrCreateApp,
  loadOrCreateBadge,
  loadOrCreateUser,
  One,
  Zero,
} from "../helpers";


export function handleCreated(event: Created): void {
  let context = dataSource.context();
  let starAddress = Address.fromString(context.getString("App"));
  let ERC721Context = new DataSourceContext();

  if (event.params.implementationId.toString() == "LazyMint") {
    ERC721Context.setString("ERC721ContractLazyMint", event.params.id.toHex());
    ERC721LazyMint.createWithContext(event.params.id, ERC721Context);
  } else {
    ERC721Context.setString("ERC721Contract", event.params.id.toHex());
    ERC721Base.createWithContext(event.params.id, ERC721Context);
  }

  let badge = loadOrCreateBadge(event.params.id, event);
  let user = loadOrCreateUser(event.params.creator, event);
  let star = loadOrCreateApp(starAddress, event);

  badge.name = event.params.name;
  badge.symbol = event.params.symbol;
  badge.royaltyBps = BigInt.fromI32(event.params.royaltyBps);
  badge.royaltyRecipient = event.params.royaltyRecipient;
  badge.app = starAddress.toHex();
  badge.totalAwarded = Zero;
  badge.totalAvailable = Zero;

  star.badgeCount = star.badgeCount.plus(One);

  star.save();
  badge.save();
  user.save();
}
