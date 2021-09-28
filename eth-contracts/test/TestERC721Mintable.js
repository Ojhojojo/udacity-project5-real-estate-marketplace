var ERC721MintableComplete = artifacts.require('RempToken');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];

    const symbol = "REMP";
    const name = "Real Estate Marketplace Token";

    describe('match erc721 spec', function () {
        beforeEach(async function () {
            this.contract = await ERC721MintableComplete.new(name, symbol, { from: account_one });

            // TODO: mint multiple tokens
            for (let n = 1; n < 10; n++) {
                await this.contract.mint(accounts[n], n, { from: account_one });
            }
        })

        it('should return total supply', async function () {
            let result = await this.contract.totalSupply();
            assert.equal(parseInt(result), 9, "Incorrect total supply!");
        })

        it('should get token balance', async function () {
            let result = await this.contract.balanceOf(account_two);
            assert.equal(parseInt(result), 1, "Incorrect token balance!");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {
            let result = await this.contract.tokenURI(2, { from: account_three });
            assert.equal(result, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/2", "Incorrect tokenURI!");
        })

        it('should transfer token from one owner to another', async function () {
            let tokenOwner = await this.contract.ownerOf(1);
            assert.equal(tokenOwner, account_two, "Wrong Owner - should be account_two");
            await this.contract.transferFrom(account_two, account_three, 1, { from: account_two });
            tokenOwner = await this.contract.ownerOf(1);
            assert.equal(tokenOwner, account_three, "Wrong Owner - should be account_three");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () {
            this.contract = await ERC721MintableComplete.new(name, symbol, { from: account_one });
        })

        it('should fail when minting when address is not contract owner', async function () {
            let result = true;
            try {
                await this.contract.mint(account_two, 8, { from: account_two });
            } catch (err) {
                result = false;
            }
            assert.equal(result, false, "Expected to fail minting when address is not contract owner");
        })

        it('should return contract owner', async function () {
            let owner = await this.contract._owner.call({ from: account_one });
            assert.equal(owner, account_one, "Expected to return contract owner");
        })

    });
})