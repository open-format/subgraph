import { assert, clearStore, test, describe, afterEach, dataSourceMock } from "matchstick-as/assembly/index";
import { chargeUser, createApp, createERC20Token } from "../utils";
import { TEST_APP_ID, TEST_CHARGE_ENTITY_TYPE, TEST_CHARGE_ID, TEST_CHARGE_TYPE, TEST_ONE_ETHER, TEST_USER_ID } from "../fixtures";
import { ChargeId } from "../../src/helpers";

describe("ChargeFacet tests", () => {
  afterEach(() => {
    clearStore();
    dataSourceMock.resetValues();
  })

  test("Charge user", () => {
    createApp();

    const event = chargeUser();
    const chargeId = ChargeId(event.transaction.hash, event.logIndex);

    // Charge data
    assert.fieldEquals(TEST_CHARGE_ENTITY_TYPE, chargeId, "id", chargeId);
    assert.fieldEquals(TEST_CHARGE_ENTITY_TYPE, chargeId, "app", TEST_APP_ID);
    assert.fieldEquals(TEST_CHARGE_ENTITY_TYPE, chargeId, "user", TEST_USER_ID);
    assert.fieldEquals(TEST_CHARGE_ENTITY_TYPE, chargeId, "amount", TEST_ONE_ETHER);
    assert.fieldEquals(TEST_CHARGE_ENTITY_TYPE, chargeId, "chargeId", TEST_CHARGE_ID);
    assert.fieldEquals(TEST_CHARGE_ENTITY_TYPE, chargeId, "chargeType", TEST_CHARGE_TYPE);
  })

});