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
    title: 'checked',
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
    title: 'split',
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
    title: 'fevered',
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
    title: 'silenced',
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
    title: 'pleading',
    accent: 'var(--purple)',
    excerpt: ['if you wish,', 'pray for me.'],
    score: [
      '<span class="cue cue-breath">[breath]</span> if you wish,',
      '<span class="cue cue-silence">( … )</span> pray for me.'
    ]
  },
  {
    key: 'witness',
    title: 'witness',
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
    title: 'static',
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
    title: 'elegy',
    accent: 'var(--red)',
    excerpt: ['if you wish—call it an elegy'],
    score: ['<span class="cue cue-silence">( … )</span> if you wish—call it an elegy']
  }
];

const EXCERPT_DELAY = 2100;
const LOADING_DELAY = 1200;

function App() {
  const [screen, setScreen] = useState('intro');
  const [selectedState, setSelectedState] = useState(null);
  const [showPoem, setShowPoem] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  useEffect(() => {
    window.clearTimeout(timerRef.current);

    if (screen === 'loading') {
      timerRef.current = window.setTimeout(() => setScreen('excerpt'), LOADING_DELAY);
    }

    if (screen === 'excerpt') {
      timerRef.current = window.setTimeout(() => setScreen('score'), EXCERPT_DELAY);
    }
  }, [screen]);

  const beginExperience = () => {
    const chosen = STATES[Math.floor(Math.random() * STATES.length)];
    setSelectedState(chosen);
    setShowPoem(false);
    setScreen('loading');
  };

  const resetExperience = () => {
    window.clearTimeout(timerRef.current);
    setShowPoem(false);
    setSelectedState(null);
    setScreen('intro');
  };

  const stateColorStyle = useMemo(
    () => ({ '--state-accent': selectedState?.accent || 'var(--purple)' }),
    [selectedState]
  );

  return html`
    <div className="app-shell">
      <${FireworksCanvas} />
      <div className="noise-layer" aria-hidden="true"></div>

      <main className="app">
        <section className="frame" style=${stateColorStyle}>
          <div className="frame-inner">
            ${screen === 'intro' && html`
              <section className="screen intro screen-fade">
                <p className="small-mark">if you wish</p>
                <h1 className="main-title">let it speak.</h1>
                <button className="btn btn-primary" onClick=${beginExperience}>begin</button>
              </section>
            `}

            ${screen === 'loading' && html`
              <section className="screen loading screen-fade" aria-live="polite">
                <div className="loading-mark">listening…</div>
              </section>
            `}

            ${screen === 'excerpt' && selectedState && html`
              <section className="screen reveal screen-fade">
                <p className="state-name">${selectedState.title}</p>
                <div className="text-block">
                  ${selectedState.excerpt.map((line, index) => renderLine(line, index, false))}
                </div>
              </section>
            `}

            ${screen === 'score' && selectedState && html`
              <section className="screen reveal final screen-fade">
                <p className="state-name">${selectedState.title}</p>
                <div className="text-block scored">
                  ${selectedState.score.map((line, index) => renderLine(line, index, true))}
                </div>
                <div className="end-actions">
                  <button className="btn btn-ghost" onClick=${() => setShowPoem(true)}>whole poem</button>
                </div>
                <button className="epilograph-button" onClick=${resetExperience}>
                  if you wish—call it an elegy
                </button>
              </section>
            `}
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
        <button className="modal-close" aria-label="Close poem" onClick=${onClose}>×</button>
        <div className="modal-head">
          <h2 className="modal-title" id="poem-modal-title">if you wish</h2>
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
    return html`<p className="poem-line" key=${index}>${line}</p>`;
  }

  return html`
    <p
      className="poem-line score"
      key=${index}
      dangerouslySetInnerHTML=${{ __html: line }}
    ></p>
  `;
}

const root = createRoot(document.getElementById('root'));
root.render(html`<${App} />`);
