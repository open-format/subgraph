import {Address, BigInt, dataSource, store} from "@graphprotocol/graph-ts";
import {TokenBalance, User} from "../generated/schema";
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

  let tokenBalance: TokenBalance;
  let user: User;

  const isMinted = event.params.from == ZERO_ADDRESS;
  const address = isMinted ? event.params.to : event.params.from;

  user = loadOrCreateUser(address, event);
  tokenBalance = loadOrCreateTokenBalance(contractAddress, address, event);

  tokenBalance.user = address.toHex();
  tokenBalance.token = contractAddress.toHex();
  tokenBalance.balance = boundContract.balanceOf(
    Address.fromString(tokenBalance.user)
  );

  if (tokenBalance.balance === BigInt.fromI32(0)) {
    store.remove("TokenBalance", tokenBalance.id);
  }

  contractMetadata.totalSupply = boundContract.totalSupply();
  contractMetadata.save();
  tokenBalance.save();
  user.save();
}
