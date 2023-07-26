import {Bytes, dataSource, json, log} from "@graphprotocol/graph-ts";
import {
  Action as ActionEvent,
  Mission as MissionEvent
} from "../generated/Rewards/Rewards";
import {Action} from "../generated/schema";
import {ActionMetadata as ActionMetadataTemplate} from "../generated/templates";
import {
  loadActionMetadata,
  loadOrCreateActionMetadata,
  loadOrCreateFungibleToken,
  loadOrCreateUser
} from "./helpers";

export function handleAction(event: ActionEvent): void {
  let action = new Action(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  );
  let user = loadOrCreateUser(event.params.to, event);
  let actionMetadata = loadActionMetadata(event.params.uri);

  let token = loadOrCreateFungibleToken(event.params.token, event);

  if (!actionMetadata) {
    ActionMetadataTemplate.create(event.params.uri);
  } else {
    actionMetadata.save();
  }

  if (token) {
    action.star = token.star;
    action.metadata = event.params.uri;
    action.xp_rewarded = event.params.amount;
    action.user = user.id;
    action.createdAt = event.block.timestamp;
    action.createdAtBlock = event.block.number;

    action.save();
  }
  user.save();
}

export function handleActionMetadata(content: Bytes): void {
  log.warning("<<<<<<< ActionMetadata >>>>>>>>>", [dataSource.stringParam()]);
  let actionMetadata = loadOrCreateActionMetadata(dataSource.stringParam());
  const value = json.fromBytes(content).toObject();
  if (value) {
    const name = value.get("name");

    if (name) {
      actionMetadata.name = name.toString();
    }

    actionMetadata.URI = dataSource.stringParam();
    actionMetadata.save();
  }
}

export function handleMission(event: MissionEvent): void {}
