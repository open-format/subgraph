import { Address, BigInt, dataSource, store } from "@graphprotocol/graph-ts";
import {
  BatchMinted,
  ERC721Badge as ERC721BadgeContract,
  Minted,
  UpdatedBaseURI
} from "../generated/templates/ERC721Badge/ERC721Badge";

import { App } from "../generated/schema";
import { Transfer } from "../generated/templates/ERC721Badge/ERC721Badge";
import {
  One,
  ZERO_ADDRESS,
  loadBadge,
  loadBadgeToken,
  loadOrCreateBadge,
  loadOrCreateBadgeToken,
  loadOrCreateUser,
} from "./helpers";

let context = dataSource.context();
let contractAddress = Address.fromString(context.getString("ERC721ContractBadge"));
const boundContract = ERC721BadgeContract.bind(contractAddress);

export function handleUpdatedBaseURI(event: UpdatedBaseURI): void {
  let badge = loadOrCreateBadge(event.address, event);

  badge.metadataURI = event.params.baseURIForTokens
  badge.save();
}

export function handleMinted(event: Minted): void {
  const tokenId = boundContract.nextTokenIdToMint().minus(One);

  let badgeToken = loadOrCreateBadgeToken(event.address, tokenId, event);

  let badge = loadBadge(event.address);

  if (badge) {
    let app = App.load(badge.app);
    if (app) {
      app.badgesAwarded = tokenId.plus(One);
      app.save();
    }
  }

  let user = loadOrCreateUser(event.params.to, event);

  badgeToken.owner = user.id;
  badgeToken.tokenId = tokenId;
  badgeToken.badge = event.address.toHex();

  badgeToken.save();
  user.save();
}

export function handleBatchMinted(event: BatchMinted): void {
  let user = loadOrCreateUser(event.params.to, event);
  let badge = loadOrCreateBadge(contractAddress, event);
  let app = App.load(badge.app);

  const totalSupplyBeforeMint = boundContract
    .totalSupply()
    .minus(event.params.quantity);

  for (let i = 0; i < event.params.quantity.toI32(); i++) {
    const tokenId = totalSupplyBeforeMint.plus(BigInt.fromI32(i));

    let badgeToken = loadOrCreateBadgeToken(event.address, tokenId, event);
    badgeToken.owner = user.id;
    badgeToken.tokenId = tokenId;
    badgeToken.badge = event.address.toHex();
    badgeToken.save();
  }

  badge.totalAwarded = totalSupplyBeforeMint.plus(event.params.quantity);

  if (app) {
    app.badgesAwarded = totalSupplyBeforeMint.plus(event.params.quantity);
    app.save();
  }

  badge.save();
}

export function handleTransfer(event: Transfer): void {
  let Badge = loadBadgeToken(event.address, event.params.tokenId);
  let user = loadOrCreateUser(event.params.to, event);
  if (Badge) {
    if (event.params.to == ZERO_ADDRESS) {
      store.remove("Badge", Badge.id);
    } else {
      Badge.owner = user.id;
      Badge.save();
    }
  }
}
