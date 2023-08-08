import {BigInt, DataSourceContext} from "@graphprotocol/graph-ts";
import {Created} from "../generated/ConstellationFactory/Constellation";
import {ERC20Base as ERC20Contract} from "../generated/ConstellationFactory/ERC20Base";
import {ERC20Base} from "../generated/templates";
import {
  loadOrCreateConstellation,
  loadOrCreateFungibleToken,
  loadOrCreateUser
} from "./helpers";

export function handleCreated(event: Created): void {
  let context = new DataSourceContext();
  let ERC20Context = new DataSourceContext();
  context.setString("constellation", event.params.id.toHex());
  ERC20Context.setString("ERC20Contract", event.params.id.toHex());
  ERC20Base.createWithContext(event.params.id, ERC20Context);

  let constellation = loadOrCreateConstellation(event.params.id, event);
  let user = loadOrCreateUser(event.params.owner, event);
  let rewardToken = loadOrCreateFungibleToken(event.params.id, event);

  let boundContract = ERC20Contract.bind(event.params.id);

  rewardToken.name = boundContract.name();
  rewardToken.owner = user.id;
  rewardToken.symbol = boundContract.symbol();
  rewardToken.totalSupply = boundContract.totalSupply();
  // only available for OPEN FORMAT created tokens
  rewardToken.burntSupply = BigInt.fromU32(0);

  constellation.owner = user.id;
  constellation.rewardToken = rewardToken.id;
  constellation.name = event.params.name;
  constellation.updatedAt = event.block.timestamp;
  constellation.updatedAtBlock = event.block.number;

  rewardToken.save();
  user.save();
  constellation.save();
}
