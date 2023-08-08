import {Address, BigInt, dataSource, store} from "@graphprotocol/graph-ts";
import {
  BatchMinted,
  ERC721LazyMint,
  Minted,
  TokensLazyMinted,
  Transfer
} from "../generated/templates/ERC721LazyMint/ERC721LazyMint";

import {
  ZERO_ADDRESS,
  loadBadgeToken,
  loadOrCreateBadge,
  loadOrCreateBadgeToken,
  loadOrCreateUser
} from "./helpers";

let context = dataSource.context();
let contractAddress = Address.fromString(
  context.getString("ERC721ContractLazyMint")
);
const boundContract = ERC721LazyMint.bind(contractAddress);

export function handleMinted(event: Minted): void {
  const totalSupply = boundContract
    .nextTokenIdToMint()
    .minus(BigInt.fromI32(1));

  let Badge = loadOrCreateBadge(contractAddress, event);

  let BadgeToken = loadOrCreateBadgeToken(event.address, totalSupply, event);
  let user = loadOrCreateUser(event.params.to, event);

  BadgeToken.owner = user.id;
  BadgeToken.metadataURI = event.params.tokenURI;
  BadgeToken.tokenId = totalSupply;
  BadgeToken.badge = event.address.toHex();

  Badge.totalAwarded = totalSupply.plus(BigInt.fromI32(1));

  Badge.save();
  BadgeToken.save();
  user.save();
}

export function handleBatchMinted(event: BatchMinted): void {
  let user = loadOrCreateUser(event.params.to, event);
  let Badge = loadOrCreateBadge(contractAddress, event);

  const totalSupplyBeforeMint = boundContract
    .totalSupply()
    .minus(event.params.quantity);

  for (let i = 0; i < event.params.quantity.toI32(); i++) {
    const tokenId = totalSupplyBeforeMint.plus(BigInt.fromI32(i));

    let BadgeToken = loadOrCreateBadgeToken(event.address, tokenId, event);
    BadgeToken.owner = user.id;
    BadgeToken.metadataURI = event.params.baseURI;
    BadgeToken.tokenId = tokenId;
    BadgeToken.badge = event.address.toHex();
    BadgeToken.save();
  }

  Badge.totalAwarded = totalSupplyBeforeMint.plus(event.params.quantity);
  Badge.save();
}

export function handleLazyMint(event: TokensLazyMinted): void {
  let badge = loadOrCreateBadge(event.address, event);
  badge.totalAvailable = event.params.endTokenId.plus(BigInt.fromI32(1));
  badge.save();
}

export function handleTransfer(event: Transfer): void {
  let Badge = loadBadgeToken(event.address, event.params.tokenId.toString());
  if (Badge) {
    if (event.params.to == ZERO_ADDRESS) {
      store.remove("Badge", Badge.id);
    } else {
      Badge.owner = event.params.to.toHex();
      Badge.save();
    }
  }
}
