import { assert, createMockedFunction, clearStore, test, describe, afterEach, dataSourceMock } from "matchstick-as/assembly/index";
import { createApp, createBadge, createERC20Token, getTestBadgeTokenEntity, badgeMintedLegacy, mintERC20TokenAction, mintERC20TokenMission, transferBadge, transferERC20TokenMission, badgeMinted, erc721Minted, updatedBaseURI } from "../utils";
import { TEST_ACTIONMETADATA_ENTITY_TYPE, TEST_ACTION_ENTITY_TYPE, TEST_APP_ID, TEST_BADGETOKEN_ENTITY_TYPE, TEST_BADGETOKEN_ID, TEST_MISSIONFUNGIBLETOKEN_ENTITY_TYPE, TEST_MISSIONMETADATA_ENTITY_TYPE, TEST_MISSION_ENTITY_TYPE, TEST_TOKEN_ID, TEST_TOKEN_MINTED_ACTION_ID, TEST_TOKEN_MINTED_MISSION_ID, TEST_TOKEN_MINTED_URI, TEST_TOKEN_TOTAL_SUPPLY, TEST_USER2_ID, TEST_USER3_ID, TEST_USER_ENTITY_TYPE, TEST_USER_ID } from "../fixtures";
import { ActionId, BadgeId, MissionId, loadBadgeToken } from "../../src/helpers";
import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Mission } from "../../generated/schema";

describe("RewardsFacet tests", () => {
    afterEach(() => {
        clearStore();
        dataSourceMock.resetValues();
    })

    test("Token minted ACTION", () => {
        createApp();
        createERC20Token();
        const event = mintERC20TokenAction();

        // Users data
        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER_ID, "id", TEST_USER_ID); // App user
        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER2_ID, "id", TEST_USER2_ID); // Token user
        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER3_ID, "id", TEST_USER3_ID); // Token minted user

        const actionId = ActionId(event.transaction.hash, event.logIndex);

        assert.fieldEquals(TEST_ACTION_ENTITY_TYPE, actionId, "id", actionId);
        assert.fieldEquals(TEST_ACTION_ENTITY_TYPE, actionId, "user", event.params.to.toHex());
        assert.fieldEquals(TEST_ACTION_ENTITY_TYPE, actionId, "xp_rewarded", event.params.amount.toString());
        assert.fieldEquals(TEST_ACTION_ENTITY_TYPE, actionId, "app", TEST_APP_ID);
        assert.fieldEquals(TEST_ACTION_ENTITY_TYPE, actionId, "metadata", actionId);

        assert.fieldEquals(TEST_ACTIONMETADATA_ENTITY_TYPE, actionId, "id", actionId);
        assert.fieldEquals(TEST_ACTIONMETADATA_ENTITY_TYPE, actionId, "name", TEST_TOKEN_MINTED_ACTION_ID);
        assert.fieldEquals(TEST_ACTIONMETADATA_ENTITY_TYPE, actionId, "URI", TEST_TOKEN_MINTED_URI);
    })

    test("Token minted MISSION", () => {
        createApp();
        createERC20Token();
        const event = mintERC20TokenMission();

        // Users data
        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER_ID, "id", TEST_USER_ID); // App user
        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER2_ID, "id", TEST_USER2_ID); // Token user
        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER3_ID, "id", TEST_USER3_ID); // Token minted user

        const missionId = MissionId(event.transaction.hash, event.params.id);
        const missionFungibleTokenId = event.transaction.hash.toHex() + "-" + event.params.id.toHex() + "-" + event.params.token.toHex();


        assert.fieldEquals(TEST_MISSION_ENTITY_TYPE, missionId, "id", missionId);
        assert.fieldEquals(TEST_MISSION_ENTITY_TYPE, missionId, "xp_rewarded", event.params.amount.toString());
        assert.fieldEquals(TEST_MISSION_ENTITY_TYPE, missionId, "user", event.params.to.toHex());
        assert.fieldEquals(TEST_MISSION_ENTITY_TYPE, missionId, "app", TEST_APP_ID);
        assert.fieldEquals(TEST_MISSION_ENTITY_TYPE, missionId, "metadata", missionId);

        assert.fieldEquals(TEST_MISSIONMETADATA_ENTITY_TYPE, missionId, "id", missionId);
        assert.fieldEquals(TEST_MISSIONMETADATA_ENTITY_TYPE, missionId, "name", TEST_TOKEN_MINTED_MISSION_ID);
        assert.fieldEquals(TEST_MISSIONMETADATA_ENTITY_TYPE, missionId, "URI", TEST_TOKEN_MINTED_URI);

        assert.fieldEquals(TEST_MISSIONFUNGIBLETOKEN_ENTITY_TYPE, missionFungibleTokenId, "id", missionFungibleTokenId);
        assert.fieldEquals(TEST_MISSIONFUNGIBLETOKEN_ENTITY_TYPE, missionFungibleTokenId, "amount_rewarded", event.params.amount.toString());
        assert.fieldEquals(TEST_MISSIONFUNGIBLETOKEN_ENTITY_TYPE, missionFungibleTokenId, "mission", missionId);
        assert.fieldEquals(TEST_MISSIONFUNGIBLETOKEN_ENTITY_TYPE, missionFungibleTokenId, "token", event.params.token.toHex());
    })

    test("Token transferred MISSION", () => {
        createApp();
        createERC20Token();
        const event = transferERC20TokenMission();

        // Users data
        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER_ID, "id", TEST_USER_ID); // App user
        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER2_ID, "id", TEST_USER2_ID); // Token user
        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER3_ID, "id", TEST_USER3_ID); // Token transfer user

        const missionId = MissionId(event.transaction.hash, event.params.id);
        const missionFungibleTokenId = event.transaction.hash.toHex() + "-" + event.params.id.toHex() + "-" + event.params.token.toHex();


        assert.fieldEquals(TEST_MISSION_ENTITY_TYPE, missionId, "id", missionId);
        // TODO: Token transfer does not change xp_rewarded
        assert.fieldEquals(TEST_MISSION_ENTITY_TYPE, missionId, "xp_rewarded", "0");
        assert.fieldEquals(TEST_MISSION_ENTITY_TYPE, missionId, "user", event.params.to.toHex());
        assert.fieldEquals(TEST_MISSION_ENTITY_TYPE, missionId, "app", TEST_APP_ID);
        assert.fieldEquals(TEST_MISSION_ENTITY_TYPE, missionId, "metadata", missionId);

        assert.fieldEquals(TEST_MISSIONMETADATA_ENTITY_TYPE, missionId, "id", missionId);
        assert.fieldEquals(TEST_MISSIONMETADATA_ENTITY_TYPE, missionId, "name", TEST_TOKEN_MINTED_MISSION_ID);
        assert.fieldEquals(TEST_MISSIONMETADATA_ENTITY_TYPE, missionId, "URI", TEST_TOKEN_MINTED_URI);

        assert.fieldEquals(TEST_MISSIONFUNGIBLETOKEN_ENTITY_TYPE, missionFungibleTokenId, "id", missionFungibleTokenId);
        assert.fieldEquals(TEST_MISSIONFUNGIBLETOKEN_ENTITY_TYPE, missionFungibleTokenId, "amount_rewarded", event.params.amount.toString());
        assert.fieldEquals(TEST_MISSIONFUNGIBLETOKEN_ENTITY_TYPE, missionFungibleTokenId, "mission", missionId);
        assert.fieldEquals(TEST_MISSIONFUNGIBLETOKEN_ENTITY_TYPE, missionFungibleTokenId, "token", event.params.token.toHex());
    })

    // older reward contract had a different event signature
    test("Badge token minted legacy", () => {
        createApp();

        const totalSupply = BigInt.fromString(TEST_TOKEN_TOTAL_SUPPLY);
        createMockedFunction(Address.fromString(TEST_TOKEN_ID), "totalSupply", "totalSupply():(uint256)")
            .withArgs([])
            .returns([ethereum.Value.fromUnsignedBigInt(totalSupply)]);

        const event = badgeMintedLegacy();

        // Users data
        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER_ID, "id", TEST_USER_ID); // App user
        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER3_ID, "id", TEST_USER3_ID); // Token minted user

        const missionId = MissionId(event.transaction.hash, event.params.id);

        assert.fieldEquals(TEST_MISSION_ENTITY_TYPE, missionId, "id", missionId);
        assert.fieldEquals(TEST_MISSION_ENTITY_TYPE, missionId, "user", event.params.to.toHex());
        assert.fieldEquals(TEST_MISSION_ENTITY_TYPE, missionId, "app", TEST_APP_ID);
        assert.fieldEquals(TEST_MISSION_ENTITY_TYPE, missionId, "metadata", missionId);

        assert.fieldEquals(TEST_MISSIONMETADATA_ENTITY_TYPE, missionId, "id", missionId);
        assert.fieldEquals(TEST_MISSIONMETADATA_ENTITY_TYPE, missionId, "name", TEST_TOKEN_MINTED_MISSION_ID);
        assert.fieldEquals(TEST_MISSIONMETADATA_ENTITY_TYPE, missionId, "URI", TEST_TOKEN_MINTED_URI);

        const quantity = event.params.quantity;
        for (let i = 0; i < quantity.toI32(); i++) {
            let tokenId = totalSupply.minus(quantity).plus(BigInt.fromI32(i));
            const id = BadgeId(event.params.token, tokenId.toHex());

            assert.fieldEquals(TEST_BADGETOKEN_ENTITY_TYPE, id, "id", id);
            assert.fieldEquals(TEST_BADGETOKEN_ENTITY_TYPE, id, "tokenId", tokenId.toString());
            assert.fieldEquals(TEST_BADGETOKEN_ENTITY_TYPE, id, "badge", event.params.token.toHex());
            assert.fieldEquals(TEST_BADGETOKEN_ENTITY_TYPE, id, "metadataURI", event.params.uri);
            assert.fieldEquals(TEST_BADGETOKEN_ENTITY_TYPE, id, "owner", event.params.to.toHex());
        }
    })

    test("Badge token minted", () => {
        createApp();
        createBadge();
        updatedBaseURI();

        const totalSupply = BigInt.fromString(TEST_TOKEN_TOTAL_SUPPLY);
        createMockedFunction(Address.fromString(TEST_TOKEN_ID), "totalSupply", "totalSupply():(uint256)")
            .withArgs([])
            .returns([ethereum.Value.fromUnsignedBigInt(totalSupply)]);

        const event = badgeMinted();

        // Users data
        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER_ID, "id", TEST_USER_ID); // App user
        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER3_ID, "id", TEST_USER3_ID); // Token minted user

        const missionId = MissionId(event.transaction.hash, event.params.activityId);

        assert.fieldEquals(TEST_MISSION_ENTITY_TYPE, missionId, "id", missionId);
        assert.fieldEquals(TEST_MISSION_ENTITY_TYPE, missionId, "user", event.params.to.toHex());
        assert.fieldEquals(TEST_MISSION_ENTITY_TYPE, missionId, "app", TEST_APP_ID);
        assert.fieldEquals(TEST_MISSION_ENTITY_TYPE, missionId, "metadata", missionId);

        assert.fieldEquals(TEST_MISSIONMETADATA_ENTITY_TYPE, missionId, "id", missionId);
        assert.fieldEquals(TEST_MISSIONMETADATA_ENTITY_TYPE, missionId, "name", TEST_TOKEN_MINTED_MISSION_ID);
        assert.fieldEquals(TEST_MISSIONMETADATA_ENTITY_TYPE, missionId, "URI", TEST_TOKEN_MINTED_URI);

        const quantity = event.params.quantity;
        for (let i = 0; i < quantity.toI32(); i++) {
            let tokenId = totalSupply.minus(quantity).plus(BigInt.fromI32(i));
            const id = BadgeId(event.params.token, tokenId.toHex());

            assert.fieldEquals(TEST_BADGETOKEN_ENTITY_TYPE, id, "id", id);
            assert.fieldEquals(TEST_BADGETOKEN_ENTITY_TYPE, id, "tokenId", tokenId.toString());
            assert.fieldEquals(TEST_BADGETOKEN_ENTITY_TYPE, id, "badge", event.params.token.toHex());
            assert.fieldEquals(TEST_BADGETOKEN_ENTITY_TYPE, id, "owner", event.params.to.toHex());

            const badgeToken = loadBadgeToken(event.params.token, tokenId)
            if (badgeToken) {
                assert.assertNull(badgeToken.metadataURI, "metadataURI should be null as it is stored on badge entity")
            } else {
                assert.assertNotNull(badgeToken)
            }
        }
    })

    test("ERC721 token minted", () => {
        createApp();

        const totalSupply = BigInt.fromString(TEST_TOKEN_TOTAL_SUPPLY);
        createMockedFunction(Address.fromString(TEST_TOKEN_ID), "totalSupply", "totalSupply():(uint256)")
            .withArgs([])
            .returns([ethereum.Value.fromUnsignedBigInt(totalSupply)]);

        const event = erc721Minted();

        // Users data
        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER_ID, "id", TEST_USER_ID); // App user
        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER3_ID, "id", TEST_USER3_ID); // Token minted user

        const missionId = MissionId(event.transaction.hash, event.params.id);

        assert.fieldEquals(TEST_MISSION_ENTITY_TYPE, missionId, "id", missionId);
        assert.fieldEquals(TEST_MISSION_ENTITY_TYPE, missionId, "user", event.params.to.toHex());
        assert.fieldEquals(TEST_MISSION_ENTITY_TYPE, missionId, "app", TEST_APP_ID);
        assert.fieldEquals(TEST_MISSION_ENTITY_TYPE, missionId, "metadata", missionId);

        assert.fieldEquals(TEST_MISSIONMETADATA_ENTITY_TYPE, missionId, "id", missionId);
        assert.fieldEquals(TEST_MISSIONMETADATA_ENTITY_TYPE, missionId, "name", TEST_TOKEN_MINTED_MISSION_ID);
        assert.fieldEquals(TEST_MISSIONMETADATA_ENTITY_TYPE, missionId, "URI", TEST_TOKEN_MINTED_URI);

        const quantity = event.params.quantity;
        for (let i = 0; i < quantity.toI32(); i++) {
            let tokenId = totalSupply.minus(quantity).plus(BigInt.fromI32(i));
            const id = BadgeId(event.params.token, tokenId.toHex());

            assert.fieldEquals(TEST_BADGETOKEN_ENTITY_TYPE, id, "id", id);
            assert.fieldEquals(TEST_BADGETOKEN_ENTITY_TYPE, id, "tokenId", tokenId.toString());
            assert.fieldEquals(TEST_BADGETOKEN_ENTITY_TYPE, id, "badge", event.params.token.toHex());
            assert.fieldEquals(TEST_BADGETOKEN_ENTITY_TYPE, id, "metadataURI", event.params.uri);
            assert.fieldEquals(TEST_BADGETOKEN_ENTITY_TYPE, id, "owner", event.params.to.toHex());
        }
    })

    test("Badge transfer", () => {
        createApp();

        const badgeToken = getTestBadgeTokenEntity(
            Address.fromString(TEST_TOKEN_ID),
            BigInt.fromString(TEST_BADGETOKEN_ID),
            TEST_USER3_ID,
            TEST_TOKEN_MINTED_URI
        );
        badgeToken.save();
        const event = transferBadge();

        // Users data
        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER_ID, "id", TEST_USER_ID); // App user
        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER3_ID, "id", TEST_USER3_ID); // Token minted user

        const missionId = MissionId(event.transaction.hash, event.params.id);

        assert.fieldEquals(TEST_MISSION_ENTITY_TYPE, missionId, "id", missionId);
        assert.fieldEquals(TEST_MISSION_ENTITY_TYPE, missionId, "user", event.params.to.toHex());
        assert.fieldEquals(TEST_MISSION_ENTITY_TYPE, missionId, "app", TEST_APP_ID);
        assert.fieldEquals(TEST_MISSION_ENTITY_TYPE, missionId, "metadata", missionId);

        assert.fieldEquals(TEST_MISSIONMETADATA_ENTITY_TYPE, missionId, "id", missionId);
        assert.fieldEquals(TEST_MISSIONMETADATA_ENTITY_TYPE, missionId, "name", TEST_TOKEN_MINTED_MISSION_ID);
        assert.fieldEquals(TEST_MISSIONMETADATA_ENTITY_TYPE, missionId, "URI", TEST_TOKEN_MINTED_URI);

        const mission = Mission.load(missionId);
        assert.assertTrue(mission!.badges != null, "Mission has badges");
        assert.assertTrue(mission!.badges.length == 1, "Mission badges has length = 1");
        assert.assertTrue(mission!.badges.at(0) == badgeToken.id, "Badge is ok");
    })

});