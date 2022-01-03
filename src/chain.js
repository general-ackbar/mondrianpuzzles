//export const address = "0x"; // mainnet
export const contract_addr = "0x97DF82De8554CA6379CF17b364baece0A4F6bf2F"; // rinkeby
export const InfuraID = "ebe23694ab8d46f0a4c82a3581f854da"; 

export const contract_abi = 
[
    {
        inputs: [],
        name: "price",
        outputs: [
        {
            internalType: "uint256",
            name: "",
            type: "uint256"
        }
        ],    
        type: "function",
        constant: true
    },
    {
        name: "mintForOther",
        inputs: [
        {
            internalType: "address",
            name: "walletAddress",
            type: "address"
        }
        ],
        outputs: [],
        stateMutability: "payable",
        type: "function",
        payable: true
    },
    {
        inputs: [],
        name: "mintForSelf",
        outputs: [],
        stateMutability: "payable",
        type: "function",
        payable: true
    },
    {
        inputs: [],
        name: "mintForFree",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
        payable: false
    },
    {
        inputs: [],
        name: "MAX_SUPPLY",
        outputs: [
          {
            internalType: "uint16",
            name: "",
            type: "uint16"
          }
        ],
        type: "function",
        constant: true
      },
      {
        inputs: [],
        name: "YEARLY_SUPPLY",
        outputs: [
          {
            internalType: "uint16",
            name: "",
            type: "uint16"
          }
        ],
        stateMutability: "view",
        type: "function",
        constant: true
      },
      {
        inputs: [],
        name: "YEARLY_FREE_SUPPLY",
        outputs: [
          {
            internalType: "uint16",
            name: "",
            type: "uint16"
          }
        ],
        stateMutability: "view",
        type: "function",
        constant: true
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address"
          }
        ],
        stateMutability: "view",
        type: "function",
        constant: true
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [
          {
            internalType: "uint16",
            name: "Amount",
            type: "uint16"
          }
        ],        
        type: "function",
        constant: true
      },
      {
        inputs: [],
        name: "currentYearSupply",
        outputs: [
          {
            internalType: "uint16",
            name: "Amount",
            type: "uint16"
          }
        ],        
        type: "function",
        constant: true
      },
      {
        inputs: [],
        name: "availableFreebies",
        outputs: [
          {
            internalType: "uint16",
            name: "Amount",
            type: "uint16"
          }
        ],        
        type: "function",
        constant: true
      },
      {
        inputs: [],
        name: "withdrawAll",
        outputs: [],
        stateMutability: "payable",
        type: "function",
        payable: true
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "destination",
            type: "address"
          }
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256"
          }
        ],
        name: "tokenURI",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string"
          }
        ],
        stateMutability: "view",
        type: "function",
        constant: true
      }
  ];

  