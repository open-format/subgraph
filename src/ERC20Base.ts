import {Address, dataSource} from "@graphprotocol/graph-ts";
import {
  ERC20Base as ERC20BaseContract,
  Transfer,
} from "../generated/templates/ERC20Base/ERC20Base";
import {
  One,
  ZERO_ADDRESS,
  loadOrCreateStats,
  loadOrCreateTransaction,
} from "./helpers";
let context = dataSource.context();
let contractAddress = Address.fromString(context.getString("ERC20Contract"));
export function handleTransfer(event: Transfer): void {
  ERC20BaseContract.bind(contractAddress);
  let stats = loadOrCreateStats();
  const isMinted = event.params.from == ZERO_ADDRESS;
  const isBurned = event.params.to == ZERO_ADDRESS;

  const type = isMinted
    ? "ERC20 Mint"
    : isBurned
    ? "ERC20 Burn"
    : "ERC20 Transfer";

  let transaction = loadOrCreateTransaction(event, type);

  if (type === "ERC20 Mint") {
    stats.TokensMintedTransactions = stats.TokensMintedTransactions.plus(One);
  } else {
    stats.TokensTransferredTransactions =
      stats.TokensTransferredTransactions.plus(One);
  }
  stats.save();
  transaction.save();
}
