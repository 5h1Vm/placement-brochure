'use client'

interface Props {
  data: { name: string; value: number }[]
}

// Theme-consistent: navy, gold, and their tonal variants
const COLORS = ['#1B2A4A', '#D4A520', '#2C5282', '#B7791F', '#4A6FA5', '#744210', '#2A4365']

function pt(cx: number, cy: number, r: number, deg: number) {
  const rad = deg * Math.PI / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

// Semi-circle: angles go from 180° (left) clockwise through 270° (top) to 360° (right)
// In SVG (y-down): sweep-flag=1 is clockwise
function slicePath(cx: number, cy: number, r1: number, r2: number, s: number, e: number) {
  const oS = pt(cx, cy, r2, s), oE = pt(cx, cy, r2, e)
  const iE = pt(cx, cy, r1, e), iS = pt(cx, cy, r1, s)
  const large = e - s > 180 ? 1 : 0
  return `M ${oS.x} ${oS.y} A ${r2} ${r2} 0 ${large} 1 ${oE.x} ${oE.y} L ${iE.x} ${iE.y} A ${r1} ${r1} 0 ${large} 0 ${iS.x} ${iS.y} Z`
}

export default function DomainPieChart({ data }: Props) {
  const total = data.reduce((a, b) => a + b.value, 0)
  const W = 440, H = 190
  const cx = W / 2, cy = 165
  const innerR = 60, outerR = 100
  const GAP = 1.2

  let cum = 0
  const slices = data.map((d, i) => {
    const sweep = (d.value / total) * 180
    const start = 180 + cum + GAP / 2
    const end   = 180 + cum + sweep - GAP / 2
    cum += sweep
    const mid   = 180 + cum - sweep / 2
    return { name: d.name, value: d.value, start, end, mid, color: COLORS[i % COLORS.length] }
  })

  // Label positions with collision resolution
  const labelR = outerR + 38
  const MIN_GAP = 28

  const rawPos = slices.map(s => {
    const p = pt(cx, cy, labelR, s.mid)
    return { ...s, lx: p.x, ly: p.y, isRight: p.x >= cx }
  })

  function resolveCollisions(group: typeof rawPos) {
    const arr = [...group].sort((a, b) => a.ly - b.ly)
    for (let pass = 0; pass < 10; pass++) {
      for (let i = 1; i < arr.length; i++) {
        const gap = arr[i].ly - arr[i - 1].ly
        if (gap < MIN_GAP) {
          const d = (MIN_GAP - gap) / 2
          arr[i - 1] = { ...arr[i - 1], ly: arr[i - 1].ly - d }
          arr[i]     = { ...arr[i],     ly: arr[i].ly + d }
        }
      }
    }
    return arr
  }

  const positions = [
    ...resolveCollisions(rawPos.filter(p => !p.isRight)),
    ...resolveCollisions(rawPos.filter(p => p.isRight)),
  ]

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
      aria-label="Domain distribution semi-circle chart"
    >
      {/* Semi-circle donut slices */}
      {slices.map((s, i) => (
        <path key={i} d={slicePath(cx, cy, innerR, outerR, s.start, s.end)} fill={s.color} stroke="white" strokeWidth={2.5} />
      ))}

      {/* Pointer lines + labels */}
      {positions.map((pos) => {
        const s = slices.find(sl => sl.name === pos.name)!
        const edgePt   = pt(cx, cy, outerR + 6, s.mid)
        const elbowPt  = pt(cx, cy, outerR + 22, s.mid)
        const anchor   = pos.isRight ? 'start' : 'end'
        const lineEndX = pos.isRight ? pos.lx - 2 : pos.lx + 2
        const tx       = pos.isRight ? pos.lx + 3 : pos.lx - 3

        return (
          <g key={`lbl-${pos.name}`}>
            <polyline
              points={`${edgePt.x},${edgePt.y} ${elbowPt.x},${elbowPt.y} ${lineEndX},${pos.ly}`}
              fill="none" stroke="#9CA3AF" strokeWidth={1.2} strokeLinejoin="round"
            />
            <text x={tx} y={pos.ly - 4} textAnchor={anchor} fontSize={10.5} fontWeight={700} fill="#1F2937">
              {pos.name}
            </text>
            <text x={tx} y={pos.ly + 9} textAnchor={anchor} fontSize={9.5} fill="#6B7280">
              {s.value} students
            </text>
          </g>
        )
      })}
    </svg>
  )
}
