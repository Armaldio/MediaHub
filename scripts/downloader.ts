#!/usr/bin/env node

/**
 * Android App Intent Extractor (Node.js Version)
 *
 * This script downloads an Android application (APK or XAPK) from the Google Play Store
 * and extracts all declared intents from its AndroidManifest.xml file.
 *
 * Author: Your Name
 * Date: 2025-07-31
 *
 * Prerequisites:
 * - Node.js v18+
 * - apkeep: A command-line tool for downloading APKs.
 * Installation: https://github.com/EFForg/apkeep
 * - apktool: A tool for reverse engineering Android APK files.
 * Installation: https://ibotpeaches.github.io/Apktool/install/
 *
 * Setup:
 * 1. npm install
 *
 * Usage:
 * npm start -- extract_intents.ts <app_id>
 *
 * Example:
 * npm start -- extract_intents.ts com.google.android.gm
 */

import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { XMLParser } from 'fast-xml-parser';
import commandExists from 'command-exists';

const execAsync = promisify(exec);

// --- Type Definitions ---
interface IntentData {
    scheme?: string;
    host?: string;
    port?: string;
    path?: string;
    pathPattern?: string;
    pathPrefix?: string;
    mimeType?: string;
}

interface IntentFilter {
    component_type: string;
    component_name: string;
    actions: string[];
    categories: string[];
    data: IntentData[];
}

// --- Helper Functions ---

/**
 * Checks if a value is an array, if not, wraps it in an array.
 * Returns an empty array for null/undefined input.
 */
const ensureArray = <T>(item: T | T[] | undefined | null): T[] => {
    if (!item) return [];
    if (Array.isArray(item)) return item;
    return [item];
};

/**
 * Extracts an XAPK file to get the base APK.
 * @param xapkPath - The path to the XAPK file.
 * @param extractDir - The directory to extract the XAPK contents.
 * @returns The path to the base APK file within the extracted XAPK, or null if extraction fails.
 */
async function extractXapk(xapkPath: string, extractDir: string = "xapk_extracted"): Promise<string | null> {
    console.log(`[*] Extracting XAPK file: ${xapkPath}`);
    try {
        await fs.rm(extractDir, { recursive: true, force: true });
        await fs.mkdir(extractDir, { recursive: true });

        // Use unzip to extract the XAPK (which is a ZIP archive)
        await execAsync(`unzip "${xapkPath}" -d "${extractDir}"`);

        // Find the base APK file (usually the largest one or named 'base.apk')
        const files = await fs.readdir(extractDir);
        const apkFiles = files.filter(file => file.endsWith('.apk'));

        if (apkFiles.length === 0) {
            console.error(`[-] No APK files found in extracted XAPK`);
            return null;
        }

        // Prefer 'base.apk' if it exists, otherwise take the largest APK
        let baseApk: string | undefined = apkFiles.find(file => file === 'base.apk');
        if (!baseApk) {
            // Find the largest APK file
            let largestSize = 0;
            for (const apkFile of apkFiles) {
                const apkPath = path.join(extractDir, apkFile);
                const stats = await fs.stat(apkPath);
                if (stats.size > largestSize) {
                    largestSize = stats.size;
                    baseApk = apkFile;
                }
            }
        }

        const baseApkPath = path.join(extractDir, baseApk!);
        console.log(`[+] XAPK extracted successfully. Using base APK: ${baseApkPath}`);
        return baseApkPath;
    } catch (error) {
        console.error(`[-] Error extracting XAPK:`, error);
        return null;
    }
}

/**
 * Checks if apkeep, apktool, and unzip are installed and in the system's PATH.
 */
async function checkPrerequisites(): Promise<void> {
    try {
        await commandExists('apkeep');
    } catch (error) {
        console.error("Error: 'apkeep' not found. Please install it and ensure it's in your PATH.");
        console.error("Installation instructions: https://github.com/EFForg/apkeep");
        process.exit(1);
    }
    try {
        await commandExists('apktool');
    } catch (error) {
        console.error("Error: 'apktool' not found. Please install it and ensure it's in your PATH.");
        console.error("Installation instructions: https://ibotpeaches.github.io/Apktool/install/");
        process.exit(1);
    }
    try {
        await commandExists('unzip');
    } catch (error) {
        console.error("Error: 'unzip' not found. Please install it and ensure it's in your PATH.");
        console.error("Installation: sudo apt install unzip  # On Ubuntu/Debian");
        console.error("Installation: sudo yum install unzip  # On CentOS/RHEL");
        process.exit(1);
    }
}

// --- Core Logic ---

/**
 * Downloads an APK using apkeep.
 * @param appId - The package name of the app to download.
 * @param downloadDir - The directory to save the downloaded APK.
 * @returns The path to the downloaded APK file, or null if download fails.
 */
async function downloadApk(appId: string, downloadDir: string = "downloads"): Promise<string | null> {
    console.log(`[*] Downloading APK for ${appId}...`);
    try {
        await fs.mkdir(downloadDir, { recursive: true });
        await execAsync(`apkeep -a ${appId} ${downloadDir}`);

        const files = await fs.readdir(downloadDir);
        const xapkFile = files.find(file => file.endsWith('.xapk'));
        const apkFile = files.find(file => file.endsWith('.apk'));

        if (xapkFile) {
            const xapkPath = path.join(downloadDir, xapkFile);
            console.log(`[+] XAPK downloaded successfully: ${xapkPath}`);
            return xapkPath;
        } else if (apkFile) {
            const apkPath = path.join(downloadDir, apkFile);
            console.log(`[+] APK downloaded successfully: ${apkPath}`);
            return apkPath;
        } else {
            console.error(`[-] Could not find downloaded APK or XAPK for ${appId} in ${downloadDir}`);
            return null;
        }
    } catch (error) {
        console.error(`[-] Error downloading APK:`, error);
        return null;
    }
}

/**
 * Decompiles an APK or XAPK using apktool.
 * @param filePath - The path to the APK or XAPK file.
 * @param outputDir - The directory to store the decompiled files.
 * @returns The path to the decompiled directory, or null if decompilation fails.
 */
async function decompileApk(filePath: string, outputDir: string = "decompiled"): Promise<string | null> {
    console.log(`[*] Decompiling ${filePath}...`);

    try {
        // Check if it's an XAPK file and extract it first
        let apkToDecompile = filePath;
        let cleanupDir: string | null = null;

        if (filePath.endsWith('.xapk')) {
            console.log(`[*] Detected XAPK file, extracting first...`);
            const extractedApk = await extractXapk(filePath);
            if (!extractedApk) {
                console.error(`[-] Failed to extract XAPK file`);
                return null;
            }
            apkToDecompile = extractedApk;
            cleanupDir = path.dirname(extractedApk); // This will be the xapk_extracted directory
        }

        await fs.rm(outputDir, { recursive: true, force: true });
        await execAsync(`apktool d "${apkToDecompile}" -o ${outputDir} -f -j1`);
        console.log(`[+] File decompiled successfully to: ${outputDir}`);

        // Clean up extracted XAPK directory if we created one
        if (cleanupDir) {
            await fs.rm(cleanupDir, { recursive: true, force: true });
            console.log(`[+] Cleaned up extracted XAPK directory`);
        }

        return outputDir;
    } catch (error) {
        console.error(`[-] Error decompiling file:`, error);
        return null;
    }
}

/**
 * Extracts intents from the AndroidManifest.xml file.
 * @param decompiledDir - The path to the directory containing the decompiled APK.
 * @returns A list of intent filters.
 */
async function extractIntents(decompiledDir: string): Promise<IntentFilter[]> {
    console.log("[*] Extracting intents from AndroidManifest.xml...");
    const manifestPath = path.join(decompiledDir, "AndroidManifest.xml");
    try {
        const xmlData = await fs.readFile(manifestPath, 'utf-8');
        const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });
        const manifest = parser.parse(xmlData);

        const intents: IntentFilter[] = [];
        const application = manifest?.manifest?.application;

        if (!application) {
            console.warn("[-] No <application> tag found in manifest.");
            return [];
        }

        const componentTypes = ["activity", "service", "receiver"];
        for (const type of componentTypes) {
            for (const component of ensureArray(application[type])) {
                const componentName = component['android:name'];
                for (const intentFilter of ensureArray(component['intent-filter'])) {
                    const intentData: IntentFilter = {
                        component_type: type,
                        component_name: componentName,
                        actions: ensureArray(intentFilter.action).map(a => a['android:name']),
                        categories: ensureArray(intentFilter.category).map(c => c['android:name']),
                        data: ensureArray(intentFilter.data).map(d => ({
                            scheme: d['android:scheme'],
                            host: d['android:host'],
                            port: d['android:port'],
                            path: d['android:path'],
                            pathPattern: d['android:pathPattern'],
                            pathPrefix: d['android:pathPrefix'],
                            mimeType: d['android:mimeType'],
                        })),
                    };
                    intents.push(intentData);
                }
            }
        }

        console.log(`[+] Found ${intents.length} intent filters.`);
        return intents;
    } catch (error) {
        console.error(`[-] Error processing AndroidManifest.xml:`, error);
        return [];
    }
}

// --- Main Execution ---

async function main() {
    const args = process.argv.slice(2);
    if (args.length !== 1) {
        console.log("Usage: npm start -- extract_intents.ts <app_id>");
        process.exit(1);
    }
    const appId = args[0];

    await checkPrerequisites();

    const apkPath = await downloadApk(appId);
    if (!apkPath) process.exit(1);

    const decompiledDir = await decompileApk(apkPath);
    if (!decompiledDir) process.exit(1);

    const intents = await extractIntents(decompiledDir);

    if (intents.length > 0) {
        console.log("\n--- Extracted Intents ---");
        intents.forEach((intent, i) => {
            console.log(`\n[${i + 1}] Component: ${intent.component_type} (${intent.component_name})`);
            if (intent.actions.length) console.log(`  Actions: ${intent.actions.join(', ')}`);
            if (intent.categories.length) console.log(`  Categories: ${intent.categories.join(', ')}`);
            if (intent.data.length) {
                console.log("  Data:");
                intent.data.forEach(d => {
                    const dataStr = Object.entries(d)
                        .filter(([, value]) => value !== undefined)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(", ");
                    if (dataStr) console.log(`    - ${dataStr}`);
                });
            }
        });
        console.log("\n--- End of Report ---");
    }

    // Clean up temporary directories
    console.log("\n[*] Cleaning up temporary files...");
    await fs.rm("downloads", { recursive: true, force: true });
    await fs.rm("decompiled", { recursive: true, force: true });
    console.log("[+] Cleanup complete.");
}

main().catch(error => {
    console.error("An unexpected error occurred:", error);
    process.exit(1);
});
