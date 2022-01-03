function generate(el)
{
  var svg = d3.select(el)
  generateSVG(svg);
}


function connect_metamask()
{        
  if(load())
  {
  d3.select('#connect').remove();
  d3.select('#minting').style("visibility", "visible");
  }  
}

document.addEventListener("DOMContentLoaded", function(e) {
  generateSVG(d3.select("#puzzle_1"));
  generateSVG(d3.select("#puzzle_2"));
  generateSVG(d3.select("#puzzle_3"));
  generateSVG(d3.select("#puzzle_4"));
});



async function init()
{
    if (window.ethereum) {
        App.web3Provider = window.ethereum;
        try {
          // Request account access
          var promise = await window.ethereum.request({ method: "eth_requestAccounts" });;
          if(promise)
          {
            return true;
          }
        } catch (error) {
          // User denied account access...
          console.error("User denied account access")
          return false;
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = window.web3.currentProvider;
        return true;
      }

      window.web3 = new Web3(App.web3Provider);

}

async function load() {
  if( init() )
  {
    window.contract = await loadContract();
    updateStatus('Ready!');
    return true;
  }
  else
    return false;
}

function updateStatus(status) {
  const statusEl = document.getElementById('status');
  statusEl.innerHTML = status;
}


async function mint() {                    
  getAccounts(function(result) {
    updateStatus(`Pending...`);
      const promise = window.contract.methods.mintForSelf().send({from: result[0], value:10000000000000000}).then(function(result)
    {
        updateStatus((result["status"] === "true" ? "success" : "error") + "." + result["gasUsed"] + "gas used");
    });
        }); 
}

async function freeMint() {
  getAccounts(function(result) {
    updateStatus(`Pending...`);
      window.contract.methods.mintForFree().send({from: result[0], value:0}).then(function(result) 
      {
          updateStatus((result["status"] === "true" ? "success" : "error") + "." + result["gasUsed"] + "gas used");
      });
        });
}


function getAccounts(callback) {
    web3.eth.getAccounts((error,result) => {
        if (error) {
            console.log(error);
        } else {
            callback(result);
        }
    });
}

async function loadContract() 
{    
    return await new window.web3.eth.Contract(
      [
        {
        "inputs": [],
        "name": "price",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
        },
        {
        "inputs": [
          {
            "internalType": "address",
            "name": "walletAddress",
            "type": "address"
          }
        ],
        "name": "mintForOther",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function",
        "payable": true
        },
        {
        "inputs": [],
        "name": "mintForSelf",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function",
        "payable": true
        },
        {
        "inputs": [],
        "name": "mintForFree",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
        "payable": false
        }
      ], '0x598C55AeEA0A97E2Bc456C90705A3a77631ba290');
}