/* exceptions are: */

/* Should not be able to vote on a non existant vote*/
/* User Should not be able to vote twice*/
/*user should not be able to vote after the vote is closed*/
/* Non owner should not be able to close the vote*/

var Voting = artifacts.require("./Voting.sol");


contract('Test Voting on a non existant vote', function(accounts){
  var votingInstance;

  //Testing failed voting on Vote 1 - which is a non existant Vote
  it("an exception should be thrown when trying to vote on Vote1 as it has not been created", function() {
    return Voting.deployed().then(function(instance){
      votingInstance = instance;
      return votingInstance.votes(1);
    }).then(assert.fail)
      .catch(function(error){
        assert(true);
      }).then(function(){
        return votingInstance.castVote(1,1, {from: accounts[1]});
      }).then(assert.fail)
        .catch(function(error){
          assert(true);
      }).then(function(){
        return votingInstance.getVoteBallot(1, {from: accounts[1]});
      }).then(assert.fail)
        .catch(function(error){
          assert(true);
      });
  });
});

contract('Testing you can only vote once', function(accounts){
  var votingInstance;

  // test data for vote creation
  var _voteName = 'Test vote';
  var _voteDescription = 'This is test vote';
  var _votecreator = accounts[1];

  //testing that a user cannot vote twice
  it("should throw an exception if you try to vote twice on the same vote", function(){
    return Voting.deployed().then(function(instance){
    votingInstance = instance;
    return votingInstance.createVote(_voteName, _voteDescription, {from: _votecreator });
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

    // cast first vote
    return votingInstance.castVote(1,1, {from: accounts[1]});
  }).then(function(){
      // check vote was cast sucessfully
      return votingInstance.getVoteBallot(1, {from: accounts[1]});
    }).then(function(data){
      assert.equal(data[0], accounts[1] , 'Address of voter should be account 1');
      assert.equal(data[1].toNumber(), 1 , 'ballotID should be 1');
      assert.equal(data[2].toNumber(), 1 , 'result should be 1');
        // attempt to cast a second vote
      return votingInstance.castVote(1,0, {from: accounts[1]});
    }).then(assert.fail)
        .catch(function(error){
          assert(true);
        })
    });

    it("Original ballot should remain the same", function(){
      return Voting.deployed().then(function (instance){
        votingInstance = instance;
        return votingInstance.getVoteBallot(1, {from: accounts[1]});
      }).then(function (data){
        assert.equal(data[0], accounts[1] , 'Address of voter should be account 1');
        assert.equal(data[1].toNumber(), 1 , 'ballotID should be 1');
        assert.equal(data[2].toNumber(), 1 , 'result should be 1');
      });
  });
});
