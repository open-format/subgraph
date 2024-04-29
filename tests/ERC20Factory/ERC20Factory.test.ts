import { assert, createMockedFunction, clearStore, test, newMockEvent, newMockCall, countEntities, mockIpfsFile, beforeAll, describe, afterEach, afterAll, mockInBlockStore, clearInBlockStore, logStore } from "matchstick-as/assembly/index"
import { newCreatedAppEvent, newCreatedERC20FactoryEvent } from "../utils";
import { APPSTATS_ENTITY_TYPE, APP_ENTITY_TYPE, APP_ID, APP_NAME, STATS_ENTITY_TYPE, TOKEN_ID, TOKEN_NAME, TOKEN_SYMBOL, USER_ENTITY_TYPE, USER_ID } from "../fixtures";
import { ByteArray, Bytes } from "@graphprotocol/graph-ts";
// import { handleCreated } from "../../src/facet/ERC20Factory";

describe("ERC20Factory tests", () => {
    afterEach(() => {
      clearStore()
    })
    
    test("Create token", () => {
        const event = newCreatedERC20FactoryEvent(
            TOKEN_ID,
            USER_ID,
            TOKEN_NAME,
            TOKEN_SYMBOL,
            18,
            "1000",
            Bytes.fromByteArray(ByteArray.fromUTF8("Base"))
        );

        // handleCreated(event);
        
    })

});