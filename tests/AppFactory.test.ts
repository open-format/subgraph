import { assert, clearStore, test, describe, afterEach } from "matchstick-as/assembly/index";
import { createApp } from "./utils";
import { TEST_APP_ENTITY_TYPE, TEST_APP_ID, TEST_APP_NAME, TEST_USER_ENTITY_TYPE, TEST_USER_ID } from "./fixtures";

describe("AppFactory tests", () => {
    afterEach(() => {
      clearStore()
    })
    
    test("Create app", () => {
        createApp();

        assert.fieldEquals(TEST_APP_ENTITY_TYPE, TEST_APP_ID, "name", TEST_APP_NAME);
        assert.fieldEquals(TEST_APP_ENTITY_TYPE, TEST_APP_ID, "owner", TEST_USER_ID);

        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER_ID, "id", TEST_USER_ID);


        assert.dataSourceCount('ERC721FactoryFacet', 1);
        assert.dataSourceCount('ERC20FactoryFacet', 1);
        assert.dataSourceCount('RewardsFacet', 1);
    })

});