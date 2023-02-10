import { Address } from "@graphprotocol/graph-ts";
import { Contract } from "../../generated/schema";

export function loadOrCreateContract(appAddress: Address): Contract {
  const id = appAddress.toHex();
  let _contract = Contract.load(id);

  if (!_contract) {
    _contract = new Contract(id);
  }

  return _contract as Contract;
}
