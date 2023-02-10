import { Address } from "@graphprotocol/graph-ts";
import { App } from "../../generated/schema";

export function loadOrCreateProxy(appAddress: Address): App {
  const id = appAddress.toHex();
  let _proxy = App.load(id);

  if (!_proxy) {
    _proxy = new App(id);
  }

  return _proxy as App;
}
