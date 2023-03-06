import {Address, dataSource, store} from "@graphprotocol/graph-ts";
import {Token, User} from "../generated/schema";
import {
  ERC20Base as ERC20BaseContract,
  Transfer
} from "../generated/templates/ERC20Base/ERC20Base";

import {
  loadOrCreateContractMetadata,
  loadOrCreateToken,
  loadOrCreateUser,
  ZERO_ADDRESS
} from "./helpers";

let context = dataSource.context();
let contractAddress = Address.fromString(context.getString("ERC20Contract"));

export function handleTransfer(event: Transfer): void {
  const boundContract = ERC20BaseContract.bind(contractAddress);
  const contractMetadata = loadOrCreateContractMetadata(contractAddress);
  let token: Token;
  let user: User;

  if (event.params.from == ZERO_ADDRESS) {
    // Mint
    token = loadOrCreateToken(contractAddress, event.params.to, event);
    user = loadOrCreateUser(event.params.to, event);
  } else {
    // Burn & Transfer
    token = loadOrCreateToken(contractAddress, event.params.from, event);
    user = loadOrCreateUser(event.params.from, event);
  }
  user.save();

  if (token) {
    if (event.params.from == ZERO_ADDRESS) {
      // Mint & Transfer
      token.owner = event.params.to.toHex();
      token.balance = boundContract.balanceOf(event.params.to);
    } else {
      // Burn
      token.balance = boundContract.balanceOf(event.params.from);
      store.remove("Token", token.id);
    }
    token.contract = contractAddress.toHex();
    token.updatedAt = event.block.timestamp;
    token.updatedAtBlock = event.block.number;
    token.save();
  }

  contractMetadata.totalSupply = boundContract.totalSupply();
  contractMetadata.save();
}
