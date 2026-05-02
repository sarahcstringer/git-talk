/* ============================================================
   git-viz.jsx — Interactive Git visualization components
   CommitGraph, WorktreeViz, ReflogTimeline, RerereViz
   ============================================================ */

/* ---- Color Palette ---- */
const GV = {
  bg: '#1a1625',
  surface: '#231f30',
  border: '#352f45',
  text: '#e8e2f0',
  dim: '#8b82a0',
  teal: '#5ed4cb',
  green: '#6fcf7c',
  amber: '#f0c060',
  red: '#f06070',
  blue: '#6eaaff',
  purple: '#b388ff',
  pink: '#f278c0',
};

/* ---- Shared: Commit Dot ---- */
function CommitDot({ cx, cy, r = 12, color = GV.blue, label, active, ghost, pulse }) {
  const opacity = ghost ? 0.25 : 1;
  return (
    <g style={{ opacity, transition: 'opacity 0.5s' }}>
      {pulse && (
        <circle cx={cx} cy={cy} r={r + 6} fill="none" stroke={color} strokeWidth={2}
          style={{ animation: 'commitPulse 1.5s ease-out infinite' }} />
      )}
      <circle cx={cx} cy={cy} r={r} fill={active ? color : GV.surface}
        stroke={color} strokeWidth={active ? 0 : 2.5} />
      {label && (
        <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
          fill={active ? '#fff' : color} fontSize={10} fontFamily="'Fira Code', monospace" fontWeight={600}>
          {label}
        </text>
      )}
    </g>
  );
}

/* ---- Shared: Branch Label ---- */
function BranchLabel({ x, y, name, color = GV.blue, below = false }) {
  const dy = below ? 28 : -28;
  return (
    <g>
      <rect x={x - (name.length * 4 + 10)} y={y + dy - 10} width={name.length * 8 + 20} height={20}
        rx={4} fill={color + '22'} stroke={color} strokeWidth={1.5} />
      <text x={x} y={y + dy} textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize={11} fontFamily="'Fira Code', monospace" fontWeight={500}>
        {name}
      </text>
    </g>
  );
}

/* ---- Shared: Edge line ---- */
function Edge({ x1, y1, x2, y2, color = GV.blue, dashed = false, ghost = false }) {
  const mid = (x1 + x2) / 2;
  const d = y1 === y2
    ? `M ${x1} ${y1} L ${x2} ${y2}`
    : `M ${x1} ${y1} C ${mid} ${y1} ${mid} ${y2} ${x2} ${y2}`;
  return (
    <path d={d} fill="none" stroke={color} strokeWidth={2.5}
      strokeDasharray={dashed ? '6 4' : 'none'}
      style={{ opacity: ghost ? 0.2 : 0.7, transition: 'opacity 0.5s' }} />
  );
}


/* ============================================================
   CommitGraph — Interactive branch/merge visualizer
   ============================================================ */
function CommitGraph({ step = 0, scenario = 'basic' }) {
  const W = 680, H = 220;

  if (scenario === 'basic') {
    // Basic linear + branch scenario
    const commits = [
      { id: 'c1', x: 80, y: 110, label: 'c1', color: GV.blue },
      { id: 'c2', x: 180, y: 110, label: 'c2', color: GV.blue },
      { id: 'c3', x: 280, y: 110, label: 'c3', color: GV.blue },
      { id: 'c4', x: 380, y: 110, label: 'c4', color: GV.blue },
      { id: 'b1', x: 330, y: 50, label: 'b1', color: GV.purple },
      { id: 'b2', x: 430, y: 50, label: 'b2', color: GV.purple },
    ];
    const edges = [
      { from: 'c1', to: 'c2', color: GV.blue },
      { from: 'c2', to: 'c3', color: GV.blue },
      { from: 'c3', to: 'c4', color: GV.blue },
      { from: 'c2', to: 'b1', color: GV.purple },
      { from: 'b1', to: 'b2', color: GV.purple },
    ];
    const visibleCommits = step >= 0 ? commits.slice(0, Math.min(step + 3, commits.length)) : [];
    const visibleEdges = step >= 0 ? edges.slice(0, Math.min(step + 2, edges.length)) : [];
    const commitMap = {};
    commits.forEach(c => commitMap[c.id] = c);

    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W }}>
        {visibleEdges.map((e, i) => (
          <Edge key={i} x1={commitMap[e.from].x} y1={commitMap[e.from].y}
            x2={commitMap[e.to].x} y2={commitMap[e.to].y} color={e.color} />
        ))}
        {visibleCommits.map((c, i) => (
          <CommitDot key={c.id} cx={c.x} cy={c.y} label={c.label} color={c.color}
            active={i === visibleCommits.length - 1} />
        ))}
        {step >= 1 && <BranchLabel x={380} y={110} name="main" color={GV.blue} below />}
        {step >= 2 && <BranchLabel x={430} y={50} name="feature" color={GV.purple} />}
      </svg>
    );
  }

  if (scenario === 'rebase-disaster') {
    const mainY = 130, featY = 60;
    const allCommits = [
      { id: 'm1', x: 60, y: mainY, label: 'm1', color: GV.blue },
      { id: 'm2', x: 150, y: mainY, label: 'm2', color: GV.blue },
      { id: 'm3', x: 240, y: mainY, label: 'm3', color: GV.blue },
      { id: 'f1', x: 200, y: featY, label: 'f1', color: GV.purple },
      { id: 'f2', x: 290, y: featY, label: 'f2', color: GV.purple },
      // after bad rebase — ghosts
      { id: 'f1g', x: 310, y: mainY, label: 'f1', color: GV.red },
      { id: 'f2g', x: 400, y: mainY, label: 'f2', color: GV.red },
    ];
    const commitMap = {};
    allCommits.forEach(c => commitMap[c.id] = c);

    // step 0: normal history
    // step 1: show the rebase attempt
    // step 2: conflict / panic
    const showGhosts = step >= 1;
    const panic = step >= 2;

    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W }}>
        {/* main line */}
        <Edge x1={60} y1={mainY} x2={240} y2={mainY} color={GV.blue} />
        {!showGhosts && <Edge x1={150} y1={mainY} x2={200} y2={featY} color={GV.purple} />}
        {!showGhosts && <Edge x1={200} y1={featY} x2={290} y2={featY} color={GV.purple} />}

        {showGhosts && <Edge x1={240} y1={mainY} x2={310} y2={mainY} color={GV.red} dashed />}
        {showGhosts && <Edge x1={310} y1={mainY} x2={400} y2={mainY} color={GV.red} dashed />}

        <CommitDot cx={60} cy={mainY} label="m1" color={GV.blue} active={false} />
        <CommitDot cx={150} cy={mainY} label="m2" color={GV.blue} active={false} />
        <CommitDot cx={240} cy={mainY} label="m3" color={GV.blue} active={false} />

        {!showGhosts && <>
          <CommitDot cx={200} cy={featY} label="f1" color={GV.purple} active={false} />
          <CommitDot cx={290} cy={featY} label="f2" color={GV.purple} active />
          <BranchLabel x={290} y={featY} name="feature" color={GV.purple} />
        </>}

        {showGhosts && <>
          <CommitDot cx={200} cy={featY} label="f1" color={GV.purple} ghost />
          <CommitDot cx={290} cy={featY} label="f2" color={GV.purple} ghost />
          <Edge x1={150} y1={mainY} x2={200} y2={featY} color={GV.purple} ghost />
          <Edge x1={200} y1={featY} x2={290} y2={featY} color={GV.purple} ghost />
          <CommitDot cx={310} cy={mainY} label="f1'" color={GV.red} active={false} />
          <CommitDot cx={400} cy={mainY} label="f2'" color={GV.red} active={!panic} pulse={!panic} />
        </>}

        <BranchLabel x={240} y={mainY} name="main" color={GV.blue} below />

        {panic && (
          <g>
            <rect x={420} y={mainY - 35} width={220} height={56} rx={8}
              fill={GV.red + '18'} stroke={GV.red} strokeWidth={1.5} />
            <text x={530} y={mainY - 15} textAnchor="middle" fill={GV.red}
              fontSize={12} fontFamily="'Fira Code', monospace" fontWeight={700}>
              CONFLICT (content)
            </text>
            <text x={530} y={mainY + 5} textAnchor="middle" fill={GV.red}
              fontSize={11} fontFamily="'Fira Code', monospace" opacity={0.8}>
              fix and run "git rebase --continue"
            </text>
          </g>
        )}
      </svg>
    );
  }

  return null;
}


/* ============================================================
   WorktreeViz — Side-by-side worktree diagram
   ============================================================ */
function WorktreeViz({ step = 0 }) {
  const showSecond = step >= 1;
  const showSharedGit = step >= 2;

  const dirStyle = {
    background: GV.surface,
    border: `1.5px solid ${GV.border}`,
    borderRadius: 12,
    padding: '22px 28px',
    minWidth: 280,
    transition: 'all 0.4s ease',
    opacity: 1,
  };

  const fileStyle = {
    fontFamily: "'Fira Code', monospace",
    fontSize: 18,
    color: GV.dim,
    padding: '4px 0',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  };

  const folderIcon = (
    <span style={{ color: GV.amber }}>📁</span>
  );
  const fileIcon = (
    <span style={{ color: GV.dim }}>📄</span>
  );
  const gitIcon = (
    <span style={{ color: GV.green }}>⚙️</span>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
      {/* Primary worktree */}
      <div style={dirStyle}>
        <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 19, fontWeight: 700, color: GV.teal, marginBottom: 12 }}>
          ~/acaas-docs <span style={{ fontWeight: 400, color: GV.dim, fontSize: 14 }}>(update-overview)</span>
        </div>
        <div style={fileStyle}>{gitIcon} .git/</div>
        <div style={{ ...fileStyle, color: GV.amber }}>{fileIcon} index.mdx <span style={{ fontSize: 12 }}>✎</span></div>
        <div style={fileStyle}>{fileIcon} quickstart.mdx</div>
        <div style={fileStyle}>{fileIcon} errors.mdx</div>
        <div style={fileStyle}>{fileIcon} experimental-emphasis.mdx</div>
        <div style={fileStyle}>{fileIcon} changelog.mdx</div>
      </div>

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', alignSelf: 'center',
        opacity: showSharedGit ? 1 : 0, transition: 'opacity 0.4s ease',
      }}>
        <div style={{ width: 72, height: 2, background: GV.green, opacity: 0.5 }} />
        <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 16, color: GV.green, marginTop: 8, textAlign: 'center' }}>
          shared<br />.git
        </div>
        <div style={{ width: 72, height: 2, background: GV.green, opacity: 0.5, marginTop: 8 }} />
      </div>

      {/* Second worktree */}
      <div style={{
        ...dirStyle,
        opacity: showSecond ? 1 : 0,
        borderColor: showSecond ? GV.teal : GV.border,
      }}>
        <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 19, fontWeight: 700, color: GV.purple, marginBottom: 12 }}>
          ~/ga <span style={{ fontWeight: 400, color: GV.dim, fontSize: 14 }}>(emphasize-ga)</span>
        </div>
        <div style={{ ...fileStyle, color: GV.green }}>{gitIcon} .git → linked</div>
        <div style={fileStyle}>{fileIcon} index.mdx</div>
        <div style={fileStyle}>{fileIcon} quickstart.mdx</div>
        <div style={fileStyle}>{fileIcon} errors.mdx</div>
        <div style={{ ...fileStyle, color: GV.amber }}>{fileIcon} experimental-emphasis.mdx <span style={{ fontSize: 12 }}>✎</span></div>
        <div style={fileStyle}>{fileIcon} changelog.mdx</div>
      </div>
    </div>
  );
}


/* ============================================================
   ReflogTimeline — Animated reflog entries
   ============================================================ */
function ReflogTimeline({ step = 0, showRecovery = false }) {
  const entries = [
    { hash: 'a1b2c3d', action: 'commit', desc: 'Add API docs', color: GV.blue, ago: '3 hours ago' },
    { hash: 'e4f5g6h', action: 'commit', desc: 'Fix typo in README', color: GV.blue, ago: '2 hours ago' },
    { hash: 'i7j8k9l', action: 'checkout', desc: 'moving from main to feature', color: GV.purple, ago: '90 min ago' },
    { hash: 'm0n1o2p', action: 'commit', desc: 'Rename all the things', color: GV.purple, ago: '60 min ago' },
    { hash: 'q3r4s5t', action: 'rebase', desc: 'rebase -i (start)', color: GV.amber, ago: '45 min ago' },
    { hash: 'u6v7w8x', action: 'rebase', desc: 'rebase -i (finish)', color: GV.red, ago: '44 min ago' },
    { hash: 'y9z0a1b', action: 'reset', desc: 'reset --hard HEAD~3 😱', color: GV.red, ago: '30 min ago' },
  ];

  const visibleCount = Math.min(step + 1, entries.length);

  const entryStyle = (i, entry) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '8px 16px',
    fontFamily: "'Fira Code', monospace",
    fontSize: 13,
    opacity: i < visibleCount ? 1 : 0,
    transform: i < visibleCount ? 'translateY(0)' : 'translateY(10px)',
    transition: 'opacity 0.4s ease, transform 0.4s ease',
    borderLeft: `3px solid ${entry.color}`,
    background: showRecovery && i === visibleCount - 1 ? GV.green + '15' : 'transparent',
    marginBottom: 4,
    borderRadius: '0 6px 6px 0',
  });

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{
        fontFamily: "'Fira Code', monospace", fontSize: 12,
        color: GV.dim, marginBottom: 12, letterSpacing: 1,
      }}>
        $ git reflog
      </div>
      {entries.slice(0, visibleCount).reverse().map((entry, idx) => {
        const i = visibleCount - 1 - idx;
        return (
          <div key={i} style={entryStyle(i, entry)}>
            <span style={{ color: entry.color, fontWeight: 700, minWidth: 70 }}>{entry.hash.slice(0, 7)}</span>
            <span style={{ color: GV.dim, minWidth: 50, fontSize: 11 }}>HEAD@{`{${entries.length - 1 - i}}`}</span>
            <span style={{ color: entry.color, minWidth: 70, fontSize: 11 }}>{entry.action}</span>
            <span style={{ color: GV.text }}>{entry.desc}</span>
            <span style={{ color: GV.dim, fontSize: 10, marginLeft: 'auto' }}>{entry.ago}</span>
          </div>
        );
      })}
      {showRecovery && step >= entries.length && (
        <div style={{
          marginTop: 16, padding: '12px 16px', background: GV.green + '15',
          border: `1.5px solid ${GV.green}40`, borderRadius: 8,
          fontFamily: "'Fira Code', monospace", fontSize: 13,
        }}>
          <span style={{ color: GV.green }}>$ git reset --hard m0n1o2p</span>
          <div style={{ color: GV.text, marginTop: 6, fontSize: 12 }}>
            HEAD is now at m0n1o2p Rename all the things ✨
          </div>
        </div>
      )}
    </div>
  );
}


/* ============================================================
   RerereViz — Conflict resolution animation
   ============================================================ */
function RerereViz({ step = 0 }) {
  // step 0: conflict shows up
  // step 1: you resolve it manually
  // step 2: same conflict again — auto-resolved!

  const conflictCode = [
    { text: '<<<<<<< HEAD', type: 'conflict-marker' },
    { text: 'Send a POST request to https://preview.api...', type: 'ours' },
    { text: '=======', type: 'conflict-marker' },
    { text: 'Send text to https://api.allcaps.dev...', type: 'theirs' },
    { text: '>>>>>>> ga-launch', type: 'conflict-marker' },
  ];

  const resolvedCode = [
    { text: 'Send a POST request to https://api.allcaps.dev...', type: 'resolved' },
  ];

  const lines = step === 0 ? conflictCode : resolvedCode;

  const colorMap = {
    'normal': GV.text,
    'conflict-marker': GV.red,
    'ours': GV.blue,
    'theirs': GV.purple,
    'resolved': GV.green,
  };

  const bgMap = {
    'conflict-marker': GV.red + '12',
    'ours': GV.blue + '10',
    'theirs': GV.purple + '10',
    'resolved': GV.green + '12',
  };

  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      {/* Status bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 16px', background: GV.surface, borderRadius: '8px 8px 0 0',
        border: `1px solid ${GV.border}`, borderBottom: 'none',
      }}>
        <span style={{ fontFamily: "'Fira Code', monospace", fontSize: 12, color: GV.dim }}>
          README.md
        </span>
        {step === 0 && (
          <span style={{ fontSize: 11, color: GV.red, fontFamily: "'Fira Code', monospace" }}>
            ⚠ CONFLICT
          </span>
        )}
        {step === 1 && (
          <span style={{ fontSize: 11, color: GV.green, fontFamily: "'Fira Code', monospace" }}>
            ✓ Resolved (rerere recorded)
          </span>
        )}
        {step === 2 && (
          <span style={{ fontSize: 11, color: GV.green, fontFamily: "'Fira Code', monospace" }}>
            ✨ Auto-resolved by rerere!
          </span>
        )}
      </div>

      {/* Code block */}
      <div style={{
        background: '#151020', padding: '16px 20px', borderRadius: '0 0 8px 8px',
        border: `1px solid ${GV.border}`, fontFamily: "'Fira Code', monospace", fontSize: 14,
        lineHeight: 1.8,
      }}>
        {lines.map((line, i) => (
          <div key={i} style={{
            color: colorMap[line.type] || GV.text,
            background: bgMap[line.type] || 'transparent',
            padding: '0 8px', margin: '0 -8px', borderRadius: 3,
            transition: 'all 0.3s ease',
          }}>
            {line.text}
          </div>
        ))}
      </div>

      {/* Step label */}
      {step >= 2 && (
        <div style={{
          marginTop: 12, textAlign: 'center',
          fontFamily: "'Fira Code', monospace", fontSize: 12, color: GV.amber,
        }}>
          Same conflict, 3 merges later → resolved automatically
        </div>
      )}
    </div>
  );
}


/* ============================================================
   TerminalBlock — Fake terminal with step reveal
   ============================================================ */
function TerminalBlock({ lines, visibleLines, title = 'terminal' }) {
  const count = visibleLines !== undefined ? visibleLines : lines.length;
  return (
    <div style={{
      background: '#0d0a14', borderRadius: 14, overflow: 'hidden',
      border: `1px solid ${GV.border}`, maxWidth: 760, margin: '0 auto',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    }}>
      {/* Title bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px',
        background: GV.surface, borderBottom: `1px solid ${GV.border}`,
      }}>
        <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#f06070' }} />
        <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#f0c060' }} />
        <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#6fcf7c' }} />
        <span style={{
          fontFamily: "'Fira Code', monospace", fontSize: 16, color: GV.dim, marginLeft: 10,
        }}>{title}</span>
      </div>
      {/* Lines */}
      <div style={{ padding: '26px 34px', fontFamily: "'Fira Code', monospace", fontSize: 28, lineHeight: 1.85 }}>
        {lines.slice(0, count).map((line, i) => (
          <div key={i} style={{
            color: line.color || GV.text,
            opacity: line.dim ? 0.5 : 1,
            transition: 'opacity 0.3s',
          }}>
            {line.prefix && <span style={{ color: GV.green }}>{line.prefix} </span>}
            {line.text}
          </div>
        ))}
        {count < lines.length && (
          <span style={{ color: GV.green, animation: 'blink 1s step-end infinite' }}>▌</span>
        )}
      </div>
    </div>
  );
}


/* ============================================================
   ProductRenameDemo — Synthesis scenario with all three commands
   ============================================================ */
function ProductRenameDemo({ step = 0 }) {
  const stages = [
    { label: '1. Create worktree', icon: '🌳', color: GV.teal,
      desc: 'git worktree add ../rename-wt rename-branch',
      detail: 'Work on the rename in a separate directory. No stashing, no branch-switching.' },
    { label: '2. Enable rerere', icon: '♻️', color: GV.amber,
      desc: 'git config rerere.enabled true',
      detail: 'Resolve each merge conflict once. Git remembers for next time.' },
    { label: '3. Work & merge periodically', icon: '🔄', color: GV.purple,
      desc: 'git merge main  (in your worktree)',
      detail: 'Pull in main regularly. rerere handles repeated conflicts automatically.' },
    { label: '4. Recover with reflog', icon: '🛟', color: GV.green,
      desc: 'git reflog → git reset --hard HEAD@{n}',
      detail: 'Something went wrong? reflog has your back. Nothing is ever truly lost.' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 560, margin: '0 auto' }}>
      {stages.map((s, i) => {
        const visible = i <= step;
        const active = i === step;
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 16,
            padding: '14px 18px',
            background: active ? s.color + '12' : GV.surface,
            border: `1.5px solid ${active ? s.color + '60' : GV.border}`,
            borderRadius: 10,
            opacity: visible ? 1 : 0.15,
            transform: visible ? 'translateX(0)' : 'translateX(20px)',
            transition: 'all 0.4s ease',
          }}>
            <span style={{ fontSize: 24 }}>{s.icon}</span>
            <div>
              <div style={{ fontWeight: 700, color: s.color, fontSize: 15, marginBottom: 4 }}>
                {s.label}
              </div>
              <div style={{
                fontFamily: "'Fira Code', monospace", fontSize: 12,
                color: GV.text, opacity: 0.9, marginBottom: 4,
              }}>
                $ {s.desc}
              </div>
              <div style={{ fontSize: 13, color: GV.dim, lineHeight: 1.4 }}>
                {s.detail}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}


// Export all components
Object.assign(window, {
  GV,
  CommitDot, BranchLabel, Edge,
  CommitGraph, WorktreeViz, ReflogTimeline, RerereViz,
  TerminalBlock, ProductRenameDemo,
});
