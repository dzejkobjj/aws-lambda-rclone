const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

const execAsync = promisify(exec);

const EFS_CONFIG_PATH = '/mnt/lambda-rclone-efs/rclone.conf';
const LOCAL_CONFIG_PATH = './rclone.conf';

exports.handler = async (event) => {
    try {
        await ensureConfigExists();
        
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

async function ensureConfigExists() {
    if (fsSync.existsSync(EFS_CONFIG_PATH)) {
        console.log('rclone.conf found on EFS');
        return;
    }
    
    console.log('rclone.conf not found on EFS, copying from current directory...');
    
    const efsDir = path.dirname(EFS_CONFIG_PATH);
    await fs.copyFile(LOCAL_CONFIG_PATH, EFS_CONFIG_PATH);
    console.log('rclone.conf successfully copied to EFS');
}

async function executeRcloneCommand() {
    const command = `rclone --config ${EFS_CONFIG_PATH} copy gdrive: awss3:dzejkobjj-gdrive-backup-06475`;
    
    console.log(`Executing command: ${command}`);
    
    const { stdout, stderr } = await execAsync(command, { maxBuffer: 1024 * 1024 * 10 });
    return { stdout, stderr };
}
