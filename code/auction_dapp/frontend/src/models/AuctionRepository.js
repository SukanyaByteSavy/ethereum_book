import Config from '../config'

export class AuctionRepository {

    web3 = null
    account = ''
    contractInstance = null
    gas = 4476768

    constructor(){
        this.gas = Config.GAS_AMOUNT
    }

    setWeb3(web3) {
        this.web3 = web3
        this.contractInstance = new this.web3.eth.Contract(
            Config.AUCTIONREPOSITORY_ABI, 
            Config.AUCTIONREPOSITORY_ADDRESS
        )
    }

    getWeb3() {
        return this.web3
    }

    setAccount(account){
        this.account = account
    }

    async getCurrentBlock() {
        return await this.web3.eth.getBlockNumber()
    }

    async watchIfCreated(cb) {
        const currentBlock = await this.getCurrentBlock()
        // Watch for events from current block onwards
        this.contractInstance.events.AuctionCreated({
            fromBlock: currentBlock // or 'latest'
        })
        .on('data', (event) => {
            cb(null, event)
        })
        .on('error', (err) => {
            cb(err, null)
        })
    }

    async watchIfBidSuccess(cb) {
        const currentBlock = await this.getCurrentBlock()
        this.contractInstance.events.BidSuccess({
            fromBlock: currentBlock
        })
        .on('data', (event) => {
            cb(null, event)
        })
        .on('error', (err) => {
            cb(err, null)
        })
    }

    async watchIfCanceled(cb) {
        const currentBlock = await this.getCurrentBlock()
        this.contractInstance.events.AuctionCanceled({
            fromBlock: currentBlock
        })
        .on('data', (event) => {
            cb(null, event)
        })
        .on('error', (err) => {
            cb(err, null)
        })
    }

    async watchIfFinalized(cb) {
        const currentBlock = await this.getCurrentBlock()
        this.contractInstance.events.AuctionFinalized({
            fromBlock: currentBlock
        })
        .on('data', (event) => {
            cb(null, event)
        })
        .on('error', (err) => {
            cb(err, null)
        })
    }

    async getCurrentBid(auctionId) {
        return await this.contractInstance.methods.getCurrentBid(auctionId).call({from: this.account})
    }

    async getBidCount(auctionId) {
        return await this.contractInstance.methods.getBidsCount(auctionId).call({from: this.account})
    }

    async getCount() {
        return await this.contractInstance.methods.getCount().call({from: this.account})
    }

    async bid(auctionId, price) {
        const priceInWei = this.web3.utils.toWei(price.toString(), 'ether')
        console.log(auctionId, priceInWei)
        return await this.contractInstance.methods.bidOnAuction(auctionId).send({
            from: this.account, 
            gas: this.gas, 
            value: priceInWei
        })
    }

    async create(deedId, auctionTitle, metadata, startingPrice, blockDeadline) {
        const priceInWei = this.web3.utils.toWei(startingPrice.toString(), 'ether')
        return await this.contractInstance.methods.createAuction(
            Config.DEEDREPOSITORY_ADDRESS, 
            deedId, 
            auctionTitle, 
            metadata, 
            priceInWei, 
            blockDeadline
        ).send({
            from: this.account, 
            gas: this.gas 
        })
    }

    async cancel(auctionId) {
        return await this.contractInstance.methods.cancelAuction(auctionId).send({
            from: this.account, 
            gas: this.gas 
        })
    }

    async finalize(auctionId) {
        return await this.contractInstance.methods.finalizeAuction(auctionId).send({
            from: this.account, 
            gas: this.gas 
        })
    }

    async findById(auctionId) {
        return await this.contractInstance.methods.getAuctionById(auctionId).call({ from: this.account })
    }

}