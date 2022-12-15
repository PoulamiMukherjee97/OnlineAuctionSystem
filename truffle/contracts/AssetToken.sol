// https://eips.ethereum.org/EIPS/eip-721, http://erc721.org/
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "./ERC721.sol";

contract AssetToken is ERC721 {
    string public name = "ASSET TOKEN";
    string public tokenSymbol = "AST";
    // Mapping from token ID to owner address
    uint256 public totalSupply;
    mapping(uint256 => address) private _owners;

    // Mapping owner address to token count
    mapping(address => uint256) private _balances;

    // Mapping from token ID to approved address
    mapping(uint256 => address) private _tokenApprovals;

    // Mapping from owner to operator approvals
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    constructor(string memory _name, string memory _tokensymbol) {
        name = _name;
        tokenSymbol = _tokensymbol;
    }
    function mint(address to, uint256 tokenId) public virtual {
        require(to != address(0), "ERC721: mint to the zero address");
        require(!_exists(tokenId), "ERC721: token already minted");

        unchecked {
            // Will not overflow unless all 2**256 token ids are minted to the same owner.
            // Given that tokens are minted one by one, it is impossible in practice that
            // this ever happens. Might change if we allow batch minting.
            // The ERC fails to describe this case.
            _balances[to] += 1;
            totalSupply+=1;
        }

        _owners[tokenId] = to;

        emit Transfer(address(0), to, tokenId);

    }
     function burn(uint256 tokenId) public virtual {
        address owner = _owners[tokenId];

        // Clear approvals
        delete _tokenApprovals[tokenId];

        unchecked {
            _balances[owner] -= 1;
            totalSupply -=1;
        }
        delete _owners[tokenId];
        emit Transfer(owner, address(0), tokenId);
    }

    function balanceOf(address _owner) external override view returns (uint256) {
        return _balances[_owner];
    }

    function ownerOf(uint256 _tokenId) external override view returns (address) {
        return _owners[_tokenId];
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes memory data
    ) public override payable {
        require(
            msg.sender == _owners[_tokenId] ||
                _tokenApprovals[_tokenId] == msg.sender || 
                isApprovedForAll(_owners[_tokenId], msg.sender),
            "Sender does not have approval"
        );
        require(
            _owners[_tokenId] == _from,
            "Sender is not owner of particular token"
        );
        require(keccak256(abi.encodePacked((data))) == keccak256(abi.encodePacked((""))), "Should have called the other safeTransferMethod");
        require(address(0) != _to, "Zero Destination Address");
        require( _exists(_tokenId), "Invalid Token Id");
        unchecked {
            _balances[_from] -= 1;
            _balances[_to] += 1;
        }

        _owners[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }
    function _exists(uint256 _tokenId) public view returns(bool){
        return _owners[_tokenId] != address(0);
    }
    function isApprovedForAll(address _owner, address _operator) public override view returns (bool){
        return _operatorApprovals[_owner][_operator];
    }
    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external override payable{
        safeTransferFrom(_from, _to, _tokenId, "");
    }
    function getApproved(uint256 _tokenId) external override view returns (address){
        require(_exists(_tokenId), "Token is invalid");
        return _tokenApprovals[_tokenId];
    }
    function approve(address _approved, uint256 _tokenId) external override payable{
        require(
            msg.sender == _owners[_tokenId] || 
                isApprovedForAll(_owners[_tokenId], msg.sender),
            "Sender does not have approval"
        );
        require(_owners[_tokenId] != _approved, "Approval to current owner");
        if(_tokenApprovals[_tokenId] == address(0)){
            _tokenApprovals[_tokenId] = _approved;
            emit Approval(_owners[_tokenId], _approved, _tokenId);
        }
        else{
            emit Approval(_owners[_tokenId], _tokenApprovals[_tokenId], _tokenId);
        }

    }
    function setApprovalForAll(address _operator, bool _approved) external override{
        require(msg.sender != _operator, "ERC721: approve to caller");
        _operatorApprovals[msg.sender][_operator] = _approved;
        emit ApprovalForAll(msg.sender, _operator, _approved);

    }
    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external override payable{
        safeTransferFrom(_from, _to, _tokenId, "");
    }

}
