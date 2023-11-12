import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import RealEstate from '../contracts/RealEstate.json';
import contractAddress from '../contracts/contract-address.json';

let provider;
let signer;

async function connectWallet(setTenant) {
  if (window.ethereum) {
    try {
      // Request account access
      await window.ethereum.enable();
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      console.log("Contract address:", contractAddress.realEstate);
      const realEstate = new ethers.Contract(contractAddress.realEstate, RealEstate.abi, signer);
      const connectedAddress = await signer.getAddress();
      setTenant(connectedAddress);
      return realEstate.connect(signer).address;
    } catch (error) {
      // User denied account access
      console.error("User denied account access");
      alert("You need to allow the Dapp to connect to your MetaMask wallet for the Dapp to work correctly.");
    }
  } else {
    console.log('No Ethereum browser extension detected, install MetaMask!');
  }
}

function RentForm() {
  const [propertyType, setPropertyType] = useState('House');
  const [tenant, setTenant] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [street, setStreet] = useState('');
  const [buildingNo, setBuildingNo] = useState('');
  const [apartmentNo, setApartmentNo] = useState('');
  const [owner, setOwner] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rentals, setRentals] = useState([]);
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    fetchRentalsAndIssues();
  }, []);

  async function fetchRentalsAndIssues() {
    try {
      const realEstate = new ethers.Contract(contractAddress.realEstate, RealEstate.abi, provider);
      
      // Fetch rentals
      const rentalCount = await realEstate.rentalCount();
      const fetchedRentals = [];
      for (let i = 0; i < rentalCount; i++) {
        const rental = await realEstate.rentals(i);
        fetchedRentals.push(rental);
      }
      setRentals(fetchedRentals);
  
      // Fetch issues
      const issueCount = await realEstate.issueCount();
      const fetchedIssues = [];
      for (let i = 0; i < issueCount; i++) {
        const issue = await realEstate.issues(i);
        fetchedIssues.push(issue);
      }
      setIssues(fetchedIssues);
    } catch (error) {
      console.error("Error fetching rentals and issues:", error);
    }
  }

  const rent = async (event) => {
    event.preventDefault();
    const realEstate = new ethers.Contract(contractAddress.realEstate, RealEstate.abi, signer);
    const propertyCount = await realEstate.propertyCount();
    const tx = await realEstate.rentProperty(propertyCount - 1, startDate, endDate);
    await tx.wait();
    fetchRentalsAndIssues();
  };

  const handleConnectWallet = async () => {
    await connectWallet();
  };

  return (
    <div className="container mt-5">
      <h2>Rent Property</h2>
      <button onClick={handleConnectWallet} className="btn btn-success">Connect Wallet</button>
      <form onSubmit={rent} className="mt-4">
        <div className="form-group">
          <label>Property Type</label>
          <select className="form-control" value={propertyType} onChange={e => setPropertyType(e.target.value)}>
            <option value="House">House</option>
            <option value="Office">Office</option>
          </select>
        </div>
        <div className="form-group">
          <label>Tenant</label>
          <input type="text" className="form-control" value={tenant} onChange={e => setTenant(e.target.value)} />
        </div>
        <div className="form-group">
          <label>City</label>
          <input type="text" className="form-control" value={city} onChange={e => setCity(e.target.value)} />
        </div>
        <div className="form-group">
          <label>District</label>
          <input type="text" className="form-control" value={district} onChange={e => setDistrict(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Neighborhood</label>
          <input type="text" className="form-control" value={neighborhood} onChange={e => setNeighborhood(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Street</label>
          <input type="text" className="form-control" value={street} onChange={e => setStreet(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Building No</label>
          <input type="text" className="form-control" value={buildingNo} onChange={e => setBuildingNo(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Apartment No</label>
          <input type="text" className="form-control" value={apartmentNo} onChange={e => setApartmentNo(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Owner</label>
          <input type="text" className="form-control" value={owner} onChange={e => setOwner(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Start Date</label>
          <input type="text" className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label>End Date</label>
          <input type="text" className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Rent</button>
      </form>

      <h3>Rentals:</h3>
      <ul>
        {rentals.map((rental, index) => (
          <li key={index}>
            Tenant: {rental.tenant}<br />
            Property ID: {rental.propertyId}<br />
            Start Date: {rental.startDate}<br />
            End Date: {rental.endDate}
          </li>
        ))}
      </ul>

      <h3>Issues:</h3>
      <ul>
        {issues.map((issue, index) => (
          <li key={index}>
            Rental ID: {issue.rentalId}<br />
            Description: {issue.description}<br />
            Status: {issue.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TerminateForm() {
  const [tenant, setTenant] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [street, setStreet] = useState('');
  const [buildingNo, setBuildingNo] = useState('');
  const [apartmentNo, setApartmentNo] = useState('');
  const [owner, setOwner] = useState('');

  const terminate = async (event) => {
    event.preventDefault();
    const realEstate = new ethers.Contract(contractAddress.RealEstate, RealEstate.abi, signer);
    const tx = await realEstate.terminate(tenant, city, district, neighborhood, street, buildingNo, apartmentNo, owner);
    await tx.wait();
  };

  return (
    <div className="container mt-5">
      <h2>Terminate Rental</h2>
      <form onSubmit={terminate} className="mt-4">
        <div className="form-group">
          <label>Tenant</label>
          <input type="text" className="form-control" value={tenant} onChange={e => setTenant(e.target.value)} />
        </div>
        <div className="form-group">
          <label>City</label>
          <input type="text" className="form-control" value={city} onChange={e => setCity(e.target.value)} />
        </div>
        <div className="form-group">
          <label>District</label>
          <input type="text" className="form-control" value={district} onChange={e => setDistrict(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Neighborhood</label>
          <input type="text" className="form-control" value={neighborhood} onChange={e => setNeighborhood(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Street</label>
          <input type="text" className="form-control" value={street} onChange={e => setStreet(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Building No</label>
          <input type="text" className="form-control" value={buildingNo} onChange={e => setBuildingNo(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Apartment No</label>
          <input type="text" className="form-control" value={apartmentNo} onChange={e => setApartmentNo(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Owner</label>
          <input type="text" className="form-control" value={owner} onChange={e => setOwner(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-danger mt-3">Terminate</button>
      </form>
    </div>
  );
}

export default function Dapp() {
  
  return (
    <div className="container">
      <h1 className="mt-5">Real Estate Rental Management</h1>
      <div className="row mt-5">
        <div className="col-md-6">
          <RentForm />
        </div>
        <div className="col-md-6">
          <TerminateForm />
        </div>
      </div>
    </div>
  );
}