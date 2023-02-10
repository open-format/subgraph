import { Address } from "@graphprotocol/graph-ts";
import { ContractData } from "../../generated/schema";

export function loadOrCreateContractMetadata(
  appAddress: Address
): ContractData {
  const id = appAddress.toHex();
  let _contractMetadata = ContractData.load(id);

  if (!_contractMetadata) {
    _contractMetadata = new ContractData(id);
  }

  return _contractMetadata as ContractData;
}
