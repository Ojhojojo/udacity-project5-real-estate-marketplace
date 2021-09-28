var solnSquareContract = artifacts.require('SolnSquareVerifier');
var verifierContract = artifacts.require("SquareVerifier");
var proofJson = require("./proof");

contract('TestSolnSquareVerifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const symbol = "REMP";
    const name = "Real Estate Marketplace Token";

    describe('match SolnSquareVerifier spec', function () {
        beforeEach(async function () {
            const verifier = await verifierContract.new({ from: account_one });
            this.contract = await solnSquareContract.new(verifier.address, name, symbol, { from: account_one });
        })

        // Test if a new solution can be added for contract - SolnSquareVerifier
        it('Test add new solution', async function () {
            let result = true;
            try {
                await this.contract.canMintNftToken(account_two, 2, proofJson.proof.a, proofJson.proof.b, proofJson.proof.c, proofJson.inputs, { from: account_one });
            } catch (error) {
                console.log(error);
                result = false;
            }
            assert.equal(result, true, "Unable to add new solution to the contract");
        })

        it('Test check for duplicate solution before adding', async function () {
            await this.contract.canMintNftToken(account_two, 2, proofJson.proof.a, proofJson.proof.b, proofJson.proof.c, proofJson.inputs, { from: account_one });
            let result = true;
            try {
                await this.contract.canMintNftToken(account_two, 3, proofJson.proof.a, proofJson.proof.b, proofJson.proof.c, proofJson.inputs, { from: account_one });
            } catch (error) {
                console.log(error);
                result = false;
            }
            assert.equal(result, false, "Duplicate solution cannot be added to the contract");
        })

        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('Test if an ERC721 token can be minted for contract', async function () {
            let result = true;
            try {
                await this.contract.mintNftToken(account_two, 2, proofJson.proof.a, proofJson.proof.b, proofJson.proof.c, proofJson.inputs, { from: account_one });
            } catch (error) {
                console.log(error);
                result = false;
            }
            assert.equal(result, true, "Token can't be minted to the contract");
        })

        it('Test if an ERC721 token can be forged or tampered', async function () {
            let result = true;
            input = [3, 1];
            try {
                await this.contract.mintNftToken(account_two, 2, proofJson.proof.a, proofJson.proof.b, proofJson.proof.c, input, { from: account_one });
            } catch (error) {
                result = false;
            }
            assert.equal(result, false, "Token should not be tampered/forged while minting");
        })
    })
});