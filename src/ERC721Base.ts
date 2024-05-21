import {
  BatchMinted,
  Minted,
} from "../generated/templates/ERC721Base/ERC721Base";

import {Transfer} from "../generated/templates/ERC721Base/ERC721Base";
import {
  One,
  ZERO_ADDRESS,
  loadOrCreateStats,
  loadOrCreateTransaction,
} from "./helpers";

export function handleMinted(event: Minted): void {
  let transaction = loadOrCreateTransaction(event, "ERC721 Mint");
  transaction.save();

  let stats = loadOrCreateStats();
  stats.BadgesMintedTransactions = stats.BadgesMintedTransactions.plus(One);
  stats.save();
}

export function handleBatchMinted(event: BatchMinted): void {
  let transaction = loadOrCreateTransaction(event, "ERC721 BatchMint");
  transaction.save();

  let stats = loadOrCreateStats();
  stats.BadgesMintedTransactions = stats.BadgesMintedTransactions.plus(One);
  stats.save();
}

export function handleTransfer(event: Transfer): void {
  const isBurned = event.params.to == ZERO_ADDRESS;
  const type = isBurned ? "ERC721 Burn" : "ERC721 Transfer";

  let transaction = loadOrCreateTransaction(event, type);
  transaction.save();

  let stats = loadOrCreateStats();
  stats.BadgesTransferredTransactions =
    stats.BadgesTransferredTransactions.plus(One);
  stats.save();
}
