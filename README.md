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

Get all apps:

[Live example](https://api.thegraph.com/subgraphs/name/open-format/mumbai/graphql?query=query+getAllApps+%7B%0A++apps+%7B%0A++++id%0A++++name%0A++++owner+%7B%0A++++++id%0A++++%7D%0A++%7D%0A%7D)

```graphql
query getAllApps {
  apps {
    id
    name
    owner {
      id
    }
  }
}
```

Get all contracts for a given app:

[Live example](https://api.thegraph.com/subgraphs/name/open-format/mumbai/graphql?query=query+getAllAppContracts+%7B%0A++contracts%28where%3A+%7Bapp%3A+%220xfc76eb5fc23b9e1d46546e6eefab07666937c276%22%7D%29%7B%0A++++id%0A++++type%0A++++metadata+%7B%0A++++++name%0A++++++totalSupply%0A++++%7D%0A++%7D%0A%7D)

```graphql
query getAllAppContracts {
  contracts(where: {app: "0xfc76eb5fc23b9e1d46546e6eefab07666937c276"}) {
    id
    type
    metadata {
      name
      totalSupply
    }
  }
}
```

Get all token balances for a given user:

[Live example](https://api.thegraph.com/subgraphs/name/open-format/mumbai/graphql?query=query+getAllUserTokens+%7B%0A++user%28id%3A+%220xcb9094b7bd910b1cd3943aa7d04b8b44bf17aa57%22%29+%7B%0A++++id%0A++++nfts+%7B%0A++++++id%0A++++++tokenId%0A++++++metadataURI%0A++++%7D%0A++++tokens+%7B%0A++++++token+%7B%0A++++++++id%0A++++++%7D%0A++++++balance%0A++++%7D%0A++%7D%0A%7D)

```graphql
query getAllUserTokens {
  user(id: "0xcb9094b7bd910b1cd3943aa7d04b8b44bf17aa57") {
    id
    nfts {
      id
      tokenId
      metadataURI
    }
    tokens {
      token {
        id
      }
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
