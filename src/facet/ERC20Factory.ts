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
  loadOrCreateAppFungibleToken,
  loadOrCreateFungibleToken,
  loadOrCreateUser,
} from "../helpers";


export function handleCreated(event: Created): void {
  let context = dataSource.context();
  let appAddress = Address.fromString(context.getString("App"));
  let ERC20Context = new DataSourceContext();

  ERC20Context.setString("ERC20Contract", event.params.id.toHex());
  ERC20Base.createWithContext(event.params.id, ERC20Context);

  let fungibleToken = loadOrCreateFungibleToken(event.params.id, event);
  let appFungibleToken = loadOrCreateAppFungibleToken(appAddress, event.params.id);
  let user = loadOrCreateUser(event.params.creator, event);
  let app = loadOrCreateApp(appAddress, event);

  fungibleToken.name = event.params.name;
  fungibleToken.symbol = event.params.symbol;
  fungibleToken.decimals = event.params.decimals;
  fungibleToken.totalSupply = BigInt.fromI32(0);
  fungibleToken.burntSupply = BigInt.fromI32(0);
  fungibleToken.owner = user.id;

  // DEPRECATED: `app` will be removed in the next major release.
  // Replaced with `apps` which is derived from `AppFungibleTokens`.
  fungibleToken.app = app.id;

  if (!app.xpToken) {
    app.xpToken = fungibleToken.id;
    app.save();
  }

  fungibleToken.save();
  appFungibleToken.save();
  user.save();
}
