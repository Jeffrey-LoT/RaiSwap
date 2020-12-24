const liquidityValueCalculator = artifacts.require("LiquidityValueCalculator");
const {expectRevert, time} = require('@openzeppelin/test-helpers');
const RaiToken = artifacts.require('RaiToken');
const MockERC20 = artifacts.require('MockERC20');
const UniswapV2Pair = artifacts.require('UniswapV2Pair');
const UniswapV2Factory = artifacts.require('UniswapV2Factory');
const Migrator = artifacts.require('Migrator');
const UniswapV2Router02 = artifacts.require('UniswapV2Router02');

contract("LiquidityValueCalculator", function ([alice, bob, dev]) {
    before(async () => {
        this.factory1 = await UniswapV2Factory.new(alice, {from: alice});
        this.factory2 = await UniswapV2Factory.new(alice, {from: alice});
        this.rai = await RaiToken.new({from: alice});
        this.instance = await liquidityValueCalculator.deployed();
        this.weth = await MockERC20.new('WETH', 'WETH', '100000000', {from: alice});
        this.token = await MockERC20.new('TOKEN', 'TOKEN', '100000000', {from: alice});
        this.token2 = await MockERC20.new('JEFF', 'JEFF', '20000', {from: alice})
        this.lp1 = await UniswapV2Pair.at((await this.factory1.createPair(this.weth.address, this.token.address)).logs[0].args.pair);
        this.lp2 = await UniswapV2Pair.at((await this.factory2.createPair(this.weth.address, this.token.address)).logs[0].args.pair);
        this.migrator = await Migrator.new(this.rai.address, this.factory1.address, this.factory2.address, '0');
    });

    it("should fetch current balance", async () => {
        this.balA = await this.token.balanceOf(alice);
        this.balB = await this.weth.balanceOf(alice);
    });
    it("print Balance", () => console.log("tokenBalance =>", this.balA, ", wethBalance =>", this.balB))

    describe("Test Case 1", () => {
        it("should get pair info", async () => {
            await this.token.transfer(this.lp1.address, '10000000', {from: alice});
            await this.weth.transfer(this.lp1.address, '500000', {from: alice});
            await this.lp1.mint(alice);
            await this.lp1.sync();
            this.pairAAddress = await this.factory1.getPair(this.weth.address, this.token.address)
        });

        it("test 01-1", () => console.log("a =>", this.pairAAddress))

        it("should fetch current balance", async () => {
            this.balA = await this.token.balanceOf(alice);
            this.balB = await this.weth.balanceOf(alice);
        });
        it("print Balance", () => console.log("tokenBalance =>", this.balA, ", wethBalance =>", this.balB))

        it("should add liquidity successfully", async () => {
            this.router1 = await UniswapV2Router02.new(this.factory1.address, this.weth.address);

            this.b = await this.router1.addLiquidity(
                this.token.address,
                this.weth.address,
                10000,
                1000,
                100,
                10,
                alice,
                Math.floor(Date.now() / 1000) + 24 * 60 * 60
            )
        });

        it("should fetch current balance", async () => {
            this.balA = await this.token.balanceOf(alice);
            this.balB = await this.weth.balanceOf(alice);
        });
        it("print Balance", () => console.log("tokenBalance =>", this.balA, ", wethBalance =>", this.balB))

        it("test 01-2", () => console.log("b =>", this.b))

        it("should can swap", async () => {
            this.c = await this.router1.swapTokensForExactTokens(
                1000,
                1000,
                [this.token.address, this.weth.address],
                alice,
                Math.floor(Date.now() / 1000) + 24 * 60 * 60
            )
        });

        it("test 01-3", () => console.log("c =>", this.c))
        it("should fetch current balance", async () => {
            this.balA = await this.token.balanceOf(alice);
            this.balB = await this.weth.balanceOf(alice);
        });
        it("test 01-4", () => console.log("tokenBalance =>", this.balA, ", wethBalance =>", this.balB))
    })
});