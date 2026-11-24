import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * AvatarViewer — shows your Blender avatar (GLB) with Three.js.
 *
 *  • Put the file at  assets/avatar/avatar.glb  (see documentation/BLENDER_GUIDE.md)
 *  • FALLBACK: if the file is missing or broken, this component renders NOTHING,
 *    so the hero frame stays exactly as in the design. No fake model is shown.
 *  • The model is auto-scaled and centred, so any export size works.
 *  • The canvas resizes with its container (responsive).
 *  • The avatar gently turns to follow the pointer (disabled for reduced motion).
 */

// The dev server returns index.html (HTTP 200) for missing files, so we check the
// first bytes: a real GLB starts with the text "glTF".
async function glbExists(url) {
  try {
    const res = await fetch(url, { headers: { Range: 'bytes=0-3' } })
    if (!res.ok) return false
    const buf = await res.arrayBuffer()
    return new TextDecoder().decode(buf.slice(0, 4)) === 'glTF'
  } catch {
    return false
  }
}

export default function AvatarViewer({ src }) {
  const mountRef = useRef(null)
  const [available, setAvailable] = useState(false)

  useEffect(() => {
    let cancelled = false
    glbExists(src).then((ok) => !cancelled && setAvailable(ok))
    return () => { cancelled = true }
  }, [src])

  useEffect(() => {
    if (!available || !mountRef.current) return
    const mount = mountRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // --- scene, camera, lights -------------------------------------------
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
    scene.add(new THREE.HemisphereLight(0xffffff, 0x222222, 1.1))
    const key = new THREE.DirectionalLight(0xffffff, 2)
    key.position.set(2, 3, 4)
    scene.add(key)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)

    let model = null
    let raf = 0
    let targetY = 0

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount
      if (!w || !h) return
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.render(scene, camera)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(mount)

    // --- load the model ----------------------------------------------------
    new GLTFLoader().load(
      src,
      (gltf) => {
        model = gltf.scene
        // centre the model and fit the camera to its size
        const box = new THREE.Box3().setFromObject(model)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())
        model.position.sub(center)
        const fitHeight = size.y / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)))
        camera.position.set(0, 0, fitHeight * 1.25 + size.z)
        scene.add(model)
        resize()
        loop()
      },
      undefined,
      () => setAvailable(false), // load error → fall back to nothing
    )

    const onMove = (e) => {
      const r = mount.getBoundingClientRect()
      targetY = (((e.clientX - r.left) / r.width) - 0.5) * 0.8
    }
    if (!reduced) window.addEventListener('pointermove', onMove)

    function loop() {
      if (model && !reduced) model.rotation.y += (targetY - model.rotation.y) * 0.06
      renderer.render(scene, camera)
      if (!reduced) raf = requestAnimationFrame(loop)
    }

    // --- cleanup -------------------------------------------------------------
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      scene.traverse((o) => {
        o.geometry?.dispose?.()
        const m = o.material
        if (m) (Array.isArray(m) ? m : [m]).forEach((x) => x.dispose?.())
      })
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [available, src])

  if (!available) return null
  return <div className="avatar" ref={mountRef} aria-label="3D avatar" role="img" />
}
