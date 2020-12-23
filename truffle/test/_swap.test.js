const liquidityValueCalculator = artifacts.require("LiquidityValueCalculator");
const {expectRevert, time} = require('@openzeppelin/test-helpers');
const RaiToken = artifacts.require('RaiToken');
const MasterChef = artifacts.require('MasterChef');
const MockERC20 = artifacts.require('MockERC20');
const UniswapV2Pair = artifacts.require('UniswapV2Pair');
const UniswapV2Factory = artifacts.require('UniswapV2Factory');
const Migrator = artifacts.require('Migrator');

const testPrivateKey1 = "91e788b7dd1c7c8c05ca4a2ce40c20ba55a090b5402b366a0ab05e03a6a8acde";
const testPrivateKey2 = "896394437de75aa9dbf74b0761352cea29c8f9278b15b74cc53309e9dd9a2bca";

contract("LiquidityValueCalculator", function ([alice, bob, dev, minter]) {
    before(async () => {
        this.factory1 = await UniswapV2Factory.new(alice, {from: alice});
        this.factory2 = await UniswapV2Factory.new(alice, {from: alice});
        this.rai = await RaiToken.new({from: alice});
        this.instance = await liquidityValueCalculator.deployed();
        this.weth = await MockERC20.new('WETH', 'WETH', '100000000', {from: alice});
        this.token = await MockERC20.new('TOKEN', 'TOKEN', '100000000', {from: alice});
        this.lp1 = await UniswapV2Pair.at((await this.factory1.createPair(this.weth.address, this.token.address)).logs[0].args.pair);
        this.lp2 = await UniswapV2Pair.at((await this.factory2.createPair(this.weth.address, this.token.address)).logs[0].args.pair);
        this.migrator = await Migrator.new(this.rai.address, this.factory1.address, this.factory2.address, '0');
    });

    it("should get pair info", async () => {
        await this.token.transfer(this.lp1.address, '10000000', {from: alice});
        await this.weth.transfer(this.lp1.address, '500000', {from: alice});
        await this.lp1.mint(alice);
        await this.lp1.sync();
        console.log((await this.instance.pairInfo(this.weth.address, this.token.address)));
    });
});