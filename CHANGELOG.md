# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.1.1] - 2025-01-09

### Added
- `Reward` entity ([#76](https://github.com/open-format/subgraph/pull/76))
- Support for different `FungibleToken` types ([#75](https://github.com/open-format/subgraph/pull/75))

### Fixed
- Bug with totalAwarded not updating on `Badge` entity ([#74](https://github.com/open-format/subgraph/pull/74))

### Deprecated
- `Mission` and `Action` entities ([#76](https://github.com/open-format/subgraph/pull/76))


## [v0.1.0] - 2024-11-19

### Added

- Changelog ([#69](https://github.com/open-format/subgraph/pull/69))
- Support for external tokens to be rewarded in missions ([#69](https://github.com/open-format/subgraph/pull/69))
- Indexes events from charge facet smart contract ([#66](https://github.com/open-format/subgraph/pull/69))

### Deprecated

- `FungibleToken.app` field ([#69](https://github.com/open-format/subgraph/pull/69))

### Fixed

- Bug where `MissionMetadata.URI` field was being indexed incorrectly ([#70](https://github.com/open-format/subgraph/pull/70))