import * as React from 'react';
import { useState, memo } from 'react';
import Image from 'next/image'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import SaveIcon from '@mui/icons-material/Save';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import { styled } from "@mui/material/styles"

import Widget from '@public/images/widget.png'
import WidgetActive from '@public/images/widget-active.png'
import TradeDetail from '@public/images/trade-detail.png'
import TradeDetailActive from '@public/images/trade-detail-active.png'
import ShareLink from '@public/images/share-link.png'
import ShareLinkActive from '@public/images/share-link-active.png'
import Save from '@public/images/save.png'
import SaveActive from '@public/images/save-active.png'
import Currency from '@public/images/hkd.png'
import CurrencyActive from '@public/images/hkd-active.png'
import Export from '@public/images/export.png'
import Fade from '@mui/material/Fade'
import ExportActive from '@public/images/export-active.png'
import SaveLayoutDialog from '@src/components/dialogs/saveLayoutDialog'

const ResponsiveAppBar = () => {
  return (
    <>
      <div className='footer-wrapper'>
        <div>
          <div style={{ minWidth: 1600, height: 5, background: '#D8A500' }}></div>
        </div>
        <div className='footer'>
          <div>© 2022 Daiwa Capital Markets Hong Kong Ltd. 大和資本市場香港有限公司 All rights reserved.</div>
        </div>
      </div>
    </>
  );
};
export default ResponsiveAppBar;
