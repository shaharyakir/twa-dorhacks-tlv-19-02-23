import { fromNano } from "ton";
import {
  Contract,
  ContractProvider,
  Sender,
  Address,
  Cell,
  contractAddress,
  beginCell,
  toNano,
} from "ton-core";

export default class FaucetJettonWallet implements Contract {
  async getBalance(provider: ContractProvider) {
    const { stack } = await provider.get("get_wallet_data", []);
    return fromNano(stack.readBigNumber());
  }

  async sendBurn(provider: ContractProvider, via: Sender, amount: bigint) {
    provider.internal(via, {
      value: toNano("0.05"),
      body: beginCell()
        .storeUint(0x595f07bc, 32)
        .storeUint(0, 64)
        .storeCoins(amount)
        .storeAddress(via.address!)
        .endCell(),
    });
  }

  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}
}
