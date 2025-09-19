# Quick Start: Generate Preview Images

You currently have no preview images, so mobile users will see the 3D models (which might crash). Here's how to fix this quickly:

## Option 1: Use the Simple Generator (Fastest)

1. **Open the generator:**
   - Navigate to: `frontend/static/generate-preview.html`
   - Double-click to open in your browser

2. **Generate previews:**
   - Select each model from the dropdown
   - Click "Download Preview" for each one
   - Or click "Generate All Previews" to download all at once

3. **Install the previews:**
   - Move the downloaded PNG files to `frontend/static/images/previews/`
   - Make sure they're named correctly:
     - `hupey-cloud.png`
     - `hupey-avatar.png` 
     - `colorstack.png`

## Option 2: Use Your Dev Server (Better Quality)

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Open preview generator:**
   - Go to: `http://localhost:5173/model-preview`

3. **Generate previews:**
   - Select model from dropdown
   - Wait for 3D model to load
   - Click "Download Preview"
   - Save to `static/images/previews/`

## Option 3: Manual Screenshots

1. **Take screenshots** of your 3D models from your main site
2. **Edit them** to be square (512x512 or 1024x1024)
3. **Save as PNG** in `static/images/previews/`

## Test Your Previews

After creating the images:

1. **Test mobile view:**
   - Use browser dev tools
   - Switch to mobile device simulation
   - Refresh your site
   - You should see PNG images instead of 3D models

2. **Check file names match:**
   ```
   static/models/hupey-cloud.gltf  →  static/images/previews/hupey-cloud.png
   static/models/hupey-avatar.gltf →  static/images/previews/hupey-avatar.png
   static/models/colorstack.gltf   →  static/images/previews/colorstack.png
   ```

## Current Status

Your models that need previews:
- ✅ `hupey-cloud.gltf` 
- ❌ `hupey-avatar.gltf` (needs preview)
- ❌ `colorstack.gltf` (needs preview)

Once you create these 3 PNG files, your mobile optimization will be complete!