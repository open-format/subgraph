import { Address, ethereum, JSONValue, Value, ipfs, json, Bytes, BigInt, DataSourceContext } from "@graphprotocol/graph-ts"
import { dataSourceMock, newMockEvent } from "matchstick-as/assembly/index"
import {Created as CreatedApp} from "../generated/AppFactory/AppFactory";
import { Created as CreatedERC20FactoryFacet } from "../generated/templates/ERC20FactoryFacet/ERC20FactoryFacet";
import { Created as CreatedERC721FactoryFacet } from "../generated/templates/ERC721FactoryFacet/ERC721Factory";
import { Created as ERC20Created} from "../generated/templates/ERC20FactoryFacet/ERC20FactoryFacet";
import { Created as ERC721Created } from "../generated/templates/ERC721FactoryFacet/ERC721Factory";
import { BadgeMinted, BadgeTransferred, TokenMinted, TokenTransferred } from "../generated/templates/RewardsFacet/RewardsFacet";
import { Created as AppCreated } from "../generated/AppFactory/AppFactory";
import { TEST_ACTION_ENTITY_TYPE, TEST_APPSTATS_ENTITY_TYPE, TEST_APP_ENTITY_TYPE, TEST_APP_ID, TEST_APP_NAME, TEST_BADGETOKEN_ID, TEST_FUNGIBLETOKEN_ENTITY_TYPE, TEST_STATS_ENTITY_TYPE, TEST_TOKEN_ID, TEST_TOKEN_IMPLEMENTATIONID_BASE, TEST_TOKEN_IMPLEMENTATIONID_LAZYMINT, TEST_TOKEN_MINTED_ACTION, TEST_TOKEN_MINTED_ACTION_ID, TEST_TOKEN_MINTED_MISSION, TEST_TOKEN_MINTED_MISSION_ID, TEST_TOKEN_MINTED_URI, TEST_TOKEN_NAME, TEST_TOKEN_ROYALTYBPS, TEST_TOKEN_ROYALTYRECIPIENT, TEST_TOKEN_SYMBOL, TEST_TOKEN_TOTAL_SUPPLY, TEST_USER2_ID, TEST_USER3_ID, TEST_USER_ENTITY_TYPE, TEST_USER_ID } from "./fixtures";
import { handleCreated as erc20handleCreated } from "../src/facet/ERC20Factory";
import { handleCreated as appHandleCreated } from "../src/AppFactory";
import { handleCreated as erc721handleCreated } from "../src/facet/ERC721Factory";
import { handleBadgeMinted, handleBadgeTransferred, handleTokenMinted, handleTokenTransferred } from "../src/facet/RewardsFacet";
import { BadgeId } from "../src/helpers";
import { BadgeToken, FungibleToken } from "../generated/schema";
import { ContractURIUpdated as ERC20ContractURIUpdated, Transfer as ERC20Transfer } from "../generated/templates/ERC20Base/ERC20Base";
import { handleContractURIUpdated, handleTransfer as handleTransferERC20 } from "../src/ERC20Base";
import { BatchMinted, Minted, Transfer as ERC721Transfer } from "../generated/templates/ERC721Base/ERC721Base";
import { handleBatchMinted, handleMinted, handleTransfer as handleTransferERC721 } from "../src/ERC721Base";
import { TokensLazyMinted, Minted as MintedLazyMint, Transfer as TransferERC721LazyMint, BatchMinted as BatchMintedLazyMint } from "../generated/templates/ERC721LazyMint/ERC721LazyMint";
import { handleLazyMint, handleTransfer as handleTransferERC721LazyMint, handleMinted as handleMintedLazyMint, handleBatchMinted as handleBatchMintedLazyMint } from "../src/ERC721LazyMint";

export class Param {
  public name: string;
  public type: ParamType;
  public value: string;
  constructor(n:string, t: ParamType, v: string) {
    this.name = n;
    this.type = t;
    this.value = v;
  }
}

export enum ParamType {
  ADDRESS,
  STRING,
  BYTES,
  I32,
  BIG_INT, 
}

export function newEvent<T>(params: Param[]): T {
  let event = newMockEvent();
  event.parameters = new Array();

  for (let i = 0; i < params.length; i++) {
    const p = params[i];
    let value: ethereum.EventParam;
    switch (p.type) {
      case ParamType.ADDRESS:
        value = new ethereum.EventParam(p.name, ethereum.Value.fromAddress(Address.fromString(p.value)));
        break;
      case ParamType.BIG_INT:
        value = new ethereum.EventParam(p.name, ethereum.Value.fromUnsignedBigInt(BigInt.fromString(p.value)));
        break;
      case ParamType.BYTES:
        value = new ethereum.EventParam(p.name, ethereum.Value.fromBytes(Bytes.fromUTF8(p.value)));
        break;
      case ParamType.I32:
        value = new ethereum.EventParam(p.name, ethereum.Value.fromI32(I32.parseInt(p.value)));
        break;
      case ParamType.STRING:
        value = new ethereum.EventParam(p.name, ethereum.Value.fromString(p.value));
        break;
      
      default:
        throw new Error("Invalid param type");
    }
    event.parameters.push(value);
  }
  return changetype<T>(event);
}

export function createApp(): AppCreated {
  const appEvent = newEvent<AppCreated>([
      new Param("id", ParamType.ADDRESS, TEST_APP_ID),
      new Param("creator", ParamType.ADDRESS, TEST_USER_ID),
      new Param("name", ParamType.STRING, TEST_APP_NAME),
  ]);
  // Create the app using event handler
  appHandleCreated(appEvent);

  // Set the app in context so it is accessible
  let context = new DataSourceContext()
  context.set('App', Value.fromString(TEST_APP_ID))
  dataSourceMock.setReturnValues(TEST_APP_ID, 'App', context)

  return appEvent;
}

export function createERC20Token(): ERC20Created {
  const createEvent = newEvent<ERC20Created>([
      new Param("id", ParamType.ADDRESS, TEST_TOKEN_ID),
      new Param("creator", ParamType.ADDRESS, TEST_USER2_ID),
      new Param("name", ParamType.STRING, TEST_TOKEN_NAME),
      new Param("symbol", ParamType.STRING, TEST_TOKEN_SYMBOL),
      new Param("decimals", ParamType.I32, "18"),
      new Param("supply", ParamType.BIG_INT, "1000"),
      new Param("implementationId", ParamType.BYTES, TEST_TOKEN_IMPLEMENTATIONID_BASE),
  ]);
  // Create token using event handler
  erc20handleCreated(createEvent);

  return createEvent;
}

export function createERC721Token(): ERC721Created {
  const createEvent = newEvent<ERC721Created>([
      new Param("id", ParamType.ADDRESS, TEST_TOKEN_ID),
      new Param("creator", ParamType.ADDRESS, TEST_USER2_ID),
      new Param("name", ParamType.STRING, TEST_TOKEN_NAME),
      new Param("symbol", ParamType.STRING, TEST_TOKEN_SYMBOL),
      new Param("royaltyRecipient", ParamType.ADDRESS, TEST_TOKEN_ROYALTYRECIPIENT),
      new Param("royaltyBps", ParamType.I32, TEST_TOKEN_ROYALTYBPS),
      new Param("implementationId", ParamType.BYTES, TEST_TOKEN_IMPLEMENTATIONID_BASE)
  ]);
  erc721handleCreated(createEvent);

  return createEvent;
}

export function createERC721LazyMintToken(): ERC721Created {
  const createEvent = newEvent<ERC721Created>([
    new Param("id", ParamType.ADDRESS, TEST_TOKEN_ID),
    new Param("creator", ParamType.ADDRESS, TEST_USER2_ID),
    new Param("name", ParamType.STRING, TEST_TOKEN_NAME),
    new Param("symbol", ParamType.STRING, TEST_TOKEN_SYMBOL),
    new Param("royaltyRecipient", ParamType.ADDRESS, TEST_TOKEN_ROYALTYRECIPIENT),
    new Param("royaltyBps", ParamType.I32, TEST_TOKEN_ROYALTYBPS),
    new Param("implementationId", ParamType.BYTES, TEST_TOKEN_IMPLEMENTATIONID_LAZYMINT)
  ]);
  erc721handleCreated(createEvent);

  return createEvent;
}

export function mintERC20TokenAction(): TokenMinted {
  const tokenMintedEvent = newEvent<TokenMinted>([
      new Param("token", ParamType.ADDRESS, TEST_TOKEN_ID),
      new Param("to", ParamType.ADDRESS, TEST_USER3_ID),
      new Param("amount", ParamType.BIG_INT, "2"),
      new Param("id", ParamType.BYTES, TEST_TOKEN_MINTED_ACTION_ID),
      new Param("activityType", ParamType.BYTES, TEST_TOKEN_MINTED_ACTION),
      new Param("uri", ParamType.STRING, TEST_TOKEN_MINTED_URI),
  ]);
  // Event handler
  handleTokenMinted(tokenMintedEvent);

  return tokenMintedEvent;
}

export function mintERC20TokenMission(): TokenMinted {
  const tokenMintedEvent = newEvent<TokenMinted>([
      new Param("token", ParamType.ADDRESS, TEST_TOKEN_ID),
      new Param("to", ParamType.ADDRESS, TEST_USER3_ID),
      new Param("amount", ParamType.BIG_INT, "2"),
      new Param("id", ParamType.BYTES, TEST_TOKEN_MINTED_MISSION_ID),
      new Param("activityType", ParamType.BYTES, TEST_TOKEN_MINTED_MISSION),
      new Param("uri", ParamType.STRING, TEST_TOKEN_MINTED_URI),
  ]);
  // Event handler
  handleTokenMinted(tokenMintedEvent);

  return tokenMintedEvent;
}

export function transferERC20TokenMission(): TokenTransferred {
  const event = newEvent<TokenTransferred>([
      new Param("token", ParamType.ADDRESS, TEST_TOKEN_ID),
      new Param("to", ParamType.ADDRESS, TEST_USER3_ID),
      new Param("amount", ParamType.BIG_INT, "2"),
      new Param("id", ParamType.BYTES, TEST_TOKEN_MINTED_MISSION_ID),
      new Param("activityType", ParamType.BYTES, TEST_TOKEN_MINTED_MISSION),
      new Param("uri", ParamType.STRING, TEST_TOKEN_MINTED_URI),
  ]);
  // Event handler
  handleTokenTransferred(event);

  return event;
}

export function mintBadge(): BadgeMinted {
  const event = newEvent<BadgeMinted>([
      new Param("token", ParamType.ADDRESS, TEST_TOKEN_ID),
      new Param("quantity", ParamType.BIG_INT, "2"),
      new Param("to", ParamType.ADDRESS, TEST_USER3_ID),
      new Param("id", ParamType.BYTES, TEST_TOKEN_MINTED_MISSION_ID),
      new Param("activityType", ParamType.BYTES, TEST_TOKEN_MINTED_MISSION),
      new Param("uri", ParamType.STRING, TEST_TOKEN_MINTED_URI),
  ]);
  // Event handler
  handleBadgeMinted(event);

  return event;
}

export function getTestBadgeTokenEntity(contractAddress: Address, tokenId: BigInt, owner: string, uri: string): BadgeToken {
  const id = BadgeId(contractAddress, tokenId.toHex());
  const badgeToken = new BadgeToken(id);
  badgeToken.createdAt = BigInt.fromI32(1);
  badgeToken.createdAtBlock = BigInt.fromI32(1);
  badgeToken.tokenId = tokenId;
  badgeToken.updatedAt = BigInt.fromI32(1);
  badgeToken.updatedAtBlock = BigInt.fromI32(1);
  badgeToken.badge = contractAddress.toHex();
  badgeToken.metadataURI = uri;
  badgeToken.owner = owner;

  return badgeToken;
}

export function transferBadge(): BadgeTransferred {
  const event = newEvent<BadgeTransferred>([
      new Param("token", ParamType.ADDRESS, TEST_TOKEN_ID),
      new Param("to", ParamType.ADDRESS, TEST_USER3_ID),
      new Param("tokenId", ParamType.BIG_INT, TEST_BADGETOKEN_ID),
      new Param("id", ParamType.BYTES, TEST_TOKEN_MINTED_MISSION_ID),
      new Param("activityType", ParamType.BYTES, TEST_TOKEN_MINTED_MISSION),
      new Param("uri", ParamType.STRING, TEST_TOKEN_MINTED_URI),
  ]);
  // Event handler
  handleBadgeTransferred(event);

  return event;
}

export function transferERC20(): ERC20Transfer {
  const event = newEvent<ERC20Transfer>([
      new Param("from", ParamType.ADDRESS, TEST_USER2_ID),
      new Param("to", ParamType.ADDRESS, TEST_USER3_ID),
      new Param("value", ParamType.BIG_INT, "5"),
  ]);
  // Event handler
  handleTransferERC20(event);

  return event;
}

export function updateERC20ContractURI(): ERC20ContractURIUpdated {
  const event = newEvent<ERC20ContractURIUpdated>([
      new Param("prevURI", ParamType.STRING, "uri://abc"),
      new Param("newURI", ParamType.STRING, "uri://abc1234"),
  ]);
  // Event handler
  handleContractURIUpdated(event);

  return event;
}

export function mintedERC721(): Minted {
  const event = newEvent<Minted>([
      new Param("to", ParamType.ADDRESS, TEST_USER3_ID),
      new Param("tokenURI", ParamType.STRING, "uri://abc"),
  ]);
  event.address = Address.fromString(TEST_TOKEN_ID);
  // Event handler
  handleMinted(event);

  return event;
}

export function batchMintedERC721(): BatchMinted {
  const event = newEvent<BatchMinted>([
      new Param("to", ParamType.ADDRESS, TEST_USER3_ID),
      new Param("quantity", ParamType.BIG_INT, "2"),
      new Param("baseURI", ParamType.STRING, "uri://abc"),
  ]);
  event.address = Address.fromString(TEST_TOKEN_ID);
  // Event handler
  handleBatchMinted(event);

  return event;
}

export function transferERC721(to: string): ERC721Transfer {
  const event = newEvent<ERC721Transfer>([
      new Param("from", ParamType.ADDRESS, TEST_USER_ID),
      new Param("to", ParamType.ADDRESS, to),
      new Param("tokenId", ParamType.BIG_INT, TEST_BADGETOKEN_ID),
  ]);
  event.address = Address.fromString(TEST_TOKEN_ID);
  // Event handler
  handleTransferERC721(event);

  return event;
}

export function getTestFungibleToken(): FungibleToken {
  const fungibleToken = new FungibleToken(TEST_TOKEN_ID);
  fungibleToken.createdAt = BigInt.fromI32(1);
  fungibleToken.createdAtBlock = BigInt.fromI32(1);
  fungibleToken.updatedAt = BigInt.fromI32(1);
  fungibleToken.updatedAtBlock = BigInt.fromI32(1);
  fungibleToken.name = TEST_TOKEN_NAME;
  fungibleToken.app = TEST_APP_ID;
  fungibleToken.totalSupply = BigInt.fromString(TEST_TOKEN_TOTAL_SUPPLY);
  fungibleToken.owner = TEST_USER_ID;
  fungibleToken.symbol = "TEST";
  fungibleToken.burntSupply = BigInt.fromI32(1);

  return fungibleToken;
}

export function transferERC721LazyMint(to: string): TransferERC721LazyMint {
  const event = newEvent<TransferERC721LazyMint>([
      new Param("from", ParamType.ADDRESS, TEST_USER_ID),
      new Param("to", ParamType.ADDRESS, to),
      new Param("tokenId", ParamType.BIG_INT, TEST_BADGETOKEN_ID),
  ]);
  event.address = Address.fromString(TEST_TOKEN_ID);
  // Event handler
  handleTransferERC721LazyMint(event);

  return event;
}

export function mintLazyMint(): TokensLazyMinted {
  const event = newEvent<TokensLazyMinted>([
      new Param("startTokenId", ParamType.BIG_INT, "1"),
      new Param("endTokenId", ParamType.BIG_INT, "5"),
      new Param("baseURI", ParamType.STRING, "uri://abcdef"),
  ]);
  event.address = Address.fromString(TEST_TOKEN_ID);
  // Event handler
  handleLazyMint(event);

  return event;
}

export function mintedERC721LazyMint(): MintedLazyMint {
  const event = newEvent<MintedLazyMint>([
      new Param("to", ParamType.ADDRESS, TEST_USER3_ID),
      new Param("tokenURI", ParamType.STRING, "uri://abc"),
  ]);
  event.address = Address.fromString(TEST_TOKEN_ID);
  // Event handler
  handleMintedLazyMint(event);

  return event;
}

export function batchMintedERC721LazyMint(): BatchMintedLazyMint {
  const event = newEvent<BatchMintedLazyMint>([
      new Param("to", ParamType.ADDRESS, TEST_USER3_ID),
      new Param("quantity", ParamType.BIG_INT, "2"),
      new Param("baseURI", ParamType.STRING, "uri://abc"),
  ]);
  event.address = Address.fromString(TEST_TOKEN_ID);
  // Event handler
  handleBatchMintedLazyMint(event);

  return event;
}
