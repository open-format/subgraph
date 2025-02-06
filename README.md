# Open Format Subgraph

The Open Format Subgraph allows you to query data about the Open Format smart contracts in graphQl. Ideal for real-time and historic data retrieval for client facing apps.

Visit [https://docs.openformat.tech](https://docs.openformat.tech) to view further documentation on our api, sdk and no-code that all use this subgraph under the hood. Or reach out to us directly via  [Discord](https://discord.gg/BgkbC7Dkuf)

## Getting Started

Best way to get started is to use the examples below and the graphQl playground. To see all the available entities see [schema.graphql](./schema.graphql)

## Deployments

There is a subgraph available for each chain the open format contracts are deployed to.

> **Note:** these endpoints are rate limited please reach out for an API key.

### Mainnets
| Chain        | endpoint                                                                                | playground                                                                                         |
| ------------ | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Arbitrum One | [endpoint](https://api.studio.thegraph.com/query/82634/open-format-arbitrum-one/v0.1.1) | [playground](https://api.studio.thegraph.com/query/82634/open-format-arbitrum-one/v0.1.1/graphql?) |
| Base         | [endpoint](https://api.studio.thegraph.com/query/82634/open-format-base/v0.1.1)         | [playground](https://api.studio.thegraph.com/query/82634/open-format-base/v0.1.1/graphql?)         |
| Aurora       | [endpoint](https://api.studio.thegraph.com/query/82634/open-format-aurora/v0.1.1)       | [playground](https://api.studio.thegraph.com/query/82634/open-format-aurora/v0.1.1/graphql?)       |

### Testnets
| Chain            | endpoint                                                                                    | playground                                                                                             |
| ---------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Arbitrum Sepolia | [endpoint](https://api.studio.thegraph.com/query/82634/open-format-arbitrum-sepolia/v0.1.1) | [playground](https://api.studio.thegraph.com/query/82634/open-format-arbitrum-sepolia/v0.1.1/graphql?) |
| Base Sepolia     | [endpoint](https://api.studio.thegraph.com/query/82634/open-format-base-sepolia/v0.1.1)     | [playground](https://api.studio.thegraph.com/query/82634/open-format-base-sepolia/v0.1.1/graphql?)     |
| Aurora testnet   | [endpoint](https://api.studio.thegraph.com/query/82634/open-format-aurora-testnet/v0.1.1)   | [playground](https://api.studio.thegraph.com/query/82634/open-format-aurora-testnet/v0.1.1/graphql?)   |


## Examples

> **Note:** All examples below use app addresses from the Arbitrum Sepolia testnet. Make sure to use the appropriate app addresses for your target blockchain network.


### App

The open format contracts are structured around app contracts. This will be the starting point for most use cases.

```graphql
{
  app (id: "0x0c1019fbcc7c334f4ff2e01379d28343b1d638bc") {
    id
    name
    owner {
      id
    }
  }
}
```
[playground example ->](https://api.studio.thegraph.com/query/82634/open-format-arbitrum-sepolia/v0.1.1/graphql?query=%7B%0A++app+%28id%3A+%220x0c1019fbcc7c334f4ff2e01379d28343b1d638bc%22%29+%7B%0A++++id%0A++++name%0A++++owner+%7B%0A++++++id%0A++++%7D%0A++%7D%0A%7D)

To get multiple apps use the where filter on the `apps` entity. For example retrieving all the apps with the same owner:

```graphql
{
  apps (
    where: {
      owner: "0x15ccdd13524bce57e8e07874eb615342ca64223e"
    }
  ) {
    id
    name
    owner {
      id
    }
  }
}
```
[playground example ->](https://api.studio.thegraph.com/query/82634/open-format-arbitrum-sepolia/v0.1.1/graphql?query=%7B%0A++apps+%28%0A++++where%3A+%7B%0A++++++owner%3A+%220x15ccdd13524bce57e8e07874eb615342ca64223e%22%0A++++%7D%0A++%29+%7B%0A++++id%0A++++name%0A++++owner+%7B%0A++++++id%0A++++%7D%0A++%7D%0A%7D)

### Fungible Tokens

To get tokens (ERC20) created or used by an app we can extend the app query from above

```graphql
{
  app (id: "0x0c1019fbcc7c334f4ff2e01379d28343b1d638bc") {
    id
    name
    tokens {
      token {
        id
        name
        symbol
        decimals
        tokenType
        totalSupply
      }
    }
  }
}
```
[playground example ->](https://api.studio.thegraph.com/query/82634/open-format-arbitrum-sepolia/v0.1.1/graphql?query=%7B%0A++app+%28id%3A+%220x0c1019fbcc7c334f4ff2e01379d28343b1d638bc%22%29+%7B%0A++++id%0A++++name%0A++++tokens+%7B%0A++++++token+%7B%0A++++++++id%0A++++++++name%0A++++++++symbol%0A++++++++decimals%0A++++++++tokenType%0A++++++++totalSupply%0A++++++%7D%0A++++%7D%0A++%7D%0A%7D)

Alternatively tokens can be queried with a filter. For example get all the tokens of type points of a given app:
```graphql
{
  fungibleTokens (
    where: {
      app: "0x0c1019fbcc7c334f4ff2e01379d28343b1d638bc",
      tokenType: Point
    }
  ) {
    id
    name
    symbol
    decimals
    tokenType
    totalSupply
  }
}
```
[playground example ->](https://api.studio.thegraph.com/query/82634/open-format-arbitrum-sepolia/v0.1.1/graphql?query=%7B%0A++fungibleTokens+%28%0A++++where%3A+%7B%0A++++++app%3A+%220x0c1019fbcc7c334f4ff2e01379d28343b1d638bc%22%2C%0A++++++tokenType%3A+Point%0A++++%7D%0A++%29+%7B%0A++++id%0A++++name%0A++++symbol%0A++++decimals%0A++++tokenType%0A++++totalSupply%0A++%7D%0A%7D)


To get balances of a given token

```graphql
{
  fungibleTokenBalances (
    where: {
      token : "0x9a798063eca2e338a1767c439ba5d20153e5a6f2"
    }
    orderBy: balance,
    orderDirection: desc
  ) {
    id
    balance
    token {
      id
      name
    }
  }
}
```
[playground example ->](https://api.studio.thegraph.com/query/82634/open-format-arbitrum-sepolia/v0.1.1/graphql?query=%7B%0A++fungibleTokenBalances+%28%0A++++where%3A+%7B%0A++++++token+%3A+%220x9a798063eca2e338a1767c439ba5d20153e5a6f2%22%0A++++%7D%0A++++orderBy%3A+balance%2C%0A++++orderDirection%3A+desc%0A++%29+%7B%0A++++id%0A++++balance%0A++++token+%7B%0A++++++id%0A++++++name%0A++++%7D%0A++%7D%0A%7D)

### Badges

Badges represent NFT or ERC721 contracts. Each badge contract keeps the record of owners of the badge tokens.

To get all the badges that have been created by an app

```graphql
{
  app (id: "0x0c1019fbcc7c334f4ff2e01379d28343b1d638bc") {
    id
    name
    badges {
     	id
     	name
      symbol
      metadataURI
      totalAwarded
    }
  }
}
```
[playground example ->](https://api.studio.thegraph.com/query/82634/open-format-arbitrum-sepolia/v0.1.1/graphql?query=%7B%0A++app+%28id%3A+%220x0c1019fbcc7c334f4ff2e01379d28343b1d638bc%22%29+%7B%0A++++id%0A++++name%0A++++badges+%7B%0A+++++%09id%0A+++++%09name%0A++++++symbol%0A++++++metadataURI%0A++++++totalAwarded%0A++++%7D%0A++%7D%0A%7D%0A)

Alternatively badges can be queried using filters. For example get all the badge contracts with metadataURI set.

```graphql
{
  badges (
    where:{
      app: "0x0c1019fbcc7c334f4ff2e01379d28343b1d638bc"
      metadataURI_not: null
    }
  ){
    id
    name
    symbol
    metadataURI
    totalAwarded
    tokens {
      tokenId
    }
  }
}
```
[playground example ->](https://api.studio.thegraph.com/query/82634/open-format-arbitrum-sepolia/v0.1.1/graphql?query=%7B%0A++badges+%28%0A++++where%3A%7B%0A++++++app%3A+%220x0c1019fbcc7c334f4ff2e01379d28343b1d638bc%22%0A++++++metadataURI_not%3A+null%0A++++%7D%0A++%29%7B%0A++++id%0A++++name%0A++++symbol%0A++++metadataURI%0A++++totalAwarded%0A++++tokens+%7B%0A++++++tokenId%0A++++%7D%0A++%7D%0A%7D)

To get the tokens of a badge you can add `tokens` field the badge entity or use filters on the `badgeTokens` entity.

```graphql
{
  badgeTokens (
    where:{
      badge: "0x8bb2d2bb85c4bbf1de64aec7823f7fa65190c301"
      owner: "0x4d2a24c1f1078f7a5342286225fabd1793b89213"
    }
  ){
    id
    tokenId
    createdAt
    createdAtBlock
    owner {
      id
    }
  }
}
```
[playground example ->](https://api.studio.thegraph.com/query/82634/open-format-arbitrum-sepolia/v0.1.1/graphql?query=%7B%0A++badgeTokens+%28%0A++++where%3A%7B%0A++++++badge%3A+%220x8bb2d2bb85c4bbf1de64aec7823f7fa65190c301%22%0A++++++owner%3A+%220x4d2a24c1f1078f7a5342286225fabd1793b89213%22%0A++++%7D%0A++%29%7B%0A++++id%0A++++tokenId%0A++++createdAt%0A++++createdAtBlock%0A++++owner+%7B%0A++++++id%0A++++%7D%0A++%7D%0A%7D)

> **Important**: The `metadataURI` field may be set on either the `badge` entity or individual `badgeToken` entities depending on the type of contract.

### Rewards

Rewards are transfers issued by an app contract with added context and metadata. Very useful for publicly recording **why** a transfer was made using the rewardId, rewardType, and metadataURI fields. Each reward wraps a fungible token or a badge tokens transfer.

```graphql
{
  rewards (
    where: {
      app: "0x0c1019fbcc7c334f4ff2e01379d28343b1d638bc"
    }
  ){
    id
    rewardId
    rewardType
    metadataURI
    badge {
      id
      name
      metadataURI
    }
    badgeCount
    token {
      id
      name
    }
    tokenAmount
    createdAt
    transactionHash
  }
}
```
[playground example ->](https://api.studio.thegraph.com/query/82634/open-format-arbitrum-sepolia/v0.1.1/graphql?query=%7B%0A++rewards+%28%0A++++where%3A+%7B%0A++++++app%3A+%220x0c1019fbcc7c334f4ff2e01379d28343b1d638bc%22%0A++++%7D%0A++%29%7B%0A++++id%0A++++rewardId%0A++++rewardType%0A++++metadataURI%0A++++badge+%7B%0A++++++id%0A++++++name%0A++++++metadataURI%0A++++%7D%0A++++badgeCount%0A++++token+%7B%0A++++++id%0A++++++name%0A++++%7D%0A++++tokenAmount%0A++++transactionHash%0A++++createdAt%0A++%7D%0A%7D)


### User Balances

Get all token balances and collected badges for a given user:

```graphql
{
  user(id: "0x03755352654d73da06756077dd7f040adce3fd58") {
    id
    collectedBadges {
      badge {
        id
        name
        metadataURI
      }
      tokenId
    }
    tokenBalances {
      token {
        id
        name
      }
      balance
    }
  }
}
```
[playground example ->](https://api.studio.thegraph.com/query/82634/open-format-arbitrum-sepolia/v0.1.1/graphql?query=%7B%0A++user%28id%3A+%220x03755352654d73da06756077dd7f040adce3fd58%22%29+%7B%0A++++id%0A++++collectedBadges+%7B%0A++++++badge+%7B%0A++++++++id%0A++++++++name%0A++++++++metadataURI%0A++++++%7D%0A++++++tokenId%0A++++%7D%0A++++tokenBalances+%7B%0A++++++token+%7B%0A++++++++id%0A++++++++name%0A++++++%7D%0A++++++balance%0A++++%7D%0A++%7D%0A%7D)


### Pagination, sorting, filtering and ordering

Please see [the graph protocol querying docs](https://thegraph.com/docs/en/subgraphs/querying/graphql-api/)


## Local Development

### Prerequisites

Before starting the local development, ensure that you have the following:

- A local version of [graph-node](https://github.com/graphprotocol/graph-node) running. We recommend using [Docker Compose](https://github.com/graphprotocol/graph-node/tree/master/docker#docker-compose).
- A local testnet node running and our [smart contracts](https://github.com/open-format/contracts#getting-started) deployed locally.

### Clone the repository:

Clone the subgraph repository by running the following command:

`git clone https://github.com/open-format/subgraph.git`

### Install dependencies:

Install the required dependencies using either of the following package managers:

Using Yarn:

`yarn install`

Using NPM:

`npm install`

### Prepare the local subgraph

Prepare the local subgraph by running the following command:

`yarn prepare:local`

### Generate code for the local subgraph

Generate needed code for the local subgraph by running the following command:

`yarn gen:local`


### Create the local subgraph

Create the local subgraph by running the following command:

`yarn create:local`

### Deploy the local subgraph

Finally, deploy the local subgraph by running the following command:

`yarn deploy:local`

## Contributing

Our bounty program provides developers with a chance to earn by contributing to the Open Format ecosystem through completing bounties for new features and templates on our product roadmap. If you're interested in getting involved, check out our [current bounties](https://github.com/orgs/open-format/projects) to see if there are any projects that match your skills and interests.

## Community

We're building a community of talented developers who are passionate about shaping the future of the internet. We believe that collaboration and shared knowledge are absolutely essential to creating amazing things that will impact people's lives in profound ways. If you share our vision, we invite you to come be a part of something amazing on [Discord](https://discord.gg/BgkbC7Dkuf).
