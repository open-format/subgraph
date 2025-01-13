import { assert, createMockedFunction, clearStore, test, describe, afterEach, dataSourceMock, beforeEach } from "matchstick-as/assembly/index";
import { getTestFungibleToken, transferERC20, updateERC20ContractURI } from "./utils";
import { TEST_FUNGIBLETOKENBALANCE_ENTITY_TYPE, TEST_FUNGIBLETOKENMETADATA_ENTITY_TYPE, TEST_FUNGIBLETOKEN_ENTITY_TYPE, TEST_TOKEN_ID, TEST_TOKEN_TOTAL_SUPPLY, TEST_USER2_ID, TEST_USER3_ID, TEST_USER_ENTITY_TYPE } from "./fixtures";
import { Address, BigInt, DataSourceContext, Value, ethereum } from "@graphprotocol/graph-ts";
import { TokenBalanceId } from "../src/helpers";

describe("ERC20Base tests", () => {
    afterEach(() => {
      clearStore();
      dataSourceMock.resetValues();
    })
    
    beforeEach(() => {
        let context = new DataSourceContext()
        context.set('ERC20BaseContract', Value.fromString(TEST_TOKEN_ID))
        dataSourceMock.setReturnValues(TEST_TOKEN_ID, 'ERC20BaseContract', context)
    })
    
    test("Token transfer", () => {
        const sender = Address.fromString(TEST_USER2_ID);
        const receiver = Address.fromString(TEST_USER3_ID);
        const balanceSender = BigInt.fromString("12");
        const balanceReceiver = BigInt.fromString("34");
        const totalSupply = BigInt.fromString(TEST_TOKEN_TOTAL_SUPPLY);

        createMockedFunction(Address.fromString(TEST_TOKEN_ID), "balanceOf", "balanceOf(address):(uint256)")
            .withArgs([ ethereum.Value.fromAddress( sender ) ])
            .returns([ ethereum.Value.fromUnsignedBigInt(balanceSender) ]);
            
        createMockedFunction(Address.fromString(TEST_TOKEN_ID), "balanceOf", "balanceOf(address):(uint256)")
            .withArgs([ ethereum.Value.fromAddress( receiver ) ])
            .returns([ ethereum.Value.fromUnsignedBigInt(balanceReceiver) ]);

        createMockedFunction(Address.fromString(TEST_TOKEN_ID), "totalSupply", "totalSupply():(uint256)")
            .withArgs([])
            .returns([ ethereum.Value.fromUnsignedBigInt(totalSupply) ]);

        const token = getTestFungibleToken();
        token.save();

        transferERC20(sender.toHex(), receiver.toHex(), "5");

        // Users data
        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER2_ID, "id", TEST_USER2_ID); // Sender
        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER3_ID, "id", TEST_USER3_ID); // Receiver
        assert.entityCount(TEST_USER_ENTITY_TYPE, 2);

        // Fungible token data
        assert.fieldEquals(TEST_FUNGIBLETOKEN_ENTITY_TYPE, TEST_TOKEN_ID, "id", TEST_TOKEN_ID);
        assert.fieldEquals(TEST_FUNGIBLETOKEN_ENTITY_TYPE, TEST_TOKEN_ID, "totalSupply", totalSupply.toString());

        const senderTokenBalanceId = TokenBalanceId(Address.fromString(TEST_TOKEN_ID), sender);
        const receiverTokenBalanceId = TokenBalanceId(Address.fromString(TEST_TOKEN_ID), receiver);

        // Sender balance
        assert.fieldEquals(TEST_FUNGIBLETOKENBALANCE_ENTITY_TYPE, senderTokenBalanceId, "id", senderTokenBalanceId);
        assert.fieldEquals(TEST_FUNGIBLETOKENBALANCE_ENTITY_TYPE, senderTokenBalanceId, "user", sender.toHex());
        assert.fieldEquals(TEST_FUNGIBLETOKENBALANCE_ENTITY_TYPE, senderTokenBalanceId, "token", TEST_TOKEN_ID);
        assert.fieldEquals(TEST_FUNGIBLETOKENBALANCE_ENTITY_TYPE, senderTokenBalanceId, "balance", balanceSender.toString());

        // Receiver balance
        assert.fieldEquals(TEST_FUNGIBLETOKENBALANCE_ENTITY_TYPE, receiverTokenBalanceId, "id", receiverTokenBalanceId);
        assert.fieldEquals(TEST_FUNGIBLETOKENBALANCE_ENTITY_TYPE, receiverTokenBalanceId, "user", receiver.toHex());
        assert.fieldEquals(TEST_FUNGIBLETOKENBALANCE_ENTITY_TYPE, receiverTokenBalanceId, "token", TEST_TOKEN_ID);
        assert.fieldEquals(TEST_FUNGIBLETOKENBALANCE_ENTITY_TYPE, receiverTokenBalanceId, "balance", balanceReceiver.toString());
    })

    test("Token transfer minted", () => {
        const sender = Address.fromString("0x0000000000000000000000000000000000000000");
        const receiver = Address.fromString(TEST_USER3_ID);
        const balanceSender = BigInt.fromString("0");
        const balanceReceiver = BigInt.fromString("34");
        const totalSupply = BigInt.fromString(TEST_TOKEN_TOTAL_SUPPLY);

        createMockedFunction(Address.fromString(TEST_TOKEN_ID), "balanceOf", "balanceOf(address):(uint256)")
            .withArgs([ ethereum.Value.fromAddress( sender ) ])
            .returns([ ethereum.Value.fromUnsignedBigInt(balanceSender) ]);
            
        createMockedFunction(Address.fromString(TEST_TOKEN_ID), "balanceOf", "balanceOf(address):(uint256)")
            .withArgs([ ethereum.Value.fromAddress( receiver ) ])
            .returns([ ethereum.Value.fromUnsignedBigInt(balanceReceiver) ]);

        createMockedFunction(Address.fromString(TEST_TOKEN_ID), "totalSupply", "totalSupply():(uint256)")
            .withArgs([])
            .returns([ ethereum.Value.fromUnsignedBigInt(totalSupply) ]);

        const token = getTestFungibleToken();
        token.save();

        transferERC20(sender.toHex(), receiver.toHex(), "5");

        // Users data
        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER3_ID, "id", TEST_USER3_ID); // Receiver
        assert.notInStore(TEST_USER_ENTITY_TYPE, sender.toHex());
        assert.entityCount(TEST_USER_ENTITY_TYPE, 1);

        // Fungible token data
        assert.fieldEquals(TEST_FUNGIBLETOKEN_ENTITY_TYPE, TEST_TOKEN_ID, "id", TEST_TOKEN_ID);
        assert.fieldEquals(TEST_FUNGIBLETOKEN_ENTITY_TYPE, TEST_TOKEN_ID, "totalSupply", totalSupply.toString());

        const senderTokenBalanceId = TokenBalanceId(Address.fromString(TEST_TOKEN_ID), sender);
        const receiverTokenBalanceId = TokenBalanceId(Address.fromString(TEST_TOKEN_ID), receiver);

        // Sender
        assert.notInStore(TEST_FUNGIBLETOKENBALANCE_ENTITY_TYPE, senderTokenBalanceId);

        // Receiver balance
        assert.fieldEquals(TEST_FUNGIBLETOKENBALANCE_ENTITY_TYPE, receiverTokenBalanceId, "id", receiverTokenBalanceId);
        assert.fieldEquals(TEST_FUNGIBLETOKENBALANCE_ENTITY_TYPE, receiverTokenBalanceId, "user", receiver.toHex());
        assert.fieldEquals(TEST_FUNGIBLETOKENBALANCE_ENTITY_TYPE, receiverTokenBalanceId, "token", TEST_TOKEN_ID);
        assert.fieldEquals(TEST_FUNGIBLETOKENBALANCE_ENTITY_TYPE, receiverTokenBalanceId, "balance", balanceReceiver.toString());
    })

    test("Token transfer burned", () => {
        const sender = Address.fromString(TEST_USER2_ID);
        const receiver = Address.fromString("0x0000000000000000000000000000000000000000");
        const balanceSender = BigInt.fromString("12");
        const balanceReceiver = BigInt.fromString("0");
        const totalSupply = BigInt.fromString(TEST_TOKEN_TOTAL_SUPPLY);

        createMockedFunction(Address.fromString(TEST_TOKEN_ID), "balanceOf", "balanceOf(address):(uint256)")
            .withArgs([ ethereum.Value.fromAddress( sender ) ])
            .returns([ ethereum.Value.fromUnsignedBigInt(balanceSender) ]);
            
        createMockedFunction(Address.fromString(TEST_TOKEN_ID), "balanceOf", "balanceOf(address):(uint256)")
            .withArgs([ ethereum.Value.fromAddress( receiver ) ])
            .returns([ ethereum.Value.fromUnsignedBigInt(balanceReceiver) ]);

        createMockedFunction(Address.fromString(TEST_TOKEN_ID), "totalSupply", "totalSupply():(uint256)")
            .withArgs([])
            .returns([ ethereum.Value.fromUnsignedBigInt(totalSupply) ]);

        const token = getTestFungibleToken();
        token.save();

        const event = transferERC20(sender.toHex(), receiver.toHex(), "5");

        // Users data
        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER2_ID, "id", TEST_USER2_ID); // Sender
        assert.notInStore(TEST_USER_ENTITY_TYPE, receiver.toHex()); // Receiver
        assert.entityCount(TEST_USER_ENTITY_TYPE, 1);

        // Fungible token data
        assert.fieldEquals(TEST_FUNGIBLETOKEN_ENTITY_TYPE, TEST_TOKEN_ID, "id", TEST_TOKEN_ID);
        assert.fieldEquals(TEST_FUNGIBLETOKEN_ENTITY_TYPE, TEST_TOKEN_ID, "totalSupply", totalSupply.toString());
        assert.fieldEquals(TEST_FUNGIBLETOKEN_ENTITY_TYPE, TEST_TOKEN_ID, "burntSupply", event.params.value.toString());

        const senderTokenBalanceId = TokenBalanceId(Address.fromString(TEST_TOKEN_ID), sender);
        const receiverTokenBalanceId = TokenBalanceId(Address.fromString(TEST_TOKEN_ID), receiver);

        // Sender balance
        assert.fieldEquals(TEST_FUNGIBLETOKENBALANCE_ENTITY_TYPE, senderTokenBalanceId, "id", senderTokenBalanceId);
        assert.fieldEquals(TEST_FUNGIBLETOKENBALANCE_ENTITY_TYPE, senderTokenBalanceId, "user", sender.toHex());
        assert.fieldEquals(TEST_FUNGIBLETOKENBALANCE_ENTITY_TYPE, senderTokenBalanceId, "token", TEST_TOKEN_ID);
        assert.fieldEquals(TEST_FUNGIBLETOKENBALANCE_ENTITY_TYPE, senderTokenBalanceId, "balance", balanceSender.toString());

        // Receiver balance
        assert.notInStore(TEST_FUNGIBLETOKENBALANCE_ENTITY_TYPE, receiverTokenBalanceId);
    })

    test("Contract URI updated", () => {
        const token = getTestFungibleToken();
        token.save();

        const event = updateERC20ContractURI();

        // Fungible token data
        assert.fieldEquals(TEST_FUNGIBLETOKEN_ENTITY_TYPE, TEST_TOKEN_ID, "id", TEST_TOKEN_ID);
        assert.fieldEquals(TEST_FUNGIBLETOKEN_ENTITY_TYPE, TEST_TOKEN_ID, "metadata", TEST_TOKEN_ID);

        // Metadata
        assert.fieldEquals(TEST_FUNGIBLETOKENMETADATA_ENTITY_TYPE, TEST_TOKEN_ID, "id", TEST_TOKEN_ID);
        assert.fieldEquals(TEST_FUNGIBLETOKENMETADATA_ENTITY_TYPE, TEST_TOKEN_ID, "URI", event.params.newURI);
    })

});