// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "hardhat/console.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/Math.sol";
/**
 * @title Owner
 * @dev Set & change owner
 */
contract DaoJones {
    using Math for uint256;

    address private owner;
    mapping(address => uint) public dao_scores; // All interest rates are to two decimal places
    mapping(address=> uint) public user_balances;
    mapping(address=> uint) public dao_balances;
    address[] private users;
    mapping(address=> bool) public added_to_users;
    //mapping(address=>uint) public dao_blocknumbers; //Interest compounds every 1000 blocks
    uint public principal;
    uint min_score=1000;
    uint max_score=0;

    // event for EVM logging
    //event OwnerSet(address indexed oldOwner, address indexed newOwner);

    // modifier to check if caller is owner
    modifier isOwner() {
        // If the first argument of 'require' evaluates to 'false', execution terminates and all
        // changes to the state and to Ether balances are reverted.
        // This used to consume all gas in old EVM versions, but not anymore.
        // It is often a good idea to use 'require' to check if functions are called correctly.
        // As a second argument, you can also provide an explanation about what went wrong.
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    /**
     * @dev Set contract deployer as owner
     */
    constructor(address[] memory daos, uint[] memory scores) {
        console.log("Owner contract deployed by:", msg.sender);
        require(daos.length==scores.length, "Must have a rate for every dao");
        owner = msg.sender;
        for(uint i=0;i<daos.length;i++) {
            if (scores[i]>max_score) {
                max_score = scores[i];
            }
            if (scores[i]<min_score) {
                min_score = scores[i];
            }
            dao_scores[daos[i]] = scores[i];
        }
        // 'msg.sender' is sender of current call, contract deployer for a constructor
        //emit OwnerSet(address(0), owner);
    }

    function setScore(address dao, uint rate) public isOwner {
        require(dao_scores[dao]!=0, "Dao must already be included in contract");
        dao_scores[dao] = rate;
    }
    function deposit() payable external {
        if (added_to_users[msg.sender]==false) {
            users.push(msg.sender);
            added_to_users[msg.sender] = true;
        }
        user_balances[msg.sender]+=msg.value;
        principal+=msg.value;
    }
    function withdraw(uint amount) external {
        uint amount_withdrawable = user_balances[msg.sender];
        require(amount<=amount_withdrawable, "You can't withdraw that much!");
        require(amount<=address(this).balance, "The contract doesn't currently have the funds to return you that much. Go beat up some daos for us.");
        
        user_balances[msg.sender]-=amount;
        principal-=amount;
        payable(msg.sender).transfer(amount);
    }
    function takeLoan(uint amount, address payable target) external  {
        require (dao_scores[msg.sender]!=0, "Must be a DAO to take out a loan");
        require(dao_balances[msg.sender]==0, "must pay back outstanding loans to get a new one");
        require(amount<=address(this).balance, "Contract cannot currently give that amount");

        uint rate = calculateRate(amount,msg.sender);
        dao_balances[msg.sender]+=(amount*(10000+rate)/10000);
        uint amount_left = amount;
        for (uint i=0;i<users.length;i++) {
            uint amount_increment = amount_left.min((user_balances[users[i]]*amount)/principal);
            user_balances[users[i]]-=amount_increment;
            amount_left-=amount_increment;
        }
        principal-=amount;
        target.transfer(amount);
    }
    function  calculateRate(uint amount, address target) public view returns (uint) {
        uint utilization = (amount*10000)/(address(this).balance);//Remember this is the utilization multiplied by 10000
        uint increment = (utilization * (max_score - min_score))/10000;
        uint rate = (utilization*100)/((dao_scores[target]-min_score+increment)*100/(max_score-min_score));
        return rate;
    }
    function payLoan() payable external {
        uint amount = msg.value;
        require (dao_scores[msg.sender]!=0, "Must be a DAO to pay back a loan");
        require(amount<=dao_balances[msg.sender], "Don't give us charity!");
        uint amount_left = amount;
        for (uint i=0;i<users.length;i++) {
            uint increment = amount_left.min((user_balances[users[i]]*amount)/principal);
            user_balances[users[i]]+=increment;
            amount_left-=increment;
        }
        principal+=amount;
        dao_balances[msg.sender]-=amount;
    }
    /**
     * @dev Return owner address 
     * @return address of owner
     */
    function getOwner() external view returns (address) {
        return owner;
    }
} 
