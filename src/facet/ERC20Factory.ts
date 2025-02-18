import {
  Address,
  BigInt,
  DataSourceContext,
  dataSource,
} from "@graphprotocol/graph-ts";
import {ERC20Base, ERC20Point} from "../../generated/templates";
import {Created} from "../../generated/templates/ERC20FactoryFacet/ERC20FactoryFacet";
import {
  loadOrCreateApp,
  loadOrCreateAppFungibleToken,
  loadOrCreateFungibleToken,
  loadOrCreateUser,
} from "../helpers";
import { FUNGIBLE_TOKEN_TYPE_BASE, FUNGIBLE_TOKEN_TYPE_POINT } from "../helpers/enums";


export function handleCreated(event: Created): void {
  let context = dataSource.context();
  let appAddress = Address.fromString(context.getString("App"));
  let ERC20Context = new DataSourceContext();
  let tokenType = FUNGIBLE_TOKEN_TYPE_BASE;

  let implementationId = event.params.implementationId.toString();
  if (implementationId.startsWith("Point")) {
    ERC20Context.setString("ERC20PointContract", event.params.id.toHex());
    ERC20Point.createWithContext(event.params.id, ERC20Context);
    tokenType = FUNGIBLE_TOKEN_TYPE_POINT
  } else {
    ERC20Context.setString("ERC20BaseContract", event.params.id.toHex());
    ERC20Base.createWithContext(event.params.id, ERC20Context);
  }


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
  fungibleToken.tokenType = tokenType;

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
