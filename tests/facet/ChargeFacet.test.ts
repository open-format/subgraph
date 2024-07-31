import { assert, clearStore, test, describe, afterEach, dataSourceMock } from "matchstick-as/assembly/index";
import { chargeUser, createApp, setRequiredTokenBalance } from "../utils";
import { TEST_APP_ID, TEST_CHARGE_ENTITY_TYPE, TEST_CHARGE_ID, TEST_CHARGE_TYPE, TEST_ONE_ETHER, TEST_REQUIREDTOKENBALANCE_ENTITY_TYPE, TEST_TOKEN_ID, TEST_USER_ID } from "../fixtures";
import { ChargeId, RequiredTokenBalanceId } from "../../src/helpers";
import { App } from "../../generated/schema";
import { Address } from "@graphprotocol/graph-ts";

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

  test("Update required token balance", () => {
    createApp();
    setRequiredTokenBalance();

    const id = RequiredTokenBalanceId(
      Address.fromString(TEST_APP_ID),
      Address.fromString(TEST_TOKEN_ID)
    );

    // requiredTokenBalance
    assert.fieldEquals(TEST_REQUIREDTOKENBALANCE_ENTITY_TYPE, id, "id", id);
    assert.fieldEquals(TEST_REQUIREDTOKENBALANCE_ENTITY_TYPE, id, "app", TEST_APP_ID);
    assert.fieldEquals(TEST_REQUIREDTOKENBALANCE_ENTITY_TYPE, id, "token", TEST_TOKEN_ID);
    assert.fieldEquals(TEST_REQUIREDTOKENBALANCE_ENTITY_TYPE, id, "balance", TEST_ONE_ETHER);

    // app
    const app = App.load(TEST_APP_ID)
    assert.assertNotNull(app)
    const requiredTokenBalance = app!.requiredTokenBalance.load();
    assert.stringEquals(id, requiredTokenBalance[0].id)
  });

});