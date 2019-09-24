// saveAsPNGfromList.jsx
// -------------------------------------------------------
// Saves current image file to destination
// taken from INI-file. If the INI-file
// doesn't exists, it asks for a path
// and writes an INI File at the location
// of photoshop.exe.
// -------------------------------------------------------
// (C) Oliver Reischl
// -------------------------------------------------------
// Version
// 0.4
// - Now stores the last savepath
// 0.3
// - saves path in INI-File, but now per PNG!
// - renames file only if there is a whitespace in there
// - save alpha only if alpha exists.
// -------------------------------------------------------

// enable double clicking from the Macintosh Finder or the Windows Explorer
// #target photoshop

// in case we double clicked the file
#target photoshop
app.bringToFront();

// Dispatch

main()

// Main Function

function main()
{
	// alert("Works!")
	
	// Hide UV-Layer
	UVVisStat=null;
	try
	{
		// "layers.getByName" throws an error when it finds no layer - DUH!
		UVLayer=app.activeDocument.layers.getByName("UV");
		UVVisStat=UVLayer.visible;
		UVLayer.visible=false;
	} catch (err) {}

	// Get PNG-Filename from INI => Uses the TGA list for ease
	// Stores it at %appdata%\Adobe\Adobe Photoshop CS5.1\Adobe Photoshop CS5.1 Settings
	INIPath=(app.preferencesFolder+"/"+"saveAsTGAfromList.ini");
	
	// alert(INIPath);
	PNGFilename=getPNGName(app.activeDocument.name);
	FileID=PNGFilename.split(".")[0];
	PNGSavePath=readINI(INIPath,"files",FileID);

	// PNG wasn't saved yet, we have to define a folder
	if (PNGSavePath==undefined)
	{
		// check for last 
		tempPath=readINI(INIPath,"config","Last_Folder");
		if (tempPath==undefined) tempPathObj=Folder.current;
		else tempPathObj=new Folder(tempPath);

		// Message is not working...?
		// msg={en:"Export-File not found. \nPlease select a save path.", de:"Eportdatei nicht gefunden.\nBitte wählen Sie einen Zielpfad."}
		texFolderPath=tempPathObj.selectDlg("Please select a save folder.");
		if (texFolderPath==null) 
		{
			alert("PNG-File was not saved.");
			if (UVVisStat!=null) UVLayer.visible=UVVisStat;
			return;
		}
		texFolder=new Folder(texFolderPath);
		PNGSavePath=texFolder.fsName;
		setINI(INIPath,"files",FileID,(PNGSavePath));
	}

	// Setup Save Options. This is file-format-dependent
	PNGOptions = new PNGSaveOptions();
	PNGOptions.interlaced=false;
	PNGOptions.compression=0;

	// alert(PNGFilename)
	// Save File
	PNGFile = new File(PNGSavePath+"\\"+PNGFilename);
	activeDocument.saveAs(PNGFile, PNGOptions, true, Extension.LOWERCASE);

	// Save last file path
	setINI(INIPath,"config","Last_Folder",(PNGSavePath));

	// Restore UV-Layer
	if (UVVisStat!=null) UVLayer.visible=UVVisStat;
}

function getPNGName(psdFileName)
{
	// var x=psdFileName.search(" ");
	var spaceCount=psdFileName.search(" ");
	if (spaceCount!=-1)
	{
		var tempFileName=psdFileName.slice(0,spaceCount)+".png";
	}
	else
	{
		var tempFileName=psdFileName;
	}			
	return tempFileName
}

function setINI(iniFilePath,category,entry,data)
{
	var iniFile=File(iniFilePath);
	
	
	// alert(iniFile.fsName);
	var iniFileLines = [];
	var iniLine="";
	var catBrac="["+category+"]";
	
	if (iniFile.exists)
	{
		// fill linebuffer
		iniFile.open("r:");
		while (iniFile.eof!=true)
		{
			iniLine=iniFile.readln();
			iniFileLines.push(iniLine);
		}
		iniFile.close();
		
		// search for entry
		// var catID=iniFileLines.find(catBrac);
		var catID=-1;
		for(var i = 0; i < iniFileLines.length; i++)
	   		if(iniFileLines[i] == catBrac)
	    		catID=i;
		if (catID!=-1) // is entry found?
		{
			var nextCat=iniFileLines.length;
			for(var i = catID+1; i < iniFileLines.length; i++)
	   			if(iniFileLines[i][0] == "[")
	     			nextCat=i;
	     	
	     	var entryID=-1;
	     	for(var i = catID+1; i < nextCat; i++)
	   			if(iniFileLines[i].split("=")[0] == entry)
	     			entryID=i;
	     			
	    	if (entryID != -1)
	    	{
	    		iniFileLines[entryID]=entry+"="+data;
			}
			else
			{
				var newEntry=entry+"="+data;
				iniFileLines.splice(nextCat,0,newEntry);
			}
		}
	}
	else
	{
		iniFileLines.push(catBrac);
		iniFileLines.push(entry+"="+data);
	}

	// Write out new ini
	iniFile.open("w:");
	for (x in iniFileLines)	iniFile.writeln(iniFileLines[x]);
	iniFile.close();
	return true;
}

function readINI(iniFilePath,category,entry)
{
	entryData="";
	iniFile=File(iniFilePath)
	if (iniFile.exists==false)
	{
		return undefined;
	}
	
	// alert(iniFile.fsName);
	iniFile.open("r:");
	iniLine="";
	
	categoryBrackets="["+category+"]";
	while (iniFile.eof!=true && iniLine!=categoryBrackets)
	{
		iniLine=iniFile.readln();
	}
	if (iniLine==("["+category+"]"))
	{
		while (iniFile.eof!=true && iniLine.split("=")[0]!=entry)
		{
			iniLine=iniFile.readln();
		}
	}
	else
	{
		return undefined
	}
	if (iniLine.split("=")[0]==entry)
	{
		entryData=iniLine.split("=")[1];
	}
	else
	{
		return undefined
	}
	iniFile.close;
	return entryData;
}