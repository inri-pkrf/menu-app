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
const CARD_W = 470, CARD_H = 255, GAP = 16, TOP = 360, COLX = [40, 570]
// סיבוב מסך: פותחים את האתר עם ?rotate=90 (או 270) אם המסך מסובב פיזית אבל ה-Windows עדיין על 1920x1080
const ROTATE = [90, 270].includes(Number(new URLSearchParams(location.search).get('rotate'))) ? Number(new URLSearchParams(location.search).get('rotate')) : 0
const BANNER_IMG = 'salads.png' // אפשר להחליף לתמונה אמיתית: לשים קובץ ב-public/img ולשנות כאן את השם
const pos = (i) => ({ x: COLX[i % 2], y: TOP + Math.floor(i / 2) * (CARD_H + GAP) })
const center = (i) => ({ x: pos(i).x + CARD_W / 2, y: pos(i).y + CARD_H / 2 - 20 })

const Heart = () => (
  <svg viewBox="0 0 24 24" className="heart-svg">
    <path d="M12 21s-8.5-5.2-8.5-11.1A4.9 4.9 0 0 1 12 7.3a4.9 4.9 0 0 1 8.5 2.6C20.5 15.8 12 21 12 21z" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
)

const useToday = () => {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(t)
  }, [])
  const day = now.toLocaleDateString('he-IL', { weekday: 'long' })
  const date = `${now.getDate()}/${now.getMonth() + 1}/${String(now.getFullYear()).slice(-2)}`
  return `${day}, \u2066${date}\u2069`
}

const PUFFS = [[10, 0], [24, 1.2], [38, 0.5], [52, 1.8], [66, 2.4], [80, 0.9]] // left %, delay (s)
const Steam = () => (
  <div className="steam">
    {PUFFS.map(([l, d]) => <span key={l} style={{ left: `${l}%`, animationDelay: `${d}s` }} />)}
  </div>
)

export default function App() {
  const today = useToday()
  const [scale, setScale] = useState(1)
  const [likes, setLikes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('likes')) || {} } catch { return {} }
  })
  const [active, setActive] = useState({})
  const [pops, setPops] = useState([])
  const timers = useRef({})

  useEffect(() => {
    const f = () => setScale(ROTATE ? Math.min(innerWidth / 1920, innerHeight / 1080) : Math.min(innerWidth / 1080, innerHeight / 1920))
    f(); addEventListener('resize', f)
    return () => removeEventListener('resize', f)
  }, [])

  useEffect(() => {
    try { localStorage.setItem('likes', JSON.stringify(likes)) } catch {}
  }, [likes])

  const toggleFs = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    else document.documentElement.requestFullscreen?.()
  }

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
      <div className="stage" style={{ transform: `translate(-50%,-50%) rotate(${ROTATE}deg) scale(${scale})` }}>
        <img className="tri-tl" src={img('triangle-blue.png')} alt="" />
        <img className="tri-br" src={img('triangle-orange.png')} alt="" />

        <img className="logo" src={img('logo.png')} alt="המכללה הלאומית לאיתנות ישראלית" />
        <button className="hat-btn" onClick={toggleFs} aria-label="מסך מלא" title="מסך מלא">
          <svg className="hat" viewBox="0 0 120 100" fill="none" stroke="#14396b" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M30 62c-14 0-22-10-22-20 0-12 12-20 24-17 4-12 20-18 32-9 8-6 26-3 29 12 10 3 14 12 10 20-4 7-12 10-20 9" />
          <path d="M30 62v22h52V62M30 78h52" />
        </svg>
        </button>
        <div className="title-wrap">
          <i className="sp sp1" /><i className="sp sp2" /><i className="sp sp3" />
          <div className="title-pill"><h1>מה בתפריט לצהריים?</h1><p className="date">{today}</p></div>
          <i className="sp sp4" /><i className="sp sp5" /><i className="sp sp6" />
        </div>

        {DISHES.map((d, i) => (
          <div key={d.id} className="card" style={{ left: pos(i).x, top: pos(i).y, animationDelay: `${i * 0.4}s` }}>
            <div className="photo"><img src={img(`${d.id}.jpg`)} alt={d.name} /></div>
            <Steam />
            {pops.filter((p) => p.id === d.id).map((p) => (
              <span key={p.k} className="pop" style={{ left: 40 + (p.k * 997 % 1) * 50 }}>❤️</span>
            ))}
            <button className={'like' + (active[d.id] ? ' on' : '')} onClick={() => like(d.id)} aria-label={`אהבתי את ${d.name}`}>
              <Heart /><b>{likes[d.id] || 0}</b>
            </button>
            <div className={`ribbon ${d.c}`}>{d.name}</div>
          </div>
        ))}

        <div className="salad-banner">
          <div className="photo"><img src={img(BANNER_IMG)} alt="מגוון סלטים ופירות" /></div>
          <div className="ribbon green">מגוון סלטים ופירות</div>
        </div>

        <div className="bon">
          <i className="sp sp1" /><i className="sp sp2" /><i className="sp sp3" />
          <span>בתאבון!</span>
          <svg viewBox="0 0 600 40"><path d="M10 28C150 30 450 6 590 24" stroke="#f1d246" strokeWidth="16" strokeLinecap="round" fill="none" /></svg>
          <i className="sp sp4" /><i className="sp sp5" /><i className="sp sp6" />
        </div>
      </div>
    </div>
  )
}