import Config from '../config'

export class DeedRepository {

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
            Config.DEEDREPOSITORY_ABI, 
            Config.DEEDREPOSITORY_ADDRESS
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
        this.contractInstance.events.DeedRegistered({
            fromBlock: currentBlock
        })
        .on('data', (event) => {
            cb(null, event)
        })
        .on('error', (err) => {
            cb(err, null)
        })
    }

    async watchIfDeedTransfered(cb) {
        const currentBlock = await this.getCurrentBlock()
        this.contractInstance.events.Transfer({
            fromBlock: currentBlock
        })
        .on('data', (event) => {
            cb(null, event)
        })
        .on('error', (err) => {
            cb(err, null)
        })
    }

    async exists(deedId) {
        return await this.contractInstance.methods.exists(deedId).call({from: this.account})
    }

    async transferTo(to, deedId) {
        return await this.contractInstance.methods.transferFrom(this.account, to, deedId).send({
            from: this.account, 
            gas: this.gas 
        })
    }

    async create(deedId, deedURI) {
        return await this.contractInstance.methods.registerDeed(deedId, deedURI).send({
            from: this.account, 
            gas: this.gas 
        })
    }
}