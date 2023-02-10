import { Address } from "@graphprotocol/graph-ts";
import { App } from "../../generated/schema";

export function loadOrCreateApp(appAddress: Address): App {
  const id = appAddress.toHex();
  let _app = App.load(id);

  if (!_app) {
    _app = new App(id);
  }

  return _app as App;
}
