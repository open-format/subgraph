import {
  Address,
  BigInt,
  DataSourceContext,
  dataSource,
} from "@graphprotocol/graph-ts";
import {ERC20Base} from "../../generated/templates";
import {Created} from "../../generated/templates/ERC20FactoryFacet/ERC20FactoryFacet";
import {
  loadOrCreateApp,
  loadOrCreateFungibleToken,
  loadOrCreateUser,
} from "../helpers";


export function handleCreated(event: Created): void {
  let context = dataSource.context();
  let starAddress = Address.fromString(context.getString("App"));
  let ERC20Context = new DataSourceContext();

  ERC20Context.setString("ERC20Contract", event.params.id.toHex());
  ERC20Base.createWithContext(event.params.id, ERC20Context);

  let fungibleToken = loadOrCreateFungibleToken(event.params.id, event);
  let user = loadOrCreateUser(event.params.creator, event);
  let star = loadOrCreateApp(starAddress, event);

  fungibleToken.name = event.params.name;
  fungibleToken.symbol = event.params.symbol;
  fungibleToken.decimals = event.params.decimals;
  fungibleToken.totalSupply = BigInt.fromI32(0);
  fungibleToken.burntSupply = BigInt.fromI32(0);

  fungibleToken.app = star.id;
  fungibleToken.owner = user.id;

  if (!star.xpToken) {
    star.xpToken = fungibleToken.id;
    star.save();
  }

  fungibleToken.save();
  user.save();
}
