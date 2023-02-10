import { Created } from "../generated/Factory/Factory";
import { loadOrCreateProxy } from "./helpers";

export function handleCreated(event: Created): void {
  //@TODO: Do we want to call this variable Proxy or App?
  let proxy = loadOrCreateProxy(event.params.id);
  proxy.creator = event.params.owner;
  proxy.createdAt = event.block.timestamp;
  proxy.save();
}
