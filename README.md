# photoshop-scripts
Various photoshop scripts

## Save As

saveAsPNGFromList.jsx and saveAsTGAFromList.jsx are simple programs to speed up your texture workflow.

### Usage

Simply start like any script in Photoshop. Versions from CS5 should work.

The script checks your current document name against a list of photoshop document names. If it's not in the list, it will ask you for a file path. The script then exports a TGA or PNG file from your current document to that path and stores the path in the list. Next time you start the script, it will recognize the path and not ask you again.

Your current PSD-document is ***not*** saved or changed in any way - great for trying out texture-changes!

This script is particular useful if you bind it to a hotkey. I have it set to F12 via actions.