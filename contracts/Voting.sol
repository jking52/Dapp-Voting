pragma solidity ^0.4.17;

/*Simple contract which allows users to vote in a binary vote*/
contract Voting {

//state variables
address owner;
string voteName;
string voteDescription;
// keep track of all voters
mapping(address => address) voters;
//track voters and thier votes
mapping(address => uint) public results;
uint currentVotesFor;
uint currentVotesAgainst;
uint numberOfVoters;
bool voteOngoing = false;

//modifiers
modifier onlyOwner(){
  require(msg.sender == owner);
  _;
}

modifier votingOpen(){
  require(voteOngoing);
  _;
}

modifier votingClosed(){
  require(!voteOngoing);
  _;
}

// add a vote
function createVote(string _voteName, string _voteDescription) public {
  owner = msg.sender;
  voteName = _voteName;
  voteDescription = _voteDescription;
  voteOngoing = true;
  numberOfVoters = 0;
}

function getVoteDetails() public view returns(address _owner, string _name, string _description){
  return (owner, voteName, voteDescription);
}

//Let a voter cast thier vote. 1 is a vote for and 0 is a vote against
function castVote(uint _vote) public votingOpen(){
  // check address has not already registerd a vote
  require(voters[msg.sender] == 0x0);
  // add address into voters mapping
  voters[msg.sender] = msg.sender;
  //ensure a valid value is passed in the argument
  require(_vote == 1 || _vote == 0);
  // register the vote
  results[msg.sender] = _vote;
  // track the results
  if(_vote == 1){
    currentVotesFor++;
  } else {
    currentVotesAgainst++;
  }
  numberOfVoters++;
}

// allow the owner to close the voting
function closeVote() public onlyOwner() votingOpen(){
  voteOngoing = false;
}

// get the results
function getResults()  public view votingClosed() returns (bool){
    return (currentVotesFor>currentVotesAgainst);
}


}
