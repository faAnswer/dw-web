import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Drawer from '@src/components/layouts/drawer'
import Tabs from '@src/components/layouts/tabs'
import User from '@public/images/user.png'
import Image from 'next/image'
import Logo from '@public/images/logo.png'
import CustomProfilePicker from '@src/components/inputs/CustomProfilePicker'
import { SINGLE_STOCK, PORTFOLIO, TRADE_DETAIL, ALL_PORTFOLIO, PROFILE_PAGE, PROFILE_PAGE_TRADE_DETAIL } from '@src/constants/values'

const pages = [
  // 'Products', 'Pricing', 'Blog'
];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const LoginAppBar = ({
  handleTabChange = () => { },
  singleStockProfileOptionList, portfolioProfileOptionList,
  singleStockProfile, portfolioProfile,
  setTabValue = () => { }, setSingleStockProfile, setPortfolioProfile
}) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ minWidth: 1600 }}>
      <div className='logo-bar'>
        <div>
          <div className='logo'><Image src={Logo} alt='Logo Icon' /></div>
          <div className='title'>{`Analytics Platform ${(process.env.NEXT_PUBLIC_CURRENT_ENV === 'DEV' || process.env.NEXT_PUBLIC_CURRENT_ENV === 'UAT') ? '(' + process.env.NEXT_PUBLIC_CURRENT_ENV + ')' : ''}`}</div>
        </div>
      </div>

      <div className='app-bar'>
        {
          <div className='trade-details-title'></div>
        }
      </div>
      <div>
        <div style={{ minWidth: 1600, height: 5, background: '#fff' }}></div>
        <div style={{ minWidth: 1600, height: 15 }}></div>
        <div style={{ minWidth: 1600, height: 10, background: '#fff' }}></div>
        <div style={{ minWidth: 1600, height: 5, background: '#D8A500' }}></div>
      </div>
    </AppBar>
  );
};
export default LoginAppBar;
