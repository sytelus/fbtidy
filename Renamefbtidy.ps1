[CmdletBinding(SupportsShouldProcess=$true)]
Param()

$match = "MyProject" 
$replacement = Read-Host "Please enter project name"

$searchFolders = @("MyProject.JS", "MyProject.WebApi", ".")
$extensions = @("*.cs", "*.csproj", "*.sln", "bower.json", "*.txt", "*.md")
foreach($searchFolderRelative in $searchFolders)
{
	$searchFolder = join-path (get-location) $searchFolderRelative
	Write-Verbose "Folder: $searchFolder"
	
	$recurse = $searchFolderRelative -ne "."
	
	if (test-path $searchFolder)
	{
		$files = Get-ChildItem (join-path $searchFolder "*") -file -include $extensions  -Recurse:$recurse |
					Where-Object {Select-String -Path $_.FullName $match -SimpleMatch -Quiet}

		foreach($file in $files) 
		{ 
			Write-Verbose "Replaced $match in $file"
			((Get-Content $file.fullname) -creplace $match, $replacement) | set-content $file.fullname 
		}
		
		$files = Get-ChildItem $searchFolder -filter *$match* -Recurse:$recurse

		$files |
			Sort-Object -Descending -Property { $_.FullName } |
			% {
				Write-Verbose "Renamed $_"
				$newName = $_.name -replace $match, $replacement
				Rename-Item $_.FullName -newname $newName -force
			}		
	}
	else
	{
		Write-Warning "Path not found: $searchFolder"
	}
}
