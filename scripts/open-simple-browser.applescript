tell application "Visual Studio Code" to activate
delay 0.5
tell application "System Events"
	keystroke "p" using {command down, shift down}
	delay 0.7
	keystroke ">Simple Browser: Show"
	delay 0.6
	key code 36
	delay 0.6
	keystroke "http://localhost:3000/"
	delay 0.3
	key code 36
end tell
