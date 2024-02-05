import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles'

export default function TabsWrappedLabel ({ tabValue, setTabValue, callBack = () => { } }) {

  const styles = theme => ({
    root: { backgroundColor: '#0af' },
    tabRoot: { backgroundColor: '#0a6' },
    label: {
      backgroundColor: '#aa0',
      fontSize: '22px'
    },
  });

  const handleChange = (event, newValue) => {
    setTabValue(newValue)
    callBack()
  };

  const CustomTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
      width: 300,
      textTransform: 'none',
      fontWeight: theme.typography.fontWeightRegular,
      fontSize: theme.typography.pxToRem(15),
      marginRight: theme.spacing(1),
      color: 'rgba(255, 255, 255, 0.35)',
      '&.Mui-selected': {
        color: '#fff',
      },
      '&.Mui-focusVisible': {
        // backgroundColor: 'rgba(100, 95, 228, 0.35)',
      },
    }),
  );

  return (
    <div className='tabs-wrapper'>
      <Tabs
        value={tabValue}
        onChange={handleChange}
        aria-label="wrapped label tabs example"
        indicatorColor="secondary"
      >
        <CustomTab id='sinlge-stock-tab' value="1" label={<span style={{ fontSize: 18 }}>Single Stock</span>} />
        <CustomTab id='portfolio-tab' value="2" label={<span style={{ fontSize: 18 }}>Portfolio</span>} />
      </Tabs>
    </div>
  );
}
