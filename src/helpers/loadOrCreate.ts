import {Address, ethereum, log} from "@graphprotocol/graph-ts";
import {Stat, Transaction, User} from "../../generated/schema";
import {One, Zero} from "../helpers";

export function loadOrCreateTransaction(
  event: ethereum.Event,
  type: string
): Transaction {
  const id =
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let _Transaction = Transaction.load(id);
  let _User = loadOrCreateUser(event.transaction.from, event);
  _User.save();

  if (!_Transaction) {
    _Transaction = new Transaction(id);
    _Transaction.createdAt = event.block.timestamp;
    _Transaction.createdAtBlock = event.block.number;
    _Transaction.user = _User.id;
    _Transaction.type = type;
    _Transaction.gasUsed = event.receipt ? event.receipt!.gasUsed : null;
  }

  return _Transaction;
}

export function loadOrCreateUser(
  userAddress: Address,
  event: ethereum.Event
): User {
  const id = userAddress.toHex();
  let _User = User.load(id);

  if (!_User) {
    _User = new User(id);
    _User.createdAt = event.block.timestamp;
    _User.createdAtBlock = event.block.number;

    const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

    if (_User.id != ZERO_ADDRESS) {
      let stats = loadOrCreateStats();
      log.debug("*** loadOrCreateUser doesn't exist: id: {}, uniqueUser: {}", [
        id,
        stats.uniqueUsers.toString(),
      ]);
      stats.uniqueUsers = stats.uniqueUsers.plus(One);
      log.debug("*** loadOrCreateUser New Unique Users: uniqueUsers: {}", [
        stats.uniqueUsers.toString(),
      ]);
      stats.save();
    }
  }

  _User.updatedAt = event.block.timestamp;
  _User.updatedAtBlock = event.block.number;

  return _User as User;
}

export function loadOrCreateStats(): Stat {
  let stats = Stat.load("STATS_SINGLETON");

  // If the Stats entity doesn't exist, create it and set all couts to 0.
  if (!stats) {
    stats = new Stat("STATS_SINGLETON");
    stats.uniqueUsers = Zero;
    stats.appCount = Zero;
    stats.ERC721Count = Zero;
    stats.ERC20Count = Zero;
    stats.TokensMintedTransactions = Zero;
    stats.TokensTransferredTransactions = Zero;
    stats.BadgesMintedTransactions = Zero;
    stats.BadgesTransferredTransactions = Zero;
    stats.save();
  }

  return stats as Stat;
}
