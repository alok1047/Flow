import { motion } from 'framer-motion';
import './Card.css';

const Card = ({
  children,
  className = '',
  hover = true,
  glow,
  onClick,
  ...props
}) => {
  const classes = [
    'flow-card',
    hover ? 'flow-card--hoverable' : '',
    onClick ? 'flow-card--clickable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.div
      className={classes}
      onClick={onClick}
      whileHover={hover ? { scale: 1.02 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      {...props}
    >
      {glow && (
        <div
          className="flow-card__glow"
          style={{ background: glow }}
        />
      )}
      {children}
    </motion.div>
  );
};

export default Card;
