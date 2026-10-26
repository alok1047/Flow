import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight,
  Play, 
  Pause, 
  RotateCcw, 
  Brain, 
  RefreshCw, 
  Microscope, 
  Building2, 
  Coffee, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  Check,
  Lightbulb,
  Award,
  Map
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { playgrounds } from '../data/playgrounds';
import { jsRoadmap } from '../data/jsRoadmap';
import LucideIcon from '../components/ui/LucideIcon';
import './PlaygroundArena.css';

/* ──────────────────────────────────────────────
   Loop Visualizer Data
   ────────────────────────────────────────────── */
const loopTemplates = {
  for: {
    label: 'for loop',
    code: [
      'for (let i = 0; i < 5; i++) {',
      '  console.log(i);',
      '}',
    ],
    run: () => {
      const steps = [];
      for (let i = 0; i <= 5; i++) {
        if (i < 5) {
          steps.push({ line: 0, vars: { i }, iteration: i + 1, output: null, label: `Check: i(${i}) < 5 → true` });
          steps.push({ line: 1, vars: { i }, iteration: i + 1, output: String(i), label: `Log: ${i}` });
          steps.push({ line: 0, vars: { i: i + 1 }, iteration: i + 1, output: null, label: `Increment: i = ${i + 1}` });
        } else {
          steps.push({ line: 0, vars: { i }, iteration: i, output: null, label: `Check: i(${i}) < 5 → false → EXIT` });
        }
      }
      return steps;
    },
  },
  while: {
    label: 'while loop',
    code: [
      'let n = 1;',
      'while (n <= 4) {',
      '  console.log(n);',
      '  n++;',
      '}',
    ],
    run: () => {
      const steps = [];
      steps.push({ line: 0, vars: { n: 1 }, iteration: 0, output: null, label: 'Init: n = 1' });
      for (let n = 1; n <= 5; n++) {
        if (n <= 4) {
          steps.push({ line: 1, vars: { n }, iteration: n, output: null, label: `Check: n(${n}) <= 4 → true` });
          steps.push({ line: 2, vars: { n }, iteration: n, output: String(n), label: `Log: ${n}` });
          steps.push({ line: 3, vars: { n: n + 1 }, iteration: n, output: null, label: `n++ → n = ${n + 1}` });
        } else {
          steps.push({ line: 1, vars: { n }, iteration: n - 1, output: null, label: `Check: n(${n}) <= 4 → false → EXIT` });
        }
      }
      return steps;
    },
  },
  'do-while': {
    label: 'do...while loop',
    code: [
      'let x = 0;',
      'do {',
      '  console.log(x);',
      '  x++;',
      '} while (x < 3);',
    ],
    run: () => {
      const steps = [];
      steps.push({ line: 0, vars: { x: 0 }, iteration: 0, output: null, label: 'Init: x = 0' });
      for (let x = 0; x <= 3; x++) {
        if (x < 3) {
          steps.push({ line: 1, vars: { x }, iteration: x + 1, output: null, label: 'Enter do block' });
          steps.push({ line: 2, vars: { x }, iteration: x + 1, output: String(x), label: `Log: ${x}` });
          steps.push({ line: 3, vars: { x: x + 1 }, iteration: x + 1, output: null, label: `x++ → x = ${x + 1}` });
          const cond = x + 1 < 3;
          steps.push({ line: 4, vars: { x: x + 1 }, iteration: x + 1, output: null, label: `Check: x(${x + 1}) < 3 → ${cond}` });
        }
      }
      return steps;
    },
  },
};

/* ──────────────────────────────────────────────
   Primitive vs Reference Data
   ────────────────────────────────────────────── */
const primitiveRefScenarios = [
  {
    title: 'Primitive Copy',
    code: 'let a = 5;\nlet b = a;',
    memory: [
      { label: 'a', value: '5', color: '#22c55e', addr: '0x01' },
      { label: 'b', value: '5', color: '#3b82f6', addr: '0x02' },
    ],
    shared: false,
    explanation: 'Primitives are copied by value. Both a and b have their own independent copy of 5 in memory.',
  },
  {
    title: 'Modify Primitive Copy',
    code: 'let a = 5;\nlet b = a;\nb = 10;',
    memory: [
      { label: 'a', value: '5', color: '#22c55e', addr: '0x01' },
      { label: 'b', value: '10', color: '#3b82f6', addr: '0x02', mutated: true },
    ],
    shared: false,
    explanation: 'Changing b does NOT affect a. They are independent values stored in separate memory slots.',
  },
  {
    title: 'Reference Copy (Array)',
    code: 'let a = [1, 2, 3];\nlet b = a;',
    memory: [
      { label: 'a', value: '→ 0xA0', color: '#f59e0b', addr: '0x01', ref: '0xA0' },
      { label: 'b', value: '→ 0xA0', color: '#f59e0b', addr: '0x02', ref: '0xA0' },
    ],
    shared: true,
    sharedValue: '[1, 2, 3]',
    sharedAddr: '0xA0',
    explanation: 'Arrays are reference types. Both a and b point to the SAME array object in heap memory (address 0xA0).',
  },
  {
    title: 'Mutate via Reference',
    code: 'let a = [1, 2, 3];\nlet b = a;\nb.push(4);',
    memory: [
      { label: 'a', value: '→ 0xA0', color: '#ef4444', addr: '0x01', ref: '0xA0' },
      { label: 'b', value: '→ 0xA0', color: '#ef4444', addr: '0x02', ref: '0xA0' },
    ],
    shared: true,
    sharedValue: '[1, 2, 3, 4]',
    sharedAddr: '0xA0',
    mutated: true,
    explanation: 'Pushing to b modifies the shared heap array. Since a points to the same array, a is now [1, 2, 3, 4] too!',
  },
  {
    title: 'String is Primitive',
    code: 'let a = "hello";\nlet b = a;\nb = "world";',
    memory: [
      { label: 'a', value: '"hello"', color: '#22c55e', addr: '0x01' },
      { label: 'b', value: '"world"', color: '#3b82f6', addr: '0x02', mutated: true },
    ],
    shared: false,
    explanation: 'Strings are primitives. Reassigning b creates a brand new string value. a remains "hello".',
  },
  {
    title: 'Object Reference',
    code: 'let a = { x: 1 };\nlet b = a;\nb.x = 99;',
    memory: [
      { label: 'a', value: '→ 0xB0', color: '#a855f7', addr: '0x01', ref: '0xB0' },
      { label: 'b', value: '→ 0xB0', color: '#a855f7', addr: '0x02', ref: '0xB0' },
    ],
    shared: true,
    sharedValue: '{ x: 99 }',
    sharedAddr: '0xB0',
    mutated: true,
    explanation: 'Objects are reference types. Modifying b.x updates the object in heap. a.x changes because they share it.',
  },
  {
    title: 'Reassign Breaks Link',
    code: 'let a = [1, 2];\nlet b = a;\nb = [3, 4];',
    memory: [
      { label: 'a', value: '→ 0xA0', color: '#22c55e', addr: '0x01', ref: '0xA0' },
      { label: 'b', value: '→ 0xB0', color: '#3b82f6', addr: '0x02', ref: '0xB0' },
    ],
    shared: false,
    heaps: [
      { addr: '0xA0', value: '[1, 2]', color: '#22c55e' },
      { addr: '0xB0', value: '[3, 4]', color: '#3b82f6' }
    ],
    explanation: 'Reassigning b to [3, 4] creates a new array object at address 0xB0. a still points to 0xA0.',
  },
  {
    title: 'Spread Operator Clone',
    code: 'let a = [1, 2, 3];\nlet b = [...a];\nb.push(4);',
    memory: [
      { label: 'a', value: '→ 0xA0', color: '#22c55e', addr: '0x01', ref: '0xA0' },
      { label: 'b', value: '→ 0xB0', color: '#3b82f6', addr: '0x02', ref: '0xB0' },
    ],
    shared: false,
    heaps: [
      { addr: '0xA0', value: '[1, 2, 3]', color: '#22c55e' },
      { addr: '0xB0', value: '[1, 2, 3, 4]', color: '#3b82f6' }
    ],
    explanation: 'Spread clones the array values into a new array. Pushing to b does NOT affect the original array a.',
  },
];

/* ──────────────────────────────────────────────
   Number Precision Lab Data
   ────────────────────────────────────────────── */
const precisionExamples = [
  { a: 0.1, b: 0.2, op: '+' },
  { a: 0.3, b: 0.1, op: '-' },
  { a: 0.2, b: 0.4, op: '+' },
  { a: 1.0, b: 0.7, op: '-' },
];

/* ──────────────────────────────────────────────
   Object Reference Sim Data
   ────────────────────────────────────────────── */
const objectRefScenarios = [
  {
    title: 'Create Object',
    code: 'let a = { x: 1, y: 2 };',
    objects: [
      { id: 'obj1', content: '{ x: 1, y: 2 }', color: '#8b5cf6' },
    ],
    vars: [
      { name: 'a', pointsTo: 'obj1', color: '#8b5cf6' },
    ],
    explanation: 'Variable a holds a reference (pointer) to the object allocated in heap memory.',
  },
  {
    title: 'Assign Reference',
    code: 'let a = { x: 1, y: 2 };\nlet b = a;',
    objects: [
      { id: 'obj1', content: '{ x: 1, y: 2 }', color: '#8b5cf6' },
    ],
    vars: [
      { name: 'a', pointsTo: 'obj1', color: '#8b5cf6' },
      { name: 'b', pointsTo: 'obj1', color: '#f59e0b' },
    ],
    explanation: 'Both a and b point to the exact same object. No duplicate object is created in the heap.',
  },
  {
    title: 'Mutate via b',
    code: 'let a = { x: 1, y: 2 };\nlet b = a;\nb.x = 99;',
    objects: [
      { id: 'obj1', content: '{ x: 99, y: 2 }', color: '#ef4444', pulse: true },
    ],
    vars: [
      { name: 'a', pointsTo: 'obj1', color: '#8b5cf6' },
      { name: 'b', pointsTo: 'obj1', color: '#f59e0b' },
    ],
    explanation: 'Setting b.x modifies the shared heap object. Checking a.x now returns 99.',
  },
  {
    title: 'Reassign a',
    code: 'let a = { x: 1 };\nlet b = a;\na = { x: 3 };',
    objects: [
      { id: 'obj1', content: '{ x: 1 }', color: '#f59e0b' },
      { id: 'obj2', content: '{ x: 3 }', color: '#22c55e' },
    ],
    vars: [
      { name: 'a', pointsTo: 'obj2', color: '#22c55e' },
      { name: 'b', pointsTo: 'obj1', color: '#f59e0b' },
    ],
    explanation: 'Reassigning a points it to a new object. b remains pointing to the original object.',
  },
  {
    title: 'Comparison Trap',
    code: 'let a = { x: 1 };\nlet b = { x: 1 };\nconsole.log(a === b);',
    objects: [
      { id: 'obj1', content: '{ x: 1 }', color: '#8b5cf6' },
      { id: 'obj2', content: '{ x: 1 }', color: '#22c55e' },
    ],
    vars: [
      { name: 'a', pointsTo: 'obj1', color: '#8b5cf6' },
      { name: 'b', pointsTo: 'obj2', color: '#22c55e' },
    ],
    result: 'false',
    explanation: 'Even though content is identical, a === b is false because they reside at different memory addresses.',
  },
];

/* ──────────────────────────────────────────────
   Sub-components
   ────────────────────────────────────────────── */

function LoopVisualizer({ onBack }) {
  const [loopType, setLoopType] = useState('for');
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [output, setOutput] = useState([]);
  const stepIndexRef = useRef(-1);

  const template = loopTemplates[loopType];

  // Keep ref synchronized with state to avoid closures
  useEffect(() => {
    stepIndexRef.current = stepIndex;
  }, [stepIndex]);

  const reset = useCallback(() => {
    setPlaying(false);
    const s = template.run();
    setSteps(s);
    setStepIndex(-1);
    stepIndexRef.current = -1;
    setOutput([]);
  }, [template]);

  useEffect(() => {
    reset();
  }, [loopType, reset]);

  const advance = useCallback(() => {
    const nextIdx = stepIndexRef.current + 1;
    if (nextIdx >= steps.length) {
      setPlaying(false);
      return;
    }
    setStepIndex(nextIdx);
    const step = steps[nextIdx];
    if (step && step.output !== null) {
      setOutput((o) => [...o, step.output]);
    }
  }, [steps]);

  // Autoplay interval effect
  useEffect(() => {
    if (!playing) return;
    
    // Perform the first advance step immediately
    advance();
    
    const interval = setInterval(() => {
      advance();
    }, speed);
    
    return () => clearInterval(interval);
  }, [playing, speed, advance]);

  const play = () => {
    if (stepIndex >= steps.length - 1) {
      // If we are at the end, reset and start immediately
      setPlaying(false);
      const s = template.run();
      setSteps(s);
      setStepIndex(-1);
      stepIndexRef.current = -1;
      setOutput([]);
      
      setTimeout(() => {
        setPlaying(true);
      }, 50);
      return;
    }
    setPlaying(true);
  };

  const pause = () => {
    setPlaying(false);
  };

  const stepForward = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    advance();
  };

  const currentStep = stepIndex >= 0 && stepIndex < steps.length ? steps[stepIndex] : null;

  return (
    <div className="sim-panel">
      <button className="sim-back-btn" onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><ArrowLeft size={16} /> Back</button>
      <h2 className="sim-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><RefreshCw size={24} className="sim-title-icon" /> Loop Visualizer</h2>

      <div className="lv-controls">
        <select className="lv-select" value={loopType} onChange={(e) => setLoopType(e.target.value)}>
          {Object.entries(loopTemplates).map(([key, t]) => (
            <option key={key} value={key}>{t.label}</option>
          ))}
        </select>
        <div className="lv-speed-control">
          <span>Speed:</span>
          <input
            type="range"
            className="lv-speed-slider"
            min={300}
            max={2000}
            step={100}
            value={2300 - speed}
            onChange={(e) => setSpeed(2300 - Number(e.target.value))}
          />
          <span>{speed}ms</span>
        </div>
      </div>

      <div className="lv-split-container">
        {/* Left Column: Code and sliding pointer indicator */}
        <div className="lv-code-panel-wrapper">
          <div className="lv-code-panel">
            <AnimatePresence>
              {currentStep && (
                <motion.div
                  className="lv-code-pointer"
                  layoutId="code-pointer"
                  style={{ top: `${currentStep.line * 29 + 12}px` }}
                  transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                >
                  <Play size={10} style={{ display: 'inline', fill: 'currentColor', stroke: 'none', marginRight: '4px' }} />
                </motion.div>
              )}
            </AnimatePresence>
            {template.code.map((line, i) => (
              <div key={i} className={`lv-code-line ${currentStep?.line === i ? 'active' : ''}`}>
                <span className="line-num">{i + 1}</span>
                {line}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: State information */}
        <div className="lv-state-sidebar">
          <div className="lv-state-panel">
            {currentStep ? (
              <>
                {Object.entries(currentStep.vars).map(([name, val]) => (
                  <motion.div key={name} className="lv-state-box" layout>
                    <div className="lv-state-label">Variable ({name})</div>
                    <motion.div
                      className="lv-state-value"
                      key={val}
                      initial={{ scale: 1.4, color: '#f59e0b' }}
                      animate={{ scale: 1, color: 'var(--accent-cyan)' }}
                      transition={{ duration: 0.3 }}
                    >
                      {val}
                    </motion.div>
                  </motion.div>
                ))}
                <div className="lv-state-box">
                  <div className="lv-state-label">Iteration</div>
                  <div className="lv-state-value">{currentStep.iteration}</div>
                </div>
              </>
            ) : (
              <div className="lv-state-box" style={{ width: '100%' }}>
                <div className="lv-state-label">Status</div>
                <div className="lv-state-value" style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
                  Ready to run...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Visual Arena - stamping elements as they output */}
      <div className="lv-visual-arena">
        <div className="lv-arena-title">Loop Stamping Visualizer</div>
        <div className="lv-arena-slots">
          {[0, 1, 2, 3, 4].map((slotIndex) => {
            const isLogged = output.includes(String(slotIndex));
            return (
              <div key={slotIndex} className="lv-arena-slot">
                <div className="lv-slot-number">{slotIndex}</div>
                <AnimatePresence>
                  {isLogged && (
                    <motion.div
                      className="lv-stamp-block"
                      initial={{ y: -50, scale: 0.2, opacity: 0 }}
                      animate={{ y: 0, scale: 1, opacity: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    >
                      <span>💾</span>
                      <div className="lv-stamp-label">i = {slotIndex}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {currentStep?.label && (
        <motion.div
          className="lv-action-panel"
          key={stepIndex + '-label'}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="lv-output-label">Active Action</div>
          <div className="lv-output-content" style={{ color: 'var(--accent-gold)' }}>
            {currentStep.label}
          </div>
        </motion.div>
      )}

      <div className="lv-output-panel">
        <div className="lv-output-label">Console Terminal</div>
        <div className="lv-output-content console">
          {output.length > 0 ? output.map((line, idx) => (
            <div key={idx} className="console-line">&gt; {line}</div>
          )) : <span className="console-empty">Console is empty</span>}
        </div>
      </div>

      <div className="lv-play-controls">
        {!playing ? (
          <button className="lv-ctrl-btn primary" onClick={play}>
            {stepIndex >= steps.length - 1 ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><RotateCcw size={16} /> Restart</span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Play size={16} /> Play</span>
            )}
          </button>
        ) : (
          <button className="lv-ctrl-btn" onClick={pause} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Pause size={16} /> Pause
          </button>
        )}
        <button
          className="lv-ctrl-btn"
          onClick={stepForward}
          disabled={playing || stepIndex >= steps.length - 1}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <ChevronRight size={16} /> Step
        </button>
        <button
          className="lv-ctrl-btn"
          onClick={reset}
          disabled={playing}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <RotateCcw size={16} /> Reset
        </button>
      </div>
    </div>
  );
}

function PrimitiveVsReference({ onBack }) {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const addXP = useStore((s) => s.addXP);

  const scenario = primitiveRefScenarios[step];

  const next = () => {
    if (step + 1 >= primitiveRefScenarios.length) {
      addXP(50);
      setCompleted(true);
    } else {
      setStep((s) => s + 1);
    }
  };

  const prev = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const restart = () => {
    setStep(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <motion.div className="sim-end-screen" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className="sim-end-emoji"><Brain size={48} /></div>
        <h2 className="sim-end-title">Memory Master!</h2>
        <p className="sim-end-score">You explored all {primitiveRefScenarios.length} scenarios</p>
        <p className="sim-end-xp glow-text-gold">+50 XP</p>
        <div className="sim-end-buttons">
          <button className="sim-retry-btn" onClick={restart}>Explore Again</button>
          <button className="sim-home-btn" onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><ArrowLeft size={16} /> All Playgrounds</button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="sim-panel">
      <button className="sim-back-btn" onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><ArrowLeft size={16} /> Back</button>
      <h2 className="sim-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Brain size={24} className="sim-title-icon" /> Primitive vs Reference</h2>

      <div className="sim-score-bar">
        <div className="sim-score-item">
          <div className="sim-score-label">Scenario Progress</div>
          <div className="sim-score-value total">{step + 1} / {primitiveRefScenarios.length}</div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="pvr-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="pvr-scenario-title">{scenario.title}</h3>
          
          <div className="pvr-code-container">
            <div className="pvr-code-dots">
              <span style={{ background: '#ff5f56' }} />
              <span style={{ background: '#ffbd2e' }} />
              <span style={{ background: '#27c93f' }} />
            </div>
            <pre className="pvr-code"><code>{scenario.code}</code></pre>
          </div>

          <div className="pvr-memory-diagram">
            <div className="pvr-memory-layout">
              {/* Stack Variables */}
              <div className="pvr-stack-section">
                <div className="pvr-section-label">Stack (Variables)</div>
                {scenario.memory.map((m, i) => (
                  <motion.div
                    key={m.label}
                    className="pvr-mem-box"
                    style={{ borderColor: m.color }}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <span className="pvr-mem-label">{m.label}</span>
                    <span className="pvr-mem-addr">{m.addr}</span>
                    <span className="pvr-mem-value" style={{ color: m.color }}>
                      {m.value}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Memory Reference indicator / Arrow */}
              {scenario.shared && (
                <div className="pvr-connection-line">
                  <span className="connection-arrow">⤳</span>
                </div>
              )}

              {/* Heap section */}
              {scenario.shared && (
                <motion.div
                  className="pvr-heap-section"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="pvr-section-label">Heap (Shared Memory)</div>
                  <motion.div
                    className="pvr-heap-box"
                    style={{ borderColor: '#ef4444' }}
                    animate={scenario.mutated ? { scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    <span className="pvr-mem-addr">{scenario.sharedAddr}</span>
                    <span className="pvr-heap-value">{scenario.sharedValue}</span>
                  </motion.div>
                  <div className="pvr-arrow-label">🔗 Both variables point to heap slot {scenario.sharedAddr}</div>
                </motion.div>
              )}

              {/* Individual heap items (Spread clone scenario) */}
              {!scenario.shared && scenario.heaps && (
                <motion.div
                  className="pvr-heap-section"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="pvr-section-label">Heap Memory</div>
                  {scenario.heaps.map((hp) => (
                    <div key={hp.addr} className="pvr-heap-box" style={{ borderColor: hp.color }}>
                      <span className="pvr-mem-addr">{hp.addr}</span>
                      <span className="pvr-heap-value" style={{ color: hp.color }}>{hp.value}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          <div className="pvr-type-badge" style={{
            background: scenario.shared ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)',
            color: scenario.shared ? '#ef4444' : '#22c55e',
            border: `1px solid ${scenario.shared ? '#ef4444' : '#22c55e'}40`
          }}>
            {scenario.shared ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <LucideIcon name="Link" size={14} /> Reference Type (Pointer Copied)
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <LucideIcon name="Package" size={14} /> Primitive Type (Deep Copy)
              </span>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.div className="sim-feedback correct" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={step + '-exp'}>
        <p className="sim-feedback-text">{scenario.explanation}</p>
      </motion.div>

      <div className="pvr-nav-buttons">
        <button className="lv-ctrl-btn" onClick={prev} disabled={step === 0} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><ChevronLeft size={16} /> Previous</button>
        <button className="lv-ctrl-btn primary" onClick={next}>
          {step + 1 >= primitiveRefScenarios.length ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Check size={16} /> Complete</span> : <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>Next Scenario <ChevronRight size={16} /></span>}
        </button>
      </div>
    </div>
  );
}

// IEEE-754 conversion utilities
const floatToIEEE754 = (val) => {
  const buffer = new ArrayBuffer(8);
  const floatView = new Float64Array(buffer);
  const uint32View = new Uint32Array(buffer);
  floatView[0] = val;
  
  const low = uint32View[0].toString(2).padStart(32, '0');
  const high = uint32View[1].toString(2).padStart(32, '0');
  const binString = high + low;
  
  const sign = binString[0];
  const exponent = binString.slice(1, 12);
  const mantissa = binString.slice(12);
  
  return { sign, exponent, mantissa, full: binString };
};

const ieee754ToFloat = (binString) => {
  const buffer = new ArrayBuffer(8);
  const uint32View = new Uint32Array(buffer);
  const floatView = new Float64Array(buffer);
  
  const highBin = binString.slice(0, 32);
  const lowBin = binString.slice(32);
  
  uint32View[1] = parseInt(highBin, 2);
  uint32View[0] = parseInt(lowBin, 2);
  
  return floatView[0];
};

const interpretBits = (bits) => {
  const sign = bits[0] === '1' ? -1 : 1;
  const exponentRaw = parseInt(bits.slice(1, 12), 2);
  const mantissaBits = bits.slice(12);
  
  let exponentVal = 0;
  let mantissaVal = 0;
  let type = 'Normal';
  
  if (exponentRaw === 0) {
    type = 'Subnormal (Denormal)';
    exponentVal = -1022;
    for (let i = 0; i < 52; i++) {
      if (mantissaBits[i] === '1') {
        mantissaVal += Math.pow(2, -(i + 1));
      }
    }
  } else if (exponentRaw === 2047) {
    exponentVal = NaN;
    if (parseInt(mantissaBits, 2) === 0) {
      type = sign === 1 ? 'Positive Infinity' : 'Negative Infinity';
    } else {
      type = 'NaN (Not a Number)';
    }
  } else {
    type = 'Normal';
    exponentVal = exponentRaw - 1023;
    mantissaVal = 1;
    for (let i = 0; i < 52; i++) {
      if (mantissaBits[i] === '1') {
        mantissaVal += Math.pow(2, -(i + 1));
      }
    }
  }
  
  return { sign, exponentRaw, exponentVal, mantissaVal, type };
};

function NumberPrecisionLab({ onBack }) {
  const [inputA, setInputA] = useState('0.1');
  const [inputB, setInputB] = useState('0.2');
  const [op, setOp] = useState('+');
  const [result, setResult] = useState(null);
  const [triedCount, setTriedCount] = useState(0);
  const [xpAwarded, setXpAwarded] = useState(false);
  const addXP = useStore((s) => s.addXP);

  // Bit flipper state (initially 0.1)
  const [flipperBits, setFlipperBits] = useState(
    '0011111110111001100110011001100110011001100110011001100110011010'
  );

  const calculate = () => {
    const a = parseFloat(inputA);
    const b = parseFloat(inputB);
    if (isNaN(a) || isNaN(b)) return;
    let res;
    switch (op) {
      case '+': res = a + b; break;
      case '-': res = a - b; break;
      default: res = a + b;
    }
    const expected = op === '+' ? (a * 10 + b * 10) / 10 : (a * 10 - b * 10) / 10;
    const naive = op === '+' ? `${a} + ${b}` : `${a} - ${b}`;
    
    const ieeeA = floatToIEEE754(a);
    const ieeeB = floatToIEEE754(b);
    const ieeeRes = floatToIEEE754(res);

    setResult({
      actual: res,
      expected,
      display: res.toString(),
      display20: res.toFixed(20),
      diff: (res - expected).toFixed(20),
      naive,
      isPrecise: res === expected,
      ieeeA,
      ieeeB,
      ieeeRes,
    });

    // Automatically load result into bit flipper
    setFlipperBits(ieeeRes.full);

    setTriedCount((c) => c + 1);
    if (!xpAwarded && triedCount + 1 >= 3) {
      addXP(40);
      setXpAwarded(true);
    }
  };

  const loadExample = (ex) => {
    setInputA(String(ex.a));
    setInputB(String(ex.b));
    setOp(ex.op);
    setResult(null);
    const resVal = ex.op === '+' ? ex.a + ex.b : ex.a - ex.b;
    setFlipperBits(floatToIEEE754(resVal).full);
  };

  const toggleFlipperBit = (idx) => {
    const updated = flipperBits.split('');
    updated[idx] = updated[idx] === '0' ? '1' : '0';
    setFlipperBits(updated.join(''));
  };

  const flipperFloat = ieee754ToFloat(flipperBits);
  const flipperInterpretation = interpretBits(flipperBits);

  return (
    <div className="sim-panel">
      <button className="sim-back-btn" onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><ArrowLeft size={16} /> Back</button>
      <h2 className="sim-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Microscope size={24} className="sim-title-icon" /> Number Precision Lab</h2>

      <div className="npl-examples">
        <div className="npl-examples-label">Interactive Examples:</div>
        <div className="npl-example-chips">
          {precisionExamples.map((ex, i) => (
            <button
              key={i}
              className="npl-chip"
              onClick={() => loadExample(ex)}
            >
              {ex.a} {ex.op} {ex.b}
            </button>
          ))}
        </div>
      </div>

      <div className="npl-calculator">
        <div className="npl-input-row">
          <input
            type="text"
            className="npl-input"
            value={inputA}
            onChange={(e) => { setInputA(e.target.value); setResult(null); }}
            placeholder="0.1"
          />
          <select className="npl-op-select" value={op} onChange={(e) => { setOp(e.target.value); setResult(null); }}>
            <option value="+">+</option>
            <option value="-">−</option>
          </select>
          <input
            type="text"
            className="npl-input"
            value={inputB}
            onChange={(e) => { setInputB(e.target.value); setResult(null); }}
            placeholder="0.2"
          />
          <button className="npl-calc-btn" onClick={calculate}>Calculate</button>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            className="npl-result-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="npl-row-card">
              <div className="npl-result-row">
                <span className="npl-result-label">Expected Result:</span>
                <span className="npl-result-expected">{result.expected}</span>
              </div>
              <div className="npl-result-row">
                <span className="npl-result-label">JS Computation (Standard):</span>
                <span className="npl-result-actual" style={{ color: result.isPrecise ? '#22c55e' : '#ef4444' }}>{result.display}</span>
              </div>
              <div className="npl-result-row">
                <span className="npl-result-label">JS Exact Float Value:</span>
                <span className="npl-result-actual code-font" style={{ color: result.isPrecise ? '#22c55e' : '#ef4444', fontSize: '0.85rem' }}>{result.display20}</span>
              </div>
              <div className={`npl-precision-badge ${result.isPrecise ? 'precise' : 'imprecise'}`}>
                {result.isPrecise ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-success)' }}><CheckCircle2 size={16} /> Matches Exact Value</span> : <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-warning)' }}><AlertTriangle size={16} /> Floating Point Rounding Error!</span>}
              </div>
            </div>

            {/* Dynamic Scale Zoom Visualizer */}
            {!result.isPrecise && (
              <div className="npl-ruler-arena">
                <div className="npl-ruler-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Microscope size={18} /> Microscopic Error Zoom-In</div>
                <div className="npl-ruler-scale">
                  <div className="ruler-tick tick-left">
                    <span className="ruler-label">Exact {result.expected}</span>
                    <div className="ruler-bar" />
                  </div>
                  <div className="ruler-tick tick-right animated-glow">
                    <span className="ruler-label font-gold">JS {result.display20}</span>
                    <div className="ruler-bar red" />
                  </div>
                  <div className="ruler-gap-connector" />
                </div>
                <div className="ruler-hint">Binary rounding pushes the result by {result.diff}!</div>
              </div>
            )}

            {/* Dynamic Binary Memory Tape explorer */}
            <div className="npl-binary-tape-section">
              <h4 className="npl-tape-title">64-bit IEEE 754 Floating-Point Tape (Sign | Exponent | Mantissa)</h4>
              <div className="npl-tapes">
                <div className="npl-tape-row">
                  <span className="tape-label">Value A ({inputA})</span>
                  <div className="tape-bits">
                    <span className="bit-box sign" title="Sign bit">{result.ieeeA.sign}</span>
                    <span className="bit-box exp" title="Exponent bits (11-bit biased)">{result.ieeeA.exponent}</span>
                    <span className="bit-box mant" title="Mantissa / Fraction bits (52-bit)">{result.ieeeA.mantissa}</span>
                  </div>
                </div>
                <div className="npl-tape-row">
                  <span className="tape-label">Value B ({inputB})</span>
                  <div className="tape-bits">
                    <span className="bit-box sign" title="Sign bit">{result.ieeeB.sign}</span>
                    <span className="bit-box exp" title="Exponent bits (11-bit biased)">{result.ieeeB.exponent}</span>
                    <span className="bit-box mant" title="Mantissa / Fraction bits (52-bit)">{result.ieeeB.mantissa}</span>
                  </div>
                </div>
                <div className="npl-tape-row">
                  <span className="tape-label">Result ({result.display})</span>
                  <div className="tape-bits">
                    <span className="bit-box sign" title="Sign bit">{result.ieeeRes.sign}</span>
                    <span className="bit-box exp" title="Exponent bits (11-bit biased)">{result.ieeeRes.exponent}</span>
                    <span className="bit-box mant" title="Mantissa / Fraction bits (52-bit)">{result.ieeeRes.mantissa}</span>
                  </div>
                </div>
              </div>
              <div className="npl-explainer">
                <p><strong>The Core Issue:</strong> Decimals like 0.1 cannot be represented exactly in base-2 binary fractions, creating an infinite repeating fraction (0.00011001100...). JS cuts the fraction off at 52 bits, causing the tiny error!</p>
                <p style={{ marginTop: '0.4rem' }}><strong>Solution:</strong> Check equality using an epsilon: <code>Math.abs(a - b) &lt; Number.EPSILON</code> or round first.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* IEEE-754 Interactive Bit-Flipper Widget */}
      <div className="npl-flipper-section glass" style={{ marginTop: '20px', padding: '16px', borderRadius: '12px' }}>
        <h4 className="npl-flipper-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Brain size={18} style={{ color: 'var(--accent-gold)' }} />
          Interactive IEEE 754 Bit-Flipper
        </h4>
        <p className="sim-subtitle-inside" style={{ marginBottom: '12px' }}>
          Flip any of the 64 bits below to watch how double-precision floating points compile to decimal values in real-time.
        </p>

        <div className="flipper-presets" style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Presets:</span>
          <button className="npl-chip" onClick={() => setFlipperBits(floatToIEEE754(0.1).full)}>0.1</button>
          <button className="npl-chip" onClick={() => setFlipperBits(floatToIEEE754(0.2).full)}>0.2</button>
          <button className="npl-chip" onClick={() => setFlipperBits(floatToIEEE754(0.3).full)}>0.3</button>
          <button className="npl-chip" onClick={() => setFlipperBits(floatToIEEE754(1.0).full)}>1.0</button>
          <button className="npl-chip" onClick={() => setFlipperBits(floatToIEEE754(0).full)}>0.0</button>
          <button className="npl-chip" onClick={() => setFlipperBits('0111111111110000000000000000000000000000000000000000000000000000')}>Infinity</button>
          <button className="npl-chip" onClick={() => setFlipperBits('0111111111111000000000000000000000000000000000000000000000000000')}>NaN</button>
          {result && (
            <button className="npl-chip" style={{ borderColor: 'var(--accent-gold)' }} onClick={() => setFlipperBits(result.ieeeRes.full)}>
              Use Calc Result
            </button>
          )}
        </div>

        <div className="npl-flipper-grid">
          {/* Sign Row */}
          <div className="npl-flipper-row">
            <span className="flipper-row-label">Sign (Bit 0): {flipperBits[0] === '1' ? 'Negative (-)' : 'Positive (+)'}</span>
            <div className="flipper-bits-container">
              <button
                className={`flipper-bit-btn sign-${flipperBits[0]}`}
                onClick={() => toggleFlipperBit(0)}
                title="Sign Bit [0]"
              >
                {flipperBits[0]}
              </button>
            </div>
          </div>

          {/* Exponent Row */}
          <div className="npl-flipper-row">
            <span className="flipper-row-label">
              Exponent (Bits 1-11): Raw = {parseInt(flipperBits.slice(1, 12), 2)} | Adjusted = {flipperInterpretation.exponentVal} (Bias -1023)
            </span>
            <div className="flipper-bits-container">
              {Array.from({ length: 11 }).map((_, i) => {
                const bitIdx = i + 1;
                return (
                  <button
                    key={bitIdx}
                    className={`flipper-bit-btn exp-${flipperBits[bitIdx]}`}
                    onClick={() => toggleFlipperBit(bitIdx)}
                    title={`Exponent Bit [${bitIdx}]`}
                  >
                    {flipperBits[bitIdx]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mantissa Row */}
          <div className="npl-flipper-row">
            <span className="flipper-row-label">Mantissa / Fraction (Bits 12-63): Value = {flipperInterpretation.mantissaVal.toFixed(17)}</span>
            <div className="flipper-bits-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(13, 1fr)', gap: '4px' }}>
              {Array.from({ length: 52 }).map((_, i) => {
                const bitIdx = i + 12;
                return (
                  <button
                    key={bitIdx}
                    className={`flipper-bit-btn mant-${flipperBits[bitIdx]}`}
                    onClick={() => toggleFlipperBit(bitIdx)}
                    title={`Mantissa Bit [${bitIdx}]`}
                  >
                    {flipperBits[bitIdx]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Evaluation Box */}
        <div className="npl-flipper-results">
          <div className="flipper-res-value-row">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Computed Float Value:</span>
            <span className="flipper-decimal-val">{isNaN(flipperFloat) ? 'NaN' : flipperFloat.toString()}</span>
          </div>
          <div className="flipper-details-grid">
            <div className="flipper-detail-card">
              <span className="flipper-detail-title">Representation</span>
              <span className="flipper-detail-val" style={{ color: 'var(--accent-cyan)' }}>{flipperInterpretation.type}</span>
            </div>
            <div className="flipper-detail-card">
              <span className="flipper-detail-title">Multiplier</span>
              <span className="flipper-detail-val">
                {isNaN(flipperInterpretation.exponentVal) ? 'N/A' : `2^(${flipperInterpretation.exponentVal})`}
              </span>
            </div>
            <div className="flipper-detail-card">
              <span className="flipper-detail-title">Exact Value</span>
              <span className="flipper-detail-val code-font" style={{ fontSize: '0.65rem' }}>
                {flipperFloat.toFixed(30).replace(/\.?0+$/, '') || '0'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="npl-counter">
        <span>Experiments conducted: <strong>{triedCount}</strong></span>
        {xpAwarded && (
          <motion.span
            className="glow-text-gold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{ marginLeft: '10px' }}
          >
            +40 XP earned! 🎉
          </motion.span>
        )}
        {!xpAwarded && triedCount > 0 && (
          <span style={{ color: 'var(--text-muted)', marginLeft: '10px' }}>
            (Try {Math.max(0, 3 - triedCount)} more to unlock +40 XP)
          </span>
        )}
      </div>
    </div>
  );
}

function ObjectReferenceSim({ onBack }) {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const addXP = useStore((s) => s.addXP);

  const scenario = objectRefScenarios[step];

  const next = () => {
    if (step + 1 >= objectRefScenarios.length) {
      addXP(55);
      setCompleted(true);
    } else {
      setStep((s) => s + 1);
    }
  };

  const prev = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const restart = () => {
    setStep(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <motion.div className="sim-end-screen" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className="sim-end-emoji"><Building2 size={48} /></div>
        <h2 className="sim-end-title">Reference Expert!</h2>
        <p className="sim-end-score">You explored all {objectRefScenarios.length} scenarios</p>
        <p className="sim-end-xp glow-text-gold">+55 XP</p>
        <div className="sim-end-buttons">
          <button className="sim-retry-btn" onClick={restart}>Explore Again</button>
          <button className="sim-home-btn" onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><ArrowLeft size={16} /> All Playgrounds</button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="sim-panel">
      <button className="sim-back-btn" onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><ArrowLeft size={16} /> Back</button>
      <h2 className="sim-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Building2 size={24} className="sim-title-icon" /> Object Reference Sim</h2>

      <div className="sim-score-bar">
        <div className="sim-score-item">
          <div className="sim-score-label">Scenario Progress</div>
          <div className="sim-score-value total">{step + 1} / {objectRefScenarios.length}</div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="ors-card"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="ors-scenario-title">{scenario.title}</h3>
          
          <div className="pvr-code-container">
            <div className="pvr-code-dots">
              <span style={{ background: '#ff5f56' }} />
              <span style={{ background: '#ffbd2e' }} />
              <span style={{ background: '#27c93f' }} />
            </div>
            <pre className="pvr-code"><code>{scenario.code}</code></pre>
          </div>

          <div className="ors-diagram">
            <div className="ors-vars-column">
              <div className="pvr-section-label">Variables</div>
              {scenario.vars.map((v, i) => (
                <motion.div
                  key={v.name}
                  className="ors-var-box"
                  style={{ borderColor: v.color }}
                  initial={{ x: -15, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="ors-var-name">{v.name}</span>
                  <span className="ors-arrow" style={{ color: v.color }}>⤳</span>
                </motion.div>
              ))}
            </div>

            <div className="ors-objects-column">
              <div className="pvr-section-label">Heap Memory</div>
              {scenario.objects.map((obj, i) => {
                const pointing = scenario.vars.filter((v) => v.pointsTo === obj.id);
                return (
                  <motion.div
                    key={obj.id}
                    className="ors-obj-box"
                    style={{ borderColor: obj.color, boxShadow: `0 0 15px ${obj.color}22` }}
                    animate={obj.pulse ? { scale: [1, 1.04, 1] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    <span className="ors-obj-content">{obj.content}</span>
                    {pointing.length > 0 && (
                      <span className="ors-obj-refs" style={{ color: pointing[0].color }}>
                        (referenced by: {pointing.map((p) => p.name).join(', ')})
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {scenario.result && (
            <div className="ors-result-section">
              <div className="ors-comparison-gate">
                <span className="comparison-operand">a</span>
                <span className="comparison-operator">===</span>
                <span className="comparison-operand">b</span>
              </div>
              <div className="ors-result-badge">
                Output: <span className="value-false">{scenario.result}</span>
              </div>
              <div className="ors-result-warning">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-warning)' }}><AlertTriangle size={16} /> Objects are compared by their heap addresses, NOT their field contents!</span>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <motion.div className="sim-feedback correct" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={step + '-exp'}>
        <p className="sim-feedback-text">{scenario.explanation}</p>
      </motion.div>

      <div className="pvr-nav-buttons">
        <button className="lv-ctrl-btn" onClick={prev} disabled={step === 0} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><ChevronLeft size={16} /> Previous</button>
        <button className="lv-ctrl-btn primary" onClick={next}>
          {step + 1 >= objectRefScenarios.length ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Check size={16} /> Complete</span> : <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>Next Scenario <ChevronRight size={16} /></span>}
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   NEW: Build Your Own JS (Java Interpreter Simulation)
   ────────────────────────────────────────────── */
const javaCodeLines = [
  'import java.util.*;', // 1
  '', // 2
  'class Main {', // 3
  '    static class console {', // 4
  '        static void log(String s) {', // 5
  '            System.out.print(s);', // 6
  '        }', // 7
  '        static void log(String a, char c, String b) {', // 8
  '            if (c == \'+\') System.out.print(a + b);', // 9
  '            else {', // 10
  '                System.out.println("Invalid operation for strings");', // 11
  '            }', // 12
  '        }', // 13
  '        static void log(int a, char c, int b) {', // 14
  '            if (c == \'+\') System.out.print(a + b);', // 15
  '            else if (c == \'*\') System.out.print(a * b);', // 16
  '            else if (c == \'-\') System.out.print(a - b);', // 17
  '            else if (c == \'/\') System.out.print(a / b);', // 18
  '            else System.out.print("invalid operator");', // 19
  '        }', // 20
  '    }', // 21
  '    static char operator = \' \';', // 22
  '    static boolean check(String j) {', // 23
  '        for (char c : j.toCharArray()) {', // 24
  '            if (c == \'+\' || c == \'*\' || c == \'/\' || c == \'-\') {', // 25
  '                operator = c;', // 26
  '                return true;', // 27
  '            }', // 28
  '        }', // 29
  '        return false;', // 30
  '    }', // 31
  '    static boolean nos(String s) {', // 32
  '        for (char c : s.toCharArray()) {', // 33
  '            if ((c >= \'a\' && c <= \'z\') ||', // 34
  '                (c >= \'A\' && c <= \'Z\')) {', // 35
  '                return true;', // 36
  '            }', // 37
  '        }', // 38
  '        return false;', // 39
  '    }', // 40
  '    public static void main(String[] args) {', // 41
  '        Scanner sc = new Scanner(System.in);', // 42
  '        String s = sc.nextLine();', // 43
  '        String d = s.trim();', // 44
  '        boolean flag = false;', // 45
  '        if (d.contains("console.log(") && d.contains(")")) {', // 46
  '            flag = true;', // 47
  '        }', // 48
  '        else {', // 49
  '            System.out.print("invalid syntax");', // 50
  '        }', // 51
  '        if (flag) {', // 52
  '            String j = d.substring(12, d.length() - 1);', // 53
  '            boolean c = check(j);', // 54
  '            if (c) {', // 55
  '                int idx = j.indexOf(operator);', // 56
  '                String a = j.substring(0, idx).trim();', // 57
  '                String b = j.substring(idx + 1).trim();', // 58
  '                boolean aStr = nos(a);', // 59
  '                boolean bStr = nos(b);', // 60
  '                if (aStr || bStr) {', // 61
  '                    console.log(a, operator, b);', // 62
  '                } else {', // 63
  '                    int x = Integer.parseInt(a);', // 64
  '                    int y = Integer.parseInt(b);', // 65
  '                    console.log(x, operator, y);', // 66
  '                }', // 67
  '            }', // 68
  '            else {', // 69
  '                console.log(j);', // 70
  '            }', // 71
  '        }', // 72
  '    }', // 73
  '}' // 74
];

const highlightJavaLine = (text) => {
  if (!text) return '\n';
  
  // Escape HTML characters
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Style comments
  if (html.includes('//')) {
    const idx = html.indexOf('//');
    const codePart = html.substring(0, idx);
    const commentPart = html.substring(idx);
    return highlightCodeTokens(codePart) + `<span class="java-comment">${commentPart}</span>`;
  }

  return highlightCodeTokens(html);
};

const highlightCodeTokens = (html) => {
  // 1. Extract strings and replace with placeholders
  const stringLiterals = [];
  html = html.replace(/(["'])(.*?)\1/g, (match) => {
    const placeholder = `__STRING_LITERAL_PLACEHOLDER_${stringLiterals.length}__`;
    stringLiterals.push(match);
    return placeholder;
  });

  // 2. Keywords
  const keywords = [
    'class', 'static', 'void', 'int', 'boolean', 'char', 'import',
    'new', 'if', 'else', 'return', 'public'
  ];
  keywords.forEach(kw => {
    const regex = new RegExp(`\\b${kw}\\b`, 'g');
    html = html.replace(regex, `<span class="java-keyword">${kw}</span>`);
  });

  // 3. Types / Classes
  const types = ['String', 'System', 'Scanner', 'Integer', 'Main'];
  types.forEach(type => {
    const regex = new RegExp(`\\b${type}\\b`, 'g');
    html = html.replace(regex, `<span class="java-type">${type}</span>`);
  });

  // 4. Methods
  html = html.replace(/\b(log|check|nos|parseInt|substring|trim|indexOf|nextLine|print|println|toCharArray)\b/g, '<span class="java-method">$&</span>');

  // 5. Restore strings wrapped in span
  stringLiterals.forEach((strVal, idx) => {
    const placeholder = `__STRING_LITERAL_PLACEHOLDER_${idx}__`;
    const styledStr = `<span class="java-string">${strVal}</span>`;
    html = html.replace(placeholder, () => styledStr);
  });

  return html;
};

function BuildYourOwnJS({ onBack }) {
  const addXP = useStore((s) => s.addXP);
  const unlockAchievement = useStore((s) => s.unlockAchievement);
  const [inputCode, setInputCode] = useState('console.log(5 + 3)');
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [debuggerSpeed, setDebuggerSpeed] = useState(1);
  const [activeJavaLine, setActiveJavaLine] = useState(-1);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [consoleLog, setConsoleLog] = useState('');
  
  // Parsed simulation properties
  const [parseDetails, setParseDetails] = useState({
    isValid: false,
    content: '',
    operator: '',
    operandA: '',
    operandB: '',
    type: '',
    result: '',
  });

  const [unlockedAchievements, setUnlockedAchievements] = useState([]);

  // Examples pre-loaded
  const codeExamples = [
    { label: 'Simple Text log', code: 'console.log("hello")' },
    { label: 'Basic Addition', code: 'console.log(5 + 3)' },
    { label: 'String Concat', code: 'console.log("code" + "craft")' },
    { label: 'Syntax Error (No bracket)', code: 'console.log("error"' },
    { label: 'Multi-Operand Math', code: 'console.log(10 + 20)' }
  ];

  const timerRef = useRef(null);
  const stepsRef = useRef([]);
  const stepIdxRef = useRef(0);
  const debuggerSpeedRef = useRef(1);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleExampleChange = (e) => {
    if (e.target.value) {
      setInputCode(e.target.value);
      resetState();
    }
  };

  const resetState = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveJavaLine(-1);
    setCurrentStepIdx(-1);
    setIsRunning(false);
    setIsPaused(false);
    setConsoleLog('');
    setParseDetails({
      isValid: false,
      content: '',
      operator: '',
      operandA: '',
      operandB: '',
      type: '',
      result: '',
    });
  };

  const getJavaExecutionSteps = (code) => {
    const trimmed = code.trim();
    const hasLogPrefix = trimmed.startsWith('console.log(');
    const hasLogSuffix = trimmed.endsWith(')');
    const isValid = hasLogPrefix && hasLogSuffix;

    const steps = [];

    steps.push({ line: 41, info: "JVM invokes main() method of Main class." });
    steps.push({ line: 42, info: "Instantiating standard Java Scanner class." });
    steps.push({ line: 43, info: `Scanner reads input line: sc.nextLine() = "${trimmed}"` });
    steps.push({ line: 44, info: "Trimming whitespace: s.trim()." });
    steps.push({ line: 45, info: "Initializing syntax valid flag: flag = false." });
    steps.push({ line: 46, info: 'Validating syntax: Checking contains("console.log(") && endsWith(")")' });

    if (!isValid) {
      steps.push({ line: 49, info: "Syntax check failed: entering else block." });
      steps.push({ line: 50, info: 'Executing System.out.print("invalid syntax")', print: "invalid syntax" });
      steps.push({ line: 73, info: "Main method execution completed." });
      return steps;
    }

    steps.push({ line: 47, info: "Syntax check passed: flag = true." });
    steps.push({ line: 52, info: "Evaluating if (flag): flag is true, entering code parsing block." });

    const content = trimmed.substring(12, trimmed.length - 1).trim();
    steps.push({ line: 53, info: `Extracting substring: substring(12, length-1) = "${content}"` });
    steps.push({ line: 54, info: 'Invoking check(j) to scan for operators (+, -, *, /).' });

    steps.push({ line: 23, info: `Entering check(String j) with parameter "${content}".` });
    steps.push({ line: 24, info: "Iterating through character array to detect operators..." });

    let operator = '';
    if (content.includes('+')) operator = '+';
    else if (content.includes('-')) operator = '-';
    else if (content.includes('*')) operator = '*';
    else if (content.includes('/')) operator = '/';

    if (operator) {
      steps.push({ line: 25, info: `Operator character '${operator}' detected!` });
      steps.push({ line: 26, info: `Setting static operator field to '${operator}'.` });
      steps.push({ line: 27, info: "check() returned true: operator found." });
    } else {
      steps.push({ line: 30, info: "check() returned false: no operators found." });
    }

    steps.push({ line: 55, info: operator ? "Entering c = true branch for operations parsing." : "check() is false, skipping operators block." });

    if (operator) {
      steps.push({ line: 56, info: `Finding index of operator '${operator}' in substring.` });
      const idx = content.indexOf(operator);
      const operandA = content.substring(0, idx).trim();
      const operandB = content.substring(idx + 1).trim();

      steps.push({ line: 57, info: `Extracting left operand A: j.substring(0, idx).trim() = "${operandA}"` });
      steps.push({ line: 58, info: `Extracting right operand B: j.substring(idx + 1).trim() = "${operandB}"` });
      steps.push({ line: 59, info: `Calling nos(a) to check if Operand A contains alphabetic characters.` });

      steps.push({ line: 32, info: `Entering nos(String s) with string "${operandA}".` });
      steps.push({ line: 33, info: "Iterating through character array..." });
      const aStr = /[a-zA-Z]/.test(operandA);
      if (aStr) {
        steps.push({ line: 36, info: "Alphabetic characters detected in Operand A: returning true." });
      } else {
        steps.push({ line: 40, info: "No alphabetic characters found in Operand A: returning false." });
      }

      steps.push({ line: 60, info: `Calling nos(b) to check if Operand B contains alphabetic characters.` });
      steps.push({ line: 32, info: `Entering nos(String s) with string "${operandB}".` });
      steps.push({ line: 33, info: "Iterating through character array..." });
      const bStr = /[a-zA-Z]/.test(operandB);
      if (bStr) {
        steps.push({ line: 36, info: "Alphabetic characters detected in Operand B: returning true." });
      } else {
        steps.push({ line: 40, info: "No alphabetic characters found in Operand B: returning false." });
      }

      steps.push({ line: 61, info: `Checking if either operand is String: if (aStr || bStr)` });

      if (aStr || bStr) {
        steps.push({ line: 62, info: `Calling console.log(String, char, String) for string concatenation.` });
        steps.push({ line: 8, info: `Entering console.log(String a, char c, String b) with "${operandA}", '${operator}', "${operandB}".` });
        steps.push({ line: 9, info: "Evaluating if (c == '+')" });
        if (operator === '+') {
          const cleanA = operandA.replace(/['"]/g, '');
          const cleanB = operandB.replace(/['"]/g, '');
          steps.push({ line: 9, info: `System.out.print(a + b) -> Concatenating strings: "${cleanA + cleanB}"`, print: cleanA + cleanB });
        } else {
          steps.push({ line: 11, info: 'System.out.println("Invalid operation for strings")', print: "Invalid operation for strings" });
        }
      } else {
        steps.push({ line: 64, info: `Parsing Operand A to int: Integer.parseInt("${operandA}")` });
        steps.push({ line: 65, info: `Parsing Operand B to int: Integer.parseInt("${operandB}")` });
        steps.push({ line: 66, info: `Calling overloaded console.log(int, char, int) with parsed integers.` });
        steps.push({ line: 14, info: `Entering console.log(int a, char c, int b) with ${operandA}, '${operator}', ${operandB}.` });
        steps.push({ line: 15, info: "Evaluating if (c == '+')" });
        
        const numA = parseInt(operandA);
        const numB = parseInt(operandB);
        if (operator === '+') {
          steps.push({ line: 15, info: `System.out.print(a + b) -> ${numA} + ${numB} = ${numA + numB}`, print: String(numA + numB) });
        } else {
          steps.push({ line: 16, info: `Evaluating if (c == '*')` });
          if (operator === '*') {
            steps.push({ line: 16, info: `System.out.print(a * b) -> ${numA} * ${numB} = ${numA * numB}`, print: String(numA * numB) });
          } else {
            steps.push({ line: 17, info: `Evaluating if (c == '-')` });
            if (operator === '-') {
              steps.push({ line: 17, info: `System.out.print(a - b) -> ${numA} - ${numB} = ${numA - numB}`, print: String(numA - numB) });
            } else {
              steps.push({ line: 18, info: `Evaluating if (c == '/')` });
              if (operator === '/') {
                steps.push({ line: 18, info: `System.out.print(a / b) -> ${numA} / ${numB} = ${Math.floor(numA / numB)}`, print: String(Math.floor(numA / numB)) });
              }
            }
          }
        }
      }
    } else {
      steps.push({ line: 69, info: "Operator check is false: entering else literal block." });
      steps.push({ line: 70, info: `Calling console.log(String s) with literal value: "${content}"` });
      steps.push({ line: 5, info: `Entering console.log(String s) with "${content}".` });
      const cleanContent = content.replace(/['"]/g, '');
      steps.push({ line: 6, info: `System.out.print(s) -> Printing literal value: "${cleanContent}"`, print: cleanContent });
    }

    steps.push({ line: 73, info: "Main method execution completed successfully." });
    return steps;
  };

  const handleRun = () => {
    if (isRunning) return;
    setIsRunning(true);
    setIsPaused(false);
    setConsoleLog('');

    const code = inputCode.trim();
    const hasLogPrefix = code.startsWith('console.log(');
    const hasLogSuffix = code.endsWith(')');
    const isValidSyntax = hasLogPrefix && hasLogSuffix;

    let content = '';
    if (isValidSyntax) {
      content = code.substring(12, code.length - 1).trim();
    } else {
      content = code;
    }

    let operator = '';
    if (content.includes('+')) operator = '+';
    else if (content.includes('-')) operator = '-';
    else if (content.includes('*')) operator = '*';
    else if (content.includes('/')) operator = '/';

    let type = '';
    let operandA = '';
    let operandB = '';
    let resultVal = '';

    if (isValidSyntax) {
      if (operator) {
        const parts = content.split(operator).map(p => p.trim());
        operandA = parts[0];
        operandB = parts[1];

        const isStringA = operandA.startsWith('"') || operandA.startsWith("'");
        const isStringB = operandB.startsWith('"') || operandB.startsWith("'");

        if (isStringA || isStringB) {
          type = 'String Expression';
          const cleanA = operandA.replace(/['"]/g, '');
          const cleanB = operandB.replace(/['"]/g, '');
          resultVal = operator === '+' ? cleanA + cleanB : 'NaN';
        } else {
          type = 'Number Expression';
          const numA = parseFloat(operandA);
          const numB = parseFloat(operandB);
          if (!isNaN(numA) && !isNaN(numB)) {
            if (operator === '+') resultVal = String(numA + numB);
            else if (operator === '-') resultVal = String(numA - numB);
            else if (operator === '*') resultVal = String(numA * numB);
            else if (operator === '/') resultVal = String(Math.floor(numA / numB));
          } else {
            resultVal = 'NaN';
          }
        }
      } else {
        const isStr = content.startsWith('"') || content.startsWith("'");
        type = isStr ? 'String literal' : 'Number literal';
        resultVal = content.replace(/['"]/g, '');
      }
    } else {
      type = 'Invalid Structure';
      resultVal = 'SyntaxError';
    }

    setParseDetails({
      isValid: isValidSyntax,
      content,
      operator,
      operandA,
      operandB,
      type,
      result: resultVal,
    });

    const steps = getJavaExecutionSteps(code);
    stepsRef.current = steps;
    stepIdxRef.current = 0;
    
    // Set initial step
    setCurrentStepIdx(0);
    setActiveJavaLine(steps[0].line);

    runStepLoop(steps, 0, resultVal, code, type, isValidSyntax);
  };

  const runStepLoop = (steps, startIdx, resultVal, code, type, isValid) => {
    stepIdxRef.current = startIdx;

    if (timerRef.current) clearTimeout(timerRef.current);

    const executeNext = () => {
      const idx = stepIdxRef.current;
      if (idx >= steps.length) {
        setIsRunning(false);
        if (isValid) {
          addXP(15);
          triggerAchievements(code, type);
        }
        return;
      }

      setCurrentStepIdx(idx);
      const currentStep = steps[idx];
      setActiveJavaLine(currentStep.line);

      // Scroll highlighted line into view
      const lineEl = document.getElementById(`java-line-${currentStep.line}`);
      if (lineEl) {
        lineEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Output printed to stdout
      if (currentStep.print !== undefined) {
        setConsoleLog(currentStep.print);
      }

      stepIdxRef.current = idx + 1;

      if (!isPaused) {
        timerRef.current = setTimeout(executeNext, 450 / debuggerSpeedRef.current);
      }
    };

    timerRef.current = setTimeout(executeNext, 100);
  };

  const handlePauseToggle = () => {
    if (!isRunning) return;
    if (isPaused) {
      setIsPaused(false);
      resumeDebugger();
    } else {
      setIsPaused(true);
      if (timerRef.current) clearTimeout(timerRef.current);
    }
  };

  const resumeDebugger = () => {
    const steps = stepsRef.current;
    if (timerRef.current) clearTimeout(timerRef.current);

    const executeNext = () => {
      const idx = stepIdxRef.current;
      if (idx >= steps.length) {
        setIsRunning(false);
        return;
      }

      setCurrentStepIdx(idx);
      const currentStep = steps[idx];
      setActiveJavaLine(currentStep.line);

      const lineEl = document.getElementById(`java-line-${currentStep.line}`);
      if (lineEl) {
        lineEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      if (currentStep.print !== undefined) {
        setConsoleLog(currentStep.print);
      }

      stepIdxRef.current = idx + 1;
      timerRef.current = setTimeout(executeNext, 450 / debuggerSpeedRef.current);
    };

    timerRef.current = setTimeout(executeNext, 450 / debuggerSpeedRef.current);
  };

  const handleStepOver = () => {
    if (!isRunning || !isPaused) return;
    const steps = stepsRef.current;
    const idx = stepIdxRef.current;
    if (idx >= steps.length) {
      setIsRunning(false);
      return;
    }

    setCurrentStepIdx(idx);
    const currentStep = steps[idx];
    setActiveJavaLine(currentStep.line);

    const lineEl = document.getElementById(`java-line-${currentStep.line}`);
    if (lineEl) {
      lineEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (currentStep.print !== undefined) {
      setConsoleLog(currentStep.print);
    }

    stepIdxRef.current = idx + 1;
  };

  const handleSpeedChange = (speed) => {
    setDebuggerSpeed(speed);
    debuggerSpeedRef.current = speed;
  };

  const triggerAchievements = (code, type) => {
    const freshUnlocks = [];
    
    if (!unlockedAchievements.includes('first-prog')) {
      unlockAchievement('byo-first');
      freshUnlocks.push({ id: 'first-prog', title: 'First Program', desc: 'Successfully simulated your first JS input!' });
    }

    if (type === 'Number Expression' && !unlockedAchievements.includes('math-wiz')) {
      freshUnlocks.push({ id: 'math-wiz', title: 'Math Wizard', desc: 'Evaluated a numeric arithmetic addition.' });
    }

    if (type === 'String Expression' && !unlockedAchievements.includes('string-mast')) {
      freshUnlocks.push({ id: 'string-mast', title: 'String Master 🔗', desc: 'Concatenated string tokens in the Java engine.' });
    }

    if (freshUnlocks.length > 0) {
      setUnlockedAchievements(prev => [...prev, ...freshUnlocks.map(a => a.id)]);
    }
  };

  // Run Error Achievement
  useEffect(() => {
    if (currentStepIdx !== -1 && currentStepIdx === stepsRef.current.length - 1 && !parseDetails.isValid && !unlockedAchievements.includes('explorer')) {
      setUnlockedAchievements(prev => [...prev, 'explorer']);
    }
  }, [currentStepIdx, parseDetails.isValid]);

  return (
    <div className="sim-panel byo-panel">
      <button className="sim-back-btn" onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><ArrowLeft size={16} /> Back</button>
      <h2 className="sim-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Coffee size={24} className="sim-title-icon" /> Build Your Own JS</h2>
      <p className="sim-subtitle-inside">Visualize how a Java compiler parses and executes JavaScript code internally step-by-step.</p>

      <div className="byo-split-layout">
        {/* Left Column: Panel 1 + Panel 3 stacked */}
        <div className="byo-left-column">

        {/* Panel 1: User Input */}
        <div className="byo-col-panel glass">
          <h3 className="byo-panel-title">1. JavaScript Input</h3>
          
          <div className="byo-dropdown-row">
            <select className="byo-select" onChange={handleExampleChange} defaultValue="">
              <option value="" disabled>Load code template...</option>
              {codeExamples.map((ex, idx) => (
                <option key={idx} value={ex.code}>{ex.label}</option>
              ))}
            </select>
          </div>

          <div className="byo-editor-container">
            <div className="byo-editor-numbers">
              <div>1</div>
              <div>2</div>
            </div>
            <textarea
              className="byo-editor"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              disabled={isRunning}
            />
          </div>

          <div className="byo-editor-controls">
            <button
              className="lv-ctrl-btn primary"
              onClick={handleRun}
              disabled={isRunning || !inputCode.trim()}
            >
              {isRunning ? 'Running...' : <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Zap size={16} /> Run Code</span>}
            </button>
            <button className="lv-ctrl-btn" onClick={resetState} disabled={isRunning}>
              Clear
            </button>
          </div>

          {/* Execution Speed Selector widget */}
          <div className="byo-speed-container">
            <div className="byo-speed-title">Interpreter Execution Speed</div>
            <div className="byo-speed-btn-group">
              <button
                className={`byo-speed-btn ${debuggerSpeed === 0.5 ? 'active' : ''}`}
                onClick={() => handleSpeedChange(0.5)}
              >
                0.5x
              </button>
              <button
                className={`byo-speed-btn ${debuggerSpeed === 1 ? 'active' : ''}`}
                onClick={() => handleSpeedChange(1)}
              >
                1.0x
              </button>
              <button
                className={`byo-speed-btn ${debuggerSpeed === 2 ? 'active' : ''}`}
                onClick={() => handleSpeedChange(2)}
              >
                2.0x
              </button>
            </div>
          </div>
        </div>

        {/* Panel 3: Output (stacked below Panel 1 in left column) */}
        <div className="byo-col-panel glass">
          <h3 className="byo-panel-title">3. Execution Details & Terminal</h3>
          
          {/* Virtual Terminal output */}
          <div className="byo-terminal">
            <div className="terminal-header">
              <span className="terminal-dot red" />
              <span className="terminal-dot yellow" />
              <span className="terminal-dot green" />
              <span className="terminal-title">Output Terminal</span>
            </div>
            <div className="terminal-body">
              {consoleLog ? (
                <div className={`terminal-output-line ${parseDetails.isValid ? '' : 'error'}`}>
                  &gt; {consoleLog}
                </div>
              ) : isRunning ? (
                <div className="terminal-loading">Running compiler engine...</div>
              ) : (
                <div className="terminal-empty">Terminal is idle</div>
              )}
            </div>
          </div>

          {/* Educational Explainer box / Debugger console */}
          <div className="byo-explainer-card">
            <h4 className="explainer-header" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Lightbulb size={16} /> Debugger Console</h4>
            <div className="explainer-content">
              {currentStepIdx === -1 || !stepsRef.current[currentStepIdx] ? (
                'Interpreter is idle. Click Run Code to watch line-by-line debugger steps.'
              ) : (
                <div className="explainer-statements">
                  <div className="explainer-line active-line"><ArrowRight size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} /> {stepsRef.current[currentStepIdx].info}</div>
                  {currentStepIdx > 0 && stepsRef.current[currentStepIdx - 1] && (
                    <div className="explainer-line-past" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} /> {stepsRef.current[currentStepIdx - 1].info}</div>
                  )}
                </div>
              )}
            </div>
            {isRunning && (
              <div className="java-debugger-controls" style={{ padding: '8px 0 0 0', background: 'transparent', border: 'none' }}>
                <button className="dbg-btn" onClick={handlePauseToggle}>
                  {isPaused ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Play size={12} style={{ fill: 'currentColor' }} /> Resume
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Pause size={12} /> Pause
                    </span>
                  )}
                </button>
                <button className="dbg-btn" onClick={handleStepOver} disabled={!isPaused} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowRight size={12} /> Step Over
                </button>
              </div>
            )}
          </div>

          <div className="byo-result-card">
            {activeJavaLine === -1 ? (
              <div className="byo-empty-results">Waiting for interpreter output...</div>
            ) : (
              <div className="byo-results-table">
                <div className="byo-result-row">
                  <span className="byo-res-label">Input Code</span>
                  <span className="byo-res-value code-font">{inputCode}</span>
                </div>
                <div className="byo-result-row">
                  <span className="byo-res-label">Syntax Valid?</span>
                  <span className={`byo-res-value ${parseDetails.isValid ? 'success' : 'fail'}`}>
                    {parseDetails.isValid ? 'YES' : 'NO (SyntaxError)'}
                  </span>
                </div>
                {parseDetails.isValid && (
                  <>
                    <div className="byo-result-row">
                      <span className="byo-res-label">Operator Found</span>
                      <span className="byo-res-value code-font">{parseDetails.operator || 'None'}</span>
                    </div>
                    <div className="byo-result-row">
                      <span className="byo-res-label">Type Detected</span>
                      <span className="byo-res-value">{parseDetails.type}</span>
                    </div>
                    <div className="byo-result-row">
                      <span className="byo-res-label">Parsed Values</span>
                      <span className="byo-res-value code-font">
                        {parseDetails.operator
                          ? `A: ${parseDetails.operandA} | B: ${parseDetails.operandB}`
                          : parseDetails.content}
                      </span>
                    </div>
                  </>
                )}
                <div className="byo-result-row">
                  <span className="byo-res-label">Execution Result</span>
                  <span className="byo-res-value code-font gold-glow">{parseDetails.result}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        </div>{/* End left column */}

        {/* Panel 2: Java Interpreter Code (full right column) */}
        <div className="byo-col-panel byo-right-panel glass">
          <h3 className="byo-panel-title">2. Inside My Java Interpreter</h3>
          <div className="byo-java-code-visualizer" style={{ flex: 1 }}>
            <div className="byo-java-header">
              <span className="byo-java-file-icon"><Coffee size={16} /></span>
              <span className="byo-java-filename">Main.java (Java Interpreter Source)</span>
            </div>
            <div className="byo-java-body">
              {javaCodeLines.map((line, idx) => {
                const lineNum = idx + 1;
                const isCurrent = activeJavaLine === lineNum;
                return (
                  <div
                    key={idx}
                    id={`java-line-${lineNum}`}
                    className={`byo-java-line ${isCurrent ? 'active-java-highlight' : ''}`}
                  >
                    <span className="byo-java-lineno">{lineNum}</span>
                    <pre className="byo-java-linecode">
                      <code dangerouslySetInnerHTML={{ __html: highlightJavaLine(line) }} />
                    </pre>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





/* ──────────────────────────────────────────────
   Main Page
   ────────────────────────────────────────────── */
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: [0.4, 0, 0.2, 1] },
  }),
};

/* ── Roadmap Card Component ── */
function RoadmapCard({ milestone, index }) {
  const ref = useRef(null);
  const cardRef = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-20% 0px -20% 0px' });
  const side = index % 2 === 0 ? 'left' : 'right';

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const box = cardRef.current.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const maxTilt = 10;
    setTilt({
      x: ((y - box.height / 2) / (box.height / 2)) * -maxTilt,
      y: ((x - box.width / 2) / (box.width / 2)) * maxTilt,
    });
    setGlarePos({ x: (x / box.width) * 100, y: (y / box.height) * 100 });
  };

  const slideLeft = {
    hidden: { opacity: 0, x: -60, y: 20 },
    visible: { opacity: 1, x: 0, y: 0 },
  };
  const slideRight = {
    hidden: { opacity: 0, x: 60, y: 20 },
    visible: { opacity: 1, x: 0, y: 0 },
  };

  const cardContent = (
    <div
      ref={cardRef}
      className="roadmap-card"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setTilt({ x: 0, y: 0 }); }}
      style={{
        '--rm-color': milestone.color,
        transform: isHovered
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px) translateZ(10px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
        transition: isHovered ? 'none' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
      }}
    >
      <div
        className="roadmap-card-glare"
        style={{
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.12) 0%, transparent 80%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      <div className="roadmap-header-row">
        <div className="roadmap-icon">
          <LucideIcon name={milestone.icon} size={26} color={milestone.color} />
        </div>
        <div className="roadmap-title-group">
          <h3 className="roadmap-title">{milestone.title}</h3>
          <span className="roadmap-step-num">{milestone.step}</span>
        </div>
      </div>
      <p className="roadmap-subtitle">{milestone.subtitle}</p>
      <p className="roadmap-text">{milestone.content}</p>
      <div className="roadmap-topics">
        {milestone.topics.map((t) => (
          <span key={t} className="roadmap-topic-tag">{t}</span>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className={`roadmap-chapter chapter-${side}`}
      style={{ '--rm-color': milestone.color }}
      ref={ref}
    >
      {/* Timeline dot */}
      <div className="roadmap-dot-wrapper">
        <motion.div
          className={`roadmap-dot ${isInView ? 'dot-active' : ''}`}
          animate={isInView ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        <span className="roadmap-step-badge">{milestone.step}</span>
      </div>

      {side === 'left' ? (
        <>
          <motion.div
            className="roadmap-side-left"
            variants={slideLeft}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            {cardContent}
          </motion.div>
          <div className="roadmap-side-right" />
        </>
      ) : (
        <>
          <div className="roadmap-side-left" />
          <motion.div
            className="roadmap-side-right"
            variants={slideRight}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            {cardContent}
          </motion.div>
        </>
      )}
    </div>
  );
}

/* ── Roadmap Section Component ── */
function RoadmapSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end end'],
  });
  const progressHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section className="roadmap-section" ref={sectionRef}>
      <motion.div
        className="roadmap-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7 }}
      >
        <div className="roadmap-badge">
          <Map size={14} />
          Learning Roadmap
        </div>
        <h2>
          Your <span className="glow-text-ocean">JavaScript</span> Journey
        </h2>
        <p>Master JavaScript step by step — from variables to modern ES6+ features.</p>
        <div className="roadmap-scroll-hint">
          <span>Scroll to explore</span>
          <div className="roadmap-scroll-arrow" />
        </div>
      </motion.div>

      <div className="roadmap-timeline">
        <div className="roadmap-line" />
        <motion.div className="roadmap-progress" style={{ height: progressHeight }} />

        {jsRoadmap.map((milestone, index) => (
          <RoadmapCard key={milestone.id} milestone={milestone} index={index} />
        ))}
      </div>
    </section>
  );
}

export default function PlaygroundArena() {
  const navigate = useNavigate();
  const [activeSim, setActiveSim] = useState(null);

  const simMap = {
    'loop-visualizer': LoopVisualizer,
    'primitive-vs-reference': PrimitiveVsReference,
    'number-precision': NumberPrecisionLab,
    'object-reference': ObjectReferenceSim,
    'build-your-own-js': BuildYourOwnJS,
  };

  const handleBack = () => setActiveSim(null);

  if (activeSim) {
    const SimComponent = simMap[activeSim];
    return (
      <motion.div
        className="playground-arena"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        {SimComponent ? (
          <SimComponent onBack={handleBack} />
        ) : null}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="playground-arena"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="pg-header">
        <button className="pg-back-btn" onClick={() => navigate('/js-world')}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><ArrowLeft size={16} /> Back to JS World</span>
        </button>
        <h1 className="pg-title">
          <span className="glow-text-ocean">Playground</span> Arena
        </h1>
        <p className="pg-subtitle">Explore interactive visual simulations to understand JavaScript behavior</p>
      </header>

      <div className="pg-grid">
        {playgrounds.map((pg, i) => (
          <motion.div
            key={pg.id}
            className="pg-card"
            style={{ '--card-accent': pg.color }}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="show"
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSim(pg.id)}
          >
            <span className="pg-card-icon" style={{ display: 'inline-flex', alignItems: 'center' }}><LucideIcon name={pg.icon} size={28} color={pg.color} /></span>
            <h3 className="pg-card-title">{pg.title}</h3>
            <p className="pg-card-desc">{pg.description}</p>
          </motion.div>
        ))}
      </div>

      {/* JavaScript Learning Roadmap */}
      <RoadmapSection />
    </motion.div>
  );
}
