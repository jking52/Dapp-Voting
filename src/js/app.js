App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,

  init: function() {
    App.initWeb3();
    App.displayAccountInfo();
    App.initContract();
  },

  initWeb3: function(){
    // initialize web3
    if(typeof web3 !== 'undefined') {
      //reuse the provider of the Web3 object injected by Metamask
      App.web3Provider = web3.currentProvider;
    } else {
      //create a new provider and plug it directly into our local node
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
  },

  displayAccountInfo: function() {
    web3.eth.getCoinbase(function(err,account){
      if(err === null){
        App.account = account;
        $('#account').append(account);
      }
      else {
        console.error(err);
      }
    });
  },
  initContract: function() {
    $.getJSON('Voting.json', function(votingArtifact) {
      // get the contract artifact file and use it to instantiate a truffle contract abstraction
      App.contracts.Voting = TruffleContract(votingArtifact);
      // set the provider for our contracts
      App.contracts.Voting.setProvider(App.web3Provider);
      // listen to events
      //App.listenToEvents();
      // retrieve the article from the contract
      //return App.reloadArticles();
    });
  },
  createVote: function() {
    // get input
    var _voteName = $('#vote_name').val();
    var _description = $('#vote_description').val();
    console.log(_voteName, _description);
    App.contracts.Voting.deployed().then(function(instance) {
      return instance.createVote(_voteName, _description,
      { from: App.account,
        gas: 500000
      });
    }).then(function(result){
      console.log(result);
    }).catch(function(err) {
      console.error(err);
    });
  }
};



  $(function() {
    $(window).load(function() {
      App.init();
    });
  });
