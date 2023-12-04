# What is a subgraph?

A subgraph is a tool used in decentralized applications built on blockchain technology, particularly those built on the Ethereum network. It is essentially a collection of GraphQL APIs that developers can use to extract data from the blockchain.

The benefits of using a subgraph are numerous. For one, subgraphs make it easier to query data from the blockchain in a structured and organized manner, allowing developers to efficiently extract the data they need for their applications. Subgraphs also help to reduce the load on the blockchain network by offloading the querying of data to a separate layer.

We have three subgraph deployed on Polygon Mumbai, Polygon Mainnet, Aurora Mainnet and Aurora Testnet. Our subgraphs use [The Graph Protocol](https://thegraph.com/en/)

## Features

✅ Real-time indexing of all Open Format contracts

✅ Indexing of all Open Format tokens

✅ Indexing of all Open Format actions and missions

✅ Sortable and filterable

🔨 Indexed NFT metadata

🔨 NFT Drop claim conditions

## Examples

Get all constellations:

[Live example](https://api.thegraph.com/subgraphs/name/open-format/mumbai-v2/graphql?query=%7B%0A++constellations+%7B%0A++++id%0A++++name%0A++++owner+%7B%0A++++++id%0A++++%7D%0A++%7D%0A%7D&variables=%22%7B%5Cn++%5C%22constellation%5C%22%3A+%5C%220x8a19c98762a3fb129ed82f01f4397b351216e7ce%5C%22%5Cn%7D%22)

```graphql
query getAllConstellations {
  constellations {
    id
    name
    owner {
      id
    }
  }
}
```

Get all stars for a given constellation:

[Live example](https://api.thegraph.com/subgraphs/name/open-format/mumbai-v2/graphql?query=query+getAllConstellationStars+%7B%0A++stars%28where%3A+%7Bconstellation%3A+%220x7087e19982a30de8d2179ca9fc76d0b625564a00%22%7D%29+%7B%0A++++id%0A++++name%0A++++xpToken+%7B%0A++++++id%0A++++%7D%0A++%7D%0A%7D&variables=%22%7B%5Cn++%5C%22constellation%5C%22%3A+%5C%220x8a19c98762a3fb129ed82f01f4397b351216e7ce%5C%22%5Cn%7D%22&operationName=getAllConstellationStars)

```graphql
query getAllConstellationStars {
  stars(where: {constellation: "0x7087e19982a30de8d2179ca9fc76d0b625564a00"}) {
    id
    name
    xpToken {
      id
    }
  }
}
```

Get all token balances and collected badges for a given user:

[Live example](https://api.thegraph.com/subgraphs/name/open-format/mumbai-v2/graphql?query=query+getAllUserTokens+%7B%0A++user%28id%3A+%220x03755352654d73da06756077dd7f040adce3fd58%22%29+%7B%0A++++id%0A++++collectedBadges+%7B%0A++++++id%0A++++%7D%0A++++tokenBalances+%7B%0A++++++balance%0A++++%7D%0A++%7D%0A%7D&variables=%22%7B%5Cn++%5C%22constellation%5C%22%3A+%5C%220x8a19c98762a3fb129ed82f01f4397b351216e7ce%5C%22%5Cn%7D%22&operationName=getAllUserTokens)

```graphql
query getAllUserTokens {
  user(id: "0x03755352654d73da06756077dd7f040adce3fd58") {
    id
    collectedBadges {
      id
    }
    tokenBalances {
      balance
    }
  }
}
```

## Documentation

Visit [https://docs.openformat.tech](https://docs.openformat.tech) to view documentation.

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
