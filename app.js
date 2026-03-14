import React, { useEffect, useMemo, useRef, useState } from 'https://esm.sh/react@18.2.0';
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client';
import htm from 'https://esm.sh/htm@3.1.1';

const html = htm.bind(React.createElement);

const WHOLE_POEM = [
  'if you wish,',
  'pray for me.',
  '',
  'take my coat of arms and',
  'splay the weapons out for me.',
  'pull out the guns and check the triggers—',
  'check if I’m a fraud,',
  'or a threat to your country.',
  '',
  'slow rising sun, potato chips and ranch,',
  'creeping strawberry vines through my liver.',
  'I eat cookies to fill the pit,',
  'to not crack open unsymmetrically—',
  'even if they go down the wrong pipe.',
  '',
  'do you see in my eyes, the slits of murder?',
  'I pull daggers out of my eyes so I can look at you,',
  'and I’m not crying,',
  'it’s the blood pouring out.',
  'they put a blindfold on my wound',
  'and call it a bandage.',
  '',
  'what do I stitch back up',
  'if my silhouette doesn’t sit still?',
  'my shadow isn’t mine',
  'and neither is my identity.',
  'so I drink oil in my fever dreams,',
  'until I spit it out—',
  'regurgitate their expectations on their face',
  'and wait for them to give me…',
  'consequenc̄e…',
  '',
  '—ʘ—',
  '',
  'the water’s out again.',
  'no electricity either.',
  'no first aid kit to clean his wounds.',
  'family dead, ancestry lost.',
  'how’s your pity going to save me?',
  '',
  'if you wish,',
  'pray for me.',
  'soon they’ll no longer trouble you with our deaths—',
  'just a few days and everyone will be gone.',
  'and then you can attend a rave on top of our graves,',
  'cleanse out the sea of bodies…',
  '',
  'but we’ll remember.',
  'the world watches and we only—',
  'remember.',
  '',
  'Epilograph: “if you wish—call it an elegy”'
];

const STATES = [
  {
    key: 'checked',
    title: 'CHECKED',
    blurb: 'Before you are heard, you are inspected.',
    caption: 'This state treats the speaker like an object of suspicion before it allows them the dignity of meaning.',
    accent: 'var(--green)',
    excerpt: [
      'pull out the guns and check the triggers—',
      'check if I’m a fraud,',
      'or a threat to your country.'
    ],
    score: [
      '<span class="cue cue-click">[clk]</span> pull out the guns and check the triggers—',
      '<span class="cue cue-click">[clk]</span> check if I’m a fraud,',
      '<span class="cue cue-silence">( … )</span> or a threat to your country.'
    ]
  },
  {
    key: 'split',
    title: 'SPLIT',
    blurb: 'Even your outline refuses to stay whole.',
    caption: 'Here the poem turns bodily. Identity is no longer stable enough to sit still inside a single silhouette.',
    accent: 'var(--purple)',
    excerpt: [
      'what do I stitch back up',
      'if my silhouette doesn’t sit still?',
      'my shadow isn’t mine',
      'and neither is my identity.'
    ],
    score: [
      'what do I stitch back up',
      '<span class="cue cue-cut">///</span> if my silhouette doesn’t sit still?',
      '<span class="cue cue-breath">[breath]</span> my shadow isn’t mine',
      'and neither is my identity.'
    ]
  },
  {
    key: 'fevered',
    title: 'FEVERED',
    blurb: 'The body keeps speaking through distortion.',
    caption: 'The voice here is overheated, contaminated, and still somehow articulate through grotesque imagery.',
    accent: 'var(--red)',
    excerpt: [
      'so I drink oil in my fever dreams,',
      'until I spit it out—',
      'regurgitate their expectations on their face',
      'and wait for them to give me…',
      'consequenc̄e…'
    ],
    score: [
      '<span class="cue cue-hiss">[hss]</span> so I drink oil in my fever dreams,',
      '<span class="cue cue-cut">///</span> until I spit it out—',
      '<span class="cue cue-hiss">[hss]</span> regurgitate their expectations on their face',
      '<span class="cue cue-silence">( … )</span> and wait for them to give me…',
      'consequenc̄e…'
    ]
  },
  {
    key: 'silenced',
    title: 'SILENCED',
    blurb: 'Meaning survives in what cannot be safely said.',
    caption: 'Scarcity and harm enter as stripped-down fact. The pauses become part of the damage.',
    accent: 'var(--white)',
    excerpt: [
      'the water’s out again.',
      'no electricity either.',
      'no first aid kit to clean his wounds.',
      'family dead, ancestry lost.',
      'how’s your pity going to save me?'
    ],
    score: [
      'the water’s out again.',
      '<span class="cue cue-silence">( … )</span> no electricity either.',
      '<span class="cue cue-cut">///</span> no first aid kit to clean his wounds.',
      '<span class="cue cue-breath">[breath]</span> family dead, ancestry lost.',
      'how’s your pity going to save me?'
    ]
  },
  {
    key: 'pleading',
    title: 'PLEADING',
    blurb: 'The mouth asks even when mercy has already failed.',
    caption: 'Prayer becomes both request and indictment. The softness of the phrase is what makes it so dangerous.',
    accent: 'var(--purple)',
    excerpt: [
      'if you wish,',
      'pray for me.'
    ],
    score: [
      '<span class="cue cue-breath">[breath]</span> if you wish,',
      '<span class="cue cue-silence">( … )</span> pray for me.'
    ]
  },
  {
    key: 'witness',
    title: 'WITNESS',
    blurb: 'You are no longer asking to be saved. You are recording.',
    caption: 'By the end, the poem stops seeking pity and becomes a document against erasure.',
    accent: 'var(--green)',
    excerpt: [
      'but we’ll remember.',
      'the world watches and we only—',
      'remember.'
    ],
    score: [
      'but we’ll remember.',
      '<span class="cue cue-cut">///</span> the world watches and we only—',
      '<span class="cue cue-silence">( … )</span> remember.'
    ]
  },
  {
    key: 'static',
    title: 'STATIC',
    blurb: 'Signal remains, but not without damage.',
    caption: 'Pleasure and violence sit in the same breath. The line tastes domestic and surreal at once.',
    accent: 'var(--green)',
    excerpt: [
      'slow rising sun, potato chips and ranch,',
      'creeping strawberry vines through my liver.',
      'I eat cookies to fill the pit,',
      'to not crack open unsymmetrically—',
      'even if they go down the wrong pipe.'
    ],
    score: [
      'slow rising sun, potato chips and ranch,',
      '<span class="cue cue-hiss">[hss]</span> creeping strawberry vines through my liver.',
      '<span class="cue cue-breath">[breath]</span> I eat cookies to fill the pit,',
      '<span class="cue cue-cut">///</span> to not crack open unsymmetrically—',
      'even if they go down the wrong pipe.'
    ]
  },
  {
    key: 'elegy',
    title: 'ELEGY',
    blurb: 'Grief becomes its own form of speech.',
    caption: 'This is the terminal state of the poem: not silence, not pity, but the endurance of memorial voice.',
    accent: 'var(--red)',
    excerpt: [
      'if you wish—call it an elegy'
    ],
    score: [
      '<span class="cue cue-silence">( … )</span> if you wish—call it an elegy'
    ]
  }
];

const LOADING_LINES = [
  'listening…',
  'testing the mouth against impact…',
  'deciding how the voice will arrive…',
  'measuring what survives the wound…'
];

function App() {
  const [screen, setScreen] = useState('intro');
  const [selectedState, setSelectedState] = useState(null);
  const [showScore, setShowScore] = useState(false);
  const [showPoem, setShowPoem] = useState(false);
  const [loadingLineIndex, setLoadingLineIndex] = useState(0);
  const loadTimerRef = useRef(null);

  useEffect(() => {
    if (screen !== 'loading') return undefined;

    let lineIndex = 0;
    const lineTimer = window.setInterval(() => {
      lineIndex = (lineIndex + 1) % LOADING_LINES.length;
      setLoadingLineIndex(lineIndex);
    }, 480);

    const chosen = STATES[Math.floor(Math.random() * STATES.length)];
    loadTimerRef.current = window.setTimeout(() => {
      setSelectedState(chosen);
      setShowScore(false);
      setScreen('assigned');
    }, 1900);

    return () => {
      window.clearTimeout(loadTimerRef.current);
      window.clearInterval(lineTimer);
    };
  }, [screen]);

  const beginExperience = () => {
    setSelectedState(null);
    setShowScore(false);
    setShowPoem(false);
    setLoadingLineIndex(0);
    setScreen('loading');
  };

  const resetExperience = () => {
    setScreen('intro');
    setSelectedState(null);
    setShowScore(false);
    setShowPoem(false);
  };

  const stateColorStyle = useMemo(() => ({
    '--state-accent': selectedState?.accent || 'var(--purple)'
  }), [selectedState]);

  return html`
    <div className="app-shell">
      <${FireworksCanvas} />
      <div className="noise-layer" aria-hidden="true"></div>

      <main className="app">
        <section className="frame" style=${stateColorStyle}>
          <div className="frame-inner">
            <header className="frame-header">
              <span className="mark">How the Voice Arrives</span>
              <span className="status-pill">if you wish</span>
            </header>

            ${screen === 'intro' && html`
              <section className="hero screen-fade">
                <div className="hero-grid">
                  <div>
                    <p className="kicker">An interactive vocal score</p>
                    <h1 className="title">Before you are heard, you are handled.</h1>
                    <p className="subtitle">
                      This experience does not assign you a label. It assigns you a condition of voice —
                      a way the poem arrives after suspicion, rupture, pity, and witness have already touched it.
                    </p>
                    <div className="actions">
                      <button className="btn btn-primary" onClick=${beginExperience}>let it speak</button>
                      <button className="btn btn-ghost" onClick=${() => setShowPoem(true)}>read the whole poem</button>
                    </div>
                  </div>

                  <aside className="hero-side-card">
                    <div>
                      <div className="side-card-label">How it works</div>
                      <p className="side-card-text">
                        Press the button. The site assigns one state of voice at random. You receive a matched excerpt,
                        then reveal how that excerpt changes when breath, silence, cuts, and pressure are allowed to speak.
                      </p>
                    </div>
                    <p className="footnote">
                      White and black hold the body. Violet, green, and red rupture the dark like warning flares.
                    </p>
                  </aside>
                </div>
              </section>
            `}

            ${screen === 'loading' && html`
              <section className="loading screen-fade" aria-live="polite">
                <div className="loading-ring">
                  <div className="loading-word">${LOADING_LINES[loadingLineIndex]}</div>
                </div>
                <p className="loading-copy">
                  The voice is passing through atmosphere: inspection, fracture, grief, static, elegy.
                </p>
              </section>
            `}

            ${screen === 'assigned' && selectedState && html`
              <section className="assignment screen-fade">
                <article className="assignment-card">
                  <div
                    className="assignment-glow"
                    style=${{ background: `radial-gradient(circle at 28% 20%, ${toGlow(selectedState.accent)}, transparent 45%)` }}
                    aria-hidden="true"
                  ></div>
                  <div className="assignment-label">Your voice arrives as</div>
                  <h2 className="assignment-title">${selectedState.title}</h2>
                  <p className="assignment-blurb">${selectedState.blurb}</p>
                  <p className="assignment-note">${selectedState.caption}</p>
                  <div className="assignment-actions">
                    <button className="btn btn-primary" onClick=${() => setScreen('excerpt')}>continue</button>
                    <button className="btn btn-ghost" onClick=${beginExperience}>draw another state</button>
                    <button className="btn btn-ghost" onClick=${() => setShowPoem(true)}>read the whole poem</button>
                  </div>
                </article>
              </section>
            `}

            ${screen === 'excerpt' && selectedState && html`
              <section className="excerpt-view screen-fade">
                <div className="state-banner">
                  <div className="state-chip">${selectedState.title}</div>
                  <p className="state-blurb-small">${selectedState.blurb}</p>
                </div>

                <article className="excerpt-card">
                  <div className="excerpt-top">
                    <div className="excerpt-title-group">
                      <h2 className="excerpt-title">${showScore ? 'The score beneath the words' : 'Matched excerpt'}</h2>
                      <p className="excerpt-caption">${selectedState.caption}</p>
                    </div>
                    <div className="score-indicator">${showScore ? 'score visible' : 'text only'}</div>
                  </div>

                  <div className="poem-panel">
                    <div className="poem-lines">
                      ${(showScore ? selectedState.score : selectedState.excerpt).map((line, index) => renderLine(line, index, showScore))}
                    </div>
                  </div>

                  ${showScore && html`
                    <div className="legend" aria-label="Legend for score cues">
                      <span className="legend-chip"><span className="legend-dot green"></span> click = inspection</span>
                      <span className="legend-chip"><span className="legend-dot red"></span> hiss = pressure / spill</span>
                      <span className="legend-chip"><span className="legend-dot purple"></span> breath = surviving voice</span>
                      <span className="legend-chip"><span className="legend-dot white"></span> silence / cut = rupture</span>
                    </div>
                  `}

                  <div className="excerpt-actions">
                    <button
                      className=${showScore ? 'btn btn-accent-green' : 'btn btn-primary'}
                      onClick=${() => setShowScore((value) => !value)}
                    >
                      ${showScore ? 'hide the score' : 'show how it sounds'}
                    </button>
                    <button className="btn btn-ghost" onClick=${() => setShowPoem(true)}>read the whole poem</button>
                    <button className="btn btn-ghost" onClick=${beginExperience}>draw another state</button>
                    <button className="btn btn-accent-red" onClick=${resetExperience}>start over</button>
                  </div>

                  <button className="epilograph-button" onClick=${resetExperience}>
                    if you wish—call it an elegy
                  </button>
                </article>
              </section>
            `}

            <footer className="credit-row">
              <span>Hasan Bukhari · UGS 2026</span>
              <span>Interactive poem environment · built for GitHub Pages</span>
            </footer>
          </div>
        </section>
      </main>

      ${showPoem ? html`<${PoemModal} onClose=${() => setShowPoem(false)} />` : null}
    </div>
  `;
}

function PoemModal({ onClose }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return html`
    <div className="poem-modal" role="dialog" aria-modal="true" aria-labelledby="poem-modal-title" onClick=${onClose}>
      <div className="poem-modal-content screen-fade" onClick=${(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="assignment-label">Full text</div>
            <h2 className="modal-title" id="poem-modal-title">if you wish</h2>
            <p className="modal-subtitle">
              The complete poem remains available at every stage, because the gimmick should deepen the poem — not replace it.
            </p>
          </div>
          <button className="btn btn-ghost close-btn" onClick=${onClose}>close</button>
        </div>

        <div className="poem-full-lines">
          ${WHOLE_POEM.map((line, index) => {
            const isBlank = line === '';
            const isEpi = line.startsWith('Epilograph:');
            return html`
              <p className=${`poem-full-line ${isBlank ? 'blank' : ''} ${isEpi ? 'epi-line' : ''}`} key=${index}>${line}</p>
            `;
          })}
        </div>

        <div className="modal-actions">
          <button className="btn btn-primary" onClick=${onClose}>return to the experience</button>
        </div>
      </div>
    </div>
  `;
}

function FireworksCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return undefined;
    }

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let animationFrame = 0;
    let lastTime = 0;
    let nextLaunch = 0;

    const shells = [];
    const sparks = [];
    const palette = ['#f5f0ea', '#b68dff', '#a8ff2f', '#ff4961'];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const launchShell = () => {
      const side = Math.random() > 0.5 ? 1 : -1;
      const startX = side > 0 ? -20 : width + 20;
      const targetX = width * (0.18 + Math.random() * 0.64);
      const targetY = height * (0.12 + Math.random() * 0.36);
      const duration = 72 + Math.random() * 24;

      shells.push({
        x: startX,
        y: height + 24,
        prevX: startX,
        prevY: height + 24,
        vx: (targetX - startX) / duration,
        vy: (targetY - (height + 24)) / duration - 1.85,
        gravity: 0.052 + Math.random() * 0.012,
        age: 0,
        maxAge: duration,
        color: palette[Math.floor(Math.random() * palette.length)]
      });
    };

    const explode = (shell) => {
      const count = 26 + Math.floor(Math.random() * 22);
      for (let index = 0; index < count; index += 1) {
        const angle = (Math.PI * 2 * index) / count + Math.random() * 0.16;
        const speed = 1.15 + Math.random() * 2.75;
        sparks.push({
          x: shell.x,
          y: shell.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.011 + Math.random() * 0.013,
          color: shell.color,
          size: 1.3 + Math.random() * 1.9,
          gravity: 0.013 + Math.random() * 0.02
        });
      }
    };

    const drawGlow = (x, y, size, color, alpha) => {
      context.save();
      context.globalAlpha = alpha;
      const gradient = context.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(x, y, size, 0, Math.PI * 2);
      context.fill();
      context.restore();
    };

    const animate = (time) => {
      animationFrame = window.requestAnimationFrame(animate);
      const delta = time - lastTime;
      lastTime = time;

      context.clearRect(0, 0, width, height);
      context.fillStyle = 'rgba(3, 3, 5, 0.14)';
      context.fillRect(0, 0, width, height);

      if (time > nextLaunch) {
        launchShell();
        nextLaunch = time + 1050 + Math.random() * 750;
      }

      for (let index = shells.length - 1; index >= 0; index -= 1) {
        const shell = shells[index];
        shell.prevX = shell.x;
        shell.prevY = shell.y;
        shell.x += shell.vx * (delta / 16.67);
        shell.y += shell.vy * (delta / 16.67);
        shell.vy += shell.gravity * (delta / 16.67);
        shell.age += delta / 16.67;

        context.save();
        context.strokeStyle = shell.color;
        context.lineWidth = 1.4;
        context.globalAlpha = 0.72;
        context.beginPath();
        context.moveTo(shell.prevX, shell.prevY);
        context.lineTo(shell.x, shell.y);
        context.stroke();
        context.restore();

        drawGlow(shell.x, shell.y, 9, shell.color, 0.2);
        drawGlow(shell.x, shell.y, 2.2, shell.color, 0.85);

        if (shell.age >= shell.maxAge || shell.vy > 0.18) {
          explode(shell);
          shells.splice(index, 1);
        }
      }

      for (let index = sparks.length - 1; index >= 0; index -= 1) {
        const spark = sparks[index];
        spark.x += spark.vx * (delta / 16.67);
        spark.y += spark.vy * (delta / 16.67);
        spark.vx *= 0.992;
        spark.vy += spark.gravity * (delta / 16.67);
        spark.life -= spark.decay * (delta / 16.67);

        context.save();
        context.globalAlpha = Math.max(spark.life, 0);
        context.fillStyle = spark.color;
        context.beginPath();
        context.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
        context.fill();
        context.restore();

        drawGlow(spark.x, spark.y, 7.5, spark.color, spark.life * 0.14);

        if (spark.life <= 0) {
          sparks.splice(index, 1);
        }
      }
    };

    resize();
    animationFrame = window.requestAnimationFrame(animate);
    window.addEventListener('resize', resize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return html`<canvas className="fireworks-canvas" ref=${canvasRef} aria-hidden="true"></canvas>`;
}

function renderLine(line, index, isScore) {
  if (!line) {
    return html`<p className="poem-line blank" key=${index} aria-hidden="true"></p>`;
  }

  if (!isScore) {
    return html`<p className="poem-line muted-fade" key=${index}>${line}</p>`;
  }

  return html`
    <p
      className="poem-line score"
      key=${index}
      dangerouslySetInnerHTML=${{ __html: line }}
    ></p>
  `;
}

function toGlow(colorVar) {
  if (colorVar === 'var(--green)') return 'rgba(168, 255, 47, 0.24)';
  if (colorVar === 'var(--red)') return 'rgba(255, 73, 97, 0.24)';
  return 'rgba(182, 141, 255, 0.24)';
}

const root = createRoot(document.getElementById('root'));
root.render(html`<${App} />`);
