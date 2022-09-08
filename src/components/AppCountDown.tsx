import { useState, useEffect, FC, ReactNode } from 'react';
import 'src/styles/components/AppCountDown.scss';
import moment from 'moment';

type CountDownProps = {
  endDate?: number;
  render?: (duration: any) => ReactNode;
  customClass?: string;
};

const AppCountdown: FC<CountDownProps> = ({
  endDate,
  customClass = '',
  render,
}: CountDownProps) => {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let countDownInterval = undefined as any;

    if (endDate && endDate >= new Date().getTime()) {
      countDownInterval = setInterval(function () {
        const distance = endDate / 1000 - moment().unix();
        setDuration(distance);
        //do something later when date is reached
        if (distance <= 0 && countDownInterval) {
          clearInterval(countDownInterval);
          window.location.reload();
        }
        //seconds
      }, 1000);
    } else {
      setDuration(0);
    }

    return () => {
      clearInterval(countDownInterval);
    };
  }, [endDate]);

  if (!endDate) {
    return <></>;
  }

  const _renderCountdownBox = () => {
    return (
      <div>
        <ul className={`list-countdown ${customClass}`}>
          {Math.floor(duration / (3600 * 24)) > 0 && (
            <>
              <li className="item">
                <div className="part">
                  <span>{Math.floor(duration / (3600 * 24))}</span>
                  <span className="info">Days</span>
                </div>
              </li>
              <li className="colon">:</li>
            </>
          )}

          <li className="item">
            <div className="part">
              <span>{moment.utc(duration * 1000).format('HH')}</span>
              <span className="info">Hours</span>
            </div>
          </li>
          <li className="colon">:</li>
          <li className="item">
            <div className="part">
              <span>{moment.utc(duration * 1000).format('mm')}</span>
              <span className="info">Minutes</span>
            </div>
          </li>
          <li className="colon">:</li>
          <li className="item">
            <div className="part">
              <span>{moment.utc(duration * 1000).format('ss')}</span>
              <span className="info">Seconds</span>
            </div>
          </li>
        </ul>
      </div>
    );
  };

  return <>{render ? render(duration) : _renderCountdownBox()}</>;
};

export default AppCountdown;
