const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

const execAsync = promisify(exec);

const LOCAL_CONFIG_PATH = './rclone.conf';

exports.handler = async (event) => {
    try {
        const result = await executeRcloneCommand();
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Rclone operation completed successfully',
                stdout: result.stdout,
                stderr: result.stderr
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify(error, Object.getOwnPropertyNames(error))
        };
    }
};

async function executeRcloneCommand() {
    const command = `rclone --config ${LOCAL_CONFIG_PATH} copy gdrive: awss3:dzejkobjj-gdrive-backup-06475`;
    
    console.log(`Executing command: ${command}`);
    
    const { stdout, stderr } = await execAsync(command, { maxBuffer: 1024 * 1024 * 10 });
    return { stdout, stderr };
}
