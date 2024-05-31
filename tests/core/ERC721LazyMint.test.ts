import { assert, createMockedFunction, clearStore, test, newMockEvent, newMockCall, countEntities, mockIpfsFile, beforeAll, describe, afterEach, afterAll, mockInBlockStore, clearInBlockStore, logStore, dataSourceMock, beforeEach } from "matchstick-as/assembly/index"
import { Param, ParamType, batchMintedERC721, batchMintedERC721LazyMint, createApp, createERC20Token, createERC721LazyMintToken, createERC721Token, getTestBadgeTokenEntity, getTestFungibleToken, mintLazyMint, mintedERC721, mintedERC721LazyMint, newEvent, transferERC20, transferERC721, transferERC721LazyMint, updateERC20ContractURI } from "../utils";
import { TEST_APPSTATS_ENTITY_TYPE, TEST_APP_ENTITY_TYPE, TEST_APP_ID, TEST_APP_NAME, TEST_BADGETOKEN_ENTITY_TYPE, TEST_BADGETOKEN_ID, TEST_BADGE_ENTITY_TYPE, TEST_BADGE_ID, TEST_FUNGIBLETOKENBALANCE_ENTITY_TYPE, TEST_FUNGIBLETOKENMETADATA_ENTITY_TYPE, TEST_FUNGIBLETOKEN_ENTITY_TYPE, TEST_STATS_ENTITY_TYPE, TEST_TOKEN_ID, TEST_TOKEN_IMPLEMENTATIONID_BASE, TEST_TOKEN_MINTED_URI, TEST_TOKEN_NAME, TEST_TOKEN_SYMBOL, TEST_TOKEN_TOTAL_SUPPLY, TEST_USER2_ID, TEST_USER3_ID, TEST_USER_ENTITY_TYPE, TEST_USER_ID } from "../fixtures";
import { Address, BigInt, DataSourceContext, Value, ethereum } from "@graphprotocol/graph-ts";
import { BadgeId, One, TokenBalanceId } from "../../src/helpers";

describe("ERC721LazyMint tests", () => {
    afterEach(() => {
      clearStore();
      dataSourceMock.resetValues();
    })
    
    beforeEach(() => {
        createApp();
        createERC721LazyMintToken();

        let context = new DataSourceContext()
        context.set('ERC721ContractLazyMint', Value.fromString(TEST_TOKEN_ID))
        dataSourceMock.setReturnValues(TEST_TOKEN_ID, 'ERC721ContractLazyMint', context)

    })

    test("Token batch minted", () => {

        createMockedFunction(Address.fromString(TEST_TOKEN_ID), "totalSupply", "totalSupply():(uint256)")
            .withArgs([ ])
            .returns([ ethereum.Value.fromUnsignedBigInt(BigInt.fromString(TEST_TOKEN_TOTAL_SUPPLY)) ]);

        const event = batchMintedERC721LazyMint();

        // TODO: User is not saved
        // assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER3_ID, "id", TEST_USER3_ID);

        assert.entityCount(TEST_BADGETOKEN_ENTITY_TYPE, event.params.quantity.toI32());
        assert.entityCount(TEST_BADGE_ENTITY_TYPE, 1);
        
        for (let i = 0; i < event.params.quantity.toI32(); i++) {
            const tokenId = BigInt.fromString(TEST_TOKEN_TOTAL_SUPPLY).minus(event.params.quantity).plus(BigInt.fromI32(i));
            const badgeTokenId = BadgeId(Address.fromString(TEST_TOKEN_ID), tokenId.toHex());

            assert.fieldEquals(TEST_BADGETOKEN_ENTITY_TYPE, badgeTokenId, "id", badgeTokenId);
            assert.fieldEquals(TEST_BADGETOKEN_ENTITY_TYPE, badgeTokenId, "owner", event.params.to.toHex());
            assert.fieldEquals(TEST_BADGETOKEN_ENTITY_TYPE, badgeTokenId, "metadataURI", event.params.baseURI);
            assert.fieldEquals(TEST_BADGETOKEN_ENTITY_TYPE, badgeTokenId, "tokenId", tokenId.toString());
            assert.fieldEquals(TEST_BADGETOKEN_ENTITY_TYPE, badgeTokenId, "badge", event.address.toHex());
        }

        assert.fieldEquals(TEST_BADGE_ENTITY_TYPE, TEST_TOKEN_ID, "id", TEST_TOKEN_ID);
        assert.fieldEquals(
            TEST_BADGE_ENTITY_TYPE,
            TEST_TOKEN_ID,
            "totalAwarded", 
            BigInt.fromString(TEST_TOKEN_TOTAL_SUPPLY).toString()
        );
    })

    test("Token minted existing", () => {

        createMockedFunction(Address.fromString(TEST_TOKEN_ID), "nextTokenIdToMint", "nextTokenIdToMint():(uint256)")
            .withArgs([ ])
            .returns([ ethereum.Value.fromUnsignedBigInt(BigInt.fromString(TEST_BADGETOKEN_ID).plus(One)) ]);

        const badgeToken = getTestBadgeTokenEntity(
            Address.fromString(TEST_TOKEN_ID), 
            BigInt.fromString(TEST_BADGETOKEN_ID),
            TEST_USER2_ID,
            TEST_TOKEN_MINTED_URI
        );
        badgeToken.owner = null;
        badgeToken.save();
    
        const event = mintedERC721LazyMint();

        // Receiver of minted token
        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER3_ID, "id", TEST_USER3_ID);

        assert.entityCount(TEST_BADGETOKEN_ENTITY_TYPE, 1); // Used existing badge token
        assert.entityCount(TEST_BADGE_ENTITY_TYPE, 1); // Used existing badge
        
        assert.fieldEquals(TEST_BADGE_ENTITY_TYPE, TEST_TOKEN_ID, "totalAwarded", BigInt.fromString(TEST_BADGETOKEN_ID).plus(One).toString());

        // Badge Token
        assert.fieldEquals(TEST_BADGETOKEN_ENTITY_TYPE, badgeToken.id, "id", badgeToken.id);
        assert.fieldEquals(TEST_BADGETOKEN_ENTITY_TYPE, badgeToken.id, "owner", event.params.to.toHex());
        assert.fieldEquals(TEST_BADGETOKEN_ENTITY_TYPE, badgeToken.id, "metadataURI", event.params.tokenURI);
        assert.fieldEquals(TEST_BADGETOKEN_ENTITY_TYPE, badgeToken.id, "badge", event.address.toHex());
    })

    test("Token minted new", () => {

        createMockedFunction(Address.fromString(TEST_TOKEN_ID), "nextTokenIdToMint", "nextTokenIdToMint():(uint256)")
            .withArgs([ ])
            .returns([ ethereum.Value.fromUnsignedBigInt(BigInt.fromString(TEST_BADGETOKEN_ID).plus(One)) ]);

        const event = mintedERC721LazyMint();

        // Receiver of minted token
        assert.fieldEquals(TEST_USER_ENTITY_TYPE, TEST_USER3_ID, "id", TEST_USER3_ID);

        assert.entityCount(TEST_BADGETOKEN_ENTITY_TYPE, 1); // Used existing badge token
        assert.entityCount(TEST_BADGE_ENTITY_TYPE, 1); // Used existing badge
        
        assert.fieldEquals(TEST_BADGE_ENTITY_TYPE, TEST_TOKEN_ID, "totalAwarded", BigInt.fromString(TEST_BADGETOKEN_ID).plus(One).toString());

        const badgeTokenId = BadgeId(Address.fromString(TEST_TOKEN_ID), BigInt.fromString(TEST_BADGETOKEN_ID).toHex());

        // Badge Token
        assert.fieldEquals(TEST_BADGETOKEN_ENTITY_TYPE, badgeTokenId, "id", badgeTokenId);
        assert.fieldEquals(TEST_BADGETOKEN_ENTITY_TYPE, badgeTokenId, "owner", event.params.to.toHex());
        assert.fieldEquals(TEST_BADGETOKEN_ENTITY_TYPE, badgeTokenId, "metadataURI", event.params.tokenURI);
        assert.fieldEquals(TEST_BADGETOKEN_ENTITY_TYPE, badgeTokenId, "badge", event.address.toHex());
    })
    
    test("Lazy mint", () => {

        const event = mintLazyMint();

        // Badge data
        assert.fieldEquals(TEST_BADGE_ENTITY_TYPE, TEST_TOKEN_ID, "id", TEST_TOKEN_ID);
        assert.fieldEquals(
            TEST_BADGE_ENTITY_TYPE,
            TEST_TOKEN_ID,
            "totalAvailable",
            event.params.endTokenId.plus(BigInt.fromI32(1)).toString()
        );
    })

    test("Badge transfer", () => {

        const badgeToken = getTestBadgeTokenEntity(
            Address.fromString(TEST_BADGE_ID), 
            BigInt.fromString(TEST_BADGETOKEN_ID),
            TEST_USER2_ID,
            TEST_TOKEN_MINTED_URI
        );
        badgeToken.save();

        const event = transferERC721LazyMint(TEST_USER3_ID);

        // Badge data
        assert.fieldEquals(TEST_BADGETOKEN_ENTITY_TYPE, badgeToken.id, "id", badgeToken.id);
        assert.fieldEquals(TEST_BADGETOKEN_ENTITY_TYPE, badgeToken.id, "owner", event.params.to.toHex());
    })

    test("Badge burned", () => {

        const badgeToken = getTestBadgeTokenEntity(
            Address.fromString(TEST_BADGE_ID), 
            BigInt.fromString(TEST_BADGETOKEN_ID),
            TEST_USER2_ID,
            TEST_TOKEN_MINTED_URI
        );
        badgeToken.save();

        // TODO: Error here trying to remove Badge with BadgeToken id
        // transferERC721LazyMint("0x0000000000000000000000000000000000000000");

        // BadgeToken data
        // assert.notInStore(TEST_BADGETOKEN_ENTITY_TYPE, badgeToken.id);
    })

});