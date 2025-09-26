// scripts/generate-model-images.js
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const projects = [
  { name: 'hupey.cloud', modelURL: '/models/hupey-cloud.gltf' },
  { name: 'ColorCoding', modelURL: '/models/computer/scene.gltf' },
  { name: 'Connect4 AI', modelURL: '/models/connect4/scene.gltf' },
  { name: 'AIDE', modelURL: '/models/robot/scene.gltf' },
  { name: 'ColorStack UF Website', modelURL: '/models/colorstack.gltf' },
  { name: 'Blockchain Coin Alert System', modelURL: '/models/crypto/scene.gltf' },
];

async function waitForServer(url, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        console.log('✓ Server is ready');
        return true;
      }
    } catch (error) {
      console.log(`Waiting for server... (${i + 1}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  throw new Error('Server failed to start within timeout');
}

async function generateModelImages() {
  // Ensure directory exists
  const imagesDir = 'static/images/models';
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  console.log('Starting image generation...');
  
  // Wait for the dev server to be ready
  await waitForServer('http://localhost:5173');

  const browser = await chromium.launch({
    headless: true
  });

  const page = await browser.newPage();
  
  // Set viewport for consistent screenshots
  await page.setViewport({ width: 800, height: 600 });

  for (const project of projects) {
    try {
      console.log(`Generating image for: ${project.name}`);
      
      const filename = project.name.toLowerCase().replace(/\s+/g, '-');
      
      // Navigate to model preview page
      await page.goto(`http://localhost:5173/model-preview?model=${encodeURIComponent(project.modelURL)}`, {
        waitUntil: 'networkidle',
        timeout: 30000
      });
      
      // Wait for canvas to load
      await page.waitForSelector('canvas', { timeout: 15000 });
      
      // Wait for 3D model to render
      await page.waitForTimeout(5000);
      
      // Take screenshot
      await page.screenshot({
        path: `${imagesDir}/${filename}.webp`,
        type: 'webp',
        quality: 80
      });
      
      console.log(`✓ Generated: ${filename}.webp`);
      
    } catch (error) {
      console.error(`✗ Failed to generate image for ${project.name}:`, error.message);
    }
  }
  
  await browser.close();
  console.log('Image generation complete!');
}

generateModelImages().catch(console.error);
