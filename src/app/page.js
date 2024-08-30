"use client";
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const contractAddress = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';
const contractABI = [
  // Add your contract ABI here
];

export default function Home() {
  const [account, setAccount] = useState('');
  const [votes, setVotes] = useState({ candidate1: 0, candidate2: 0 });
  const [contract, setContract] = useState(null);

  useEffect(() => {
    connectWallet();
  }, []);

  async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const votingContract = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(votingContract);

        updateVotes();
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log('Please install MetaMask');
    }
  }

  async function updateVotes() {
    if (contract) {
      const [candidate1Votes, candidate2Votes] = await contract.getVotes();
      setVotes({
        candidate1: candidate1Votes.toNumber(),
        candidate2: candidate2Votes.toNumber(),
      });
    }
  }

  async function vote(candidateId) {
    if (contract) {
      try {
        const tx = await contract.vote(candidateId);
        await tx.wait();
        updateVotes();
      } catch (err) {
        console.error(err);
      }
    }
  }

  return (
    <div>
      <h1>Web3 Voting App</h1>
      {account ? (
        <>
          <p>Connected account: {account}</p>
          <h2>Current Votes</h2>
          <p>Candidate 1: {votes.candidate1}</p>
          <p>Candidate 2: {votes.candidate2}</p>
          <button onClick={() => vote(1)}>Vote for Candidate 1</button>
          <button onClick={() => vote(2)}>Vote for Candidate 2</button>
        </>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}