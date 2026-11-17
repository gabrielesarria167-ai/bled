// Temporary calibration page for 3D models; removed before delivery.
import { ModelStage } from '../components/three/ModelStage'

const models: { src: string; rotation?: [number, number, number]; target?: [number, number, number]; distance?: number }[] = [
  { src: '/models/heart.glb' },
  { src: '/models/lungs.glb' },
  { src: '/models/torso.glb' },
  { src: '/models/torso.glb', target: [0, 0.55, 0], distance: 1.6 },
  { src: '/models/aed.glb' },
  { src: '/models/cpr-hands.glb' },
  { src: '/models/first-aid-kit.glb' },
  { src: '/models/skeleton.glb' },
]

export default function Lab() {
  const only = new URLSearchParams(location.search).get('m')
  return (
    <div className="grid gap-4 bg-well p-4 md:grid-cols-2">
      {models
        .filter((m, i) => only === null || String(i) === only)
        .map((m, i) => (
          <div key={i}>
            <p className="text-well-ink">{m.src} {m.rotation ? 'supine' : ''}</p>
            <ModelStage src={m.src} alt={m.src} rotation={m.rotation} target={m.target} distance={m.distance} className="h-[24rem]" />
          </div>
        ))}
    </div>
  )
}
