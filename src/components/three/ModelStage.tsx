import { OrbitControls, useAnimations, useGLTF } from '@react-three/drei'
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber'
import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import { AnimationMixer, Box3, Group, Vector3, type Mesh, type Object3D } from 'three'
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { Button } from '../ui/Button'

export type Hotspot = {
  /** Position in stage units: the model is centred at the origin and its largest side measures 2.4. */
  at: [number, number, number]
  label: string
  text: ReactNode
}

type Props = {
  /** Path under /public, e.g. "/models/heart.glb". */
  src: string
  /** What the model shows, for people who cannot see it. */
  alt: string
  hotspots?: Hotspot[]
  /** Euler rotation in radians applied to the model (e.g. [-Math.PI / 2, 0, 0] to lay a standing body on its back). */
  rotation?: [number, number, number]
  autoRotate?: boolean
  /** Play the model's first animation clip. */
  animate?: boolean
  /** Names of nodes to hide. */
  hide?: string[]
  /** Extra react-three-fiber nodes placed in the same stage units (pads, arrows, markers). */
  children?: ReactNode
  /** Camera distance; default 4.6 frames the whole model. */
  distance?: number
  /** Camera height; default 0.4. Raise it to look down on a model lying flat. */
  height?: number
  /** Point the camera looks at and orbits around, in stage units; default the model's centre [0, 0, 0]. Use it with a smaller `distance` to frame a detail (e.g. the chest of the standing body at about [0, 0.55, 0]). */
  target?: [number, number, number]
  /** For heavy files: show a button and load only on request. Pass the size label, e.g. "28 MB". */
  deferLabel?: string
  className?: string
}

function Model({ src, rotation = [0, 0, 0], animate, hide, onPick, onReady }: Pick<Props, 'src' | 'rotation' | 'animate' | 'hide'> & { onPick?: (p: Vector3) => void; onReady: () => void }) {
  const group = useRef<Group>(null)
  const { scene: original, animations } = useGLTF(src)
  const key = JSON.stringify([rotation, hide, animate])
  // One clone per stage, so the same file can appear in several stages at once (SkeletonUtils keeps skinned bones bound).
  // Size and centre are measured on the visible meshes only, after rotation, so hidden props do not shrink or shift the model;
  // an animated model is measured across its whole clip, so it stays in frame while it moves.
  const { scene, scale, offset } = useMemo(() => {
    const scene = cloneSkinned(original)
    scene.traverse((o) => {
      if (hide?.includes(o.name)) o.visible = false
    })
    const probe = new Group()
    probe.rotation.set(...rotation)
    probe.add(scene)
    const box = new Box3()
    const measure = () => {
      // Bones must be posed before measuring, or skinned models (the skeleton) report their bind-pose size.
      probe.updateMatrixWorld(true)
      scene.traverse((o) => {
        let shown: boolean = (o as Mesh).isMesh
        for (let p: Object3D | null = o; shown && p && p !== probe; p = p.parent) shown = p.visible
        if (shown) box.expandByObject(o, true)
      })
    }
    const clip = animate ? animations[0] : undefined
    if (clip) {
      const mixer = new AnimationMixer(scene)
      const action = mixer.clipAction(clip).play()
      for (let i = 0; i <= 8; i++) {
        mixer.setTime((clip.duration * i) / 8)
        measure()
      }
      mixer.setTime(0)
      action.stop()
      mixer.uncacheRoot(scene)
    } else measure()
    probe.remove(scene)
    const scale = 2.4 / Math.max(...box.getSize(new Vector3()).toArray(), 0.0001)
    return { scene, scale, offset: box.getCenter(new Vector3()).multiplyScalar(-scale) }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` stands for rotation, hide and animate; callers pass fresh array literals
  }, [original, animations, key])
  const { actions, names } = useAnimations(animations, group)

  useEffect(() => {
    const a = animate ? actions[names[0]] : undefined
    a?.reset().play()
    return () => void a?.stop()
  }, [animate, actions, names])
  useEffect(onReady, [onReady])

  return (
    <group position={offset}>
      <group ref={group} rotation={rotation} scale={scale} onPointerDown={onPick && ((e: ThreeEvent<PointerEvent>) => (e.stopPropagation(), onPick(e.point)))}>
        <primitive object={scene} />
      </group>
    </group>
  )
}

/** Moves the DOM hotspot buttons to the screen position of their 3D points every frame. */
function Projector({ hotspots, pins }: { hotspots: Hotspot[]; pins: RefObject<(HTMLElement | null)[]> }) {
  const v = useMemo(() => new Vector3(), [])
  const toCam = useMemo(() => new Vector3(), [])
  useFrame(({ camera, size }) => {
    hotspots.forEach((h, i) => {
      const el = pins.current[i]
      if (!el) return
      v.set(...h.at)
      // A point on the far side of the model (facing away from the camera) is dimmed.
      const facing = v.clone().normalize().dot(toCam.copy(camera.position).normalize()) > -0.15
      v.project(camera)
      el.style.transform = `translate(${((v.x + 1) / 2) * size.width}px, ${((1 - v.y) / 2) * size.height}px) translate(-50%, -50%)`
      el.style.opacity = facing ? '1' : '0.35'
    })
  })
  return null
}

class Boundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError = () => ({ failed: true })
  render = () => (this.state.failed ? this.props.fallback : this.props.children)
}

/**
 * A 3D model you can turn, with optional labelled hotspots. Sits on the dark well, so wrap it in <Stage>
 * or use it full-bleed inside a ScrollStory visual. Add `?debug3d` to the URL to click the model and read
 * the stage coordinates of the point, for placing hotspots.
 */
export function ModelStage({ src, alt, hotspots = [], rotation, autoRotate, animate, hide, children, distance = 4.6, height = 0.4, target = [0, 0, 0], deferLabel, className = 'h-[26rem]' }: Props) {
  const wrap = useRef<HTMLDivElement>(null)
  const pins = useRef<(HTMLElement | null)[]>([])
  const [visible, setVisible] = useState(false)
  // The canvas mounts the first time the stage comes near the viewport and stays mounted after that.
  const [seen, setSeen] = useState(false)
  const [open, setOpen] = useState<number | null>(null)
  const [load, setLoad] = useState(!deferLabel)
  const [ready, setReady] = useState(false)
  const [picked, setPicked] = useState('')
  const debug = typeof location !== 'undefined' && location.search.includes('debug3d')
  const onReady = useMemo(() => () => setReady(true), [])

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting)
        if (e.isIntersecting) setSeen(true)
      },
      { rootMargin: '300px' },
    )
    const el = wrap.current
    if (el) {
      io.observe(el)
      // Do not wait for the observer's first report (late or missing in background tabs).
      const r = el.getBoundingClientRect()
      if (r.top < innerHeight + 300 && r.bottom > -300) {
        setVisible(true)
        setSeen(true)
      }
    }
    return () => io.disconnect()
  }, [])

  const failed = <p className="grid h-full place-items-center p-6 text-center text-well-soft">Il modello 3D non si è caricato. {alt}</p>

  return (
    <div>
      <div ref={wrap} className={`relative overflow-hidden rounded-chip bg-well-2 ${className}`} role="img" aria-label={alt}>
        {!load ? (
          <div className="grid h-full place-items-center p-6 text-center">
            <div>
              <p className="mb-4 max-w-[40ch] text-well-soft">{alt}</p>
              <Button variant="onDark" onClick={() => setLoad(true)}>
                Carica il modello 3D ({deferLabel})
              </Button>
            </div>
          </div>
        ) : !seen ? (
          <p className="grid h-full place-items-center text-well-soft">Carico il modello…</p>
        ) : (
          <Boundary fallback={failed}>
            <Canvas dpr={[1, 2]} camera={{ position: [target[0], target[1] + height, target[2] + distance], fov: 35 }} frameloop={visible ? 'always' : 'never'} onCreated={debug ? (s) => ((window as unknown as { __stages: unknown[] }).__stages ??= []).push({ s, src, hotspots }) : undefined}>
              <hemisphereLight args={['#ffffff', '#1c3a2b', 1.5]} />
              <directionalLight position={[3, 5, 4]} intensity={2.6} />
              <directionalLight position={[-4, 2, -3]} intensity={1.1} color="#d4f76a" />
              <Suspense fallback={null}>
                <Model src={src} rotation={rotation} animate={animate} hide={hide} onReady={onReady} onPick={debug ? (p) => setPicked(p.toArray().map((n) => n.toFixed(2)).join(', ')) : undefined} />
                {children}
              </Suspense>
              {hotspots.length > 0 && <Projector hotspots={hotspots} pins={pins} />}
              <OrbitControls makeDefault target={target} enablePan={false} enableZoom={false} autoRotate={autoRotate && open === null} autoRotateSpeed={0.9} minPolarAngle={0.3} maxPolarAngle={2.6} />
            </Canvas>
            {!ready && <p className="pointer-events-none absolute inset-0 grid place-items-center text-well-soft">Carico il modello…</p>}
            {ready &&
              hotspots.map((h, i) => (
                <button
                  key={h.label}
                  ref={(el) => {
                    pins.current[i] = el
                  }}
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-label={h.label}
                  aria-pressed={open === i}
                  className={`absolute left-0 top-0 grid size-7 place-items-center rounded-full font-display text-[1rem] font-extrabold leading-none shadow-raise ring-2 ring-well transition-[background-color,opacity] duration-150 ${open === i ? 'bg-on-sign text-well' : 'bg-lume text-well'}`}
                >
                  {i + 1}
                </button>
              ))}
          </Boundary>
        )}
        {debug && <p className="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 font-mono text-xs text-white">at: [{picked}]</p>}
      </div>

      {hotspots.length > 0 && (
        <div className="mt-4 grid gap-x-6 gap-y-3 md:grid-cols-[minmax(0,15rem)_1fr]">
          <ol className="flex flex-wrap gap-2 md:flex-col md:flex-nowrap">
            {hotspots.map((h, i) => (
              <li key={h.label}>
                <button type="button" onClick={() => setOpen(i)} aria-pressed={open === i} className={`flex w-full items-center gap-2.5 rounded-chip px-2.5 py-1.5 text-left text-[0.95rem] leading-tight transition-colors duration-150 ${open === i ? 'bg-well-2 text-lume' : 'text-well-ink hover:bg-well-2'}`}>
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-lume font-display text-[0.95rem] font-extrabold leading-none text-well">{i + 1}</span>
                  {h.label}
                </button>
              </li>
            ))}
          </ol>
          <div className="min-h-24 rounded-chip bg-well-2 p-4 [&>*+*]:mt-2" aria-live="polite">
            {open === null ? (
              <p className="text-well-soft">Trascina per ruotare il modello. Scegli un numero per leggere cosa indica.</p>
            ) : (
              <>
                <p className="font-display text-[1.4rem] font-extrabold leading-none text-lume">{hotspots[open].label}</p>
                <div>{hotspots[open].text}</div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
