fbtidy.JS
==========

Build (Windows)
---------------
0. Install TypeScript (just for VS project)
1. Install node.js from http://nodejs.org/
2. Reopen the command prompt (kill explorer instances if needed) and type
	npm install grunt-cli -g
	npm install bower -g
3. Switch to folder fbtidy\fbtidy.JS
4. Type following commands
	bower update
	npm install
	grunt
5. Start webserver for fbtidy\fbtidy.JS folder. For IIS, make sure you have json mime type added as application/json, less as text/css.
6. Add website called api in IIS under the website for fbtidy\fbtidy.JS pointing to fbtidy\fbtidy.WebApi.
7. You need files in fbtidy\fbtidy.WebApi\App_Data\<username> folder which is mysteriously not provided. To get this files, run fbtidy.WinForms project, drop in your account files, scan, save merged files and copy them over to data folder. Similarly appSecrets.json file in DropBox folder is understandably missing.
8. VS2013 now needs to start as administrator so you can debug WebApi project.
 
 Issues
 -------
 1. npm is not available from command line
	Kill explorer windows, start command prompt again.
 2. bower update shows error such as 
	'ECMDERR Failed to execute "git ls-remote --tags --heads git://github...'
	First run bower prune to clean up existing files.
	Then make sure git is latest (1.8.4+) from http://git-scm.com/download/win
	
 
