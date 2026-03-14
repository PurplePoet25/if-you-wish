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
    key: 'remembering',
    title: 'remembering',
    accent: 'var(--red)',
    excerpt: [
      'but we’ll remember.',
      'the world watches and we only—',
      'remember.'
    ],
    score: [
      '<span class="cue cue-breath">[breath]</span> but we’ll remember.',
      '<span class="cue cue-cut">///</span> the world watches and we only—',
      '<span class="cue cue-silence">( … )</span> remember.'
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
      'the world watches and we only—',
      'remember.'
    ],
    score: [
      '<span class="cue cue-silence">( … )</span> the world watches and we only—',
      '<span class="cue cue-cut">///</span> remember.'
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
const LOADING_DELAY = 4100;
const AMBIENT_PALETTE = ['#f5f0ea', '#b68dff', '#a8ff2f', '#ff4961'];

const SOUND_FILES = {
  begin: './audio/begin.wav',
  ambient: './audio/ambient_loading_loop.wav',
  reveal: './audio/reveal.wav',
  modalOpen: './audio/modal_open.wav',
  close: './audio/close.wav',
  cueClick: './audio/cue_click.wav',
  cueCut: './audio/cue_cut.wav',
  cueBreath: './audio/cue_breath.wav',
  cueHiss: './audio/cue_hiss.wav',
  bombFall: './audio/bomb_fall.wav',
  wordBurst: './audio/word_burst.wav'
};

const SCORE_CUE_SEQUENCE = [
  { match: 'cue-click', sound: 'cueClick', delay: 0 },
  { match: 'cue-cut', sound: 'cueCut', delay: 220 },
  { match: 'cue-breath', sound: 'cueBreath', delay: 320 },
  { match: 'cue-hiss', sound: 'cueHiss', delay: 260 }
];

function createAudio(src, { volume = 1, loop = false } = {}) {
  const audio = new Audio(src);
  audio.preload = 'auto';
  audio.volume = volume;
  audio.loop = loop;
  return audio;
}

function resetAudio(audio) {
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
}

function getScoreCueTimeline(lines = []) {
  let offset = 0;
  const timeline = [];

  for (const line of lines) {
    const cue = SCORE_CUE_SEQUENCE.find(({ match }) => line.includes(match));
    if (cue) {
      timeline.push({ sound: cue.sound, at: offset });
      offset += cue.delay;
    } else {
      offset += 180;
    }
  }

  return timeline;
}

function App() {
  const [screen, setScreen] = useState('intro');
  const [selectedState, setSelectedState] = useState(null);
  const [showPoem, setShowPoem] = useState(false);
  const timerRef = useRef(null);
  const stateBagRef = useRef([]);
  const audioRef = useRef(null);
  const cueTimeoutsRef = useRef([]);
  const previousShowPoemRef = useRef(false);

  const clearCueTimeouts = () => {
    cueTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    cueTimeoutsRef.current = [];
  };

  const playSound = (name, { restart = true } = {}) => {
    const audio = audioRef.current?.[name];
    if (!audio) return;

    if (restart) {
      audio.currentTime = 0;
    }

    const playback = audio.play();
    if (playback && typeof playback.catch === 'function') {
      playback.catch(() => {});
    }
  };

  const stopSound = (name, { reset = false } = {}) => {
    const audio = audioRef.current?.[name];
    if (!audio) return;

    audio.pause();
    if (reset) {
      audio.currentTime = 0;
    }
  };

  useEffect(() => {
    audioRef.current = {
      begin: createAudio(SOUND_FILES.begin, { volume: 0.72 }),
      ambient: createAudio(SOUND_FILES.ambient, { volume: 0.24, loop: true }),
      reveal: createAudio(SOUND_FILES.reveal, { volume: 0.46 }),
      modalOpen: createAudio(SOUND_FILES.modalOpen, { volume: 0.42 }),
      close: createAudio(SOUND_FILES.close, { volume: 0.4 }),
      cueClick: createAudio(SOUND_FILES.cueClick, { volume: 0.52 }),
      cueCut: createAudio(SOUND_FILES.cueCut, { volume: 0.5 }),
      cueBreath: createAudio(SOUND_FILES.cueBreath, { volume: 0.42 }),
      cueHiss: createAudio(SOUND_FILES.cueHiss, { volume: 0.34 }),
      bombFall: createAudio(SOUND_FILES.bombFall, { volume: 0.38 }),
      wordBurst: createAudio(SOUND_FILES.wordBurst, { volume: 0.5 })
    };

    return () => {
      window.clearTimeout(timerRef.current);
      clearCueTimeouts();
      Object.values(audioRef.current || {}).forEach(resetAudio);
    };
  }, []);

  useEffect(() => {
    window.clearTimeout(timerRef.current);

    if (screen === 'loading') {
      playSound('ambient', { restart: false });
      timerRef.current = window.setTimeout(() => setScreen('excerpt'), LOADING_DELAY);
    } else {
      stopSound('ambient', { reset: true });
    }

    if (screen === 'excerpt') {
      playSound('reveal');
      timerRef.current = window.setTimeout(() => setScreen('score'), EXCERPT_DELAY);
    }

    if (screen === 'score' && selectedState) {
      playSound('reveal');
      clearCueTimeouts();

      const timeline = getScoreCueTimeline(selectedState.score);
      cueTimeoutsRef.current = timeline.map(({ sound, at }) =>
        window.setTimeout(() => playSound(sound), at)
      );
    } else {
      clearCueTimeouts();
    }
  }, [screen, selectedState]);

  useEffect(() => {
    const wasOpen = previousShowPoemRef.current;

    if (showPoem && !wasOpen) {
      playSound('modalOpen');
    }

    if (!showPoem && wasOpen) {
      playSound('close');
    }

    previousShowPoemRef.current = showPoem;
  }, [showPoem]);

  const refillStateBag = () => {
    const bag = [...STATES];
    for (let index = bag.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [bag[index], bag[swapIndex]] = [bag[swapIndex], bag[index]];
    }
    stateBagRef.current = bag;
  };

  const beginExperience = () => {
    if (!stateBagRef.current.length) {
      refillStateBag();
    }

    const chosen = stateBagRef.current.pop();
    clearCueTimeouts();
    playSound('begin');
    playSound('ambient');
    setSelectedState(chosen);
    setShowPoem(false);
    setScreen('loading');
  };

  const resetExperience = () => {
    window.clearTimeout(timerRef.current);
    clearCueTimeouts();
    stopSound('ambient', { reset: true });
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
      <${FireworksCanvas}
        phase=${screen}
        word=${selectedState?.title || ''}
        onSoundEvent=${(soundName) => playSound(soundName)}
      />
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

function FireworksCanvas({ phase, word, onSoundEvent }) {
  const canvasRef = useRef(null);
  const wordRef = useRef(word);
  const phaseRef = useRef(phase);
  const soundEventRef = useRef(onSoundEvent);

  useEffect(() => {
    wordRef.current = word;
  }, [word]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    soundEventRef.current = onSoundEvent;
  }, [onSoundEvent]);

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
    let activeWordKey = '';

    const shells = [];
    const sparks = [];
    let wordParticles = [];
    let sequence = null;

    const offscreen = document.createElement('canvas');
    const offCtx = offscreen.getContext('2d', { willReadFrequently: true });

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
        color: AMBIENT_PALETTE[Math.floor(Math.random() * AMBIENT_PALETTE.length)]
      });
    };

    const explodeAmbientShell = (shell) => {
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

    const createWordTargets = (text) => {
      if (!text) return [];
      const fontSize = Math.max(74, Math.min(width * 0.16, 188));
      offscreen.width = Math.floor(width);
      offscreen.height = Math.floor(height);
      offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
      offCtx.fillStyle = '#ffffff';
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.font = `700 ${fontSize}px Inter, system-ui, sans-serif`;
      offCtx.fillText(text.toUpperCase(), offscreen.width / 2, offscreen.height * 0.36);

      const imageData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height).data;
      const gap = Math.max(4, Math.round(fontSize / 28));
      const points = [];

      for (let y = 0; y < offscreen.height; y += gap) {
        for (let x = 0; x < offscreen.width; x += gap) {
          const alpha = imageData[(y * offscreen.width + x) * 4 + 3];
          if (alpha > 130) {
            points.push({ x, y });
          }
        }
      }

      if (points.length > 360) {
        const step = Math.ceil(points.length / 320);
        return points.filter((_, index) => index % step === 0);
      }

      return points;
    };

    const startWordSequence = (text) => {
      if (!text || width === 0 || height === 0) return;
      const targets = createWordTargets(text);
      if (!targets.length) return;

      const burstX = width * (0.3 + Math.random() * 0.4);
      const burstY = height * (0.22 + Math.random() * 0.1);
      sequence = {
        stage: 'falling',
        elapsed: 0,
        burstX,
        burstY,
        hold: 0,
        targets,
        bomb: {
          x: width * (0.18 + Math.random() * 0.64),
          y: -44,
          vx: (burstX - width * 0.5) * 0.0018,
          vy: 2.7,
          rotation: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.09
        }
      };
      wordParticles = [];
      activeWordKey = text;
      soundEventRef.current?.('bombFall');
    };

    const buildWordParticles = (targets, startX, startY) => {
      wordParticles = targets.map((target, index) => {
        const angle = (Math.PI * 2 * index) / Math.max(1, targets.length) + Math.random() * 0.5;
        const speed = 1.6 + Math.random() * 3.8;
        return {
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.4,
          tx: target.x,
          ty: target.y,
          color: AMBIENT_PALETTE[index % AMBIENT_PALETTE.length],
          size: 1.6 + Math.random() * 1.3,
          alpha: 1
        };
      });
    };

    const updateSpecialSequence = (delta) => {
      if (!sequence) return;

      sequence.elapsed += delta;

      if (sequence.stage === 'falling') {
        const bomb = sequence.bomb;
        bomb.x += bomb.vx * (delta / 16.67);
        bomb.y += bomb.vy * (delta / 16.67);
        bomb.vy += 0.055 * (delta / 16.67);
        bomb.rotation += bomb.vr * (delta / 16.67);

        if (bomb.y >= sequence.burstY || sequence.elapsed > 1000) {
          sequence.stage = 'burst';
          sequence.elapsed = 0;
          buildWordParticles(sequence.targets, bomb.x, bomb.y);
          sequence.burstX = bomb.x;
          sequence.burstY = bomb.y;
          soundEventRef.current?.('wordBurst');
        }
      } else if (sequence.stage === 'burst') {
        for (const particle of wordParticles) {
          particle.x += particle.vx * (delta / 16.67);
          particle.y += particle.vy * (delta / 16.67);
          particle.vx *= 0.986;
          particle.vy += 0.026 * (delta / 16.67);
        }

        if (sequence.elapsed > 430) {
          sequence.stage = 'forming';
          sequence.elapsed = 0;
        }
      } else if (sequence.stage === 'forming') {
        let settled = 0;
        for (const particle of wordParticles) {
          const dx = particle.tx - particle.x;
          const dy = particle.ty - particle.y;
          particle.vx += dx * 0.0046 * (delta / 16.67);
          particle.vy += dy * 0.0046 * (delta / 16.67);
          particle.vx *= 0.89;
          particle.vy *= 0.89;
          particle.x += particle.vx * (delta / 16.67);
          particle.y += particle.vy * (delta / 16.67);
          if (Math.abs(dx) < 3.5 && Math.abs(dy) < 3.5) settled += 1;
        }

        if (settled > wordParticles.length * 0.72 || sequence.elapsed > 980) {
          sequence.stage = 'holding';
          sequence.elapsed = 0;
        }
      } else if (sequence.stage === 'holding') {
        sequence.hold += delta;
        for (const particle of wordParticles) {
          particle.vx *= 0.84;
          particle.vy *= 0.84;
          particle.x += particle.vx * (delta / 16.67);
          particle.y += particle.vy * (delta / 16.67);
        }

        if (sequence.hold > 720) {
          sequence.stage = 'dissolve';
          sequence.elapsed = 0;
        }
      } else if (sequence.stage === 'dissolve') {
        let visible = 0;
        for (const particle of wordParticles) {
          particle.vx += (Math.random() - 0.5) * 0.16;
          particle.vy += (Math.random() - 0.5) * 0.1;
          particle.x += particle.vx * (delta / 16.67);
          particle.y += particle.vy * (delta / 16.67);
          particle.alpha -= 0.018 * (delta / 16.67);
          if (particle.alpha > 0) visible += 1;
        }

        if (visible === 0 || sequence.elapsed > 650) {
          sequence = null;
          wordParticles = [];
        }
      }
    };

    const drawSpecialSequence = () => {
      if (!sequence) return;

      if (sequence.stage === 'falling') {
        const bomb = sequence.bomb;
        context.save();
        context.globalAlpha = 1;
        context.strokeStyle = 'rgba(255,255,255,0.22)';
        context.lineWidth = 1.8;
        context.beginPath();
        context.moveTo(bomb.x, bomb.y - 42);
        context.lineTo(bomb.x, bomb.y + 18);
        context.stroke();

        drawGlow(bomb.x, bomb.y + 8, 40, '#ff4961', 0.28);

        context.translate(bomb.x, bomb.y);
        context.rotate(bomb.rotation);
        context.fillStyle = '#f5f0ea';
        context.beginPath();
        context.ellipse(0, 0, 11.5, 18, 0, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = '#ff4961';
        context.beginPath();
        context.arc(0, 16, 3.1, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }

      if (sequence.stage === 'burst') {
        drawGlow(sequence.burstX, sequence.burstY, 120, '#ff4961', 0.22);
        drawGlow(sequence.burstX, sequence.burstY, 66, '#a8ff2f', 0.15);
      }

      if (wordParticles.length) {
        for (const particle of wordParticles) {
          context.save();
          context.globalAlpha = Math.max(0, particle.alpha ?? 1);
          context.fillStyle = particle.color;
          context.beginPath();
          context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          context.fill();
          context.restore();
          drawGlow(particle.x, particle.y, 16, particle.color, Math.max(0, (particle.alpha ?? 1) * 0.26));
        }
      }
    };

    const animate = (time) => {
      animationFrame = window.requestAnimationFrame(animate);
      const delta = lastTime ? time - lastTime : 16.67;
      lastTime = time;

      context.clearRect(0, 0, width, height);
      context.fillStyle = 'rgba(3, 3, 5, 0.14)';
      context.fillRect(0, 0, width, height);

      const specialActive = phaseRef.current === 'loading' && wordRef.current;
      if (specialActive && activeWordKey !== wordRef.current && !sequence) {
        startWordSequence(wordRef.current);
      }
      if (!specialActive && !sequence) {
        activeWordKey = '';
      }

      const ambientInterval = specialActive ? 1800 : 1050;
      if (time > nextLaunch) {
        launchShell();
        nextLaunch = time + ambientInterval + Math.random() * (specialActive ? 850 : 750);
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
          explodeAmbientShell(shell);
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

      updateSpecialSequence(delta);
      drawSpecialSequence();
    };

    resize();
    animationFrame = window.requestAnimationFrame(animate);
    window.addEventListener('resize', resize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return html`<canvas className=${`fireworks-canvas phase-${phase}`} ref=${canvasRef} aria-hidden="true"></canvas>`;
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
