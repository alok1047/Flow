import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useStore } from '../../store/useStore';
import './SoundToggle.css';

const SoundToggle = () => {
  const soundEnabled = useStore((s) => s.soundEnabled);
  const toggleSound = useStore((s) => s.toggleSound);

  return (
    <motion.button
      className="sound-toggle"
      onClick={toggleSound}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
      title={soundEnabled ? 'Sound on' : 'Sound off'}
    >
      {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
    </motion.button>
  );
};

export default SoundToggle;
