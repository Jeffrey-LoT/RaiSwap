# RaiSwap

https://swap.rai.finance. Feel free to read the code. More details coming soon.

## Deployed Contracts / Hash

## License

MIT

## How to access Test server
### 1. Polkadot JS Explorer
- Goto https://polkadot.js.org/apps/#/explorer and switch the endpoint to following ws address.
   `wss://test-node.rai.finance/ws`
  
### 2. Ethereum compatible RPC
- Use following Endpoint to use.
   `https://test-node.rai.finance/`

## How to deploy

### Step 1. Prepare a moonbeam node

- Following [This Link](https://docs.moonbeam.network/getting-started/local-node/setting-up-a-node/) to setup a moonbeam
  node in your local machine.

### Step 2. Deploy RaiSwap Contract into your local node

1. Clone this repository.
    ```shell
   git clone https://github.com/RaiFinance/RaiSwap.git
   cd RaiSwap 
   ```    

2. Setup a private key file.
    ```shell
   cat 'your_test_private_key1,your_test_private_key2,your_test_private_key3' > test_private_key.txt  
   ```

3. Install Dependencies.
   ```shell
   cd truffle
   yarn
   npm i -g truffle mocha 
   ```

4. Deploy a RaiSwap contract.
    ```shell
    truffle migrate --network development
    ```
   
5. Test the contract.
   ```shell
   truffle test -network development
   ```

