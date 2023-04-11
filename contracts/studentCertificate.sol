// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Certification is AccessControl{
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(ADMIN_ROLE, _msgSender());
        _grantRole(MINTER_ROLE, _msgSender());
    }

    struct Certificate {
        string candidate_name;
        string org_name;
        string course_name;
        uint256 expiration_date;
    }

    mapping(bytes32 => Certificate) public certificates;

    event certificateGenerated(bytes32 _certificateId);

    function stringToBytes32(string memory source) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }
        assembly {
                result := mload(add(source, 32))
        }
    }

    function generateCertificate (
        string memory _id,
        string memory _candidate_name,
        string memory _org_name, 
        string memory _course_name, 
        uint256 _expiration_date) public onlyRole(ADMIN_ROLE) {
        bytes32 byte_id = stringToBytes32(_id);
        require(certificates[byte_id].expiration_date == 0, "Certificate with given id already exists");
        certificates[byte_id] = Certificate(_candidate_name, _org_name, _course_name, _expiration_date);
        emit certificateGenerated(byte_id);
    }

    function getData(string memory _id) public view returns(string memory, string memory, string memory, uint256) {
        bytes32 byte_id = stringToBytes32(_id);
        Certificate memory temp = certificates[byte_id];
        require(temp.expiration_date != 0, "No data exists");
        return (temp.candidate_name, temp.org_name, temp.course_name, temp.expiration_date);
    }
}