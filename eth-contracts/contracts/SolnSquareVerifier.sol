pragma solidity >=0.4.21 <0.6.0;
import "./ERC721Mintable.sol";
import "openzeppelin-solidity/contracts/utils/Address.sol";
import "./Verifier.sol";

// TODO - Completed - define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract SquareVerifier is Verifier { }

// TODO  - Completed - define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is RempToken {
      SquareVerifier public contractVerifier;

    constructor(
        address verifierAddress,
        string memory name,
        string memory symbol
    ) public RempToken(name, symbol) {
        contractVerifier = SquareVerifier(verifierAddress);
    }

    // TODO  - Completed - define a solutions struct that can hold an index & an address
    struct solutions {
        uint256 solutionIndex;
        address solutionAddress;
    }

    // TODO - Completed - define an array of the above struct
    solutions[] private solutionsArray;

    // TODO - Completed - define a mapping to store unique solutions submitted
    mapping(bytes32 => solutions) uniqueSolutions;

    // TODO - Completed - Create an event to emit when a solution is added
    event solutionAdded(uint256 index, address solutionAddress);

    // TODO - Completed - Create a function to add the solutions to the array and emit the event
    function addSolution(address _solutionAddress, uint256 _index, bytes32 _key) internal 
    {
        solutions memory _soln = solutions({
            solutionIndex : _index,
            solutionAddress : _solutionAddress
        });

        solutionsArray.push(_soln);
        uniqueSolutions[_key] = _soln;
        emit solutionAdded(_index, _solutionAddress);
    }

    // TODO - Completed - Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly

    function canMintNftToken(address to, uint256 tokenId, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public returns(uint256) {

        require(contractVerifier.verifyTx(a,b,c,input), "Unable verify contract!");
        bytes32 key = keccak256(abi.encodePacked(a,b,c,input));
        require(uniqueSolutions[key].solutionAddress == address(0), "Requires a unique solution!");
        addSolution(to, tokenId, key);
    }

    function mintNftToken(address to, uint256 tokenId, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public returns(uint256) {

        bytes32 key = keccak256(abi.encodePacked(a,b,c,input));
        require(uniqueSolutions[key].solutionAddress == address(0), "Requires a unique solution!");
        require(contractVerifier.verifyTx(a,b,c,input), "Unable verify contract!");
        addSolution(to, tokenId, key);
        super.mint(to, tokenId);
    }
}



  


























