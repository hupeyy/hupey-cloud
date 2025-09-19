# How to Generate Model Previews

Since the automated script requires additional dependencies that can be tricky to install on Windows, here are simple manual approaches:

## Method 1: Browser-based Generator (Easiest)

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Open the preview generator:**
   Navigate to: `http://localhost:5173/model-preview`

3. **Generate previews:**
   - Select your model from the dropdown
   - Wait for it to load and render nicely
   - Click "Download Preview"
   - Save the PNG file

4. **Install the preview:**
   - Move the downloaded PNG to `static/images/previews/`
   - Rename it to match your model name (e.g., `hupey-cloud.png`)

## Method 2: Manual Screenshots

1. **Take a screenshot:**
   - Open your site in a browser
   - Navigate to a page with your 3D model
   - Take a high-quality screenshot (use browser dev tools to set a specific resolution)

2. **Edit the image:**
   - Crop to show just the model
   - Make it square (1024x1024 recommended)
   - Save as PNG

3. **Install the preview:**
   - Place in `static/images/previews/`
   - Name it to match your model (e.g., `hupey-cloud.png`)

## Method 3: Use Online Tools

1. **Upload your GLTF to an online viewer:**
   - https://gltf-viewer.donmccurdy.com/
   - https://sandbox.babylonjs.com/
   - https://threejs.org/editor/

2. **Take a screenshot** of the rendered model

3. **Save and install** as described above

## File Naming Convention

Your preview images should be named to match your model files:

```
static/models/hupey-cloud.gltf  →  static/images/previews/hupey-cloud.png
static/models/my-model.gltf     →  static/images/previews/my-model.png
static/models/colorstack.gltf   →  static/images/previews/colorstack.png
```

## Testing

After creating preview images:

1. **Test on mobile** (or use browser dev tools to simulate mobile)
2. **Check that images load** instead of 3D models
3. **Verify fallback** works if images fail to load

The system will automatically detect mobile devices and show your PNG previews instead of rendering the 3D models!