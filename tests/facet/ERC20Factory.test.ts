import { assert, clearStore, test, describe, afterEach, dataSourceMock } from "matchstick-as/assembly/index";
import { createApp, createERC20Token } from "../utils";
import { TEST_APP_ENTITY_TYPE, TEST_APP_ID, TEST_APPFUNGIBLETOKEN_ENTITY_TYPE, TEST_FUNGIBLETOKEN_ENTITY_TYPE, TEST_TOKEN_DECIMALS, TEST_TOKEN_ID, TEST_TOKEN_NAME, TEST_TOKEN_SYMBOL, TEST_USER2_ID, TEST_USER_ENTITY_TYPE, TEST_USER_ID } from "../fixtures";

describe("ERC20Factory tests", () => {
    afterEach(() => {
      clearStore();
      dataSourceMock.resetValues();
    })

    test("Create token", () => {
        createApp();
        createERC20Token();

        assert.dataSourceCount('ERC20Base', 1);
        // TODO: Check ERC20Base has context with key: "ERC20Contract" and value: event.params.id.toHex()
        const appFungibleTokenId = TEST_APP_ID + "-" + TEST_TOKEN_ID;

        // Users data
        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER_ID, "id", TEST_USER_ID); // App user
        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER2_ID, "id", TEST_USER2_ID); // Token user
        // App new data
        assert.fieldEquals(TEST_APP_ENTITY_TYPE, TEST_APP_ID, "xpToken", TEST_TOKEN_ID); // xpToken
        // Fungible token data
        assert.fieldEquals(TEST_FUNGIBLETOKEN_ENTITY_TYPE, TEST_TOKEN_ID, "id", TEST_TOKEN_ID);
        assert.fieldEquals(TEST_FUNGIBLETOKEN_ENTITY_TYPE, TEST_TOKEN_ID, "name", TEST_TOKEN_NAME);
        assert.fieldEquals(TEST_FUNGIBLETOKEN_ENTITY_TYPE, TEST_TOKEN_ID, "symbol", TEST_TOKEN_SYMBOL);
        assert.fieldEquals(TEST_FUNGIBLETOKEN_ENTITY_TYPE, TEST_TOKEN_ID, "decimals", TEST_TOKEN_DECIMALS);
        assert.fieldEquals(TEST_FUNGIBLETOKEN_ENTITY_TYPE, TEST_TOKEN_ID, "totalSupply", "0");
        assert.fieldEquals(TEST_FUNGIBLETOKEN_ENTITY_TYPE, TEST_TOKEN_ID, "burntSupply", "0");
        assert.fieldEquals(TEST_FUNGIBLETOKEN_ENTITY_TYPE, TEST_TOKEN_ID, "app", TEST_APP_ID);
        assert.fieldEquals(TEST_FUNGIBLETOKEN_ENTITY_TYPE, TEST_TOKEN_ID, "owner", TEST_USER2_ID);
        // App Fungible token data
        assert.fieldEquals(TEST_APPFUNGIBLETOKEN_ENTITY_TYPE, appFungibleTokenId, "id", appFungibleTokenId);
        assert.fieldEquals(TEST_APPFUNGIBLETOKEN_ENTITY_TYPE, appFungibleTokenId, "app", TEST_APP_ID);
        assert.fieldEquals(TEST_APPFUNGIBLETOKEN_ENTITY_TYPE, appFungibleTokenId, "token", TEST_TOKEN_ID);
    })

});