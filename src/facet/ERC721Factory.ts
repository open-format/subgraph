import {
  Address,
  BigInt,
  dataSource,
  DataSourceContext
} from "@graphprotocol/graph-ts";
import {ERC721Base, ERC721LazyMint} from "../../generated/templates";
import {Created} from "../../generated/templates/ERC721FactoryFacet/ERC721Factory";
import {loadOrCreateBadge, loadOrCreateUser} from "../helpers";

let context = dataSource.context();
let star = Address.fromString(context.getString("Star"));

export function handleCreated(event: Created): void {
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

  badge.name = event.params.name;
  badge.symbol = event.params.symbol;
  badge.royaltyBps = BigInt.fromI32(event.params.royaltyBps);
  badge.royaltyRecipient = event.params.royaltyRecipient;
  badge.star = star.toHex();
  badge.totalAvailable = BigInt.fromI32(0);
  badge.totalClaimed = BigInt.fromI32(0);

  badge.save();
  user.save();
}
