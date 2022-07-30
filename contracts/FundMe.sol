// SPDX-License-Identifier: MIT
pragma solidity >=0.8.8;

import "./PriceConverter.sol";

error FundMe__NotOwner();

/** @title A Contract for crowd funding
 *  @author Jucel Dorante
 *  @notice This contract is just a demo
 *  @dev This implements price feeds
 */
contract FundMe {
    using PriceConverter for uint256;

    address[] private s_funders;
    mapping(address => uint256) private s_addressToAmountFunded;

    address private immutable i_owner;
    uint256 public constant MINIMUM_USD = 50 * 1e18;

    AggregatorV3Interface private s_priceFeed;

    // Modifier are blocks that we can use in function to pass specify functionalities to execute before their code
    modifier onlyOwner() {
        // require(msg.sender == i_owner, "You are not the owner!");
        if (msg.sender != i_owner) {
            // this is new and more gas efficient
            revert FundMe__NotOwner();
        }
        _; // this is to tell the functions that use the modifier
        // that after execuste the line from above,
        // they need to continue with the function code
    }

    constructor(address _priceFeed) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(_priceFeed);
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    function fund() public payable {
        // Want to be able to set a minimum fund amount in USD
        // 1. Send ETH to this contract
        require(
            msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
            "Didn't send enough"
        ); // 1e18 == 1 * 10 ** 18;
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] = msg.value;

        // emit Funed(msg.sender, msg.value)
    }

    function withdraw() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }

        // reset the array
        s_funders = new address[](0);

        // withdraw the funds

        // transfer
        // payable(msg.sender).transfer(address(this).balance);

        // //send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed");

        //call
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }

    function cheaperWithdraw() public payable onlyOwner {
        address[] memory funders = s_funders;
        for (uint256 i = 0; i < funders.length; i++) {
            address funder = funders[i];
            s_addressToAmountFunded[funder] = 0;
        }

        s_funders = new address[](0);
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success, "Failed");
    }

    function getAddressToAmountFunded(address fundingAddress)
        public
        view
        returns (uint256)
    {
        return s_addressToAmountFunded[fundingAddress];
    }

    function getVersion() public view returns (uint256) {
        return s_priceFeed.version();
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
