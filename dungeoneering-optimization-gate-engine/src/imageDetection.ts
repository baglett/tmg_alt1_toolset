import * as a1lib from "@alt1/base";

// Load the home room icon image
const homeRoomIcon = new Image();
homeRoomIcon.src = "./assets/home_room_icon.png";

// Load the dungeon map X icon
const dungMapXIcon = new Image();
dungMapXIcon.src = "./assets/dung_map_x.png";

// Create additional variations of the icon for more robust detection
const homeRoomIconVariations: HTMLImageElement[] = [];
const dungMapXVariations: HTMLImageElement[] = [];
const variationCount = 3; // Number of variations to create

// Wait for the images to load before using them
let homeRoomIconLoaded = false;
let dungMapXLoaded = false;

homeRoomIcon.onload = () => {
    homeRoomIconLoaded = true;
    console.log("Home room icon loaded successfully");
    
    // Create variations once the original is loaded
    createIconVariations();
    createColorVariations();
    createLargerIconVersion();
};

dungMapXIcon.onload = () => {
    dungMapXLoaded = true;
    console.log("Dungeon map X icon loaded successfully");
    
    // Create variations for the dungeon map X icon
    createDungMapXVariations();
};

// Function to create variations of the icon with different brightness/contrast
function createIconVariations() {
    // Create a canvas to manipulate the icon
    const canvas = document.createElement("canvas");
    canvas.width = homeRoomIcon.width;
    canvas.height = homeRoomIcon.height;
    const ctx = canvas.getContext("2d")!;
    
    // Draw the original icon
    ctx.drawImage(homeRoomIcon, 0, 0);
    
    // Create variations with different brightness/contrast
    for (let i = 0; i < variationCount; i++) {
        // Create a new image for this variation
        const variationImg = new Image();
        
        // Apply different adjustments for each variation
        ctx.drawImage(homeRoomIcon, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Apply different adjustments based on the variation index
        switch (i) {
            case 0: // Increased brightness
                for (let p = 0; p < data.length; p += 4) {
                    data[p] = Math.min(255, data[p] + 30);     // R
                    data[p+1] = Math.min(255, data[p+1] + 30); // G
                    data[p+2] = Math.min(255, data[p+2] + 30); // B
                }
                break;
            case 1: // Increased contrast
                for (let p = 0; p < data.length; p += 4) {
                    data[p] = data[p] < 128 ? Math.max(0, data[p] - 20) : Math.min(255, data[p] + 20);
                    data[p+1] = data[p+1] < 128 ? Math.max(0, data[p+1] - 20) : Math.min(255, data[p+1] + 20);
                    data[p+2] = data[p+2] < 128 ? Math.max(0, data[p+2] - 20) : Math.min(255, data[p+2] + 20);
                }
                break;
            case 2: // Edge enhancement
                // Simple edge detection - highlight edges
                const tempData = new Uint8ClampedArray(data.length);
                for (let y = 1; y < canvas.height - 1; y++) {
                    for (let x = 1; x < canvas.width - 1; x++) {
                        const idx = (y * canvas.width + x) * 4;
                        // Simple edge detection using neighboring pixels
                        const leftIdx = (y * canvas.width + (x-1)) * 4;
                        const rightIdx = (y * canvas.width + (x+1)) * 4;
                        const topIdx = ((y-1) * canvas.width + x) * 4;
                        const bottomIdx = ((y+1) * canvas.width + x) * 4;
                        
                        // Calculate edge intensity (simple gradient)
                        const edgeIntensity = Math.abs(data[leftIdx] - data[rightIdx]) + 
                                             Math.abs(data[topIdx] - data[bottomIdx]);
                        
                        // Enhance edges
                        tempData[idx] = Math.min(255, data[idx] + edgeIntensity);
                        tempData[idx+1] = Math.min(255, data[idx+1] + edgeIntensity);
                        tempData[idx+2] = Math.min(255, data[idx+2] + edgeIntensity);
                        tempData[idx+3] = data[idx+3]; // Keep original alpha
                    }
                }
                // Copy the edge-enhanced data back
                for (let p = 0; p < data.length; p++) {
                    if (tempData[p] > 0) {
                        data[p] = tempData[p];
                    }
                }
                break;
        }
        
        // Put the modified data back to the canvas
        ctx.putImageData(imageData, 0, 0);
        
        // Convert canvas to data URL and set as the variation image source
        variationImg.src = canvas.toDataURL();
        
        // Add to variations array
        homeRoomIconVariations.push(variationImg);
        
        console.log(`Created icon variation ${i+1}`);
    }
}

// Function to create additional color variations of the home room icon
// This helps detect the icon in different lighting conditions or UI themes
function createColorVariations() {
    // Create a canvas to manipulate the icon
    const canvas = document.createElement("canvas");
    canvas.width = homeRoomIcon.width;
    canvas.height = homeRoomIcon.height;
    const ctx = canvas.getContext("2d")!;
    
    // Draw the original icon
    ctx.drawImage(homeRoomIcon, 0, 0);
    
    // Get the image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Create color variations
    const colorVariations = [
        { name: "grayscale", process: (r: number, g: number, b: number) => {
            const gray = 0.3 * r + 0.59 * g + 0.11 * b;
            return [gray, gray, gray];
        }},
        { name: "inverted", process: (r: number, g: number, b: number) => {
            return [255 - r, 255 - g, 255 - b];
        }},
        { name: "high-contrast", process: (r: number, g: number, b: number) => {
            const threshold = 128;
            return [r > threshold ? 255 : 0, g > threshold ? 255 : 0, b > threshold ? 255 : 0];
        }},
        { name: "sepia", process: (r: number, g: number, b: number) => {
            return [
                Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189)),
                Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168)),
                Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131))
            ];
        }}
    ];
    
    // Process each color variation
    for (const variation of colorVariations) {
        // Create a new image for this variation
        const variationImg = new Image();
        
        // Clone the original image data
        const variationData = new Uint8ClampedArray(data);
        
        // Apply the color transformation
        for (let i = 0; i < variationData.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];
            
            // Skip transparent pixels
            if (a === 0) continue;
            
            // Apply the color transformation
            const [newR, newG, newB] = variation.process(r, g, b);
            
            variationData[i] = newR;
            variationData[i + 1] = newG;
            variationData[i + 2] = newB;
        }
        
        // Create a new ImageData object
        const newImageData = new ImageData(variationData, canvas.width, canvas.height);
        
        // Put the modified data back to the canvas
        ctx.putImageData(newImageData, 0, 0);
        
        // Convert canvas to data URL and set as the variation image source
        variationImg.src = canvas.toDataURL();
        
        // Add to variations array
        homeRoomIconVariations.push(variationImg);
        
        console.log(`Created color variation: ${variation.name}`);
    }
}

// Function to create a larger version of the home room icon
// This can help with detecting the icon when it's scaled or slightly blurred
function createLargerIconVersion() {
    // Create a canvas to draw the larger icon
    const canvas = document.createElement("canvas");
    // Make it 2x larger
    canvas.width = homeRoomIcon.width * 2;
    canvas.height = homeRoomIcon.height * 2;
    const ctx = canvas.getContext("2d")!;
    
    // Use nearest-neighbor scaling for pixel art
    ctx.imageSmoothingEnabled = false;
    
    // Draw the icon at 2x size
    ctx.drawImage(
        homeRoomIcon, 
        0, 0, homeRoomIcon.width, homeRoomIcon.height,
        0, 0, canvas.width, canvas.height
    );
    
    // Create a new image for the larger version
    const largerIcon = new Image();
    largerIcon.src = canvas.toDataURL();
    
    // Add to variations array
    homeRoomIconVariations.push(largerIcon);
    
    console.log("Created larger icon version (2x)");
}

// Function to create variations of the dungeon map X icon
function createDungMapXVariations() {
    // Create a canvas to manipulate the icon
    const canvas = document.createElement("canvas");
    canvas.width = dungMapXIcon.width;
    canvas.height = dungMapXIcon.height;
    const ctx = canvas.getContext("2d")!;
    
    // Draw the original icon
    ctx.drawImage(dungMapXIcon, 0, 0);
    
    // Create variations with different brightness/contrast
    for (let i = 0; i < variationCount; i++) {
        // Create a new image for this variation
        const variationImg = new Image();
        
        // Apply different adjustments for each variation
        ctx.drawImage(dungMapXIcon, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Apply different adjustments based on the variation index
        switch (i) {
            case 0: // Increased brightness
                for (let p = 0; p < data.length; p += 4) {
                    data[p] = Math.min(255, data[p] + 30);     // R
                    data[p+1] = Math.min(255, data[p+1] + 30); // G
                    data[p+2] = Math.min(255, data[p+2] + 30); // B
                }
                break;
            case 1: // Increased contrast
                for (let p = 0; p < data.length; p += 4) {
                    data[p] = data[p] < 128 ? Math.max(0, data[p] - 20) : Math.min(255, data[p] + 20);
                    data[p+1] = data[p+1] < 128 ? Math.max(0, data[p+1] - 20) : Math.min(255, data[p+1] + 20);
                    data[p+2] = data[p+2] < 128 ? Math.max(0, data[p+2] - 20) : Math.min(255, data[p+2] + 20);
                }
                break;
            case 2: // Edge enhancement
                // Simple edge detection - highlight edges
                const tempData = new Uint8ClampedArray(data.length);
                for (let y = 1; y < canvas.height - 1; y++) {
                    for (let x = 1; x < canvas.width - 1; x++) {
                        const idx = (y * canvas.width + x) * 4;
                        // Simple edge detection using neighboring pixels
                        const leftIdx = (y * canvas.width + (x-1)) * 4;
                        const rightIdx = (y * canvas.width + (x+1)) * 4;
                        const topIdx = ((y-1) * canvas.width + x) * 4;
                        const bottomIdx = ((y+1) * canvas.width + x) * 4;
                        
                        // Calculate edge intensity (simple gradient)
                        const edgeIntensity = Math.abs(data[leftIdx] - data[rightIdx]) + 
                                             Math.abs(data[topIdx] - data[bottomIdx]);
                        
                        // Enhance edges
                        tempData[idx] = Math.min(255, data[idx] + edgeIntensity);
                        tempData[idx+1] = Math.min(255, data[idx+1] + edgeIntensity);
                        tempData[idx+2] = Math.min(255, data[idx+2] + edgeIntensity);
                        tempData[idx+3] = data[idx+3]; // Keep original alpha
                    }
                }
                // Copy the edge-enhanced data back
                for (let p = 0; p < data.length; p++) {
                    if (tempData[p] > 0) {
                        data[p] = tempData[p];
                    }
                }
                break;
        }
        
        // Put the modified data back to the canvas
        ctx.putImageData(imageData, 0, 0);
        
        // Convert canvas to data URL and set as the variation image source
        variationImg.src = canvas.toDataURL();
        
        // Add to variations array
        dungMapXVariations.push(variationImg);
        
        console.log(`Created dungeon map X variation ${i+1}`);
    }
}

// Define common screen regions where the minimap might be located
// These are common locations for the minimap in different interfaces
const MINIMAP_REGIONS = [
    // Top-right corner (standard layout)
    { x: 0.75, y: 0, width: 0.25, height: 0.25 },
    // Bottom-right corner (some layouts)
    { x: 0.75, y: 0.75, width: 0.25, height: 0.25 },
    // Full right side (for wider search)
    { x: 0.8, y: 0, width: 0.2, height: 1.0 },
    // Top-right quadrant (for larger minimap)
    { x: 0.5, y: 0, width: 0.5, height: 0.5 }
];

// Function to find the home room icon on the screen with enhanced detection
export async function findHomeRoomIcon(debugMode = false): Promise<{ x: number, y: number } | null> {
    // Make sure the image is loaded
    if (!homeRoomIconLoaded) {
        await new Promise<void>(resolve => {
            const checkLoaded = () => {
                if (homeRoomIconLoaded) {
                    resolve();
                } else {
                    setTimeout(checkLoaded, 100);
                }
            };
            checkLoaded();
        });
    }

    // Make sure Alt1 is available
    if (!window.alt1) {
        console.error("Alt1 not available");
        return null;
    }

    try {
        // Capture the screen
        const fullImg = a1lib.captureHoldFullRs();
        if (!fullImg) {
            console.error("Failed to capture screen");
            return null;
        }

        // Create an ImageData from the home room icon
        const canvas = document.createElement("canvas");
        canvas.width = homeRoomIcon.width;
        canvas.height = homeRoomIcon.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(homeRoomIcon, 0, 0);
        const iconData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // If in debug mode, save a screenshot for analysis
        if (debugMode) {
            // Draw debug info on the screen
            window.alt1.overLayClearGroup("debug_info");
            window.alt1.overLaySetGroup("debug_info");
            window.alt1.overLayText(
                a1lib.mixColor(255, 255, 255, 255),
                10, 
                10, 
                5000,
                `Searching for home icon (${homeRoomIcon.width}x${homeRoomIcon.height}px)`
            );
            window.alt1.overLayRefreshGroup("debug_info");
        }

        // CHANGE: First try searching the entire screen
        if (debugMode) {
            console.log("Searching entire screen first...");
            window.alt1.overLayText(
                a1lib.mixColor(255, 255, 255, 255),
                10, 
                30, 
                5000,
                "Searching entire screen..."
            );
        }
        
        // Try with the original icon on full screen
        const fullScreenMatches = fullImg.findSubimage(iconData);
        
        if (fullScreenMatches.length > 0) {
            const result = {
                x: fullScreenMatches[0].x,
                y: fullScreenMatches[0].y
            };
            
            console.log(`Found home room icon at (${result.x}, ${result.y}) in full screen`);
            return result;
        }
        
        // Try with variations on full screen
        for (let i = 0; i < homeRoomIconVariations.length; i++) {
            const variationImg = homeRoomIconVariations[i];
            
            // Skip if the variation isn't loaded yet
            if (!variationImg.complete) continue;
            
            // Create ImageData from the variation
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(variationImg, 0, 0);
            const variationData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // Search with this variation
            const variationMatches = fullImg.findSubimage(variationData);
            
            if (variationMatches.length > 0) {
                const result = {
                    x: variationMatches[0].x,
                    y: variationMatches[0].y
                };
                
                console.log(`Found home room icon (variation ${i+1}) at (${result.x}, ${result.y}) in full screen`);
                return result;
            }
        }

        // If full screen search failed, try searching in specific minimap regions
        if (debugMode) {
            console.log("Full screen search failed, trying specific regions...");
        }
        
        for (const region of MINIMAP_REGIONS) {
            // Calculate region coordinates based on screen size
            const screenWidth = fullImg.width;
            const screenHeight = fullImg.height;
            const regionX = Math.floor(region.x * screenWidth);
            const regionY = Math.floor(region.y * screenHeight);
            const regionWidth = Math.floor(region.width * screenWidth);
            const regionHeight = Math.floor(region.height * screenHeight);
            
            if (debugMode) {
                // Highlight the search region for debugging
                const debugColor = a1lib.mixColor(255, 0, 0, 100); // Semi-transparent red
                window.alt1.overLayRect(
                    debugColor,
                    regionX,
                    regionY,
                    regionWidth,
                    regionHeight,
                    3000,
                    1
                );
            }
            
            // Try with the original icon first
            const matches = fullImg.findSubimage(iconData, regionX, regionY, regionWidth, regionHeight);
            
            if (matches.length > 0) {
                const result = {
                    x: matches[0].x,
                    y: matches[0].y
                };
                
                console.log(`Found home room icon at (${result.x}, ${result.y}) in region`);
                return result;
            }
            
            // If original didn't match, try with variations
            for (let i = 0; i < homeRoomIconVariations.length; i++) {
                const variationImg = homeRoomIconVariations[i];
                
                // Skip if the variation isn't loaded yet
                if (!variationImg.complete) continue;
                
                // Create ImageData from the variation
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(variationImg, 0, 0);
                const variationData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                
                // Search with this variation
                const variationMatches = fullImg.findSubimage(variationData, regionX, regionY, regionWidth, regionHeight);
                
                if (variationMatches.length > 0) {
                    const result = {
                        x: variationMatches[0].x,
                        y: variationMatches[0].y
                    };
                    
                    console.log(`Found home room icon (variation ${i+1}) at (${result.x}, ${result.y}) in region`);
                    return result;
                }
            }
        }
        
        // Try with additional image processing if standard detection fails
        // This creates a version with enhanced contrast to help with detection
        if (debugMode) {
            console.log("Trying enhanced contrast detection...");
        }
        
        // Create a high contrast version of the icon
        const enhancedCanvas = document.createElement("canvas");
        enhancedCanvas.width = iconData.width;
        enhancedCanvas.height = iconData.height;
        const enhancedCtx = enhancedCanvas.getContext("2d")!;
        
        // Draw the original icon
        enhancedCtx.putImageData(iconData, 0, 0);
        
        // Apply contrast enhancement
        const enhancedData = enhancedCtx.getImageData(0, 0, iconData.width, iconData.height);
        const data = enhancedData.data;
        
        // Simple contrast enhancement
        for (let i = 0; i < data.length; i += 4) {
            // Increase contrast
            data[i] = data[i] < 128 ? Math.max(0, data[i] - 30) : Math.min(255, data[i] + 30);
            data[i+1] = data[i+1] < 128 ? Math.max(0, data[i+1] - 30) : Math.min(255, data[i+1] + 30);
            data[i+2] = data[i+2] < 128 ? Math.max(0, data[i+2] - 30) : Math.min(255, data[i+2] + 30);
        }
        
        enhancedCtx.putImageData(enhancedData, 0, 0);
        const enhancedIconData = enhancedCtx.getImageData(0, 0, iconData.width, iconData.height);
        
        // Try with the enhanced icon
        const enhancedMatches = fullImg.findSubimage(enhancedIconData);
        
        if (enhancedMatches.length > 0) {
            const result = {
                x: enhancedMatches[0].x,
                y: enhancedMatches[0].y
            };
            
            console.log(`Found home room icon at (${result.x}, ${result.y}) with enhanced contrast`);
            return result;
        }

        // If all else fails, try a color-based detection approach
        if (debugMode) {
            console.log("Trying color-based detection...");
            
            // Save a screenshot of the game for debugging
            if (window.alt1.captureAsync) {
                try {
                    window.alt1.captureAsync({
                        left: 0,
                        top: 0,
                        width: fullImg.width,
                        height: fullImg.height
                    }, (img) => {
                        console.log("Debug screenshot captured");
                    });
                } catch (e) {
                    console.error("Failed to capture debug screenshot:", e);
                }
            }
        }

        console.log("Home room icon not found with any method");
        return null;
    } catch (error) {
        console.error("Error finding home room icon:", error);
        return null;
    }
}

// Function to highlight the home room icon
export function highlightHomeRoomIcon(x: number, y: number, duration: number = 5000): void {
    if (!window.alt1) return;

    try {
        // Set the overlay group
        window.alt1.overLaySetGroup("dungeoneering_home_icon");
        
        // Clear any previous overlays
        window.alt1.overLayClearGroup("dungeoneering_home_icon");
        
        // Draw a rectangle around the home room icon
        // Use a bright color that stands out
        const color = a1lib.mixColor(0, 255, 0, 255); // Bright green
        
        // Get the dimensions of the home room icon
        const width = homeRoomIcon.width;
        const height = homeRoomIcon.height;
        
        // Draw the rectangle with a 2px border
        window.alt1.overLayRect(
            color,
            x,
            y,
            width,
            height,
            duration,
            2 // Thickness in pixels
        );
        
        // Add a larger indicator to make it more visible
        const indicatorColor = a1lib.mixColor(255, 255, 0, 150); // Semi-transparent yellow
        window.alt1.overLayRect(
            indicatorColor,
            x - 5,
            y - 5,
            width + 10,
            height + 10,
            duration,
            1 // Thickness in pixels
        );
        
        // Add a text label
        window.alt1.overLayText(
            a1lib.mixColor(255, 255, 255, 255), // White
            x,
            y - 10,
            duration,
            "Home Room"
        );
        
        // Add a pulsing circle for better visibility
        const pulseInterval = setInterval(() => {
            const pulseColor = a1lib.mixColor(255, 0, 255, 150); // Purple, semi-transparent
            window.alt1.overLayCircle(
                pulseColor,
                x + width/2,
                y + height/2,
                20, // Radius
                1000, // Duration
                2 // Thickness
            );
        }, 1000);
        
        // Clear the interval after the duration
        setTimeout(() => {
            clearInterval(pulseInterval);
        }, duration);
        
        // Refresh the overlay group
        window.alt1.overLayRefreshGroup("dungeoneering_home_icon");
        
        console.log(`Highlighted home room icon at (${x}, ${y})`);
    } catch (error) {
        console.error("Error highlighting home room icon:", error);
    }
}

// Function to find the red X marker on the minimap
export async function findRedXMarker(debugMode = false): Promise<{ x: number, y: number } | null> {
    // Make sure Alt1 is available
    if (!window.alt1) {
        console.error("Alt1 not available");
        return null;
    }

    try {
        // Capture the screen
        const fullImg = a1lib.captureHoldFullRs();
        if (!fullImg) {
            console.error("Failed to capture screen");
            return null;
        }

        if (debugMode) {
            // Draw debug info on the screen
            window.alt1.overLayClearGroup("debug_info");
            window.alt1.overLaySetGroup("debug_info");
            window.alt1.overLayText(
                a1lib.mixColor(255, 255, 255, 255),
                10, 
                10, 
                5000,
                "Searching for red X marker on minimap"
            );
            window.alt1.overLayRefreshGroup("debug_info");
        }

        // Define the regions to search for the red X marker
        // The red X is typically in the top-right corner of the minimap
        const searchRegions = [
            // Top-right corner of the screen (where minimap is usually located)
            { x: 0.75, y: 0, width: 0.25, height: 0.25 },
            // Full right side (for wider search)
            { x: 0.7, y: 0, width: 0.3, height: 0.5 }
        ];

        // Search for the red X using color detection
        // Red X has a distinctive bright red color
        const redColor = { r: 255, g: 0, b: 0 };
        const redColorTolerance = 50; // Tolerance for color matching

        // First try searching in specific regions
        for (const region of searchRegions) {
            // Calculate region coordinates based on screen size
            const screenWidth = fullImg.width;
            const screenHeight = fullImg.height;
            const regionX = Math.floor(region.x * screenWidth);
            const regionY = Math.floor(region.y * screenHeight);
            const regionWidth = Math.floor(region.width * screenWidth);
            const regionHeight = Math.floor(region.height * screenHeight);
            
            if (debugMode) {
                // Highlight the search region for debugging
                const debugColor = a1lib.mixColor(255, 0, 0, 100); // Semi-transparent red
                window.alt1.overLayRect(
                    debugColor,
                    regionX,
                    regionY,
                    regionWidth,
                    regionHeight,
                    3000,
                    1
                );
            }

            // Get the image data for this region
            const regionImgData = fullImg.toData(regionX, regionY, regionWidth, regionHeight);
            const data = regionImgData.data;

            // Look for clusters of red pixels that could form an X
            const redPixels: {x: number, y: number}[] = [];
            
            // First pass: find all red pixels
            for (let y = 0; y < regionHeight; y++) {
                for (let x = 0; x < regionWidth; x++) {
                    const idx = (y * regionWidth + x) * 4;
                    const r = data[idx];
                    const g = data[idx + 1];
                    const b = data[idx + 2];
                    
                    // Check if this pixel is red enough (high R, low G and B)
                    if (r > 200 && g < 100 && b < 100) {
                        redPixels.push({ x, y });
                    }
                }
            }
            
            if (redPixels.length > 0) {
                // Find the center of the largest cluster of red pixels
                // This is a simple approach - we could use more sophisticated clustering if needed
                let clusterCenter = { x: 0, y: 0 };
                
                // Calculate the average position of all red pixels
                for (const pixel of redPixels) {
                    clusterCenter.x += pixel.x;
                    clusterCenter.y += pixel.y;
                }
                
                clusterCenter.x = Math.floor(clusterCenter.x / redPixels.length);
                clusterCenter.y = Math.floor(clusterCenter.y / redPixels.length);
                
                // Convert back to screen coordinates
                const result = {
                    x: regionX + clusterCenter.x,
                    y: regionY + clusterCenter.y
                };
                
                console.log(`Found red X marker at (${result.x}, ${result.y})`);
                
                // Verify this is likely an X by checking for red pixels in an X pattern
                const isXShape = verifyXShape(data, clusterCenter.x, clusterCenter.y, regionWidth);
                
                if (isXShape || redPixels.length >= 10) { // If we have enough red pixels or it looks like an X
                    return result;
                }
            }
        }

        // If region-based search failed, try the full screen with a more aggressive approach
        if (debugMode) {
            console.log("Region search failed, trying full screen...");
        }
        
        // Get the full screen image data
        const fullImgData = fullImg.toData(0, 0, fullImg.width, fullImg.height);
        const data = fullImgData.data;
        
        // Look for bright red pixels
        const redPixels: {x: number, y: number}[] = [];
        
        // Sample the screen at a lower resolution for performance
        const sampleRate = 2; // Check every 2nd pixel
        
        for (let y = 0; y < fullImg.height; y += sampleRate) {
            for (let x = 0; x < fullImg.width; x += sampleRate) {
                const idx = (y * fullImg.width + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                
                // Check for bright red pixels (high R, low G and B)
                if (r > 200 && g < 80 && b < 80) {
                    redPixels.push({ x, y });
                }
            }
        }
        
        if (redPixels.length > 0) {
            // Group red pixels into clusters
            const clusters = clusterRedPixels(redPixels, 20); // 20px radius for clustering
            
            // Find the largest cluster
            if (clusters.length > 0) {
                let largestCluster = clusters[0];
                for (const cluster of clusters) {
                    if (cluster.length > largestCluster.length) {
                        largestCluster = cluster;
                    }
                }
                
                if (largestCluster && largestCluster.length >= 5) { // Need at least 5 pixels to be considered a marker
                    // Calculate the center of the cluster
                    let centerX = 0;
                    let centerY = 0;
                    
                    for (const pixel of largestCluster) {
                        centerX += pixel.x;
                        centerY += pixel.y;
                    }
                    
                    centerX = Math.floor(centerX / largestCluster.length);
                    centerY = Math.floor(centerY / largestCluster.length);
                    
                    const result = { x: centerX, y: centerY };
                    console.log(`Found red X marker at (${result.x}, ${result.y}) with ${largestCluster.length} pixels`);
                    return result;
                }
            }
        }

        console.log("Red X marker not found");
        return null;
    } catch (error) {
        console.error("Error finding red X marker:", error);
        return null;
    }
}

// Helper function to verify if a cluster of pixels forms an X shape
function verifyXShape(imageData: Uint8ClampedArray, centerX: number, centerY: number, width: number): boolean {
    // Check for red pixels in diagonal directions from the center
    const directions = [
        { dx: -1, dy: -1 }, // top-left
        { dx: 1, dy: -1 },  // top-right
        { dx: -1, dy: 1 },  // bottom-left
        { dx: 1, dy: 1 }    // bottom-right
    ];
    
    let diagonalsWithRed = 0;
    
    for (const dir of directions) {
        let hasRed = false;
        
        // Check a few pixels in each diagonal direction
        for (let i = 1; i <= 5; i++) {
            const x = centerX + (dir.dx * i);
            const y = centerY + (dir.dy * i);
            
            // Make sure we're within bounds
            if (x < 0 || y < 0 || x >= width || y >= width) continue;
            
            const idx = (y * width + x) * 4;
            const r = imageData[idx];
            const g = imageData[idx + 1];
            const b = imageData[idx + 2];
            
            // Check if this pixel is red
            if (r > 200 && g < 100 && b < 100) {
                hasRed = true;
                break;
            }
        }
        
        if (hasRed) {
            diagonalsWithRed++;
        }
    }
    
    // If we have red pixels in at least 3 of the 4 diagonal directions, it's likely an X
    return diagonalsWithRed >= 3;
}

// Helper function to cluster red pixels
function clusterRedPixels(pixels: {x: number, y: number}[], radius: number): {x: number, y: number}[][] {
    if (!pixels || pixels.length === 0) {
        return [];
    }
    
    const clusters: {x: number, y: number}[][] = [];
    
    for (const pixel of pixels) {
        let addedToCluster = false;
        
        // Check if this pixel belongs to an existing cluster
        for (const cluster of clusters) {
            for (const clusterPixel of cluster) {
                const distance = Math.sqrt(
                    Math.pow(pixel.x - clusterPixel.x, 2) + 
                    Math.pow(pixel.y - clusterPixel.y, 2)
                );
                
                if (distance <= radius) {
                    cluster.push(pixel);
                    addedToCluster = true;
                    break;
                }
            }
            
            if (addedToCluster) break;
        }
        
        // If not added to any cluster, create a new one
        if (!addedToCluster) {
            clusters.push([pixel]);
        }
    }
    
    return clusters;
}

// Function to highlight the red X marker
export function highlightRedXMarker(x: number, y: number, duration: number = 5000): void {
    if (!window.alt1) return;

    try {
        // Draw a crosshair and circle using lines instead of the non-existent overLayCircle
        const greenColor = a1lib.mixColor(0, 255, 0); // Bright green
        const yellowColor = a1lib.mixColor(255, 255, 0); // Yellow
        const whiteColor = a1lib.mixColor(255, 255, 255); // White
        const purpleColor = a1lib.mixColor(255, 0, 255); // Purple
        
        // Draw crosshair lines
        const size = 15;
        // Horizontal line
        window.alt1.overLayLine(greenColor, 2, x - size, y, x + size, y, duration);
        // Vertical line
        window.alt1.overLayLine(greenColor, 2, x, y - size, x, y + size, duration);
        
        // Draw a square around the marker (instead of a circle)
        window.alt1.overLayLine(yellowColor, 1, x - 25, y - 25, x + 25, y - 25, duration); // Top
        window.alt1.overLayLine(yellowColor, 1, x + 25, y - 25, x + 25, y + 25, duration); // Right
        window.alt1.overLayLine(yellowColor, 1, x + 25, y + 25, x - 25, y + 25, duration); // Bottom
        window.alt1.overLayLine(yellowColor, 1, x - 25, y + 25, x - 25, y - 25, duration); // Left
        
        // Add a text label
        window.alt1.overLayText("Minimap Marker", whiteColor, 12, x, y - 30, duration);
        
        // Add a pulsing effect with a square
        const pulseInterval = setInterval(() => {
            const pulseSize = 35;
            window.alt1.overLayLine(purpleColor, 2, x - pulseSize, y - pulseSize, x + pulseSize, y - pulseSize, 1000); // Top
            window.alt1.overLayLine(purpleColor, 2, x + pulseSize, y - pulseSize, x + pulseSize, y + pulseSize, 1000); // Right
            window.alt1.overLayLine(purpleColor, 2, x + pulseSize, y + pulseSize, x - pulseSize, y + pulseSize, 1000); // Bottom
            window.alt1.overLayLine(purpleColor, 2, x - pulseSize, y + pulseSize, x - pulseSize, y - pulseSize, 1000); // Left
        }, 1000);
        
        // Clear the interval after the duration
        setTimeout(() => {
            clearInterval(pulseInterval);
        }, duration);
        
        console.log(`Highlighted red X marker at (${x}, ${y})`);
    } catch (error) {
        console.error("Error highlighting red X marker:", error);
    }
}

// Function to find the dungeon map X icon on the screen
export async function findDungMapXIcon(debugMode = false): Promise<{ x: number, y: number } | null> {
    // Make sure the image is loaded
    if (!dungMapXLoaded) {
        await new Promise<void>(resolve => {
            const checkLoaded = () => {
                if (dungMapXLoaded) {
                    resolve();
                } else {
                    setTimeout(checkLoaded, 100);
                }
            };
            checkLoaded();
        });
    }

    // Make sure Alt1 is available
    if (!window.alt1) {
        console.error("Alt1 not available");
        return null;
    }

    try {
        // Capture the screen
        const fullImg = a1lib.captureHoldFullRs();
        if (!fullImg) {
            console.error("Failed to capture screen");
            return null;
        }

        // Create an ImageData from the dungeon map X icon
        const canvas = document.createElement("canvas");
        canvas.width = dungMapXIcon.width;
        canvas.height = dungMapXIcon.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(dungMapXIcon, 0, 0);
        const iconData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // If in debug mode, save a screenshot for analysis
        if (debugMode) {
            // Draw debug info on the screen
            window.alt1.overLayClearGroup("debug_info");
            window.alt1.overLaySetGroup("debug_info");
            window.alt1.overLayText(
                a1lib.mixColor(255, 255, 255, 255),
                10, 
                10, 
                5000,
                `Searching for dungeon map X (${dungMapXIcon.width}x${dungMapXIcon.height}px)`
            );
            window.alt1.overLayRefreshGroup("debug_info");
        }

        // First try searching the entire screen
        if (debugMode) {
            console.log("Searching entire screen for dungeon map X...");
            window.alt1.overLayText(
                a1lib.mixColor(255, 255, 255, 255),
                10, 
                30, 
                5000,
                "Searching entire screen..."
            );
        }
        
        // Try with the original icon on full screen
        const fullScreenMatches = fullImg.findSubimage(iconData);
        
        if (fullScreenMatches.length > 0) {
            const result = {
                x: fullScreenMatches[0].x,
                y: fullScreenMatches[0].y
            };
            
            console.log(`Found dungeon map X at (${result.x}, ${result.y}) in full screen`);
            return result;
        }
        
        // Try with variations on full screen
        for (let i = 0; i < dungMapXVariations.length; i++) {
            const variationImg = dungMapXVariations[i];
            
            // Skip if the variation isn't loaded yet
            if (!variationImg.complete) continue;
            
            // Create ImageData from the variation
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(variationImg, 0, 0);
            const variationData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // Search with this variation
            const variationMatches = fullImg.findSubimage(variationData);
            
            if (variationMatches.length > 0) {
                const result = {
                    x: variationMatches[0].x,
                    y: variationMatches[0].y
                };
                
                console.log(`Found dungeon map X (variation ${i+1}) at (${result.x}, ${result.y}) in full screen`);
                return result;
            }
        }

        // If full screen search failed, try searching in specific minimap regions
        if (debugMode) {
            console.log("Full screen search failed, trying specific regions...");
        }
        
        for (const region of MINIMAP_REGIONS) {
            // Calculate region coordinates based on screen size
            const screenWidth = fullImg.width;
            const screenHeight = fullImg.height;
            const regionX = Math.floor(region.x * screenWidth);
            const regionY = Math.floor(region.y * screenHeight);
            const regionWidth = Math.floor(region.width * screenWidth);
            const regionHeight = Math.floor(region.height * screenHeight);
            
            if (debugMode) {
                // Highlight the search region for debugging
                const debugColor = a1lib.mixColor(255, 0, 0, 100); // Semi-transparent red
                window.alt1.overLayRect(
                    debugColor,
                    regionX,
                    regionY,
                    regionWidth,
                    regionHeight,
                    3000,
                    1
                );
            }
            
            // Try with the original icon first
            const matches = fullImg.findSubimage(iconData, regionX, regionY, regionWidth, regionHeight);
            
            if (matches.length > 0) {
                const result = {
                    x: matches[0].x,
                    y: matches[0].y
                };
                
                console.log(`Found dungeon map X at (${result.x}, ${result.y}) in region`);
                return result;
            }
            
            // If original didn't match, try with variations
            for (let i = 0; i < dungMapXVariations.length; i++) {
                const variationImg = dungMapXVariations[i];
                
                // Skip if the variation isn't loaded yet
                if (!variationImg.complete) continue;
                
                // Create ImageData from the variation
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(variationImg, 0, 0);
                const variationData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                
                // Search with this variation
                const variationMatches = fullImg.findSubimage(variationData, regionX, regionY, regionWidth, regionHeight);
                
                if (variationMatches.length > 0) {
                    const result = {
                        x: variationMatches[0].x,
                        y: variationMatches[0].y
                    };
                    
                    console.log(`Found dungeon map X (variation ${i+1}) at (${result.x}, ${result.y}) in region`);
                    return result;
                }
            }
        }

        // Try with additional image processing if standard detection fails
        if (debugMode) {
            console.log("Trying enhanced contrast detection for dungeon map X...");
        }
        
        // Create a high contrast version of the icon
        const enhancedCanvas = document.createElement("canvas");
        enhancedCanvas.width = iconData.width;
        enhancedCanvas.height = iconData.height;
        const enhancedCtx = enhancedCanvas.getContext("2d")!;
        
        // Draw the original icon
        enhancedCtx.putImageData(iconData, 0, 0);
        
        // Apply contrast enhancement
        const enhancedData = enhancedCtx.getImageData(0, 0, iconData.width, iconData.height);
        const data = enhancedData.data;
        
        // Simple contrast enhancement
        for (let i = 0; i < data.length; i += 4) {
            // Increase contrast
            data[i] = data[i] < 128 ? Math.max(0, data[i] - 30) : Math.min(255, data[i] + 30);
            data[i+1] = data[i+1] < 128 ? Math.max(0, data[i+1] - 30) : Math.min(255, data[i+1] + 30);
            data[i+2] = data[i+2] < 128 ? Math.max(0, data[i+2] - 30) : Math.min(255, data[i+2] + 30);
        }
        
        enhancedCtx.putImageData(enhancedData, 0, 0);
        const enhancedIconData = enhancedCtx.getImageData(0, 0, iconData.width, iconData.height);
        
        // Try with the enhanced icon
        const enhancedMatches = fullImg.findSubimage(enhancedIconData);
        
        if (enhancedMatches.length > 0) {
            const result = {
                x: enhancedMatches[0].x,
                y: enhancedMatches[0].y
            };
            
            console.log(`Found dungeon map X at (${result.x}, ${result.y}) with enhanced contrast`);
            return result;
        }

        console.log("Dungeon map X not found with any method");
        return null;
    } catch (error) {
        console.error("Error finding dungeon map X:", error);
        return null;
    }
}

// Function to highlight the dungeon map X
export function highlightDungMapXIcon(x: number, y: number, duration: number = 5000): void {
    if (!window.alt1) return;

    try {
        // Set the overlay group
        window.alt1.overLaySetGroup("dungeoneering_map_x");
        
        // Clear any previous overlays
        window.alt1.overLayClearGroup("dungeoneering_map_x");
        
        // Draw a rectangle around the dungeon map X
        // Use a bright color that stands out
        const color = a1lib.mixColor(255, 0, 255, 255); // Bright magenta
        
        // Get the dimensions of the dungeon map X
        const width = dungMapXIcon.width;
        const height = dungMapXIcon.height;
        
        // Draw the rectangle with a 2px border
        window.alt1.overLayRect(
            color,
            x,
            y,
            width,
            height,
            duration,
            2 // Thickness in pixels
        );
        
        // Add a larger indicator to make it more visible
        const indicatorColor = a1lib.mixColor(255, 255, 0, 150); // Semi-transparent yellow
        window.alt1.overLayRect(
            indicatorColor,
            x - 5,
            y - 5,
            width + 10,
            height + 10,
            duration,
            1 // Thickness in pixels
        );
        
        // Add a text label
        window.alt1.overLayText(
            a1lib.mixColor(255, 255, 255, 255), // White
            x,
            y - 10,
            duration,
            "Map X"
        );
        
        // Add a pulsing circle for better visibility
        const pulseInterval = setInterval(() => {
            const pulseColor = a1lib.mixColor(0, 255, 255, 150); // Cyan, semi-transparent
            window.alt1.overLayCircle(
                pulseColor,
                x + width/2,
                y + height/2,
                20, // Radius
                1000, // Duration
                2 // Thickness
            );
        }, 1000);
        
        // Clear the interval after the duration
        setTimeout(() => {
            clearInterval(pulseInterval);
        }, duration);
        
        // Refresh the overlay group
        window.alt1.overLayRefreshGroup("dungeoneering_map_x");
        
        console.log(`Highlighted dungeon map X at (${x}, ${y})`);
    } catch (error) {
        console.error("Error highlighting dungeon map X:", error);
    }
}

// Function to scan for the red X around the mouse cursor
export async function scanForRedXAroundMouse(mousePosition: { x: number, y: number }, debugMode = false): Promise<{ x: number, y: number } | null> {
    // Make sure Alt1 is available
    if (!window.alt1) {
        console.error("Alt1 not available");
        return null;
    }

    try {
        // Capture the screen
        const fullImg = a1lib.captureHoldFullRs();
        if (!fullImg) {
            console.error("Failed to capture screen");
            return null;
        }

        // Define the scan region around the mouse cursor
        const scanRadius = 30; // Increased from 20 to 30 pixels around the mouse to scan
        const regionX = Math.max(0, mousePosition.x - scanRadius);
        const regionY = Math.max(0, mousePosition.y - scanRadius);
        const regionWidth = Math.min(fullImg.width - regionX, scanRadius * 2);
        const regionHeight = Math.min(fullImg.height - regionY, scanRadius * 2);

        if (debugMode) {
            // Highlight the search region for debugging
            window.alt1.overLayClearGroup("debug_info");
            window.alt1.overLaySetGroup("debug_info");
            
            const debugColor = a1lib.mixColor(255, 0, 0, 100); // Semi-transparent red
            window.alt1.overLayRect(
                debugColor,
                regionX,
                regionY,
                regionWidth,
                regionHeight,
                3000,
                1
            );
            
            window.alt1.overLayText(
                a1lib.mixColor(255, 255, 255, 255),
                regionX,
                regionY - 10,
                3000,
                "Scanning for red X around mouse (30px radius)"
            );
            
            window.alt1.overLayRefreshGroup("debug_info");
        }

        // Get the image data for this region
        const regionImgData = fullImg.toData(regionX, regionY, regionWidth, regionHeight);
        const data = regionImgData.data;

        // Look for orange-red pixels that could form an X
        const redPixels: {x: number, y: number}[] = [];
        
        // First pass: find all orange-red pixels
        for (let y = 0; y < regionHeight; y++) {
            for (let x = 0; x < regionWidth; x++) {
                const idx = (y * regionWidth + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                
                // Check if this pixel is orange-red (high R, medium G, low B)
                // Adjusted thresholds to match the orange-red color in the screenshot
                if (r > 180 && g > 50 && g < 150 && b < 100 && r > g + 50) {
                    redPixels.push({ x, y });
                    
                    if (debugMode) {
                        // Mark detected pixels for debugging
                        const pixelScreenX = regionX + x;
                        const pixelScreenY = regionY + y;
                        window.alt1.overLaySetGroup("debug_pixels");
                        window.alt1.overLayRect(
                            a1lib.mixColor(0, 255, 0, 200),
                            pixelScreenX,
                            pixelScreenY,
                            1,
                            1,
                            3000,
                            1
                        );
                    }
                }
            }
        }
        
        if (debugMode && redPixels.length > 0) {
            console.log(`Found ${redPixels.length} orange-red pixels in scan area`);
            window.alt1.overLayRefreshGroup("debug_pixels");
        }
        
        if (redPixels.length > 0) {
            // Group red pixels into clusters
            const clusters = clusterRedPixels(redPixels, 15); // Increased from 10px to 15px radius for clustering
            
            if (debugMode) {
                console.log(`Found ${clusters.length} clusters of orange-red pixels`);
            }
            
            // Find the largest cluster
            if (clusters.length > 0) {
                let largestCluster = clusters[0];
                for (const cluster of clusters) {
                    if (cluster.length > largestCluster.length) {
                        largestCluster = cluster;
                    }
                }
                
                if (debugMode) {
                    console.log(`Largest cluster has ${largestCluster.length} pixels`);
                }
                
                // Lower the threshold for detection since the X might be smaller
                if (largestCluster && largestCluster.length >= 3) {
                    // Calculate the center of the cluster
                    let centerX = 0;
                    let centerY = 0;
                    
                    for (const pixel of largestCluster) {
                        centerX += pixel.x;
                        centerY += pixel.y;
                    }
                    
                    centerX = Math.floor(centerX / largestCluster.length);
                    centerY = Math.floor(centerY / largestCluster.length);
                    
                    // Convert back to screen coordinates
                    const result = { 
                        x: regionX + centerX, 
                        y: regionY + centerY 
                    };
                    
                    // Enhanced X shape verification
                    const isXShape = enhancedVerifyXShape(data, centerX, centerY, regionWidth, regionHeight);
                    
                    if (debugMode) {
                        console.log(`X shape verification result: ${isXShape}`);
                        
                        // Highlight the center point
                        window.alt1.overLaySetGroup("debug_center");
                        window.alt1.overLayCircle(
                            a1lib.mixColor(0, 0, 255, 255),
                            result.x,
                            result.y,
                            5,
                            3000,
                            2
                        );
                        window.alt1.overLayRefreshGroup("debug_center");
                    }
                    
                    // Accept the result if it looks like an X or has enough pixels
                    if (isXShape || largestCluster.length >= 4) {
                        console.log(`Found red X marker at (${result.x}, ${result.y}) near mouse with ${largestCluster.length} pixels`);
                        return result;
                    }
                }
            }
        }

        // If we didn't find a red X, try looking for the dungeon map X icon
        if (dungMapXLoaded) {
            // Create an ImageData from the dungeon map X icon
            const canvas = document.createElement("canvas");
            canvas.width = dungMapXIcon.width;
            canvas.height = dungMapXIcon.height;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(dungMapXIcon, 0, 0);
            const iconData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // Search with the icon
            const matches = fullImg.findSubimage(iconData, regionX, regionY, regionWidth, regionHeight);
            
            if (matches.length > 0) {
                const result = {
                    x: matches[0].x,
                    y: matches[0].y
                };
                
                console.log(`Found dungeon map X at (${result.x}, ${result.y}) near mouse`);
                return result;
            }
        }

        if (debugMode) {
            console.log("No red X or dungeon map X found around mouse position");
        }
        return null;
    } catch (error) {
        console.error("Error scanning for red X around mouse:", error);
        return null;
    }
}

// Enhanced function to verify if a cluster of pixels forms an X shape
function enhancedVerifyXShape(imageData: Uint8ClampedArray, centerX: number, centerY: number, width: number, height: number): boolean {
    // Check for orange-red pixels in diagonal directions from the center
    const directions = [
        { dx: -1, dy: -1 }, // top-left
        { dx: 1, dy: -1 },  // top-right
        { dx: -1, dy: 1 },  // bottom-left
        { dx: 1, dy: 1 }    // bottom-right
    ];
    
    let diagonalsWithRed = 0;
    
    for (const dir of directions) {
        let redPixelsInDirection = 0;
        
        // Check more pixels in each diagonal direction
        for (let i = 1; i <= 8; i++) {
            const x = centerX + (dir.dx * i);
            const y = centerY + (dir.dy * i);
            
            // Make sure we're within bounds
            if (x < 0 || y < 0 || x >= width || y >= height) continue;
            
            const idx = (y * width + x) * 4;
            const r = imageData[idx];
            const g = imageData[idx + 1];
            const b = imageData[idx + 2];
            
            // Check if this pixel is orange-red (adjusted thresholds)
            if (r > 180 && g > 50 && g < 150 && b < 100 && r > g + 50) {
                redPixelsInDirection++;
            }
        }
        
        // If we have at least 2 red pixels in this direction, count it
        if (redPixelsInDirection >= 2) {
            diagonalsWithRed++;
        }
    }
    
    // If we have red pixels in at least 3 of the 4 diagonal directions, it's likely an X
    return diagonalsWithRed >= 3;
} 