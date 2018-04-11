var Voting = artifacts.require("./Voting.sol");

// test suite
contract('Voting' , function(accounts){

var votingInstance;

// test initialation of contract
it("Should be initialized with empty/zero values", function() {
  return Voting.deployed().then(function(instance){
    votingInstance = instance;
    return votingInstance.voteCounter();
  }).then(function(data){
    assert.equal(data.toNumber() , 0 , "vote counter should be 0 on deployment");
    return votingInstance.votes(0);
  }).then(function(data){
      assert.equal(data[0].toNumber() ,0, 'index should be 0');
      assert.equal(data[1] ,'0x0000000000000000000000000000000000000000', 'address should be default address');
      assert.equal(data[2], '', 'Vote name should be empty');
      assert.equal(data[3], '', 'Vote description should be empty');
      assert.equal(data[4].toNumber() ,0, 'Current votes for should be 0');
      assert.equal(data[5].toNumber() ,0, 'Current votes against should be 0');
      assert.equal(data[6].toNumber() ,0, 'Number of voters should be 0');
      assert.equal(data[7] ,false, 'Vote ongoing should be false');
      // ballots??
    });
  });

// test vote creation
var _voteName = 'Test vote';
var _voteDescription = 'This is test vote';
var _votecreator = accounts[1];

// create the first vote from account 1
it("Vote shoud be registered sucessfully", function() {
  return Voting.deployed().then(function(instance){
  votingInstance = instance;
  return instance.createVote(_voteName, _voteDescription, {from: _votecreator });
}).then(function(){
  return votingInstance.voteCounter();
}).then(function(data){
  assert.equal(data.toNumber() , 1 , "vote counter should be 1 on after a vote is created");
  return votingInstance.votes(1);
}).then(function(data){
  assert.equal(data[0].toNumber() ,1, 'index should be 1');
  assert.equal(data[1] ,_votecreator, 'address should be the creator address');
  assert.equal(data[2], 'Test vote', 'Vote name should be set');
  assert.equal(data[3], 'This is test vote', 'Vote description should be set');
  assert.equal(data[4].toNumber() ,0, 'Current votes for should be 0');
  assert.equal(data[5].toNumber() ,0, 'Current votes against should be 0');
  assert.equal(data[6].toNumber() ,0, 'Number of voters should be 0');
  assert.equal(data[7] ,true, 'Vote ongoing should be true');
  });
});

var _voteName2 = 'Test vote 2';
var _voteDescription2 = 'This is test vote number 2';

// create the second vote from account 1
it("Second Vote shoud be registered sucessfully", function() {
  return Voting.deployed().then(function(instance){
  votingInstance = instance;
  return instance.createVote(_voteName2, _voteDescription2, {from: _votecreator });
}).then(function(){
  return votingInstance.voteCounter();
}).then(function(data){
  assert.equal(data.toNumber() , 2 , "vote counter should be 2 on after a vote is created");
  return votingInstance.votes(2);
}).then(function(data){
  assert.equal(data[0].toNumber() ,2, 'index should be 2');
  assert.equal(data[1] ,_votecreator, 'address should be the creator address');
  assert.equal(data[2], 'Test vote 2', 'Vote name should be set');
  assert.equal(data[3], 'This is test vote number 2', 'Vote description should be set');
  assert.equal(data[4].toNumber() ,0, 'Current votes for should be 0');
  assert.equal(data[5].toNumber() ,0, 'Current votes against should be 0');
  assert.equal(data[6].toNumber() ,0, 'Number of voters should be 0');
  assert.equal(data[7] ,true, 'Vote ongoing should be true');
  });
});

var _voteName3 = 'Test vote 3';
var _voteDescription3 = 'This is test vote number 3';
var _votecreator2 = accounts[2];

// create the first vote from account 2
it("first Vote should be registered sucessfully with account 2", function() {
  return Voting.deployed().then(function(instance){
  votingInstance = instance;
  return instance.createVote(_voteName3, _voteDescription3, {from: _votecreator2 });
}).then(function(){
  return votingInstance.voteCounter();
}).then(function(data){
  assert.equal(data.toNumber() , 3 , "vote counter should be 3 on after a vote is created");
  return votingInstance.votes(3);
}).then(function(data){
  assert.equal(data[0].toNumber() ,3, 'index should be 3');
  assert.equal(data[1] ,_votecreator2, 'address should be the creator address');
  assert.equal(data[2], 'Test vote 3', 'Vote name should be set');
  assert.equal(data[3], 'This is test vote number 3', 'Vote description should be set');
  assert.equal(data[4].toNumber() ,0, 'Current votes for should be 0');
  assert.equal(data[5].toNumber() ,0, 'Current votes against should be 0');
  assert.equal(data[6].toNumber() ,0, 'Number of voters should be 0');
  assert.equal(data[7] ,true, 'Vote ongoing should be true');
  });
});

// account 2 should be cast sucessfully on vote1
it("account 2 should be able to vote 'for' sucessfully on vote with id: 1", function() {
  return Voting.deployed().then(function(instance){
  votingInstance = instance;
  return instance.castVote(1,1, {from: accounts[2] });
}).then(function(){
  // get the vote counter
  return votingInstance.voteCounter();
}).then(function(data){
  // should remain as three
  assert.equal(data.toNumber() , 3 , "vote counter should be 3 on after a vote is created");
  return votingInstance.votes(1);
}).then(function(data){
  // asside from number of voters, all state variables should remain constant
  assert.equal(data[0].toNumber() ,1, 'index should be 1');
  assert.equal(data[1] ,_votecreator, 'address should be the creator address');
  assert.equal(data[2], 'Test vote', 'Vote name should be set');
  assert.equal(data[3], 'This is test vote', 'Vote description should be set');
  assert.equal(data[4].toNumber() ,0, 'Current votes for should be 0');
  assert.equal(data[5].toNumber() ,0, 'Current votes against should be 0');
  assert.equal(data[6].toNumber() ,1, 'Number of voters should be 1');
  assert.equal(data[7] ,true, 'Vote ongoing should be true');

  // get the ballot
  return votingInstance.getVoteBallot(1, {from: accounts[2]});
}).then(function(data){
  assert.equal(data[0], accounts[2] , 'Address of voter should be account 2');
  assert.equal(data[1].toNumber(), 1 , 'ballotID should be 1');
  assert.equal(data[2].toNumber(), 1 , 'result should be 1');
});
});

// account 3 should be cast sucessfully on vote1
it("account 3 should be able to vote 'against' sucessfully on vote with id: 1", function() {
  return Voting.deployed().then(function(instance){
  votingInstance = instance;
  return instance.castVote(1,0, {from: accounts[3] });
}).then(function(){
  // get the vote counter
  return votingInstance.voteCounter();
}).then(function(data){
  // should remain as three
  assert.equal(data.toNumber() , 3 , "vote counter should be 3 on after a vote is created");
  return votingInstance.votes(1);
}).then(function(data){
  // asside from number of voters, all state variables should remain constant
  assert.equal(data[0].toNumber() ,1, 'index should be 1');
  assert.equal(data[1] ,_votecreator, 'address should be the creator address');
  assert.equal(data[2], 'Test vote', 'Vote name should be set');
  assert.equal(data[3], 'This is test vote', 'Vote description should be set');
  assert.equal(data[4].toNumber() ,0, 'Current votes for should be 0');
  assert.equal(data[5].toNumber() ,0, 'Current votes against should be 0');
  assert.equal(data[6].toNumber() ,2, 'Number of voters should be 2');
  assert.equal(data[7] ,true, 'Vote ongoing should be true');

  // get the ballot
  return votingInstance.getVoteBallot(1, {from: accounts[3]});
}).then(function(data){
  assert.equal(data[0], accounts[3] , 'Address of voter should be account 3');
  assert.equal(data[1].toNumber(), 2 , 'ballotID should be 2');
  assert.equal(data[2].toNumber(), 0 , 'result should be 0');
});
});

// user should be able to close a vote1
it("Account1 should be able to close vote 1", function() {
  return Voting.deployed().then(function(instance){
    votingInstance = instance;
    return votingInstance.closeVote(1, {from: _votecreator});
  }).then(function(){
    // get the vote counter
    return votingInstance.voteCounter();
  }).then(function(data){
    // should remain as three
    assert.equal(data.toNumber() , 3 , "vote counter should be 3");
    return votingInstance.votes(1);
  }).then(function(data){
    // asside from voteOngoing, all state variables should remain constant
    assert.equal(data[0].toNumber() ,1, 'index should be 1');
    assert.equal(data[1] ,_votecreator, 'address should be the creator address');
    assert.equal(data[2], 'Test vote', 'Vote name should be set');
    assert.equal(data[3], 'This is test vote', 'Vote description should be set');
    assert.equal(data[4].toNumber() ,0, 'Current votes for should be 0');
    assert.equal(data[5].toNumber() ,0, 'Current votes against should be 0');
    assert.equal(data[6].toNumber() ,2, 'Number of voters should be 2');
    assert.equal(data[7] ,false, 'Vote ongoing should be false');
});
});
});
