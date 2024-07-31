import {
  Address,
  BigInt,
  Bytes,
  ByteArray,
  dataSource,
  ethereum
} from "@graphprotocol/graph-ts";
import {
  ChargedUser,
  RequiredTokenBalanceUpdated
} from "../../generated/templates/ChargeFacet/ChargeFacet";
import {
  createCharge,
  loadOrCreateApp,
  loadOrCreateFungibleToken,
  loadOrCreateRequiredTokenBalance,
  loadOrCreateUser,
} from "../helpers/loadOrCreate";

export function handleChargedUser(event: ChargedUser): void {
  let context = dataSource.context();
  let appAddress = Address.fromString(context.getString("App"));

  let user = loadOrCreateUser(event.params.user, event);
  let app = loadOrCreateApp(appAddress, event);
  let token = loadOrCreateFungibleToken(event.params.token, event);
  let charge = createCharge(event.transaction.hash, event.logIndex, event);

  charge.app = app.id
  charge.user = user.id
  charge.token = token.id
  charge.amount = event.params.amount
  charge.chargeId = event.params.chargeId.toString()
  charge.chargeType = event.params.chargeType.toString()

  charge.save()
}

export function handleRequiredTokenBalanceUpdated(event: RequiredTokenBalanceUpdated): void {
  let context = dataSource.context();
  let appAddress = Address.fromString(context.getString("App"));

  let app = loadOrCreateApp(appAddress, event);
  let token = loadOrCreateFungibleToken(event.params.token, event);
  let requiredTokenBalance = loadOrCreateRequiredTokenBalance(appAddress, event.params.token, event);

  requiredTokenBalance.app = app.id;
  requiredTokenBalance.token = token.id;
  requiredTokenBalance.balance = event.params.balance;

  requiredTokenBalance.save();
}
