// Import Alt1 dependencies
import * as a1lib from "@alt1/base";


// Initialize Alt1 detection
if (window.alt1) {
    a1lib.identifyApp("dungeoneering-optimization-gate-engine");
    
    if (window.alt1.permissionGameState) {
        console.log("Alt1 permissions active");
    } else {
        console.log("Alt1 permissions not active. The app will still function but cannot read game data.");
    }
} else {
    console.log("Alt1 not detected. The app will still function but cannot interact with the game.");
    document.body.classList.add("alt1-missing");
}



// Log when TypeScript is loaded
console.log("TypeScript module loaded");

// Simple function to initialize the app when the DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded");
    
    // Get DOM elements
    const toggleBtn = document.getElementById("toggle-sidebar");
    const sidebar = document.getElementById("sidebar");
    const navItems = document.querySelectorAll(".nav-item");
    const views = document.querySelectorAll(".view");
    
    // Add click event to toggle button
    if (toggleBtn && sidebar) {
        console.log("Toggle button and sidebar found");
        toggleBtn.addEventListener("click", function() {
            console.log("Toggle button clicked");
            sidebar.classList.toggle("expanded");
        });
    } else {
        console.error("Toggle button or sidebar not found");
    }
    
    // Add click events to navigation items
    navItems.forEach(item => {
        item.addEventListener("click", function(this: HTMLElement) {
            // Get the view ID from the data attribute
            const viewId = this.getAttribute("data-view");
            
            // Remove active class from all items
            navItems.forEach(navItem => {
                navItem.classList.remove("active");
            });
            
            // Add active class to clicked item
            this.classList.add("active");
            
            // Hide all views
            views.forEach(view => {
                view.classList.remove("active");
            });
            
            // Show the selected view
            if (viewId) {
                const viewToShow = document.getElementById(viewId);
                if (viewToShow) {
                    viewToShow.classList.add("active");
                }
            }
        });
    });
    
    console.log("App initialized");
});
