#!/usr/bin/env node

/**
 * TMG Alt1 Toolset Deployment Script
 *
 * This script handles local deployment preparation for Alt1 plugins.
 * It builds all plugins and prepares them for deployment to GitHub Pages.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PLUGINS_DIR = 'plugins';
const DEPLOY_DIR = 'deploy-local';
const BRANCH_NAME = process.env.GITHUB_REF_NAME || 'local';

console.log('🚀 TMG Alt1 Toolset Deployment Script');
console.log(`📂 Branch: ${BRANCH_NAME}`);
console.log('=' .repeat(50));

/**
 * Execute shell command with error handling
 */
function runCommand(command, cwd = process.cwd()) {
    try {
        console.log(`💻 Running: ${command}`);
        const result = execSync(command, {
            cwd,
            stdio: 'inherit',
            encoding: 'utf8'
        });
        return result;
    } catch (error) {
        console.error(`❌ Command failed: ${command}`);
        console.error(`   Error: ${error.message}`);
        process.exit(1);
    }
}

/**
 * Copy directory recursively
 */
function copyDir(src, dest) {
    if (!fs.existsSync(src)) {
        console.log(`⚠️  Source directory not found: ${src}`);
        return false;
    }

    fs.mkdirSync(dest, { recursive: true });

    const files = fs.readdirSync(src);
    for (const file of files) {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);

        if (fs.statSync(srcPath).isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
    return true;
}

/**
 * Get list of available plugins
 */
function getPlugins() {
    if (!fs.existsSync(PLUGINS_DIR)) {
        console.log(`❌ Plugins directory not found: ${PLUGINS_DIR}`);
        return [];
    }

    return fs.readdirSync(PLUGINS_DIR).filter(item => {
        const pluginPath = path.join(PLUGINS_DIR, item);
        return fs.statSync(pluginPath).isDirectory();
    });
}

/**
 * Generate index.html for plugin directory
 */
function generateIndexPage(deployDir, plugins) {
    const baseUrl = BRANCH_NAME === 'main'
        ? 'https://baglett.github.io/tmg_alt1_toolset'
        : `https://baglett.github.io/tmg_alt1_toolset/${BRANCH_NAME}`;

    const pluginCards = plugins.map(plugin => {
        // Read plugin metadata from package.json or appconfig.json
        let pluginName = plugin;
        let pluginDescription = `Alt1 plugin: ${plugin}`;

        try {
            const packagePath = path.join(PLUGINS_DIR, plugin, 'package.json');
            if (fs.existsSync(packagePath)) {
                const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
                pluginName = packageJson.name?.replace('@tmg-alt1/', '') || plugin;
                pluginDescription = packageJson.description || pluginDescription;
            }

            const appconfigPath = path.join(PLUGINS_DIR, plugin, 'src', 'appconfig.json');
            if (fs.existsSync(appconfigPath)) {
                const appconfig = JSON.parse(fs.readFileSync(appconfigPath, 'utf8'));
                pluginName = appconfig.appName || pluginName;
                pluginDescription = appconfig.description || pluginDescription;
            }
        } catch (error) {
            console.log(`⚠️  Could not read metadata for plugin: ${plugin}`);
        }

        return `
            <div class="plugin">
              <h2>${getPluginIcon(plugin)} ${pluginName}</h2>
              <p>${pluginDescription}</p>
              <a href="alt1://addapp/${baseUrl}/${plugin}/appconfig.json" class="install-link">📥 Install in Alt1</a>
              <a href="${plugin}/" style="margin-left: 10px;">📂 Browse Files</a>
            </div>`;
    }).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TMG Alt1 Toolset - ${BRANCH_NAME}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 40px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .plugin {
            margin: 24px 0;
            padding: 20px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .plugin h2 {
            margin: 0 0 10px 0;
            color: #ffffff;
        }
        .plugin p {
            margin: 0 0 15px 0;
            opacity: 0.9;
        }
        .install-link {
            background: linear-gradient(45deg, #51cf66, #40c057);
            color: white;
            padding: 12px 20px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            display: inline-block;
            transition: all 0.2s ease;
        }
        .install-link:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        .browse-link {
            color: #74c0fc;
            text-decoration: none;
            margin-left: 15px;
        }
        .browse-link:hover {
            text-decoration: underline;
        }
        .instructions {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 12px;
            padding: 20px;
            margin-top: 30px;
        }
        .instructions h3 {
            margin: 0 0 15px 0;
            color: #74c0fc;
        }
        .instructions ol {
            margin: 0;
            padding-left: 20px;
        }
        .instructions li {
            margin: 8px 0;
            opacity: 0.9;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            opacity: 0.7;
            font-size: 14px;
        }
        .branch-badge {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            margin-left: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 TMG Alt1 Toolset<span class="branch-badge">${BRANCH_NAME}</span></h1>
        <p>Advanced Alt1 plugins for RuneScape automation and optimization.</p>

        ${pluginCards}

        <div class="instructions">
            <h3>📋 Installation Instructions</h3>
            <ol>
                <li>Ensure <strong>Alt1 Toolkit</strong> is installed and running</li>
                <li>Click the "📥 Install in Alt1" button for the desired plugin</li>
                <li>Alt1 will prompt to add the app - click <strong>"Add App"</strong></li>
                <li>Grant necessary permissions (pixel, overlay) when prompted</li>
                <li>The plugin will appear in your Alt1 apps list</li>
            </ol>
        </div>

        <div class="footer">
            <p>
                <strong>Branch:</strong> ${BRANCH_NAME} |
                <strong>Repository:</strong> <a href="https://github.com/baglett/tmg_alt1_toolset" style="color: #74c0fc;">tmg_alt1_toolset</a>
            </p>
        </div>
    </div>
</body>
</html>`;

    fs.writeFileSync(path.join(deployDir, 'index.html'), html);
    console.log(`📄 Generated index page: ${path.join(deployDir, 'index.html')}`);
}

/**
 * Get appropriate icon for plugin
 */
function getPluginIcon(plugin) {
    const icons = {
        'dungeoneering-optimizer': '🏰',
        'advanced-windows-test': '🪟',
        'mouse-text-tool': '🔍'
    };
    return icons[plugin] || '🔧';
}

/**
 * Main deployment function
 */
function main() {
    console.log('📋 Starting deployment process...');

    // Clean and create deploy directory
    if (fs.existsSync(DEPLOY_DIR)) {
        fs.rmSync(DEPLOY_DIR, { recursive: true });
    }
    fs.mkdirSync(DEPLOY_DIR, { recursive: true });

    // Determine deploy subdirectory based on branch
    const deploySubDir = BRANCH_NAME === 'main' ? DEPLOY_DIR : path.join(DEPLOY_DIR, BRANCH_NAME);
    if (BRANCH_NAME !== 'main') {
        fs.mkdirSync(deploySubDir, { recursive: true });
    }

    // Get available plugins
    const plugins = getPlugins();
    console.log(`🔍 Found plugins: ${plugins.join(', ')}`);

    if (plugins.length === 0) {
        console.log('❌ No plugins found to deploy');
        process.exit(1);
    }

    // Deploy each plugin
    const deployedPlugins = [];
    for (const plugin of plugins) {
        const pluginDistPath = path.join(PLUGINS_DIR, plugin, 'dist');
        const pluginDeployPath = path.join(deploySubDir, plugin);

        if (copyDir(pluginDistPath, pluginDeployPath)) {
            console.log(`✅ Deployed plugin: ${plugin}`);
            deployedPlugins.push(plugin);
        } else {
            console.log(`⚠️  Skipped plugin (no dist): ${plugin}`);
        }
    }

    // Generate index page
    if (deployedPlugins.length > 0) {
        generateIndexPage(deploySubDir, deployedPlugins);
        console.log(`📋 Deployment summary:`);
        console.log(`   • Branch: ${BRANCH_NAME}`);
        console.log(`   • Plugins deployed: ${deployedPlugins.length}`);
        console.log(`   • Deploy directory: ${deploySubDir}`);
        console.log(`   • Deployed plugins: ${deployedPlugins.join(', ')}`);
    } else {
        console.log('❌ No plugins were successfully deployed');
        process.exit(1);
    }

    console.log('✅ Deployment completed successfully!');
    console.log('');
    console.log('🚨 IMPORTANT: After pushing to GitHub, ALWAYS monitor deployment:');
    console.log('   📊 Check: https://github.com/baglett/tmg_alt1_toolset/actions');
    console.log('   ⏱️  Monitor the latest workflow run for success/failure');
    console.log('   🔧 Fix any failures immediately before next commit');
    console.log('   🌐 Verify deployment URL is accessible after success');
}

// Run the deployment
if (require.main === module) {
    main();
}

module.exports = { main, getPlugins, copyDir, generateIndexPage };