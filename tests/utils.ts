import { Address, ethereum, JSONValue, Value, ipfs, json, Bytes, BigInt } from "@graphprotocol/graph-ts"
import { newMockEvent } from "matchstick-as/assembly/index"
import {Created as CreatedApp} from "../generated/AppFactory/AppFactory";
import { Created as CreatedERC20FactoryFacet } from "../generated/templates/ERC20FactoryFacet/ERC20FactoryFacet";

export function newCreatedAppEvent(id: string, ownerAddress: string, name: string): CreatedApp {
    let event = newMockEvent();
    event.parameters = new Array();
    let idParam = new ethereum.EventParam("id", ethereum.Value.fromAddress(Address.fromString(id)));
    let addressParam = new ethereum.EventParam("owner", ethereum.Value.fromAddress(Address.fromString(ownerAddress)));
    let nameParam = new ethereum.EventParam("name", ethereum.Value.fromString(name));
  
    event.parameters.push(idParam);
    event.parameters.push(addressParam);
    event.parameters.push(nameParam);
  
    return changetype<CreatedApp>(event);
  }

  export function newCreatedERC20FactoryEvent(
    id: string,
    creator: string,
    name: string,
    symbol: string,
    decimals: i32,
    supply: string,
    implementationId: Bytes
): CreatedERC20FactoryFacet {
    let event = newMockEvent();
    event.parameters = new Array();
    let idParam = new ethereum.EventParam("id", ethereum.Value.fromAddress(Address.fromString(id)));
    let creatorParam = new ethereum.EventParam("creator", ethereum.Value.fromAddress(Address.fromString(creator)));
    let nameParam = new ethereum.EventParam("name", ethereum.Value.fromString(name));
    let symbolParam = new ethereum.EventParam("symbol", ethereum.Value.fromString(symbol));
    let decimalsParam = new ethereum.EventParam("decimals", ethereum.Value.fromI32(decimals));
    let supplyParam = new ethereum.EventParam("supply", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(supply)));
    let implParam = new ethereum.EventParam("implementationId", ethereum.Value.fromString("Base"));

    event.parameters.push(idParam);
    event.parameters.push(creatorParam);
    event.parameters.push(nameParam);
    event.parameters.push(symbolParam);
    event.parameters.push(decimalsParam);
    event.parameters.push(supplyParam);
    event.parameters.push(implParam);
    
    return changetype<CreatedERC20FactoryFacet>(event);
  }
  