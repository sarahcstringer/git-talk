/* ============================================================
   deck.jsx — Slide registry, navigation, mount
   ============================================================ */

// Video slides set `src`. Space/MediaPlayPause toggle their playback;
// arrow/page keys still navigate.
const SLIDES = [
  { c: SlideTitle,           max: 0 },
  { c: SlideHowWeLearn,      max: 2 },
  { c: SlideNineYears,       max: 1 },
  { c: SlideTurningPoint,    max: 1 },
  { c: SlideMeetACAAS,       max: 2 },
  { c: SlideVideo,           max: 0, src: 'videos/acaas.mp4' },
  { c: SlideScenario,        max: 1 },
  { c: SlideAct1,            max: 0 },
  { c: SlideWorktreeExplain, max: 0 },
  { c: SlideVideo,           max: 0, src: 'videos/no-worktrees.mp4' },
  { c: SlideWorktreeViz,     max: 6 },
  { c: SlideVideo,           max: 0, src: 'videos/with-worktrees.mp4' },
  { c: SlideAct2,            max: 0 },
  { c: SlideVideo,           max: 0, src: 'videos/setup-reflog.mp4' },
  { c: SlideReflogModel,     max: 3 },
  { c: SlideVideo,           max: 0, src: 'videos/with-reflog.mp4' },
  { c: SlideAct3,            max: 0 },
  { c: SlideWhyStack,        max: 1 },
  { c: SlideUpdateRefsViz,   max: 2 },
  { c: SlideVideo,           max: 0, src: 'videos/update-refs.mp4' },
  { c: SlideJujutsu,         max: 2 },
  { c: SlideRecap,           max: 3 },
  { c: SlideThanks,          max: 0 },
];

const LS_KEY = 'wtd-git-talk-pos';
const save = (s, t) => { try { localStorage.setItem(LS_KEY, JSON.stringify({ s, t })); } catch(e){} };
const load = () => { try { const d = JSON.parse(localStorage.getItem(LS_KEY)); if (d && typeof d.s === 'number') return d; } catch(e){} return { s: 0, t: 0 }; };


function ProgressBar({ current, total }) {
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 3, background: GV.surface, zIndex: 100 }}>
      <div style={{
        height: '100%', width: `${((current + 1) / total) * 100}%`,
        background: `linear-gradient(90deg, ${GV.teal}, ${GV.green}, ${GV.amber})`,
        transition: 'width 0.3s ease',
      }} />
    </div>
  );
}

function SlideCounter({ current, total }) {
  return (
    <div style={{
      position: 'fixed', bottom: 16, right: 24,
      fontFamily: "'Fira Code', monospace", fontSize: 18, color: GV.dim, opacity: 0.5, zIndex: 100,
    }}>
      {current + 1}/{total}
    </div>
  );
}


function App() {
  const [si, setSi] = React.useState(0);
  const [ti, setTi] = React.useState(0);
  const videoRef = React.useRef(null);
  const total = SLIDES.length;

  React.useEffect(() => {
    const p = load();
    if (p.s < total) { setSi(p.s); setTi(Math.min(p.t, SLIDES[p.s].max)); }
  }, []);

  const goTo = React.useCallback((ns, nt) => {
    const s = Math.max(0, Math.min(ns, total - 1));
    const t = Math.max(0, Math.min(nt, SLIDES[s].max));
    setSi(s); setTi(t); save(s, t);
  }, [total]);

  React.useEffect(() => { window.__goTo = goTo; }, [goTo]);

  const fwd = React.useCallback(() => {
    if (ti < SLIDES[si].max) { const n = ti + 1; setTi(n); save(si, n); }
    else if (si < total - 1) goTo(si + 1, 0);
  }, [si, ti, total, goTo]);

  const back = React.useCallback(() => {
    if (ti > 0) { const n = ti - 1; setTi(n); save(si, n); }
    else if (si > 0) goTo(si - 1, SLIDES[si - 1].max);
  }, [si, ti, goTo]);

  const toggleVideoPlayback = React.useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play(); else v.pause();
  }, []);

  React.useEffect(() => {
    const handled = (e) => { e.preventDefault(); e.stopPropagation(); };
    const h = (e) => {
      const isVideoSlide = !!SLIDES[si].src;

      if (e.key === 'MediaPlayPause' || e.code === 'MediaPlayPause') {
        if (isVideoSlide) { handled(e); toggleVideoPlayback(); }
        return;
      }

      if (e.key === ' ') {
        handled(e);
        if (isVideoSlide) toggleVideoPlayback();
        else fwd();
        return;
      }

      if (['ArrowRight', 'ArrowDown', 'PageDown'].includes(e.key)) {
        handled(e); fwd();
      } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) {
        handled(e); back();
      } else if (e.key === 'Home') {
        handled(e); goTo(0, 0);
      } else if (e.key === 'End') {
        handled(e); goTo(total - 1, 0);
      }
    };
    window.addEventListener('keydown', h, true);
    return () => window.removeEventListener('keydown', h, true);
  }, [fwd, back, goTo, total, si, toggleVideoPlayback]);

  const click = React.useCallback((e) => {
    if (e.target.closest('button, a, input, select, textarea, video')) return;
    const r = e.currentTarget.getBoundingClientRect();
    (e.clientX - r.left < r.width * 0.3) ? back() : fwd();
  }, [fwd, back]);

  const entry = SLIDES[si];
  const Slide = entry.c;

  return (
    <div style={{ width: '100%', height: '100%', background: GV.bg, position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
      onClick={click}>
      <div style={{ width: '100%', height: '100%' }}>
        <Slide step={ti} src={entry.src} videoRef={videoRef} />
      </div>
      <ProgressBar current={si} total={total} />
      <SlideCounter current={si} total={total} />
    </div>
  );
}

function PrintAll() {
  return (
    <div style={{ background: GV.bg }}>
      {SLIDES.map((s, i) => {
        const Slide = s.c;
        return (
          <div key={i} style={{
            width: 1280, height: 720, position: 'relative', overflow: 'hidden',
            pageBreakAfter: 'always', breakAfter: 'page',
          }}>
            <Slide step={s.max} />
            <div style={{
              position: 'absolute', bottom: 12, right: 20,
              fontFamily: "'Fira Code', monospace", fontSize: 14, color: GV.dim, opacity: 0.5,
            }}>{i + 1}/{SLIDES.length}</div>
          </div>
        );
      })}
    </div>
  );
}

const isPrint = new URLSearchParams(location.search).has('print');
if (isPrint) {
  document.body.style.overflow = 'auto';
  document.documentElement.style.overflow = 'auto';
}
ReactDOM.createRoot(document.getElementById('root')).render(isPrint ? <PrintAll /> : <App />);
