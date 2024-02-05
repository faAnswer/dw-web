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
import RestoreIcon from '@mui/icons-material/Restore';

const pages = [
  // 'Products', 'Pricing', 'Blog'
];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const ResponsiveAppBar = ({
  page = 'HOME', handleTabChange = () => { },
  singleStockProfileOptionList, portfolioProfileOptionList,
  tabValue = 2, singleStockProfile, portfolioProfile,
  setTabValue = () => { }, setSingleStockProfile, setPortfolioProfile, userId,
  deleteProfileButtonClick, handleEditProfileNameButtonClick,
  handleSingleProfileChange, handlePortfolioProfileChange
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
    <AppBar position="static" elevation={0} sx={{ minWidth: 1600 }}>
      <div className='logo-bar'>
        <div>
          <div className='logo'><Image src={Logo} alt='Logo Icon' /></div>
          <div className='title'>{`Analytics Platform ${(process.env.NEXT_PUBLIC_CURRENT_ENV === 'DEV' || process.env.NEXT_PUBLIC_CURRENT_ENV === 'UAT') ? '(' + process.env.NEXT_PUBLIC_CURRENT_ENV + ')':''}`}</div>
        </div>
      </div>

      <div className='app-bar'>
        {
          page === 'HOME' &&
          <Tabs tabValue={tabValue} setTabValue={setTabValue} callBack={handleTabChange} />
        }
        {
          (page === 'TRADE_DETAIL' || page === 'PROFILE_PAGE_TRADE_DETAIL') &&
          <div className='trade-details-title'>Trade Details</div>
        }
        {
          page === 'PROFILE_PAGE_SINGLE_STOCK' || page === 'PROFILE_PAGE_PORTFOLIO' &&
          <div className='trade-details-title'>{tabValue === '1' ? 'Single Stock' : 'Portfolio'}</div>
        }
        <div className='profile-container'>
          <div className='avatar-wrapper'>
            <div className='avatar'>
              <div style={{ width: 22 }}><Image src={User} alt='User Icon' /></div>
            </div>
            <div className='username'>{userId}</div>
          </div>
          <div className='profile-name'>
            {/* <div className='restore-btn'>
              <IconButton onClick={() => { }}>
                <RestoreIcon sx={{ color: '#fff' }} />
              </IconButton>
            </div> */}
            {
              tabValue === '1' && (page === 'SINGLE_STOCK' || page === 'PORTFOLIO' || page === 'TRADE_DETAIL' || page === 'HOME') &&
              <CustomProfilePicker
                optionList={singleStockProfileOptionList}
                setFieldValue={setSingleStockProfile}
                value={singleStockProfile}
                hideSvgIcon={singleStockProfileOptionList.length <= 0}
                deleteProfileButtonClick={deleteProfileButtonClick}
                handleEditProfileNameButtonClick={handleEditProfileNameButtonClick}
                handleProfileOnChange={handleSingleProfileChange}
              />
            }
            {
              tabValue === '2' && (page === 'SINGLE_STOCK' || page === 'PORTFOLIO' || page === 'TRADE_DETAIL' || page === 'HOME') &&
              <CustomProfilePicker
                optionList={portfolioProfileOptionList}
                setFieldValue={setPortfolioProfile}
                value={portfolioProfile}
                hideSvgIcon={portfolioProfileOptionList.length <= 0}
                deleteProfileButtonClick={deleteProfileButtonClick}
                handleEditProfileNameButtonClick={handleEditProfileNameButtonClick}
                handleProfileOnChange={handlePortfolioProfileChange}
              />
            }
          </div>
        </div>
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
export default ResponsiveAppBar;
