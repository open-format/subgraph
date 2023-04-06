import {Address, dataSource} from "@graphprotocol/graph-ts";
import {Action, Mission} from "../../generated/schema";
import {Reward as RewardEvent} from "../../generated/templates/RewardsFacet/RewardsFacet";

let context = dataSource.context();
let appAddress = Address.fromString(context.getString("app"));

export function handleReward(event: RewardEvent): void {
  if (event.params.activityType == "ACTION") {
    let action = new Action(
      event.transaction.hash.toHexString() + "-" + event.params.id.toString()
    );
    action.app = appAddress.toHex();
    action.amount = event.params.amount;
    action.user = event.params.recipient.toHex();
    action.token = event.params.token.toHex();
    action.type_id = event.params.id;
    action.save();
  } else {
    let action = new Mission(
      event.transaction.hash.toHexString() + "-" + event.params.id.toString()
    );
    action.app = appAddress.toHex();
    action.amount = event.params.amount;
    action.user = event.params.recipient.toHex();
    action.token = event.params.token.toHex();
    action.type_id = event.params.id;
    action.save();
  }
}
