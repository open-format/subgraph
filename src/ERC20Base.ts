import {Address, dataSource} from "@graphprotocol/graph-ts";
import {
  ERC20Base as ERC20BaseContract,
  Transfer
} from "../generated/templates/ERC20Base/ERC20Base";
import {
  loadOrCreateContractMetadata,
  loadOrCreateTokenBalance,
  loadOrCreateUser,
  ZERO_ADDRESS
} from "./helpers";

let context = dataSource.context();
let contractAddress = Address.fromString(context.getString("ERC20Contract"));

export function handleTransfer(event: Transfer): void {
  const boundContract = ERC20BaseContract.bind(contractAddress);
  const contractMetadata = loadOrCreateContractMetadata(contractAddress);

  // sender and receiver User and TokenBalance entities required for Wallet > Wallet transfers
  let sender = loadOrCreateUser(event.params.from, event);
  let receiver = loadOrCreateUser(event.params.to, event);

  let senderTokenBalance = loadOrCreateTokenBalance(
    contractAddress,
    event.params.from,
    event
  );

  senderTokenBalance.user = sender.id;
  senderTokenBalance.token = contractAddress.toHex();
  senderTokenBalance.balance = boundContract.balanceOf(
    Address.fromString(sender.id)
  );

  let receiverTokenBalance = loadOrCreateTokenBalance(
    contractAddress,
    event.params.to,
    event
  );

  receiverTokenBalance.user = receiver.id;
  receiverTokenBalance.token = contractAddress.toHex();
  receiverTokenBalance.balance = boundContract.balanceOf(
    Address.fromString(receiver.id)
  );

  //@TODO delete  senderTokenBalance and/or receiverTokenBalance entity if balanceOf is zero.

  const isMinted = event.params.from == ZERO_ADDRESS;
  const isBurned = event.params.to == ZERO_ADDRESS;

  if (isMinted) {
    receiver.save();
    receiverTokenBalance.save();
  } else if (isBurned) {
    sender.save();
    senderTokenBalance.save();

    //@TODO is burntSupply the correct name?
    contractMetadata.burntSupply = contractMetadata.burntSupply.plus(
      event.params.value
    );
  } else {
    sender.save();
    receiver.save();

    receiverTokenBalance.save();
    senderTokenBalance.save();
  }

  contractMetadata.totalSupply = boundContract.totalSupply();
  contractMetadata.save();
}
