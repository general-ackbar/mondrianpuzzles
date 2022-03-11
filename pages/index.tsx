import Head from 'next/head'


import { useState, useEffect } from "react";
import styles from '../styles/Main.module.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";


import  Modal from '../components/modal';
import Loader from "react-loader-spinner";
import  Puzzle  from '../components/puzzle';

import { Web3ReactProvider, useWeb3React } from "@web3-react/core";
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

import {contract_abi, contract_addr, InfuraID, network } from '../src/chain'

import { Contract } from '@ethersproject/contracts'
import { Web3Provider } from "@ethersproject/providers";
import { ethers } from 'ethers';

const iConn = new InjectedConnector({   
  supportedChainIds: [1, 4]
});

const wcConn = new WalletConnectConnector({
  infuraId: InfuraID,
  supportedChainIds: [1,4]  
});



function Home() {

  
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [contract, setContract] = useState<Contract | null>(null); 
  const [availableFreebies, setAvailableFreebies] = useState<number>(0);
  const [totalTokens, setTotalTokens] = useState<number>(0);
  const [tokensPerYear, setTokensPerYear] = useState<number>(0);
  const [mintedTokensTotal, setMintedTokensTotal] = useState<number>(0);
  const [mintedTokensYear, setMintedTokensYear] = useState<number>(0);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [toAddress, setToAddress] = useState<string | null>(null);
  const [mintedTokenImage, setMintedTokenImage] = useState<string | undefined>(undefined);
  const [mintedTokenID, setMintedTokenID] = useState<number>(0);
  const [mintedTokenScore, setMintedTokenScore] = useState<number>(0);
  const [mintedTokenRects, setMintedTokenRects] = useState<number>(0);
  const [requestedToken, setRequestedToken] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);


  const { activate, active, library, connector, account, deactivate } = useWeb3React(); 
  

  /*
  useEffect(() => {
    var provider = new ethers.providers.InfuraProvider(network, InfuraID);    
    const contract = new Contract(contract_addr, contract_abi, provider);

    const callPromise = contract.callStatic.tokenURI(0);
    callPromise.then(function(result:any) {
        const decodedJson = Buffer.from(result.substring(29), "base64");        
        const json = JSON.parse(decodedJson.toString('ascii'));
//        console.log(json.attributes);

        console.log(json.image);
      }, handleError);
    
  }, []);
*/

  useEffect(() => {
  
    var provider = new ethers.providers.InfuraProvider(network, InfuraID);    
    const contract = new Contract(contract_addr, contract_abi, provider);
    setContract(contract);

    contract.callStatic
      .total()      
      .then((res) => {  
        setMintedTokensTotal(res);
      }, handleError);


    contract.callStatic
      .YEARLY_SUPPLY()      
      .then((res) => {
        setTotalTokens(res * 5);
        setTokensPerYear(res);
      }, handleError);

    contract.callStatic
      .currentYearSupply()      
      .then((res) => {
        setMintedTokensYear(res);
      }, handleError);
  }, [transactionHash]);

  useEffect(() => {
    if(!contract) return;
    contract.callStatic
      .currentYearFreeSupply()      
      .then((res) => {     
        setAvailableFreebies( (tokensPerYear/256) - res );
      }, handleError);
  }, [tokensPerYear]);
  

  useEffect(() => {
    if(!library) { return };
    
    const contract = new Contract(contract_addr, contract_abi, library.getSigner());
    setContract(contract);

    contract.callStatic
      .owner()      
      .then((res) => {
        if(res == account)        
        {
          console.log(account);
          console.log(res);
          setIsOwner(true);
          console.log("This is an owner account");
        }
      }, handleError);


  }, [account, success]);


  /*
  useEffect(() => {
    if(transactionHash)
    {
      alert("You succesfully minted a token" + transactionHash);
    }
  }, [transactionHash]);
  */

  function getTokenImageFromID(tokenID:number) {

    if(!contract) {console.log("no contract"); return;   } 
    
    setIsBusy(true);
    setError(null);

    const callPromise = contract.callStatic.tokenURI(tokenID);
    callPromise.then(function(result:any) {
        const decodedJson = Buffer.from(result.substring(29), "base64");        
        const json = JSON.parse(decodedJson.toString('ascii'));
        console.log(json.attributes);
        setMintedTokenID(tokenID); 
        setMintedTokenScore(json.attributes[0].value);
        setMintedTokenRects(json.attributes[2].value);
        setMintedTokenImage(json.image);    
        setShowModal(true);        
        setIsBusy(false); 
      }, handleError);
  }

  function handleError(err:Error) {
    //console.error(err);
    setIsBusy(false);
    setSuccess(false);
    setError(err);
    console.log(err.message);
  }

  function mintForFree()
  {
    if(!contract) return;    
    setIsBusy(true);
    setError(null);

    const sendPromise = contract.mintForFree({from: account, value: ethers.utils.parseEther("0.0")});
    sendPromise.then(function(transaction:any) {
      if(transaction.hash != "") {
        setTransactionHash(transaction.hash);
        setSuccess(true);  
      }
      setIsBusy(false);             
    }, handleError);
  }

  function mint() {
    if(!contract) return;    
    setIsBusy(true);
    setError(null);
    
    contract.mintFor(account,
      { 
        from: account,         
        value: ethers.utils.parseEther("0.01") 
      })
      .then(function(transaction:any) {
        if(transaction.hash != "") {
          setTransactionHash(transaction.hash);
          setSuccess(true);  
        }
        setIsBusy(false);            
      }, handleError);
  } 

  function ownerMint() {
    if(!contract) return;    
    setIsBusy(true);
    setError(null);
    
    console.log(toAddress);

    contract.mint(toAddress,  
            { 
              from: account                          
            }
          )
          .then(function(transaction:any) {
            console.log("Transaction hash: " + transaction.hash);
            if(transaction.hash != "") {
              setTransactionHash(transaction.hash);
              setSuccess(true);  
            }
            setIsBusy(false);            
          }, handleError);
  } 

  function withdrawAll() {
    if(!contract) return;
    setIsBusy(true);
    setError(null);
    
    contract.withdrawAll(
    { 
      from: account, 
    })
    .then(function(transaction:any) {
      console.log("Transaction hash: " + transaction.hash);
      if(transaction.hash != "") {
        setTransactionHash(transaction.hash);
        setSuccess(true);  
      }
      setIsBusy(false);            
    }, handleError);
  }
  

  function getTokenImageFromHash(hash:string)
  {
    var provider = new ethers.providers.InfuraProvider(network, InfuraID);    
    provider.getTransactionReceipt(hash).then(function(transactionReceipt) {

      if(!transactionReceipt)
      {
        alert("Token not ready yet. Please try again in a short while.");
        return;
      }
      const tokenID = (parseInt(transactionReceipt.logs[0].topics[3], 16));
      console.log("TokenID: " + tokenID);
      setMintedTokenID(tokenID);
      getTokenImageFromID(tokenID);

    }); 
  }

  function refresh()
  {
    window.location.reload();
  }

  function displayExistingToken()
  {    
    const isNumber:RegExp = new RegExp("^[0-9]+$");
    //const isHash:RegExp = new RegExp("^0x\\w{64}$");
    const isHash:RegExp = new RegExp("^0x([A-Fa-f0-9]{64})$");
    if(isNumber.test(requestedToken))
    {
      const tokenID = parseInt(requestedToken);
      getTokenImageFromID(tokenID);
      window.scrollTo(0, 0);
    } else if(isHash.test(requestedToken))
    {
      getTokenImageFromHash(requestedToken);
      window.scrollTo(0,0);
    }
    else
      console.log("Neither a valid number or a valid hash");
    
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Mondrian Puzzles</title>
        <meta name="description" content="Project site for NFT Mondrian Puzzles" />
        <link rel="icon" href="/favicon.ico" />          
      </Head>

    <main className={styles.content}>
    <div>
    { isBusy && (
      <div className={styles.spinner}>
        <Spinner />
      </div>
      
    )

    }
    </div>
    <h1 className={styles.mainHeadline}>Mondrian Puzzles_</h1>
    <p>
      Mondrian Puzzles are dynamic heuristically solutions to the Mondrian Puzzles. They are fully generated and stored tokens on the chain and each represent a randomly generated solution that evolves with the Ethereum chain.
      <br />
      <br />
      Connect your wallet to start minting.
    </p>
    <div id="modal-root"></div>
    <div className={styles.chainSection}>
      { !active && (                  
        <ConnectButtons activate={activate} handleError={handleError} markBusy={setIsBusy} />      
      )}
      { active && (
        <code>Connected with wallet address '{account}'</code>
      )}      
      { active && (
        <div className={styles.mint}>
        <TransactionButton 
          disabled={mintedTokensYear == tokensPerYear}
          onClick={mint}
          >Mint puzzle (0.01 E)
        </TransactionButton>
        </div>
      )}
      { active && availableFreebies > 0 && (
        <div className={styles.mint}>
        <TransactionButton 
          disabled={availableFreebies == 0}
          onClick={mintForFree}
          >Apply for freebie
        </TransactionButton>
        </div>
      )}      
      { active && transactionHash &&
      (
        <div>
          The transaction finished with the hash <code className={ success && !error ? styles.success : styles.error }>{ transactionHash }</code>.<br />          
          You can look up the transaction on EtherScan by using <a className={styles.link} href=  { 'https://etherscan.io/tx/' + transactionHash } target='_blank' >this link</a><br />    
          <br />
          If you are using Rainbow wallet a snapshot of the puzzle should show up in your app in a short while. If using other wallets you will have to rely on other services such as <a href="https://opensea.io/collection/mondrian-puzzles" target="_blank">OpenSea</a> to view the puzzle. Please keep in mind that OpenSea, Rainbow Wallet and other services only shows a snapshot. The entire puzzle solution is constantly evolving.
          Once the transaction is fully processed you may also view a snapshot of the puzzle here: <a className={styles.link} onClick={() => getTokenImageFromHash(transactionHash)}>view token</a>
          <br />          
        </div>
      )
      }
        <TokenStats 
          availableFreebies={availableFreebies} 
          mintedTokensTotal={mintedTokensTotal} 
          mintedTokensYear={mintedTokensYear} 
          tokensPerYear={tokensPerYear} 
          totalTokens={totalTokens}   
        />                
      { active && isOwner && (
        <div className={styles.owner}>
          <label>Owner-retricted function:</label>
          <br />
          <TransactionButton 
            disabled={!isOwner}
            onClick={withdrawAll}
            >Withdraw
          </TransactionButton>
          <br />
          <TransactionButton 
              disabled={!isOwner}
              onClick={ownerMint}
              >Owner mint
            </TransactionButton>
          <form>
            <input type="text" 
              className={styles.transactionElement} 
              placeholder='receiver address' 
              onChange={event => setToAddress(event.target.value)} 
            />
          </form>
        </div>
      )}
      { active && (
        <DisconnectButton deactivate={deactivate} handleError={handleError} />
      )}
    </div>
    
    <h2 className={styles.headline}>What are Mondrian Puzzles?</h2>
    <p>
      Well, the Mondrian Puzzle is a puzzle that requires rectangles tiling a integer-sided square. All rectangles within the square must be integer sided and pairwise non-congruential. The aim is to fill the square with such rectangles in a way so that the difference between the area of the largest and the area of the smalles rectangles are kept at a minimum. The ultimate challenge consists in finding a tiling that has the lowest score possible.  Each puzzle is unique and by using the natuaral evolution of the block chain it will use a heuristic approach to lower the score.
    </p>
    { (
    <div className={styles.puzzles}>          
      <Puzzle width={300} height={300} noOfRectangles={12}  />
      <Puzzle width={300} height={300} noOfRectangles={8}  />    
    </div>
    )}
    <h2 className={styles.headline}>Why?</h2>
    <p>
      I am by no means either an artist nor a mathematician, but I have delt with both areas and am fashinated by them. Especially I have been intrigued by geometric art from the beginning of the 20th century and generative and concrete art from the 1960s. 
      Also I am fascinated by computer assisted visual creations and have deployed my programming skills to make tools for melty beads patterns, pixel art, cross stitches, CNC/Laser-cutting, video mosaics and much more.
      To me the possibility to create NFTs on the block chain, combines to two worlds beautifully and so this is my first attempt to make something that 
    </p>

    <h2 className={styles.headline}>Background</h2>
    <p>
      The Mondrian Puzzle of course derives from the dutch painter Piet Mondrian, who is well known for his colorful and abstract art. Mondrian was intrigued be the abstract and non-figurative and developed an art style where his artistic expression was "reduced" to simple geometric shapes. 
      Many of his geometric works has stringency to them that appeals to the minds of mathematicians and from conjunction of the artistic mind and the mathematical minds the Mondrian Puzzle did emerge.
    </p>

    <h2 className={styles.headline}>Any questions?</h2>
    <h3>What does "on chain" means?</h3>
    <p>
      It means that all calculations and the token it self - including the metadata and actual artwork - is stored on the Ethereum Blockchain. Therefore it's codebase is immutable and can never be changed or removed unless the entire blockchain shuts down. 
      Many NFTs only stores a seed or the metadata on the chain while generating and storing the art work on either centralized servers or perhaps decentralized. While theres nothing wrong in that, there is a chance that the connection between the token and the artwork is broken if the centralized server is down or removed.
    </p>

    <h3>How are the puzzles generated?</h3>
    <p>
      The puzzles are generated from a rather simple algorithm that fills a predefined integersided-square with rectangles according to the "rules" of the Mondrian Puzzle. The size, place and colors of the puzzles are generated randomly based on a seed.
      You can look up the code on Etherscan.
    </p>

    <h3>How many are there?</h3>
    <p>
      Each year a total of 1024 puzzles can be minted (created). When the grand total reaches 5120 puzzles the supply ends and it will no longer be able to mint new puzzles - not even by me. 
      You might find some on <a href="https://opensea.io/collection/mondrian-puzzles" target="_blank">Opensea.io</a> though.
    </p>
    <h3>How much is it?</h3>
    <p>
      You can mint a Puzzle for 0.01 ETH. At the very beginning of each year, there will be a few give aways - or rather the minting is free but the gas fee still applies.
      There are no restrictions to the give-aways, but if you are one of the lucky ones, I hope you will take only one and leave the rest for others.
    </p>

    <h3>So how do I buy one?</h3>
    <p>
    If you're here you're most likely familiar with NFTs and crypto currencies. But in case you're not, the the first thing you will need is an Ethereum wallet. Metamask is probably one of the easiest to get started with, but for NFTs I personally prefer Rainbow as it displays you tokens nicely :). Then you need to connect you wallet to this site using one of the button above (please note that Metamask is only available in Chrome). Once connected the mint-buttons will show up and you can start minting - provided you have at least 0.01 ether in your wallet.
    </p>

    <h3>Now I bought one, how can I revisit it?</h3>
    <p>
      There are several ways to retrieve a snapshot of the puzzle once the transaction is fully processed. If you are familiar with EtherScan you can alway use that to interact with the contracts <code>tokenURI()</code> method which will give you the current state of the puzzle. If you are using Rainbow wallet, a snapshot of the puzzle is displayed directly in the wallet and you can also find it on OpenSea.io. 
    </p>
      { true && (
          <div>If you extract the <code>transaction hash</code> or the <code>tokenID</code> from your wallet you can also look it up using the feature below (please connect first).
          <form>
          <input type="text" 
            className={styles.transactionElement} 
            placeholder='tokenID or transaction hash' 
            onChange={event => setRequestedToken(event.target.value)} 
          />
        </form>
        <TransactionButton 
            disabled={!active}
            onClick={displayExistingToken }
            >Retrieve token
          </TransactionButton>
        </div>
      )}
    

    <h3>How about copyrights?</h3>
    <p>
      The contract code, IP and resulting assets are all Public Domain. Feel free to build upon the project in any way you'd like.
    </p>
    <Modal
          title={"Mondrian Puzzle #" + mintedTokenID}
          onClose={() => setShowModal(false)}          
          show={showModal}
        >
          <img className={styles.tokenSnap} src={mintedTokenImage} />
          <code>Token ID: {mintedTokenID}</code><br />
          <code>Current mondrian score <em>{mintedTokenScore}</em> using <em>{mintedTokenRects}</em> rectangles</code><br />
          <span className={styles.tokenInfo}>You can right-click and save the image but please note that it's only a snapshot of the current state. However it makes it easier to display it elsewhere</span>
    </Modal>


      </main>
      <footer className={styles.footer}>      
      </footer>
    </div>

  )  
}

function getLibrary(provider:any) {
  return new Web3Provider(provider);
}

function ConnectButtons({ activate, handleError, markBusy }) {    
  return (
    <>        
        <button
          className={styles.connect}
          onClick={ () => {
              markBusy(true);
              try {
                activate(iConn);
              } catch (error) {
                handleError(error);
              }       
              markBusy(false);
            }
          }          
        >
          <img src="/assets/MetaMask.png" />            
        </button>
        <button
          className={styles.connect}
          onClick={ () => {
              markBusy(true);
              try {
                activate(wcConn);
              } catch (error) {
                handleError(error);
              }       
              markBusy(false);
            }
          }  
        >
          <img src="/assets/WalletConnect.png" />
        </button>
    </>
  );
}

function DisconnectButton({ deactivate, handleError })
{
  return(
  <>
    <button 
      className={styles.disconnect}
      onClick={ () => {
        try {
          deactivate();  
        } catch (error) {
          handleError(error);
        }       
      }
    }
    >
      Disconnect Wallet
    </button>
  </>
  );
}

function TransactionButton({ ...options }) {
  return (
    <button className={styles.transactionElement}        
      {...options}
    />
  );
}

function TokenStats({mintedTokensTotal, totalTokens, mintedTokensYear, tokensPerYear, availableFreebies} : {mintedTokensTotal:number, totalTokens:number, mintedTokensYear:number, tokensPerYear:number, availableFreebies:number})
{  
  
  return (
    <div className={styles.stats}>          
      <span className={styles.info}>Tokens: { mintedTokensTotal } / { totalTokens }</span>
      <span className={ (mintedTokensYear < tokensPerYear ? styles.info : styles.unavailable )}>Minted this year: { mintedTokensYear } / { tokensPerYear } </span>
      <span className={ (availableFreebies > 0 ? styles.info : styles.unavailable )}>Available freebies this year: { availableFreebies } </span>
    </div>
  );
}

function Spinner()
{
  return (
    <Loader
      type="ThreeDots"
      color="#00BFFF"
      height={80}
      width={80}
  />
  );
}



export default function () {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Home />
    </Web3ReactProvider>
  );
}