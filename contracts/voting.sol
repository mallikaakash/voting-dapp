// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    mapping(address => bool) public voters;
    uint256 public candidate1Votes;
    uint256 public candidate2Votes;

    function vote(uint256 _candidateId) public {
        require(!voters[msg.sender], "Already voted");
        require(_candidateId == 1 || _candidateId == 2, "Invalid candidate");

        voters[msg.sender] = true;

        if (_candidateId == 1) {
            candidate1Votes++;
        } else {
            candidate2Votes++;
        }
    }

    function getVotes() public view returns (uint256, uint256) {
        return (candidate1Votes, candidate2Votes);
    }
}