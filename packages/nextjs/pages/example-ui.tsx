import React, { ChangeEvent, useState } from "react";

interface TokenDetails {
  owner: string;
  name: string;
  symbol: string;
  decimals: string;
  irs: string;
  ONCHAINID: string;
  irAgents: string;
  tokenAgents: string;
  complianceModules: string;
  complianceSettings: string;
}

interface Errors {
  [key: string]: string;
}

const TokenDetailsInput = () => {
  const [tokenDetails, setTokenDetails] = useState<TokenDetails>({
    owner: "",
    name: "",
    symbol: "",
    decimals: "",
    irs: "",
    ONCHAINID: "",
    irAgents: "",
    tokenAgents: "",
    complianceModules: "",
    complianceSettings: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTokenDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    let error = "";
    if (name === "owner") {
      const isAddress = /^0x[a-fA-F0-9]{40}$/.test(value);
      if (!isAddress) {
        error = "Invalid Ethereum address format";
      } else if (value === "0x0000000000000000000000000000000000000000") {
        error = "Address cannot be the zero address";
      }
    }
    if (name === "name") {
      if (!value.trim()) {
        error = "Name is required.";
      } else if (value.length > 100) {
        // Assuming a max length of 100 for token name
        error = "Name is too long.";
      } else if (!/^[a-zA-Z0-9\s\-_]+$/.test(value)) {
        error =
          "Name contains invalid characters. Only alphanumeric characters, spaces, hyphens, and underscores are allowed.";
      }
    }
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleCopy = () => {
    if (Object.values(errors).some(error => error)) {
      alert("Please fix the errors before copying the tuple.");
      return;
    }
    const complianceModulesArray = tokenDetails.complianceModules.split(",").filter(Boolean);
    const complianceSettingsArray = tokenDetails.complianceSettings.split(",").filter(Boolean);

    const complianceModulesString =
      complianceModulesArray.length > 0 ? `["${complianceModulesArray.join('","')}"]` : "[]";
    const complianceSettingsString =
      complianceSettingsArray.length > 0 ? `["${complianceSettingsArray.join('","')}"]` : "[]";
    const irAgentsArray = tokenDetails.irAgents
      .split(",")
      .filter(Boolean)
      .map(agent => `"${agent.trim()}"`)
      .join(",");

    const tokenAgentsArray = tokenDetails.tokenAgents
      .split(",")
      .filter(Boolean)
      .map(agent => `"${agent.trim()}"`)
      .join(",");

    const tupleString = `["${tokenDetails.owner}", "${tokenDetails.name}", "${tokenDetails.symbol}", ${tokenDetails.decimals}, "${tokenDetails.irs}", "${tokenDetails.ONCHAINID}", [${irAgentsArray}], [${tokenAgentsArray}], ${complianceModulesString}, ${complianceSettingsString}]`;

    navigator.clipboard
      .writeText(tupleString)
      .then(() => {
        setTimeout(() => {
          alert("Tuple copied to clipboard!");
        }, 100);
      })
      .catch(err => {
        alert("Failed to copy tuple: " + err);
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl mb-4">Token Details Input</h2>
      <form className="space-y-4">
        <div title="Address of the owner of all contracts">
          <label className="block text-sm font-medium">
            Owner (Address) <span className="text-red-500">*</span>:
          </label>
          <input
            type="text"
            name="owner"
            value={tokenDetails.owner}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="0x1234...5678"
            required
          />
          {errors.owner && <p className="text-red-500 text-xs">{errors.owner}</p>}
        </div>
        <div title="Name of the token">
          <label className="block text-sm font-medium">Name (String):</label>
          <input
            type="text"
            name="name"
            value={tokenDetails.name}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="TokenName"
            maxLength={100} // Assuming a max length of 100 for token name
            required
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
        </div>
        <div title="Symbol / ticker of the token">
          <label className="block text-sm font-medium">Symbol (String):</label>
          <input
            type="text"
            name="symbol"
            value={tokenDetails.symbol}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="TKN"
          />
          {errors.symbol && <p className="text-red-500 text-xs">{errors.symbol}</p>}
        </div>
        <div title="Decimals of the token (can be between 0 and 18)">
          <label className="block text-sm font-medium">Decimals (Uint8):</label>
          <input
            type="number"
            name="decimals"
            value={tokenDetails.decimals}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="18"
          />
          {errors.decimals && <p className="text-red-500 text-xs">{errors.decimals}</p>}
        </div>
        <div title="Identity registry storage address. Set it to ZERO address if you want to deploy a new storage. If an address is provided, please ensure that the factory is set as owner of the contract">
          <label className="block text-sm font-medium">IRS (Address):</label>
          <input
            type="text"
            name="irs"
            value={tokenDetails.irs}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="0x1234...5678"
          />
          {errors.irs && <p className="text-red-500 text-xs">{errors.irs}</p>}
        </div>
        <div title="ONCHAINID of the token">
          <label className="block text-sm font-medium">ONCHAINID (Address):</label>
          <input
            type="text"
            name="ONCHAINID"
            value={tokenDetails.ONCHAINID}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="0x1234...5678"
          />
          {errors.ONCHAINID && <p className="text-red-500 text-xs">{errors.ONCHAINID}</p>}
        </div>
        <div title="List of agents of the identity registry (can be set to an AgentManager contract)">
          <label className="block text-sm font-medium">IR Agents (Address[] - comma separated):</label>
          <textarea
            name="irAgents"
            value={tokenDetails.irAgents}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="0x1234...5678,0x1234...5678"
          ></textarea>
        </div>
        <div title="List of agents of the token">
          <label className="block text-sm font-medium">Token Agents (Address[] - comma separated):</label>
          <textarea
            name="tokenAgents"
            value={tokenDetails.tokenAgents}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="0x1234...5678,0x1234...5678"
          ></textarea>
        </div>
        <div title="Modules to bind to the compliance">
          <label className="block text-sm font-medium">Compliance Modules (Address[] - comma separated):</label>
          <textarea
            name="complianceModules"
            value={tokenDetails.complianceModules}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="0x1234...5678,0x1234...5678"
          ></textarea>
        </div>
        <div title="Settings calls for compliance modules">
          <label className="block text-sm font-medium">Compliance Settings (Bytes[] - comma separated):</label>
          <textarea
            name="complianceSettings"
            value={tokenDetails.complianceSettings}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="0x1234...5678,0x1234...5678"
          ></textarea>
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={handleCopy}
            className={`bg-blue-500 text-white p-2 rounded-md ${
              Object.values(errors).some(error => error) ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={Object.values(errors).some(error => error)}
          >
            Copy Generated Tuple
          </button>
        </div>
      </form>
    </div>
  );
};

export default TokenDetailsInput;
