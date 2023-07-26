import {Address, dataSource} from "@graphprotocol/graph-ts";
import {Action, Mission} from "../../generated/schema";
import {Reward as RewardEvent} from "../../generated/templates/RewardsFacet/RewardsFacet";

let context = dataSource.context();
let starAddress = Address.fromString(context.getString("Star"));

export function handleReward(event: RewardEvent): void {
  if (event.params.activityType == "ACTION") {
    let action = new Action(
      event.transaction.hash.toHexString() +
        "-" +
        event.params.id.toString() +
        "-" +
        event.logIndex.toString()
    );
    action.name = event.params.id;
    action.star = starAddress.toHex();
    action.xp_rewarded = event.params.amount;
    action.user = event.params.recipient.toHex();
    action.createdAt = event.block.timestamp;
    action.createdAtBlock = event.block.number;

    action.save();
  } else {
    let mission = new Mission(
      event.transaction.hash.toHexString() + "-" + event.params.id.toString()
    );

    mission.name = event.params.id;
    mission.star = starAddress.toHex();
    mission.user = event.params.recipient.toHex();
    mission.createdAt = event.block.timestamp;
    mission.createdAtBlock = event.block.number;
    mission.save();
  }
}
