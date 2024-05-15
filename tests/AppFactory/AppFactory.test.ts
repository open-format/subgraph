import { assert, createMockedFunction, clearStore, test, newMockEvent, newMockCall, countEntities, mockIpfsFile, beforeAll, describe, afterEach, afterAll, mockInBlockStore, clearInBlockStore, logStore } from "matchstick-as/assembly/index"
import { newCreatedAppEvent, newCreatedERC20FactoryEvent } from "../utils";
import { APPSTATS_ENTITY_TYPE, APP_ENTITY_TYPE, APP_ID, APP_NAME, STATS_ENTITY_TYPE, TOKEN_ID, TOKEN_NAME, TOKEN_SYMBOL, USER_ENTITY_TYPE, USER_ID } from "../fixtures";
import { handleCreated as apphandleCreated } from "../../src/AppFactory";

describe("AppFactory tests", () => {
    afterEach(() => {
      clearStore()
    })
    
    test("Create app", () => {
        const event = newCreatedAppEvent(APP_ID, USER_ID, APP_NAME);
        apphandleCreated(event);

        assert.fieldEquals(APP_ENTITY_TYPE, APP_ID, "name", APP_NAME);
        assert.fieldEquals(APP_ENTITY_TYPE, APP_ID, "owner", USER_ID);

        assert.fieldEquals(APPSTATS_ENTITY_TYPE, APP_ID, "id", APP_ID);

        assert.fieldEquals(USER_ENTITY_TYPE, USER_ID, "id", USER_ID);

        assert.entityCount(STATS_ENTITY_TYPE, 1);
    })

});