import os
import subprocess

def run_command(command):
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()
    return stdout.decode('utf-8'), stderr.decode('utf-8')

# Update package list
run_command('sudo apt update')

# Install Node.js and npm
run_command('curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -')
run_command('sudo apt-get install -y nodejs')

# Verify the installed versions
stdout, _ = run_command('node -v')
print(f'Node.js version: {stdout.strip()}')
stdout, _ = run_command('npm -v')
print(f'npm version: {stdout.strip()}')

# Navigate to the project directory
os.chdir('/path/to/your/project')

# Install the required packages
run_command('npm init -y')
run_command('npm install express stripe crypto')
