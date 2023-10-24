process.chdir('./packages/hardhat');
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { updateDeployedContracts } from "./packages/hardhat/scripts/updateDeployedContracts";
import { Request, Response } from "express";
import { HardhatRuntimeEnvironment } from "hardhat/types";
const hre: HardhatRuntimeEnvironment = require("./packages/hardhat/node_modules/hardhat");
hre.network.name = "polygonMumbai";

const app = express();
app.use(cors({
    origin: 'http://localhost:3000'
}));
const PORT = 4000;

app.use(bodyParser.json());

app.post("/update-contracts", async (req: Request, res: Response) => {
    const { tokenAddress } = req.body;

    try {
        await updateDeployedContracts(tokenAddress);
        console.log("Token address:", tokenAddress);
        res.status(200).send({ message: "Contracts updated successfully!" });
    } catch (error) {
        console.error("Error updating contracts:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
