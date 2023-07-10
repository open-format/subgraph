import {Address, dataSource} from "@graphprotocol/graph-ts";
import {Action, Mission} from "../../generated/schema";
import {Reward as RewardEvent} from "../../generated/templates/RewardsFacet/RewardsFacet";

let context = dataSource.context();
let appAddress = Address.fromString(context.getString("app"));

export function handleReward(event: RewardEvent): void {
  if (event.params.activityType == "ACTION") {
    let action = new Action(
      event.transaction.hash.toHexString() +
        "-" +
        event.params.id.toString() +
        "-" +
        event.logIndex.toString()
    );
    action.action_id = event.params.id;
    action.app = appAddress.toHex();
    action.amount = event.params.amount;
    action.user = event.params.recipient.toHex();
    action.token = event.params.token.toHex();
    action.createdAt = event.block.timestamp;
    action.createdAtBlock = event.block.number;

    action.save();
  } else {
    let mission = new Mission(
      event.transaction.hash.toHexString() + "-" + event.params.id.toString()
    );
    mission.mission_id = event.params.id;
    mission.app = appAddress.toHex();
    mission.amount = event.params.amount;
    mission.user = event.params.recipient.toHex();
    mission.token = event.params.token.toHex();
    mission.createdAt = event.block.timestamp;
    mission.createdAtBlock = event.block.number;
    mission.save();
  }
}
