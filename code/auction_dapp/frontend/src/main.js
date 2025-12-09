import Vue from 'vue'
import App from './App'
import Config from './config'
import router from './router'
import Vuetify from 'vuetify'
import VueResource from 'vue-resource'
import { ChatRoom } from './models/ChatRoom'
import { DeedRepository } from './models/DeedRepository'
import { AuctionRepository } from './models/AuctionRepository'

// rename to avoid conflict between metamask
// will be used for whisper v5/6
var Web3_1 = require('web3')

Vue.use(VueResource)
Vue.use(Vuetify)
Vue.config.productionTip = false

// state management
var store = {
    debug: true,
    state: {
        // metamask state variable
        metamask: {
            web3DefaultAccount: '',
            metamaskInstalled: false,
            networkId: '',
        },

        // local web3 instance(not metamask)
        web3 : null,

    },
    networkReady() {
        return this.getNetworkId() != '' && this.getMetamaskInstalled() && this.getWeb3DefaultAccount() != ''
    },
    setNetworkId(networkId) {
        this.state.metamask.networkId = networkId
    },
    getNetworkId() {
        return this.state.metamask.networkId
    },

    setWeb3DefaultAccount(account) {
        this.state.metamask.web3DefaultAccount = account
    },
    getWeb3DefaultAccount() {
        return this.state.metamask.web3DefaultAccount
    },

    setMetamaskInstalled(){
        this.state.metamask.metamaskInstalled = true
    },
    getMetamaskInstalled(){
        return this.state.metamask.metamaskInstalled
    },

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }
}


Vue.mixin({
    created: function () {
        // Inject the models to components
        this.$chatroomInstance = new ChatRoom()
        this.$deedRepoInstance = new DeedRepository()
        this.$auctionRepoInstance = new AuctionRepository()
        
        // this.$chatroomInstance.setWeb3(new Web3_1(Config.SHH_ENDPOINT)) // Whisper is deprecated/removed in many modern contexts

        // one instance of web3 available to all components
        const initWeb3 = async () => {
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                try {
                    // Request account access if needed
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    
                    this.$auctionRepoInstance.setWeb3(web3)
                    this.$deedRepoInstance.setWeb3(web3)

                    store.setMetamaskInstalled()
                    
                    const netId = await web3.eth.net.getId();
                    store.setNetworkId(netId)

                    // pull accounts every 2 seconds
                    setInterval(async () => {
                        const accounts = await web3.eth.getAccounts();
                        if(accounts.length > 0) store.setWeb3DefaultAccount(accounts[0])
                    }, 2000)

                } catch (error) {
                    console.error("User denied account access", error);
                }
            } else if (window.web3) { // Legacy dapp browsers...
                const web3 = new Web3(window.web3.currentProvider);
                 this.$auctionRepoInstance.setWeb3(web3)
                 this.$deedRepoInstance.setWeb3(web3)
            } else {
                console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
            }
        }

        initWeb3();
        
        // inject config to components
        this.$config = Config
    }
})


new Vue({
    el: '#app',
    data: {
        globalState: store,
    },
    router,
    template: '<App/>',
    components: { App },
    mounted() {

    }
})
