# PowerShell script to make shell scripts executable on Windows
# This is needed because Windows doesn't have chmod command

$scriptPath = "g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\scripts\setup_dev_env.sh"

if (Test-Path $scriptPath) {
    # Set the file to be executable
    $ = Get-Acl $scriptPath
    $accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule("Users", "ReadAndExecute", "Allow")
    $acl.SetAccessRule($accessRule)
    Set-Acl $scriptPath $acl
    
    Write-Host "Made $scriptPath executable"
} else {
    Write-Host "Script not found: $scriptPath"
}