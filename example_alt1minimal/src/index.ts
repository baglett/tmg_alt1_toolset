// alt1 base libs, provides all the commonly used methods for image matching and capture
// also gives your editor info about the window.alt1 api
import * as a1lib from "alt1";
import { TooltipReader } from "alt1/tooltip";

// tell webpack that this file relies index.html, appconfig.json and icon.png
import "./index.html";
import "./appconfig.json";
import "./icon.png";

var output = document.getElementById("output");

// listen for pasted (ctrl-v) images
a1lib.PasteInput.listen(img => {
	findDoorTooltip(img);
}, (err, errid) => {
	output.insertAdjacentHTML("beforeend", `<div><b>${errid}</b>  ${err}</div>`);
});

// Define our valid patterns
const VALID_COLORS = ['Blue', 'Crimson', 'Gold', 'Green', 'Orange', 'Purple', 'Silver', 'Yellow'];
const VALID_SHAPES = ['Corner', 'Crescent', 'Diamond', 'Pentagon', 'Triangle', 'Rectangle', 'Shield', 'Wedge'];

export function capture() {
	if (!window.alt1) {
		output.insertAdjacentHTML("beforeend", `<div>You need to run this page in alt1 to capture the screen</div>`);
		return;
	}
	if (!alt1.permissionPixel) {
		output.insertAdjacentHTML("beforeend", `<div>Page is not installed as app or capture permission is not enabled</div>`);
		return;
	}
	var img = a1lib.captureHoldFullRs();
	findDoorTooltip(img);
}

function findDoorTooltip(img: a1lib.ImgRef) {
	// Clear previous output
	output.innerHTML = '';
	
	if (window.alt1) {
		// Display the captured image for debugging
		output.insertAdjacentHTML("beforeend", `<div>Captured image:</div>`);
		output.insertAdjacentElement("beforeend", img.toData().toImage());

		try {
			// Search for tooltip text using Alt1's built-in functionality
			const tooltipReader = new TooltipReader();
			const tooltip = tooltipReader.find(img);
			
			if (tooltip) {
				const tooltipText = tooltip.text;
				output.insertAdjacentHTML("beforeend", `<div>Found tooltip text: "${tooltipText}"</div>`);
				
				// Check for "Enter Guardian door" pattern
				const enterMatch = tooltipText.match(/^Enter (.+) door$/i);
				if (enterMatch) {
					output.insertAdjacentHTML("beforeend", `
						<div>Found "Enter" door pattern:</div>
						<div>- Type: ${enterMatch[1]}</div>
					`);
				}

				// Check for "Unlock [Color] [Shape] door" pattern
				const unlockMatch = tooltipText.match(/^Unlock (\w+) (\w+) door$/i);
				if (unlockMatch) {
					const [_, color, shape] = unlockMatch;
					if (VALID_COLORS.includes(color) && VALID_SHAPES.includes(shape)) {
						output.insertAdjacentHTML("beforeend", `
							<div>Found "Unlock" door pattern:</div>
							<div>- Color: ${color}</div>
							<div>- Shape: ${shape}</div>
						`);
					}
				}

				// Highlight the tooltip area
				alt1.overLayRect(
					a1lib.mixColor(255, 255, 255), // White rectangle
					tooltip.rect.x,
					tooltip.rect.y,
					tooltip.rect.width,
					tooltip.rect.height,
					2000, // Duration in ms
					2    // Line width
				);
			}
		} catch (e) {
			console.error("Error reading tooltip:", e);
		}

		// Development notes
		output.insertAdjacentHTML("beforeend", `
			<div>Development Notes:</div>
			<div>- Currently displaying raw captured image</div>
			<div>- Using Alt1's built-in tooltip detection</div>
			<div>- Looking for patterns:</div>
			<div>  * "Enter [Type] door"</div>
			<div>  * "Unlock [Color] [Shape] door"</div>
			<div>- Valid colors: ${VALID_COLORS.join(', ')}</div>
			<div>- Valid shapes: ${VALID_SHAPES.join(', ')}</div>
		`);
	}
}

//check if we are running inside alt1 by checking if the alt1 global exists
if (window.alt1) {
	//tell alt1 about the app
	alt1.identifyAppUrl("./appconfig.json");
} else {
	let addappurl = `alt1://addapp/${new URL("./appconfig.json", document.location.href).href}`;
	output.insertAdjacentHTML("beforeend", `
		Alt1 not detected, click <a href='${addappurl}'>here</a> to add this app to Alt1
	`);
}

//Add instructions for using the app
output.insertAdjacentHTML("beforeend", `
	<div>Paste an image of RS with a door tooltip, or click capture if using Alt1</div>
	<div onclick='TestApp.capture()'>Click to capture if on alt1</div>`
);
