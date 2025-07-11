const COLORFUL_BACKGROUND_SVG = '/svgs/backgrounds/colorful-background.svg';

export const useColorfulBackground = () => {
  const getPageContainerProps = () => ({
    backgroundImage: `url(${COLORFUL_BACKGROUND_SVG})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50% -10px',
  });

  return {
    getPageContainerProps,
  };
};
