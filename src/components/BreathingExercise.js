import React, { useState, useEffect } from 'react';

function BreathingExercise() {
  const [phase, setPhase] = useState('ready');
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);

  const exercises = [
    {
      name: '4-7-8',
      emoji: '😌',
      description: 'Calms anxiety',
      pattern: { inhale: 4, hold: 7, exhale: 8 }
    },
    {
      name: 'Box',
      emoji: '⬜',
      description: 'Stress relief',
      pattern: { inhale: 4, hold: 4, exhale: 4, holdEmpty: 4 }
    },
    {
      name: 'Simple',
      emoji: '🌊',
      description: 'Quick calm',
      pattern: { inhale: 4, exhale: 6 }
    }
  ];

  const [selectedExercise, setSelectedExercise] = useState(exercises[0]);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      const pattern = selectedExercise.pattern;
      
      if (phase === 'inhale' && count >= pattern.inhale) {
        setPhase(pattern.hold ? 'hold' : 'exhale');
        setCount(0);
      } else if (phase === 'hold' && count >= pattern.hold) {
        setPhase('exhale');
        setCount(0);
      } else if (phase === 'exhale' && count >= pattern.exhale) {
        if (pattern.holdEmpty) {
          setPhase('holdEmpty');
          setCount(0);
        } else {
          setPhase('inhale');
          setCount(0);
          setCycles(c => c + 1);
        }
      } else if (phase === 'holdEmpty' && count >= pattern.holdEmpty) {
        setPhase('inhale');
        setCount(0);
        setCycles(c => c + 1);
      } else {
        setCount(c => c + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase, count, selectedExercise]);

  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setCount(0);
    setCycles(0);
  };

  const stopExercise = () => {
    setIsActive(false);
    setPhase('ready');
    setCount(0);
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'holdEmpty':
        return 'Hold';
      case 'ready':
        return 'Ready';
      default:
        return '';
    }
  };

  return (
    <div className="breathing-simple">
      <div className="breathing-header-simple">
        <h1>Breathing Exercise</h1>
        <p>Follow the circle to calm your mind</p>
      </div>

      <div className="breathing-picker">
        {exercises.map((exercise, index) => (
          <button
            key={index}
            className={`exercise-btn ${selectedExercise.name === exercise.name ? 'active' : ''}`}
            onClick={() => {
              setSelectedExercise(exercise);
              stopExercise();
            }}
            disabled={isActive}
          >
            <span className="exercise-emoji">{exercise.emoji}</span>
            <div>
              <div className="exercise-name">{exercise.name}</div>
              <div className="exercise-desc">{exercise.description}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="breathing-visual-simple">
        <div className={`breathing-circle-simple ${phase} ${isActive ? 'active' : ''}`}>
          <div className="circle-text">
            <div className="phase-instruction">{getPhaseInstruction()}</div>
            {isActive && <div className="phase-count">{count + 1}</div>}
          </div>
        </div>
      </div>

      <div className="breathing-info-simple">
        {isActive && <p>Cycles: {cycles}</p>}
      </div>

      <div className="breathing-controls-simple">
        {!isActive ? (
          <button className="start-btn-simple" onClick={startExercise}>
            ▶️ Start
          </button>
        ) : (
          <button className="stop-btn-simple" onClick={stopExercise}>
            ⏹️ Stop
          </button>
        )}
      </div>
    </div>
  );
}

export default BreathingExercise;
