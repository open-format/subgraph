import {Transfer} from "../generated/AccessKey/ERC721Base";
import {ZERO_ADDRESS, loadOrCreateAccessKey, loadOrCreateUser} from "./helpers";

export function handleTransfer(event: Transfer): void {
  let receiver = loadOrCreateUser(event.params.to, event);
  let accessKey = loadOrCreateAccessKey(event.params.tokenId, event);

  if (event.params.from == ZERO_ADDRESS) {
    accessKey.currentOwner = receiver.id;
    accessKey.originalOwner = receiver.id;
  } else {
    accessKey.currentOwner = receiver.id;
  }

  accessKey.save();
  receiver.save();
}
