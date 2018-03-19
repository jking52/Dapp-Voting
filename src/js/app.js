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
      return App.displayVote();
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
      App.displayVote();
    }).catch(function(err) {
      console.error(err);
    });
  },

  displayVote: function () {
    var _voteName;
    var _voteOwner;
    var _voteDescription;

    // clear votesRow before displaying info
    $('#votesRow').empty();

    App.contracts.Voting.deployed().then(function(instance){
      return instance.getVoteDetails();
    }).then(function (details){
      console.log(details);
      _voteOwner = details[0];
      _voteName = details[1];
      _voteDescription = details[2];

      //display vote details
      var articleTemplate = $("#voteTemplate");
      articleTemplate.find('.panel-title').text("Vote Details");
      articleTemplate.find('.vote-description').text(_voteDescription);
      articleTemplate.find('.vote-name').text(_voteName);
      if(App.account === _voteOwner) {
          articleTemplate.find('.vote-owner').text("You");
          articleTemplate.find('.btn-closeVote').show();
      }
      else {
        articleTemplate.find('.vote-owner').text(_voteOwner);
        articleTemplate.find('.btn-closeVote').hide();
      }
      $('#votesRow').append(articleTemplate.html());
    });
  },

castVote: function (_vote){
  App.contracts.Voting.deployed().then(function(instance){
    return instance.castVote(_vote, { from: App.account, gas: 500000});
  }).then(function (result){
    App.displayVote();
    $("#voteTemplate").find('.btn-for').prop('disabled', true);
    $("#voteTemplate").find('.btn-against').prop('disabled', true);
  }).catch(function(err) {
    console.error(err);
  });
},

closeVote: function(){
  App.contracts.Voting.deployed().then(function(instance){
    return instance.closeVote({ from: App.account, gas: 500000});
  });
},

getResults: function(){
  App.contracts.Voting.deployed().then(function(instance){
    return instance.getResults({ from: App.account, gas: 500000});
  }).then(function (result){
    console.log(result);
  $('#resultsRow').find('.vote-result').text(result);
  $('#modalShowResults').modal('show');
});
}

};



  $(function() {
    $(window).load(function() {
      App.init();
    });
  });
