import {
  Bytes,
  DataSourceContext,
  dataSource,
  log,
} from "@graphprotocol/graph-ts";
import {EventContent} from "../../generated/schema";
import {IpfsContent} from "../../generated/templates";
import {
  BadgeMinted,
  BadgeTransferred,
  ERC721Minted,
  MetadataAdded,
  TokenMinted,
  TokenTransferred,
} from "../../generated/templates/EventFacet/EventFacet";
import {loadOrCreateEvent} from "../helpers/loadOrCreate";

const EVENT_ID_KEY = "Event";

export function handleMetadataAdded(event: MetadataAdded): void {
  log.info("<<<<<<<<<<< handleMetadataAdded >>>>>>>>>>>,{}", [
    event.params.uri,
  ]);
  let _event = loadOrCreateEvent(event);
  _event.metadata = event.params.uri;

  let context = new DataSourceContext();
  context.setString(EVENT_ID_KEY, _event.id);
  IpfsContent.createWithContext(event.params.uri, context);

  _event.save();
}

export function handleEventContent(content: Bytes): void {
  log.info("<<<<<<<<<<< handleEventContent >>>>>>>>>>>,{}", [
    content.toString(),
  ]);
  let hash = dataSource.stringParam();
  let ctx = dataSource.context();
  let id = ctx.getString(EVENT_ID_KEY);

  let eventMetadata = new EventContent(id);

  eventMetadata.hash = hash;
  eventMetadata.content = content.toString();
  eventMetadata.save();
}

export function handleTokenMinted(event: TokenMinted): void {
  let _event = loadOrCreateEvent(event);
  _event.save();
}

export function handleTokenTransferred(event: TokenTransferred): void {}

// handles ERC721 tokens being rewarded with the uri being emitted from the event
export function handleERC721Minted(event: ERC721Minted): void {}

// handles ERC721 badge tokens being rewarded with the uri on the contract
export function handleBadgeMinted(event: BadgeMinted): void {}

export function handleBadgeTransferred(event: BadgeTransferred): void {}
