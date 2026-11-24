# Creating the 3D avatar in Blender and adding it to the website

> STATUS: the website is READY for a GLB avatar, but **no model has been made yet**.
> You (or your team) create it in Blender, following this guide.

## 1. Plan the avatar (for the report too)
- Style: match Pappu — a simple, rounded, off-white blob with two small eyes and a smile. Keep it low-poly (under ~10 000 triangles) so it loads fast on phones.
- Sketch front and side views first (Procreate/Illustrator). Save them in `blender/reference/`.

## 2. Modelling steps in Blender (3.6 LTS or newer)
1. **Reference images**: Add ▸ Image ▸ Reference, place front/side views.
2. **Base shape**: start with a Cube, add a *Subdivision Surface* modifier (level 2) and *Mirror* modifier, push vertices to match Pappu's rounded-square head.
3. **Face**: add two small flattened spheres (eyes) and a curved mouth (Bezier curve with *Bevel* ▸ Depth, then Convert ▸ Mesh).
4. **Material**: Principled BSDF, Base Color off-white (#fbfbf6), Roughness 0.6. Eyes/mouth: near-black (#111). Keep ONE material per colour.
5. **Origin & scale**: select all ▸ `Ctrl+A` ▸ *All Transforms*; put the origin at the bottom centre; keep the model about 2 m tall (Blender units).
6. (Optional) **Animation**: simple idle breathing with 2 keyframes (Scale Z 1.0 ↔ 1.03), loop. Rigging is optional for this project.

## 3. Export as GLB
`File ▸ Export ▸ glTF 2.0 (.glb/.gltf)`
- Format: **glTF Binary (.glb)**
- Include: Selected Objects (select only the avatar)
- Transform: **+Y Up** (default)
- Mesh: Apply Modifiers ✔
- Compression: leave off for now (or enable Draco later to shrink the file)
- Save as **`assets/avatar/avatar.glb`**

## 4. See it on the website
```bash
cd frontend
npm run dev
```
Reload the page: the avatar appears inside the top frame (bottom-right) and gently turns to follow the mouse.

## 5. How the code handles it (`frontend/src/components/avatar/AvatarViewer.jsx`)
| Need | How |
|------|-----|
| Where is the file? | `assets/avatar/avatar.glb` (path in `frontend/src/data/site.js ▸ avatar.glb`) |
| Three.js | plain `three` + `GLTFLoader`, loaded lazily (doesn't slow the first page load) |
| Responsive size | a `ResizeObserver` resizes the canvas with its container |
| Camera / lights | auto-fits the camera to the model's bounding box; hemisphere light + one key light |
| Fallback | if the file is missing/broken, **nothing is rendered** and the page stays as designed (an error boundary also protects the page) |
| Reduced motion | the pointer-follow animation is disabled |

## 6. Troubleshooting
- *Model is black* → check lights/materials; make sure the material is Principled BSDF.
- *Model is tiny/huge* → apply scale (`Ctrl+A`) before export; the viewer auto-fits, so extreme sizes are the only problem.
- *Nothing appears* → open `http://localhost:5173/avatar/avatar.glb` in the browser: it should download a file. If you see the website instead, the file isn't in `assets/avatar/`.
- Want the avatar somewhere else (e.g. a bigger standalone section)? Edit the `.avatar` rules in `frontend/src/styles/sections.css` or render `<AvatarViewer />` in another component.
