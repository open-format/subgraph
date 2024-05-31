import { assert, createMockedFunction, clearStore, test, newMockEvent, newMockCall, countEntities, mockIpfsFile, beforeAll, describe, afterEach, afterAll, mockInBlockStore, clearInBlockStore, logStore, dataSourceMock } from "matchstick-as/assembly/index"
import { Param, ParamType, createApp, createERC20Token, newEvent } from "../utils";
import { TEST_APPSTATS_ENTITY_TYPE, TEST_APP_ENTITY_TYPE, TEST_APP_ID, TEST_APP_NAME, TEST_FUNGIBLETOKEN_ENTITY_TYPE, TEST_STATS_ENTITY_TYPE, TEST_TOKEN_ID, TEST_TOKEN_IMPLEMENTATIONID_BASE, TEST_TOKEN_NAME, TEST_TOKEN_SYMBOL, TEST_USER2_ID, TEST_USER_ENTITY_TYPE, TEST_USER_ID } from "../fixtures";

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

        // Users data
        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER_ID, "id", TEST_USER_ID); // App user
        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER2_ID, "id", TEST_USER2_ID); // Token user
        // App new data
        assert.fieldEquals(TEST_APP_ENTITY_TYPE, TEST_APP_ID, "xpToken", TEST_TOKEN_ID); // xpToken
        // Fungible token data
        assert.fieldEquals(TEST_FUNGIBLETOKEN_ENTITY_TYPE, TEST_TOKEN_ID, "id", TEST_TOKEN_ID);
        assert.fieldEquals(TEST_FUNGIBLETOKEN_ENTITY_TYPE, TEST_TOKEN_ID, "name", TEST_TOKEN_NAME);
        assert.fieldEquals(TEST_FUNGIBLETOKEN_ENTITY_TYPE, TEST_TOKEN_ID, "symbol", TEST_TOKEN_SYMBOL);
        assert.fieldEquals(TEST_FUNGIBLETOKEN_ENTITY_TYPE, TEST_TOKEN_ID, "totalSupply", "0");
        assert.fieldEquals(TEST_FUNGIBLETOKEN_ENTITY_TYPE, TEST_TOKEN_ID, "burntSupply", "0");
        assert.fieldEquals(TEST_FUNGIBLETOKEN_ENTITY_TYPE, TEST_TOKEN_ID, "app", TEST_APP_ID);
        assert.fieldEquals(TEST_FUNGIBLETOKEN_ENTITY_TYPE, TEST_TOKEN_ID, "owner", TEST_USER2_ID);
    })

});