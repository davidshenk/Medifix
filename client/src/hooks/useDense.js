import { useMediaQuery, useTheme } from '@mui/material';

const useDense = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const size = isMobile ? 'small' : 'medium';
  const largeSize = isMobile ? 'medium' : 'large';

  return { isMobile, size, largeSize };
};

export default useDense;
