import { useEffect, useState, useRef } from 'react'

const img = (n) => `${import.meta.env.BASE_URL}img/${n}`
const DISHES = [
  { id: 'soup', name: 'מרק אפונה', c: 'green' },
  { id: 'goulash', name: 'תבשיל גולאש', c: 'yellow' },
  { id: 'schnitzel', name: 'שניצל', c: 'yellow' },
  { id: 'szechuan', name: 'בקר סצ׳ואן', c: 'blue' },
  { id: 'rice', name: 'אורז לבן', c: 'green' },
  { id: 'potato', name: 'תפו״א סירות', c: 'orange' },
  { id: 'duet', name: 'דואט שעועית ואפונה', c: 'blue' },
  { id: 'curry', name: 'טבעוני סויה קארי', c: 'green' },
]
const CARD_W = 470, CARD_H = 270, GAP = 26, TOP = 380, COLX = [40, 570]
const pos = (i) => ({ x: COLX[i % 2], y: TOP + Math.floor(i / 2) * (CARD_H + GAP) })
const center = (i) => ({ x: pos(i).x + CARD_W / 2, y: pos(i).y + CARD_H / 2 - 20 })
const FORK_ORDER = [0, 1, 3, 2, 4, 5, 7, 6]

const Heart = () => (
  <svg viewBox="0 0 24 24" className="heart-svg">
    <path d="M12 21s-8.5-5.2-8.5-11.1A4.9 4.9 0 0 1 12 7.3a4.9 4.9 0 0 1 8.5 2.6C20.5 15.8 12 21 12 21z" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
)

export default function App() {
  const [scale, setScale] = useState(1)
  const [likes, setLikes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('likes')) || {} } catch { return {} }
  })
  const [active, setActive] = useState({})
  const [pops, setPops] = useState([])
  const [fork, setFork] = useState({ x: 540, y: -400, stab: false })
  const [spark, setSpark] = useState(null)
  const timers = useRef({})

  useEffect(() => {
    const f = () => setScale(Math.min(innerWidth / 1080, innerHeight / 1920))
    f(); addEventListener('resize', f)
    return () => removeEventListener('resize', f)
  }, [])

  useEffect(() => {
    try { localStorage.setItem('likes', JSON.stringify(likes)) } catch {}
  }, [likes])

  // fork wanders between dishes and stabs them
  useEffect(() => {
    let alive = true, n = 0
    const ts = []
    const later = (fn, ms) => ts.push(setTimeout(() => alive && fn(), ms))
    const go = () => {
      const i = FORK_ORDER[n++ % FORK_ORDER.length]
      const c = center(i)
      setFork({ x: c.x, y: c.y, stab: false })
      later(() => {
        setFork((f) => ({ ...f, stab: true }))
        setSpark({ i, k: Date.now() })
        later(() => { setFork((f) => ({ ...f, stab: false })); later(go, 1000) }, 700)
      }, 1500)
    }
    later(go, 1200)
    return () => { alive = false; ts.forEach(clearTimeout) }
  }, [])

  const like = (id) => {
    setLikes((l) => ({ ...l, [id]: (l[id] || 0) + 1 }))
    setActive((a) => ({ ...a, [id]: true }))
    clearTimeout(timers.current[id])
    timers.current[id] = setTimeout(() => setActive((a) => ({ ...a, [id]: false })), 2500)
    const k = Math.random()
    setPops((p) => [...p, { k, id }])
    setTimeout(() => setPops((p) => p.filter((x) => x.k !== k)), 1000)
  }

  return (
    <div className="viewport">
      <div className="stage" style={{ transform: `translate(-50%,-50%) scale(${scale})` }}>
        <div className="blob blob-tl" />
        <svg className="wave wave-y" viewBox="0 0 700 360"><path d="M0 120C140 40 260 120 380 190S600 330 700 360H0z" /></svg>
        <svg className="wave wave-b" viewBox="0 0 800 260"><path d="M800 0C680 70 560 40 430 110S160 240 0 260h800z" /></svg>

        <img className="logo" src={img('logo.png')} alt="המכללה הלאומית לאיתנות ישראלית" />
        <svg className="hat" viewBox="0 0 120 100" fill="none" stroke="#14396b" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M30 62c-14 0-22-10-22-20 0-12 12-20 24-17 4-12 20-18 32-9 8-6 26-3 29 12 10 3 14 12 10 20-4 7-12 10-20 9" />
          <path d="M30 62v22h52V62M30 78h52" />
        </svg>
        <div className="title-wrap">
          <i className="sp sp1" /><i className="sp sp2" /><i className="sp sp3" />
          <h1>תפריט המכללה היום:</h1>
          <i className="sp sp4" /><i className="sp sp5" /><i className="sp sp6" />
        </div>

        {DISHES.map((d, i) => (
          <div key={d.id} className="card" style={{ left: pos(i).x, top: pos(i).y, animationDelay: `${i * 0.4}s` }}>
            <div className="photo"><img src={img(`${d.id}.jpg`)} alt={d.name} /></div>
            <div className="steam">
              <span style={{ left: '28%', animationDelay: '0s' }} />
              <span style={{ left: '48%', animationDelay: '1s' }} />
              <span style={{ left: '68%', animationDelay: '2s' }} />
            </div>
            {d.id === 'soup' && (
              <svg className="spoon" viewBox="0 0 60 260"><ellipse cx="30" cy="212" rx="20" ry="30" fill="#e8edf3" stroke="#14396b" strokeWidth="5" /><path d="M30 182V0" stroke="#14396b" strokeWidth="9" strokeLinecap="round" /></svg>
            )}
            {d.id === 'schnitzel' && (
              <svg className="knife" viewBox="0 0 90 260"><path d="M30 0c30 10 40 70 36 130H30z" fill="#e8edf3" stroke="#14396b" strokeWidth="5" strokeLinejoin="round" /><rect x="26" y="130" width="46" height="120" rx="14" fill="#14396b" /></svg>
            )}
            {spark && spark.i === i && <span key={spark.k} className="spark">✨</span>}
            {pops.filter((p) => p.id === d.id).map((p) => (
              <span key={p.k} className="pop" style={{ left: 40 + (p.k * 997 % 1) * 50 }}>❤️</span>
            ))}
            <button className={'like' + (active[d.id] ? ' on' : '')} onClick={() => like(d.id)} aria-label={`אהבתי את ${d.name}`}>
              <Heart /><b>{likes[d.id] || 0}</b>
            </button>
            <div className={`ribbon ${d.c}`}>{d.name}</div>
          </div>
        ))}

        <div className="fork" style={{ left: fork.x, top: fork.y }}>
          <div className={'forkin' + (fork.stab ? ' stab' : '')}>
            <svg viewBox="0 0 60 240"><path d="M8 4v52c0 14 9 20 22 22 13-2 22-8 22-22V4M30 4v74" fill="none" stroke="#14396b" strokeWidth="7" strokeLinecap="round" /><rect x="22" y="76" width="16" height="160" rx="8" fill="#14396b" /></svg>
          </div>
        </div>

        <div className="bon">
          <i className="sp sp1" /><i className="sp sp2" /><i className="sp sp3" />
          <span>בתאבון!</span>
          <svg viewBox="0 0 600 40"><path d="M10 28C150 6 450 6 590 24" stroke="#ffc933" strokeWidth="16" strokeLinecap="round" fill="none" /></svg>
          <i className="sp sp4" /><i className="sp sp5" /><i className="sp sp6" />
        </div>
        <svg className="cutlery" viewBox="0 0 160 220" fill="#14396b">
          <rect x="22" y="0" width="10" height="90" rx="5" /><rect x="42" y="0" width="10" height="90" rx="5" /><rect x="2" y="0" width="10" height="90" rx="5" />
          <path d="M2 70h50v20a25 25 0 0 1-50 0z" /><rect x="20" y="100" width="14" height="118" rx="7" />
          <ellipse cx="116" cy="50" rx="30" ry="48" /><rect x="108" y="90" width="16" height="128" rx="8" />
        </svg>
      </div>
    </div>
  )
}
