// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract RealEstate {
    address public owner;

    enum UserType { Tenant, Owner }
    enum PropertyType { House, Office }
    enum IssueStatus { Reported, Accepted, Rejected }

    struct User {
        UserType userType;
        string name;
        string contactInfo;
    }

    struct Property {
        string description;
        PropertyType propertyType;
        address owner;
        uint256 lastContractCreationTime;
    }

    struct Rental {
        address tenant;
        uint256 propertyId;
        string startDate;
        string endDate;
    }

    struct Issue {
        uint256 rentalId;
        string description;
        IssueStatus status;
    }

    mapping(address => User) public users;
    mapping(uint256 => Property) public properties;
    mapping(uint256 => Rental) public rentals;
    mapping(uint256 => Issue) public issues;

    uint256 public propertyCount;
    uint256 public rentalCount;
    uint256 public issueCount;

    uint256 public constant contractCreationCooldown = 365 days;

    constructor() {
        owner = msg.sender;
        addDemoRentalsAndIssues();
    }

    function registerUser(UserType _userType, string memory _name, string memory _contactInfo) public {
        users[msg.sender] = User(_userType, _name, _contactInfo);
    }

    function addProperty(string memory _description, PropertyType _propertyType) public {
        require(msg.sender == owner, "Only the owner can add a property");
        properties[propertyCount++] = Property(_description, _propertyType, msg.sender, 0);
    }

function addDemoRentalsAndIssues() public {
    // Add 3 house rentals
    addProperty("House Rental 1", PropertyType.House);
    rentProperty(propertyCount - 1, "2022-01-01", "2022-12-31");
    reportIssue(rentalCount - 1, "Issue with House Rental 1");
    resolveIssue(issueCount - 1, IssueStatus.Accepted);

    addProperty("House Rental 2", PropertyType.House);
    rentProperty(propertyCount - 1, "2022-01-01", "2022-12-31");
    reportIssue(rentalCount - 1, "Issue with House Rental 2");
    resolveIssue(issueCount - 1, IssueStatus.Rejected);

    addProperty("House Rental 3", PropertyType.House);
    rentProperty(propertyCount - 1, "2022-01-01", "2022-12-31");
    reportIssue(rentalCount - 1, "Issue with House Rental 3");
    resolveIssue(issueCount - 1, IssueStatus.Accepted);

    // Add 2 office rentals
    addProperty("Office Rental 1", PropertyType.Office);
    rentProperty(propertyCount - 1, "2022-01-01", "2022-12-31");
    reportIssue(rentalCount - 1, "Issue with Office Rental 1");
    resolveIssue(issueCount - 1, IssueStatus.Rejected);

    addProperty("Office Rental 2", PropertyType.Office);
    rentProperty(propertyCount - 1, "2022-01-01", "2022-12-31");
    reportIssue(rentalCount - 1, "Issue with Office Rental 2");
    resolveIssue(issueCount - 1, IssueStatus.Accepted);
}

    function rentProperty(uint256 _propertyId, string memory _startDate, string memory _endDate) public {
        // Check if the property exists
        require(_propertyId < propertyCount, "Property does not exist");

        // Create a new rental
        rentals[rentalCount++] = Rental(msg.sender, _propertyId, _startDate, _endDate);

        // Update the last contract creation time of the property
        properties[_propertyId].lastContractCreationTime = block.timestamp;
    }

    function reportIssue(uint256 _rentalId, string memory _description) public {
        issues[issueCount++] = Issue(_rentalId, _description, IssueStatus.Reported);
    }

    function resolveIssue(uint256 _issueId, IssueStatus _status) public {
        Issue storage issue = issues[_issueId];
        Rental storage rental = rentals[issue.rentalId];
        Property storage property = properties[rental.propertyId];

        require(msg.sender == property.owner, "Only the property owner can resolve the issue");
        issue.status = _status;

        if (_status == IssueStatus.Accepted) {
            property.lastContractCreationTime = block.timestamp + contractCreationCooldown;
        }
    }
}