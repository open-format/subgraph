import {Address, BigInt, ethereum} from "@graphprotocol/graph-ts";
import {
  App,
  Contract,
  ContractData,
  NFT,
  Token,
  TokenBalance,
  User
} from "../../generated/schema";
import {NFTId, TokenBalanceId} from "./idTemplates";

export function loadOrCreateApp(appAddress: Address): App {
  const id = appAddress.toHex();
  let _app = App.load(id);

  if (!_app) {
    _app = new App(id);
  }

  return _app as App;
}

export function loadOrCreateContract(contractAddress: Address): Contract {
  const id = contractAddress.toHex();
  let _contract = Contract.load(id);

  if (!_contract) {
    _contract = new Contract(id);
  }

  return _contract as Contract;
}

export function loadOrCreateContractMetadata(
  contractAddress: Address
): ContractData {
  const id = contractAddress.toHex();
  let _contractMetadata = ContractData.load(id);

  if (!_contractMetadata) {
    _contractMetadata = new ContractData(id);
    _contractMetadata.burntSupply = BigInt.fromU32(0);
  }

  return _contractMetadata as ContractData;
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
  }

  _User.updatedAt = event.block.timestamp;
  _User.updatedAtBlock = event.block.number;

  return _User as User;
}

export function loadOrCreateNFT(
  contractAddress: Address,
  tokenId: string
): NFT {
  const id = NFTId(contractAddress, tokenId);
  let _NFT = NFT.load(id);

  if (!_NFT) {
    _NFT = new NFT(id);
  }

  return _NFT as NFT;
}

export function loadOrCreateToken(
  contractAddress: Address,
  event: ethereum.Event
): Token {
  const id = contractAddress.toHex();
  let _Token = Token.load(id);

  if (!_Token) {
    _Token = new Token(id);
    _Token.createdAt = event.block.timestamp;
    _Token.createdAtBlock = event.block.number;
  }

  _Token.updatedAt = event.block.timestamp;
  _Token.updatedAtBlock = event.block.number;

  return _Token as Token;
}

export function loadOrCreateTokenBalance(
  contractAddress: Address,
  userAddress: Address,
  event: ethereum.Event
): TokenBalance {
  const id = TokenBalanceId(contractAddress, userAddress);
  let _TokenBalance = TokenBalance.load(id);

  if (!_TokenBalance) {
    _TokenBalance = new TokenBalance(id);
    _TokenBalance.createdAt = event.block.timestamp;
    _TokenBalance.createdAtBlock = event.block.number;
  }

  _TokenBalance.updatedAt = event.block.timestamp;
  _TokenBalance.updatedAtBlock = event.block.number;

  return _TokenBalance as TokenBalance;
}
