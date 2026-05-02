/* ============================================================
   slides.jsx — All slide components
   Principle: slides are billboards, not documents.
   Prose lives in SPEAKER_NOTES (deck.jsx) and DEMO.md.
   ============================================================ */

/* ---- Layout helpers ---- */
function Center({ children, label, bg }) {
  return (
    <div data-screen-label={label} style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      alignItems: 'center', height: '100%', textAlign: 'center', padding: 70,
      background: bg || 'transparent',
    }}>
      {children}
    </div>
  );
}

function Big({ children, color = GV.text, size = 64, weight = 800 }) {
  return (
    <div style={{
      fontFamily: "'Outfit', sans-serif", fontSize: size, fontWeight: weight,
      color, lineHeight: 1.25, maxWidth: 1050,
    }}>
      {children}
    </div>
  );
}

function Mono({ children, color = GV.teal, size = 32 }) {
  return (
    <span style={{ fontFamily: "'Fira Code', monospace", fontSize: size, color, fontWeight: 600 }}>
      {children}
    </span>
  );
}

function Kicker({ children, color = GV.dim }) {
  return (
    <div style={{
      fontFamily: "'Fira Code', monospace", fontSize: 22, color,
      letterSpacing: 4, textTransform: 'uppercase', opacity: 0.7, marginBottom: 36,
    }}>
      {children}
    </div>
  );
}

function ActDots({ n }) {
  const acts = [
    { color: GV.teal, label: 'worktree' },
    { color: GV.green, label: 'reflog' },
    { color: GV.amber, label: 'update-refs' },
  ];
  return (
    <div style={{ display: 'flex', gap: 24, marginBottom: 36 }}>
      {acts.map((a, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: i + 1 === n ? 1 : i + 1 < n ? 0.5 : 0.15, transition: 'opacity 0.3s' }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: a.color }} />
          <Mono size={15} color={i + 1 === n ? a.color : GV.dim}>{a.label}</Mono>
        </div>
      ))}
    </div>
  );
}

function ActMarker({ n, title, cmd, color, icon }) {
  return (
    <Center label={`Act ${n}`} bg={`radial-gradient(ellipse at 30% 60%, ${color}10 0%, transparent 55%)`}>
      <ActDots n={n} />
      <Big size={56}>{title}</Big>
      <div style={{ marginTop: 44, fontSize: 72 }}>{icon}</div>
      <div style={{
        marginTop: 24, padding: '16px 36px', borderRadius: 12,
        background: color + '12', border: `1.5px solid ${color}40`,
      }}>
        <Mono color={color} size={36}>{cmd}</Mono>
      </div>
    </Center>
  );
}

function Reveal({ show, children, inline }) {
  const Tag = inline ? 'span' : 'div';
  return (
    <Tag style={{ opacity: show ? 1 : 0, transition: 'opacity 0.4s ease' }}>
      {children}
    </Tag>
  );
}


/* ========================================================== */
/* INTRO                                                      */
/* ========================================================== */

function SlideTitle() {
  return (
    <Center label="01 Title" bg={`radial-gradient(ellipse at 30% 80%, ${GV.purple}15 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, ${GV.teal}12 0%, transparent 50%)`}>
      <Kicker color={GV.teal}>Write the Docs · Portland 2026</Kicker>
      <Big size={68}>
        The Git Commands I Avoided<br/>
        <span style={{ color: GV.teal }}>for 9 Years</span>
      </Big>
      <div style={{ marginTop: 22, fontFamily: "'Outfit', sans-serif", fontSize: 30, color: GV.dim }}>
        (and why I wish I hadn't)
      </div>
      <div style={{ marginTop: 56, fontFamily: "'Outfit', sans-serif", fontSize: 24, color: GV.text, opacity: 0.7 }}>
        Sarah Deaton
      </div>
    </Center>
  );
}

function SlideAbout() {
  return (
    <Center label="02 About">
      <Big size={56}>Hi, I'm Sarah.</Big>
      <div style={{ marginTop: 24, fontFamily: "'Outfit', sans-serif", fontSize: 28, color: GV.dim }}>
        Claude Code docs · <span style={{ color: GV.teal }}>Anthropic</span>
      </div>
      <div style={{
        marginTop: 64, fontFamily: "'Outfit', sans-serif", fontSize: 22,
        color: GV.dim, opacity: 0.75, fontStyle: 'italic',
      }}>
        I learned git at a bootcamp.
      </div>
    </Center>
  );
}

function SlideHowWeLearn({ step = 0 }) {
  return (
    <Center label="03 How We Learn">
      <Big size={58}>
        We learn Git on the job.
        <br/><br/><Reveal inline show={step >= 1}><span style={{ color: GV.dim }}>Just enough to contribute.</span></Reveal>
        <br/><br/><Reveal inline show={step >= 2}><span style={{ color: GV.amber }}>Then we stop looking.</span></Reveal>
      </Big>
    </Center>
  );
}

function SlideNineYears({ step = 0 }) {
  const lines = [
    { prefix: '$', text: 'git add .' },
    { prefix: '$', text: 'git commit -m "wip"' },
    { prefix: '$', text: 'git rebase -i HEAD~4' },
    { prefix: '$', text: 'git commit --amend --no-edit' },
  ];
  return (
    <Center label="03 Nine Years">
      <div style={{
        fontFamily: "'Fira Code', monospace", fontSize: 30, color: GV.dim,
        letterSpacing: 4, marginBottom: 36, opacity: 0.8,
      }}>
        2016 → 2025
      </div>
      <TerminalBlock title="my whole workflow" lines={lines} visibleLines={4} />
      <Reveal show={step >= 1}>
        <div style={{ marginTop: 40 }}>
          <Big size={40} weight={600} color={GV.dim}>
            It worked. <span style={{ color: GV.red }}>Except when it didn't.</span>
          </Big>
        </div>
      </Reveal>
    </Center>
  );
}

function SlideTurningPoint({ step = 0 }) {
  return (
    <Center label="05b Turning Point" bg={`radial-gradient(ellipse at 50% 55%, ${GV.amber}10 0%, transparent 55%)`}>
      <Kicker color={GV.amber}>2025 — discover worktrees</Kicker>
      <div style={{
        borderLeft: `3px solid ${GV.amber}80`,
        padding: '12px 0 12px 32px',
        marginBottom: 56,
        maxWidth: 1100,
        textAlign: 'left',
      }}>
        <div style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 52,
          fontWeight: 400,
          fontStyle: 'italic',
          color: GV.text,
          lineHeight: 1.2,
        }}>
          Run parallel Claude Code sessions with Git worktrees
        </div>
        <div style={{
          fontFamily: "'Fira Code', monospace",
          fontSize: 18,
          color: GV.dim,
          marginTop: 16,
          letterSpacing: 1,
        }}>
          — Claude Code docs
        </div>
      </div>
      <Reveal show={step >= 1}>
        <Big size={56} color={GV.amber}>There were solutions.</Big>
      </Reveal>
    </Center>
  );
}

function SlideMeetACAAS({ step = 0 }) {
  const navItems = ['Getting started', 'API reference', 'Cookbook', 'Changelog'];
  return (
    <Center label="05c Meet ACAAS" bg={`radial-gradient(ellipse at 50% 55%, ${GV.purple}12 0%, transparent 55%)`}>
      <Kicker color={GV.purple}>where I (don't really) work</Kicker>
      <Big size={72}>
        <span style={{ color: GV.purple }}>ACAAS</span>
      </Big>
      <div style={{ marginTop: 16, fontFamily: "'Outfit', sans-serif", fontSize: 32, color: GV.dim }}>
        All Caps as a Service
      </div>
      <Reveal show={step >= 1}>
        <div style={{
          marginTop: 48, padding: '20px 28px', borderRadius: 12,
          background: GV.surface, border: `1px solid ${GV.border}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
        }}>
          <Mono size={22} color={GV.teal}>acaas.mintlify.app</Mono>
          <div style={{
            display: 'flex', gap: 18, alignItems: 'center',
            fontFamily: "'Outfit', sans-serif", fontSize: 18, color: GV.dim,
          }}>
            {navItems.map((n, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={{ opacity: 0.4 }}>·</span>}
                <span>{n}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </Reveal>
    </Center>
  );
}


/* ========================================================== */
/* DEMO                                                       */
/* ========================================================== */

function SlideScenario({ step = 0 }) {
  return (
    <Center label="05 Scenario">
      <Kicker color={GV.purple}>Live demo · ACAAS docs</Kicker>
      <Big size={50}>
        <Mono size={44} color={GV.purple}>/v1/emphasize</Mono> is graduating.
      </Big>
      <div style={{ marginTop: 24, fontFamily: "'Outfit', sans-serif", fontSize: 24, color: GV.dim }}>
        experimental → GA
      </div>
      <Reveal show={step >= 1}>
        <div style={{
          marginTop: 48, padding: '18px 32px', borderRadius: 12,
          background: GV.surface, border: `1px solid ${GV.border}`,
          fontFamily: "'Fira Code', monospace", fontSize: 20, color: GV.dim,
        }}>
          remove "experimental" markers · add cookbook · changelog
        </div>
      </Reveal>
    </Center>
  );
}

/* ---- Act 1: worktree ---- */
function SlideAct1() {
  return <ActMarker n={1} title="Don't drop what you're holding"
    cmd="git worktree" color={GV.teal} icon="🌳" />;
}

function SlideWorktreeExplain() {
  return (
    <Center label="06b What's a worktree">
      <Kicker color={GV.teal}>What's a worktree?</Kicker>
      <Big size={42} weight={600}>
        A second checkout of your repo —
        <br/>
        <span style={{ color: GV.teal }}>two folders, one </span>
        <Mono size={42} color={GV.teal}>.git</Mono>
        <span style={{ color: GV.teal }}>.</span>
      </Big>
      <div style={{ marginTop: 44 }}>
        <WorktreeViz step={2} />
      </div>
    </Center>
  );
}

function CmdPart({ text, label, color, show }) {
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'top' }}>
      <span style={{ fontFamily: "'Fira Code', monospace", fontSize: 30, fontWeight: 600, color: GV.teal }}>
        {text}
      </span>
      <span style={{
        height: 10, alignSelf: 'stretch', margin: '6px 6px 0',
        borderLeft: `2.5px solid ${color}`, borderRight: `2.5px solid ${color}`,
        borderBottom: `2.5px solid ${color}`, borderRadius: '0 0 6px 6px',
        opacity: show ? 1 : 0, transition: 'opacity 0.35s ease',
      }} />
      <span style={{
        marginTop: 10, fontFamily: "'Outfit', sans-serif", fontSize: 18,
        color, maxWidth: 200, lineHeight: 1.35, minHeight: 50,
        opacity: show ? 1 : 0, transition: 'opacity 0.35s ease',
      }}>
        {label}
      </span>
    </span>
  );
}

function SlideWorktreeViz({ step = 0 }) {
  const parts = [
    { text: 'git worktree add', label: 'make another working directory', color: GV.blue },
    { text: '../ga', label: 'put it next door', color: GV.pink },
    { text: 'main', label: 'start from main', color: GV.purple },
    { text: '-b emphasize-ga', label: 'on a fresh branch', color: GV.amber },
  ];
  return (
    <Center label="07 Worktree Viz">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 22, marginBottom: 40 }}>
        <span style={{ fontFamily: "'Fira Code', monospace", fontSize: 30, fontWeight: 600, color: GV.green }}>$</span>
        {parts.map((p, i) => (
          <CmdPart key={i} text={p.text} label={p.label} color={p.color} show={step >= i + 1} />
        ))}
      </div>
      <Reveal show={step >= 5}>
        <WorktreeViz step={2} />
        <div style={{ marginTop: 24, fontFamily: "'Outfit', sans-serif", fontSize: 22, color: GV.dim, textAlign: 'center' }}>
          shipped <span style={{ color: GV.amber }}>2015</span>
        </div>
      </Reveal>
      <Reveal show={step >= 6}>
        <div style={{
          marginTop: 22, padding: '16px 28px', borderRadius: 12,
          background: GV.surface, border: `1px solid ${GV.border}`,
          display: 'flex', gap: 56, alignItems: 'flex-start',
          fontFamily: "'Fira Code', monospace", fontSize: 16, textAlign: 'left',
        }}>
          <div>
            <div style={{ color: GV.green, fontWeight: 700, marginBottom: 6, letterSpacing: 1 }}>shared</div>
            <div style={{ color: GV.dim, lineHeight: 1.7 }}>
              .git/objects <span style={{ color: GV.dim, opacity: 0.6 }}>· every commit, once</span><br/>
              .git/refs <span style={{ color: GV.dim, opacity: 0.6 }}>· branches, tags</span><br/>
              config · hooks
            </div>
          </div>
          <div>
            <div style={{ color: GV.teal, fontWeight: 700, marginBottom: 6, letterSpacing: 1 }}>per worktree</div>
            <div style={{ color: GV.dim, lineHeight: 1.7 }}>
              HEAD <span style={{ color: GV.dim, opacity: 0.6 }}>· which branch</span><br/>
              index <span style={{ color: GV.dim, opacity: 0.6 }}>· what's staged</span><br/>
              working files
            </div>
          </div>
        </div>
      </Reveal>
    </Center>
  );
}

/* ---- Act 2: reflog ---- */
function SlideAct2() {
  return <ActMarker n={2} title="The undo button"
    cmd="git reflog" color={GV.green} icon="🛟" />;
}

function SlideReflogModel({ step = 0 }) {
  const W = 700, H = 180, mainY = 90;
  const commits = [
    { x: 60, label: 'A', color: GV.blue },
    { x: 160, label: 'B', color: GV.blue },
    { x: 260, label: 'C', color: GV.blue },
    { x: 360, label: 'D', color: GV.purple },
    { x: 460, label: 'E', color: GV.purple },
    { x: 560, label: 'F', color: GV.purple },
  ];
  const keep = step >= 1 ? 3 : 6;
  const headers = [
    'Branches are pointers.',
    <Mono size={30} color={GV.red}>$ git reset --hard HEAD~3</Mono>,
    <span><span style={{ color: GV.green }}>reflog</span> is the trail.</span>,
  ];

  return (
    <Center label="10 Reflog Model">
      <div style={{ height: 56, display: 'flex', alignItems: 'center' }}>
        <Big size={36} weight={600} color={GV.dim}>{headers[Math.min(step, 2)]}</Big>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, marginTop: 24 }}>
        {commits.slice(0, -1).map((c, i) => (
          <Edge key={i} x1={c.x} y1={mainY} x2={commits[i+1].x} y2={mainY}
            color={commits[i+1].color} ghost={i >= keep - 1} />
        ))}
        {commits.map((c, i) => (
          <CommitDot key={i} cx={c.x} cy={mainY} label={c.label} color={c.color}
            active={i === keep - 1 && step >= 1} ghost={i >= keep}
            pulse={i === keep - 1 && step === 1} />
        ))}
        <BranchLabel x={commits[keep-1].x} y={mainY} name="HEAD" color={step >= 1 ? GV.red : GV.blue} below />
        <g style={{ opacity: step >= 2 ? 1 : 0, transition: 'opacity 0.4s' }}>
          {commits.slice(3).map((c, i) => (
            <g key={i}>
              <circle cx={c.x} cy={mainY - 42} r={4} fill={GV.green} opacity={0.7} />
              <line x1={c.x} y1={mainY - 38} x2={c.x} y2={mainY - 16} stroke={GV.green}
                strokeWidth={1.5} strokeDasharray="3 3" opacity={0.5} />
            </g>
          ))}
        </g>
      </svg>
      <Reveal show={step >= 3}>
        <div style={{
          marginTop: 24, padding: '16px 28px', borderRadius: 12,
          background: GV.surface, border: `1px solid ${GV.border}`,
          fontFamily: "'Fira Code', monospace", fontSize: 16, textAlign: 'left',
          maxWidth: 720, lineHeight: 1.85,
        }}>
          <div>
            <span style={{ color: GV.blue, fontWeight: 700 }}>commits</span>
            <span style={{ color: GV.dim }}> · immutable objects in .git/objects, addressed by SHA</span>
          </div>
          <div>
            <span style={{ color: GV.purple, fontWeight: 700 }}>branches, HEAD</span>
            <span style={{ color: GV.dim }}> · files holding one SHA each</span>
          </div>
          <div>
            <span style={{ color: GV.red, fontWeight: 700 }}>reset / rebase / amend</span>
            <span style={{ color: GV.dim }}> · moves the pointer · leaves the commit</span>
          </div>
          <div>
            <span style={{ color: GV.green, fontWeight: 700 }}>reflog</span>
            <span style={{ color: GV.dim }}> · logs every pointer move · kept 90 days</span>
          </div>
        </div>
      </Reveal>
      <Reveal show={step >= 4}>
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <Big size={48} weight={800} color={GV.green}>commit often.</Big>
          <div style={{
            marginTop: 12, fontFamily: "'Outfit', sans-serif", fontSize: 20,
            color: GV.dim, maxWidth: 760, fontStyle: 'italic',
          }}>
            Bootcamp said <span style={{ color: GV.red }}>be careful</span>.
            Reflog says <span style={{ color: GV.green }}>commit recklessly</span> — ugly WIPs are fine, it's all recoverable.
          </div>
        </div>
      </Reveal>
    </Center>
  );
}

/* ---- Act 3: update-refs ---- */
function SlideAct3() {
  return <ActMarker n={3} title="Stop rebasing the stack by hand"
    cmd="git rebase --update-refs" color={GV.amber} icon="📚" />;
}

function SlideStackSetup({ step = 0 }) {
  const parts = [
    { text: 'git checkout', label: 'switch in place', color: GV.blue },
    { text: '-b ga-changelog', label: 'a new branch', color: GV.amber },
    { text: 'emphasize-ga', label: 'on top of my GA work', color: GV.purple },
  ];
  return (
    <Center label="12 Stack Setup">
      <Kicker color={GV.amber}>Different problem · different tool</Kicker>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 22, marginBottom: 28 }}>
        <span style={{ fontFamily: "'Fira Code', monospace", fontSize: 30, fontWeight: 600, color: GV.green }}>$</span>
        {parts.map((p, i) => (
          <CmdPart key={i} text={p.text} label={p.label} color={p.color} show={step >= i + 1} />
        ))}
      </div>
      <Reveal show={step >= 4}>
        <div style={{
          padding: '14px 24px', borderRadius: 10, marginBottom: 32,
          background: GV.surface, border: `1px solid ${GV.border}`,
          fontFamily: "'Outfit', sans-serif", fontSize: 18, color: GV.dim,
          display: 'inline-flex', gap: 22, alignItems: 'center',
        }}>
          <span><span style={{ color: GV.teal, fontWeight: 700 }}>worktree</span> → parallel streams</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span><span style={{ color: GV.amber, fontWeight: 700 }}>stack</span> → sequential branches</span>
        </div>
      </Reveal>
      <Reveal show={step >= 5}>
        <svg viewBox="0 0 480 120" style={{ width: 480 }}>
          <Edge x1={70} y1={60} x2={220} y2={60} color={GV.dim} />
          <Edge x1={220} y1={60} x2={380} y2={60} color={GV.amber} />
          <CommitDot cx={70} cy={60} label="m" color={GV.blue} />
          <CommitDot cx={220} cy={60} label="ga" color={GV.amber} />
          <CommitDot cx={380} cy={60} label="cl" color={GV.amber} active />
          <BranchLabel x={70} y={60} name="main" color={GV.blue} below />
          <BranchLabel x={220} y={60} name="emphasize-ga" color={GV.amber} />
          <BranchLabel x={380} y={60} name="ga-changelog" color={GV.amber} below />
        </svg>
        <div style={{ marginTop: 24, fontFamily: "'Outfit', sans-serif", fontSize: 22, color: GV.dim, textAlign: 'center' }}>
          two PRs, one chain
        </div>
      </Reveal>
    </Center>
  );
}

function SlideWhyStack({ step = 0 }) {
  return (
    <Center label="Why Stack" bg={`radial-gradient(ellipse at 50% 60%, ${GV.amber}10 0%, transparent 55%)`}>
      <Kicker color={GV.amber}>setup · stacking</Kicker>
      <Big size={50}>Why <span style={{ color: GV.amber }}>stack</span> at all?</Big>
      <div style={{ marginTop: 56, display: 'flex', alignItems: 'center', gap: 56, justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 240, height: 120, borderRadius: 12,
            background: GV.red + '15', border: `2px solid ${GV.red}50`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Mono size={20} color={GV.red}>one giant PR</Mono>
          </div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, color: GV.dim }}>
            unreviewable
          </div>
        </div>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, color: GV.dim, fontWeight: 300 }}>vs</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['PR 1 · scaffolding', 'PR 2 · the change', 'PR 3 · cleanup'].map((label, i) => (
              <div key={i} style={{
                width: 240, height: 32, borderRadius: 8,
                background: GV.amber + '18', border: `1.5px solid ${GV.amber}55`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Mono size={14} color={GV.amber}>{label}</Mono>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, color: GV.dim }}>
            a stack
          </div>
        </div>
      </div>
      <Reveal show={step >= 1}>
        <div style={{
          marginTop: 44, fontFamily: "'Outfit', sans-serif", fontSize: 22,
          color: GV.dim, maxWidth: 880, lineHeight: 1.45,
        }}>
          Smaller, sequential pieces. Each builds on the last.
          Each gets its own review.
        </div>
      </Reveal>
    </Center>
  );
}

function SlideJujutsu({ step = 0 }) {
  return (
    <Center label="Jujutsu" bg={`radial-gradient(ellipse at 50% 60%, ${GV.pink}12 0%, transparent 55%)`}>
      <Kicker color={GV.pink}>and one more thing</Kicker>
      <Big size={48}>
        I didn't realize <span style={{ color: GV.pink }}>other systems</span> were being built.
      </Big>
      <Reveal show={step >= 1}>
        <div style={{
          marginTop: 52, padding: '24px 40px', borderRadius: 14,
          background: GV.surface, border: `1.5px solid ${GV.pink}50`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
        }}>
          <Mono size={44} color={GV.pink}>jj</Mono>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, color: GV.dim }}>
            Jujutsu — works on git repos · rethinks what a commit is
          </div>
        </div>
      </Reveal>
      <Reveal show={step >= 2}>
        <div style={{
          marginTop: 32, fontFamily: "'Outfit', sans-serif", fontSize: 19,
          color: GV.dim, maxWidth: 940, lineHeight: 1.55,
        }}>
          No staging area. Every change is a snapshot. Conflicts become
          first-class objects you can carry around. Solves papercuts I didn't
          know I had.
        </div>
      </Reveal>
    </Center>
  );
}

function SlideVideo({ src, videoRef }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} data-screen-label="video">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        controls
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  );
}


/* ========================================================== */
/* RECAP / CLOSE                                              */
/* ========================================================== */

function SlideRecap({ step = 0 }) {
  const cmds = [
    { name: 'git worktree', sub: 'daily', color: GV.teal, icon: '🌳' },
    { name: 'git reflog', sub: 'hopefully-never', color: GV.green, icon: '🛟' },
    { name: '--update-refs', sub: 'stack-shift', color: GV.amber, icon: '📚' },
  ];
  return (
    <Center label="13 Recap">
      <Kicker>What we saw</Kicker>
      <div style={{ display: 'flex', gap: 28 }}>
        {cmds.map((c, i) => (
          <div key={i} style={{
            padding: '36px 40px', borderRadius: 16, textAlign: 'center', minWidth: 260,
            background: c.color + '0a', border: `2px solid ${i <= step ? c.color + '50' : GV.border}`,
            opacity: i <= step ? 1 : 0.2,
            transition: 'opacity 0.4s ease, border-color 0.4s ease',
          }}>
            <div style={{ fontSize: 52, marginBottom: 18 }}>{c.icon}</div>
            <Mono size={24} color={c.color}>{c.name}</Mono>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 19, color: GV.dim, marginTop: 10 }}>
              {c.sub}
            </div>
          </div>
        ))}
      </div>
    </Center>
  );
}

function SlideClose({ step = 0 }) {
  return (
    <Center label="16 Close" bg={`radial-gradient(ellipse at 50% 55%, ${GV.teal}12 0%, transparent 55%)`}>
      <Big size={54}>
        <span style={{ color: GV.dim }}>The commands were never the problem.</span>
        <br/><br/><Reveal inline show={step >= 1}>The <span style={{ color: GV.amber }}>intimidation</span> was.</Reveal>
        <br/><br/><Reveal inline show={step >= 2}><span style={{ color: GV.teal }}>Go look. It's safe.</span></Reveal>
      </Big>
    </Center>
  );
}

function QR({ url, label, size = 120 }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current || typeof qrcode === 'undefined') return;
    const q = qrcode(0, 'M');
    q.addData(url);
    q.make();
    ref.current.innerHTML = q.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
    const svg = ref.current.querySelector('svg');
    if (svg) { svg.style.width = size + 'px'; svg.style.height = size + 'px'; }
  }, [url, size]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div ref={ref} style={{ background: '#fff', padding: 12, borderRadius: 12, width: size + 24, height: size + 24 }} />
      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, color: GV.text, fontWeight: 500 }}>{label}</div>
      <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 15, color: GV.dim }}>
        {url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
      </div>
    </div>
  );
}

function SlideThanks() {
  return (
    <Center label="17 Thanks">
      <Big size={60}>Thank you</Big>
      <div style={{ marginTop: 14, fontFamily: "'Outfit', sans-serif", fontSize: 26, color: GV.dim }}>
        Sarah Deaton
      </div>
      <div style={{ marginTop: 40 }}>
        <QR url="https://github.com/sarahcstringer/git-talk" label="slides · resources" size={190} />
      </div>
      <div style={{ marginTop: 40, display: 'flex', gap: 56 }}>
        <QR url="https://sdeaton.com/" label="blog" size={120} />
        <QR url="https://linkedin.com/in/sarahstringerdeaton" label="linkedin" size={120} />
        <QR url="https://github.com/sarahcstringer" label="github" size={120} />
      </div>
    </Center>
  );
}


Object.assign(window, {
  SlideTitle, SlideAbout, SlideHowWeLearn, SlideNineYears,
  SlideTurningPoint, SlideMeetACAAS,
  SlideScenario,
  SlideAct1, SlideWorktreeExplain, SlideWorktreeViz,
  SlideAct2, SlideReflogModel,
  SlideAct3, SlideWhyStack, SlideJujutsu,
  SlideVideo,
  SlideRecap, SlideClose, SlideThanks,
});
