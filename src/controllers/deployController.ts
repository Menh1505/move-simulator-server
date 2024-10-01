import { Request, Response, NextFunction } from 'express';
import { exec } from 'child_process';

export const deploySolidity = async (filePath: string, fileNameWithoutExtension: string, rpcUrl: string, privateKey: string, res: Response) => {
    const forgeCommand = `forge create ${filePath}:${fileNameWithoutExtension} --rpc-url ${rpcUrl} --private-key ${privateKey}`;

    return new Promise<void>((resolve, reject) => {
        exec(forgeCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${error.message}`);
                res.status(500).send(`Error executing command: ${error.message}`);
                reject(error);
                return;
            }

            if (stderr) {
                console.error(`Error output: ${stderr}`);
                res.status(500).send(`Command failed: ${stderr}`);
                reject(new Error(stderr));
                return;
            }

            res.send(`Command output: ${stdout}`);
            resolve();
        });
    });
};