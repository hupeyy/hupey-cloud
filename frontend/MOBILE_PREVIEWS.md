# Mobile 3D Model Previews

This system automatically shows high-quality PNG previews of 3D models on mobile devices instead of rendering the actual 3D models, preventing crashes and improving performance.

## How it works

1. **Desktop**: Shows full 3D models with Three.js/Threlte
2. **Mobile**: Shows static PNG previews for better performance

## Generating Preview Images

### Option 1: Browser-based Generator (Recommended)
1. Start your development server:
   ```bash
   npm run dev
   ```
2. Navigate to: `http://localhost:5173/model-preview`
3. Select your model from the dropdown
4. Wait for it to render
5. Click "Download Preview" to save the PNG
6. Place the downloaded file in `static/images/previews/`
7. Rename to match your model (e.g., `hupey-cloud.png`)

### Option 2: Manual Screenshots
1. Take screenshots of your 3D models from your preferred angle
2. Save as high-quality PNG files (1024x1024 recommended)
3. Place in `static/images/previews/`
4. Name them to match your model files:
   - `hupey-cloud.gltf` → `hupey-cloud.png`
   - `my-model.gltf` → `my-model.png`

## Usage in Components

```svelte
<ModelViewer
  modelURL="/models/my-model.gltf"
  previewImage="/images/previews/my-model.png"
  scale={2}
  cameraPosition={[7, 7, 7]}
  alt="My 3D Model"
/>
```

## File Structure
```
static/
├── models/
│   ├── hupey-cloud.gltf
│   └── other-model.gltf
└── images/
    └── previews/
        ├── hupey-cloud.png
        └── other-model.png
```

## Benefits

- ✅ No mobile crashes from memory issues
- ✅ Faster loading on mobile devices
- ✅ Better user experience across all devices
- ✅ Automatic fallback system
- ✅ Maintains full 3D experience on desktop