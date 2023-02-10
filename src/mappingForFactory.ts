import { Created } from "../generated/Factory/Factory";
import { loadOrCreateApp } from "./helpers";

export function handleCreated(event: Created): void {
  let app = loadOrCreateApp(event.params.id);
  app.creator = event.params.owner;
  app.createdAtBlock = event.block.number;
  app.createdAt = event.block.timestamp;
  app.save();
}
