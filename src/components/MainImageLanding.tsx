import animationData from 'src/assets/icons/main-image-landing.json';
import Lottie from 'react-lottie';

const MainImageLanding = (props: any) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <Lottie
      isClickToPauseDisabled
      options={defaultOptions}
      height={props.height || 'auto'}
      width={props.width || 'auto'}
    />
  );
};

export default MainImageLanding;
