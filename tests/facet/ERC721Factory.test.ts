import { assert, createMockedFunction, clearStore, test, newMockEvent, newMockCall, countEntities, mockIpfsFile, beforeAll, describe, afterEach, afterAll, mockInBlockStore, clearInBlockStore, logStore, dataSourceMock } from "matchstick-as/assembly/index"
import { Param, ParamType, createApp, createERC721LazyMintToken, createERC721Token, newEvent } from "../utils";
import { TEST_APPSTATS_ENTITY_TYPE, TEST_APP_ENTITY_TYPE, TEST_APP_ID, TEST_APP_NAME, TEST_BADGE_ENTITY_TYPE, TEST_FUNGIBLETOKEN_ENTITY_TYPE, TEST_NFT_ENTITY_TYPE, TEST_STATS_ENTITY_TYPE, TEST_TOKEN_ID, TEST_TOKEN_IMPLEMENTATIONID_BASE, TEST_TOKEN_IMPLEMENTATIONID_LAZYMINT, TEST_TOKEN_NAME, TEST_TOKEN_ROYALTYBPS, TEST_TOKEN_ROYALTYRECIPIENT, TEST_TOKEN_SYMBOL, TEST_USER2_ID, TEST_USER_ENTITY_TYPE, TEST_USER_ID } from "../fixtures";

describe("ERC721Factory tests", () => {
    afterEach(() => {
      clearStore();
      dataSourceMock.resetValues();
    })
    
    test("Create token Base", () => {
        createApp();
        createERC721Token();

        assert.dataSourceCount('ERC721Base', 1);
        // TODO: Check ERC721Base has context with key: "ERC721Contract" and value: event.params.id.toHex()

        // Users data
        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER_ID, "id", TEST_USER_ID); // App user
        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER2_ID, "id", TEST_USER2_ID); // Token user
        // App new data
        assert.fieldEquals(TEST_APP_ENTITY_TYPE, TEST_APP_ID, "badgeCount", "1"); // badgeCount
        // Fungible token data
        assert.fieldEquals(TEST_BADGE_ENTITY_TYPE, TEST_TOKEN_ID, "id", TEST_TOKEN_ID);
        assert.fieldEquals(TEST_BADGE_ENTITY_TYPE, TEST_TOKEN_ID, "name", TEST_TOKEN_NAME);
        assert.fieldEquals(TEST_BADGE_ENTITY_TYPE, TEST_TOKEN_ID, "symbol", TEST_TOKEN_SYMBOL);
        assert.fieldEquals(TEST_BADGE_ENTITY_TYPE, TEST_TOKEN_ID, "royaltyBps", TEST_TOKEN_ROYALTYBPS.toString());
        assert.fieldEquals(TEST_BADGE_ENTITY_TYPE, TEST_TOKEN_ID, "royaltyRecipient", TEST_TOKEN_ROYALTYRECIPIENT);
        assert.fieldEquals(TEST_BADGE_ENTITY_TYPE, TEST_TOKEN_ID, "app", TEST_APP_ID);
        assert.fieldEquals(TEST_BADGE_ENTITY_TYPE, TEST_TOKEN_ID, "totalAwarded", "0");
        assert.fieldEquals(TEST_BADGE_ENTITY_TYPE, TEST_TOKEN_ID, "totalAvailable", "0");
        // TODO: no owner for NFT?
    })

    test("Create token LazyMint", () => {
        createApp();
        createERC721LazyMintToken();

        assert.dataSourceCount('ERC721LazyMint', 1);
        // TODO: Check ERC721Base has context with key: "ERC721Contract" and value: event.params.id.toHex()

        // Users data
        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER_ID, "id", TEST_USER_ID); // App user
        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER2_ID, "id", TEST_USER2_ID); // Token user
        // App new data
        assert.fieldEquals(TEST_APP_ENTITY_TYPE, TEST_APP_ID, "badgeCount", "1"); // badgeCount
        // Fungible token data
        assert.fieldEquals(TEST_BADGE_ENTITY_TYPE, TEST_TOKEN_ID, "id", TEST_TOKEN_ID);
        assert.fieldEquals(TEST_BADGE_ENTITY_TYPE, TEST_TOKEN_ID, "name", TEST_TOKEN_NAME);
        assert.fieldEquals(TEST_BADGE_ENTITY_TYPE, TEST_TOKEN_ID, "symbol", TEST_TOKEN_SYMBOL);
        assert.fieldEquals(TEST_BADGE_ENTITY_TYPE, TEST_TOKEN_ID, "royaltyBps", TEST_TOKEN_ROYALTYBPS.toString());
        assert.fieldEquals(TEST_BADGE_ENTITY_TYPE, TEST_TOKEN_ID, "royaltyRecipient", TEST_TOKEN_ROYALTYRECIPIENT);
        assert.fieldEquals(TEST_BADGE_ENTITY_TYPE, TEST_TOKEN_ID, "app", TEST_APP_ID);
        assert.fieldEquals(TEST_BADGE_ENTITY_TYPE, TEST_TOKEN_ID, "totalAwarded", "0");
        assert.fieldEquals(TEST_BADGE_ENTITY_TYPE, TEST_TOKEN_ID, "totalAvailable", "0");
        // TODO: no owner for NFT?
    })
});