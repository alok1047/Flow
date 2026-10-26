import StarField from './StarField';
import Moon from './Moon';
import Clouds from './Clouds';
import ShootingStar from './ShootingStar';
import './NightSky.css';

export default function NightSky() {
  return (
    <div className="night-sky" aria-hidden="true">
      <StarField />
      <Moon />
      <Clouds />
      <ShootingStar />
    </div>
  );
}
