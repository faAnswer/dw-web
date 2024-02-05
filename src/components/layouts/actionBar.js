import * as React from 'react';
import { useState, memo } from 'react';
import Image from 'next/image'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import SaveIcon from '@mui/icons-material/Save';
import { useRouter } from 'next/router';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import { styled } from "@mui/material/styles"
import useStores from '@src/utils/hooks/useStores'
import Popover from '@mui/material/Popover';
import { Observer } from 'mobx-react'
import Tooltip from '@mui/material/Tooltip';

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
import ExportPortfolioFileDialog from '@src/components/dialogs/exportPortfolioFileDialog';
import { saveLayoutOptionList } from '@src/configs/commonConfig'
import { SINGLE_STOCK, PORTFOLIO, TRADE_DETAIL, ALL_PORTFOLIO } from '@src/constants/values'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import envConfig from '@src/configs/envConfig';
import copyToClipboard from '@src/utils/copyToClipboard';
import ShareLinkDialog from '@src/components/dialogs/shareLinkDialog';

const ResponsiveAppBar = ({
  currencyOptionList, viewVisble = {},
  sinlgeStockViewVisble, portfolioViewVisble,
  handleSaveSingleStockClick, handleSavePortfolioClick,
  handleCloseGridClick, handleCurrencyChange,
  handleExportSingleStockExcelClick, handleExportPortfolioExcelClick,
  handleExportSingleStockPdfClick, handleExportPortfolioPdfClick,
  page = 'SINGLE_STOCK', currencyCountry, tabValue = '2',
  setPortfolioStatus,
  setSaveProfileDialog, setSaveMode, saveMode, setSaveProfileName,
  setExportFileMode, exportFileMode,
  singleStockProfile, portfolioProfile,
  isSingleStockOptimizedGridShow, isPortfolioOptimizedGridShow,
  isSinglePageReady, isPortfolioPageReady, setMessageDialog, setMessageType
}) => {
  const router = useRouter()
  const { commonStore, authStore } = useStores()
  const [isShareLinkDialogOpen, setShareLinkDialogOpen] = useState(false)
  const CustomMenuitemWithIcon = styled(MenuItem)((props) => ({
    width: '350px',
    height: 64,
    justifyContent: 'space-between',
  }))

  const CustomMenuitem = styled(MenuItem)((props) => ({
    width: '350px',
    height: 64,
    justifyContent: 'center',
  }))

  const widgetMenuItemList = [
    {
      key: 'INSTRUMENT_CHARACTERISTICS',
      label: 'Instrument Characteristics',
      showIn: ['SINGLE_STOCK'],
      withToggleIcon: true,
      onClickAction: () => {
        handleCloseGridClick('INSTRUMENT_CHARACTERISTICS')
      }
    },
    {
      key: 'PORTFOLIO_SUMMARY',
      label: 'Portfolio Summary',
      showIn: ['PORTFOLIO'],
      withToggleIcon: true,
      onClickAction: () => {
        handleCloseGridClick('PORTFOLIO_SUMMARY')
      }
    },
    {
      key: 'PORTFOLIO_BREAKDOWN',
      label: 'Portfolio Breakdown',
      showIn: ['PORTFOLIO'],
      withToggleIcon: true,
      onClickAction: () => {
        handleCloseGridClick('PORTFOLIO_BREAKDOWN')
      }
    },
    {
      key: 'MARKET_CONDITION_INDICATORS',
      label: 'Market Condition Indicators',
      showIn: envConfig.marketConditionEnable ? ['SINGLE_STOCK', 'PORTFOLIO'] : [],
      withToggleIcon: true,
      onClickAction: () => {
        handleCloseGridClick('MARKET_CONDITION_INDICATORS')
      }
    },
    {
      key: 'HISTORICAL_INTRADAY_PROFILES',
      label: 'Historical Intraday Profiles',
      showIn: ['SINGLE_STOCK', 'PORTFOLIO'],
      withToggleIcon: true,
      onClickAction: () => {
        handleCloseGridClick('HISTORICAL_INTRADAY_PROFILES')
      }
    },
    {
      key: 'OPTIMIZED_PARAMETERS',
      label: 'Optimized Parameters',
      showIn: [isSingleStockOptimizedGridShow ? 'SINGLE_STOCK' : '', isPortfolioOptimizedGridShow ? 'PORTFOLIO' : ''],
      withToggleIcon: true,
      onClickAction: () => {
        handleCloseGridClick('OPTIMIZED_PARAMETERS')
      }
    },
    {
      key: 'TRADE_SCHEDULE_ESTIMATE',
      label: 'Trade Schedule Estimate',
      showIn: ['SINGLE_STOCK', 'PORTFOLIO'],
      withToggleIcon: true,
      onClickAction: () => {
        handleCloseGridClick('TRADE_SCHEDULE_ESTIMATE')
      }
    },
  ]

  const actionList = [
    {
      id: 'widget',
      name: 'Widget',
      icon: {
        width: 36
      },
      image: Widget,
      activeImage: WidgetActive,
      showIn: ['SINGLE_STOCK', 'PORTFOLIO'],
      menuItemList: widgetMenuItemList.sort((a, b) => a.label.localeCompare(b.label))
    },
    {
      id: 'disabled-widget',
      name: 'Widget',
      icon: {
        width: 36
      },
      status: 'DISABLED',
      image: Widget,
      activeImage: WidgetActive,
      showIn: ['TRADE_DETAIL'],
      menuItemList: []
    },
    {
      id: 'portfolio',
      name: 'Portfolio',
      icon: {
        width: 30
      },
      image: TradeDetail,
      activeImage: TradeDetailActive,
      showIn: ['TRADE_DETAIL', 'PROFILE_PAGE_TRADE_DETAIL'],
      menuItemList: []
    },
    {
      id: 'tradeDetail',
      name: 'Trade Detail',
      icon: {
        width: 30
      },
      image: TradeDetail,
      activeImage: TradeDetailActive,
      showIn: ['PORTFOLIO', 'PROFILE_PAGE_PORTFOLIO'],
      menuItemList: []
    },
    {
      id: 'shareLink',
      name: 'Share Link',
      icon: {
        width: 32
      },
      image: ShareLink,
      activeImage: ShareLinkActive,
      showIn: [
        // commonStore.singleStockPageData.profilePickerOptionList.length ? 'SINGLE_STOCK' : '',
        // commonStore.portfolioPageData.profilePickerOptionList.length ? 'PORTFOLIO' : '',
        // commonStore.portfolioPageData.profilePickerOptionList.length ? 'TRADE_DETAIL' : ''
        'SINGLE_STOCK',
        'PORTFOLIO',
        'TRADE_DETAIL'
      ],
      menuItemList: [],
    },
    {
      id: 'save',
      name: 'Save',
      icon: {
        width: 36
      },
      image: Save,
      showIn: ['SINGLE_STOCK', 'PORTFOLIO', 'TRADE_DETAIL'],
      activeImage: SaveActive,
      menuItemList:
        [
          {
            key: 'SAVE',
            label: 'Save',
            withToggleIcon: false,
            onClickAction: () => {
              switch (tabValue) {
                case '1':
                  if (singleStockProfile) {
                    setSaveDialogOpened(true)
                    return
                  }
                  setSaveProfileDialog(true)
                  setSaveProfileName('')
                  handleClose()
                  break;
                case '2':
                  if (portfolioProfile) {
                    setSaveDialogOpened(true)
                    return
                  }
                  setSaveProfileDialog(true)
                  setSaveProfileName('')
                  handleClose()
                  break;
              }
            }
          },
          {
            key: 'SAVE_AS',
            label: 'Save as',
            withToggleIcon: false,
            onClickAction: () => {
              setSaveProfileDialog(true)
              setSaveProfileName('')
              handleClose()
            }
          }
        ]
    },
    {
      id: 'currency',
      name: currencyCountry,
      icon: {
        width: 20
      },
      showIn: ['SINGLE_STOCK', 'PORTFOLIO', 'TRADE_DETAIL', 'PROFILE_PAGE_TRADE_DETAIL'],
      image: Currency,
      activeImage: CurrencyActive,
      menuItemList: currencyOptionList && currencyOptionList.map((currencyOption) => {
        return (
          {
            key: currencyOption['value'],
            label: currencyOption['label'],
            withToggleIcon: false,
            onClickAction:
              () => {
                handleCurrencyChange(currencyOption['value'])
                handleClose()
              }
          }
        )
      })
    },
    {
      id: 'export',
      name: 'Export',
      icon: {
        width: 40
      },
      showIn: ['SINGLE_STOCK', 'PORTFOLIO', 'TRADE_DETAIL', 'PROFILE_PAGE_TRADE_DETAIL'],
      image: Export,
      activeImage: ExportActive,
      menuItemList:
        [
          {
            key: 'PDF',
            label: 'PDF',
            withToggleIcon: false,
            onClickAction: () => {
              if (tabValue === '1') {
                handleExportSingleStockPdfClick()
                handleClose()
              } else {
                setExportPdfDialogOpened(true)
              }
            }
          },
          {
            key: 'Excel',
            label: 'Excel',
            withToggleIcon: false,
            onClickAction: () => {
              if (tabValue === '1') {
                handleExportSingleStockExcelClick()
                handleClose()
              } else {
                setExportExcelDialogOpened(true)
              }
            }
          }
        ]
    },
  ]
  const [active, setActive] = useState(null)
  const [anchorEl, setAnchorEl] = useState(Array(actionList.length))
  const [saveDialogOpened, setSaveDialogOpened] = useState(false)
  const [exportPdfDialogOpened, setExportPdfDialogOpened] = useState(false)
  const [exportExcelDialogOpened, setExportExcelDialogOpened] = useState(false)

  const handleActionClick = async (id, event, key) => {
    let newAnchorEl = anchorEl
    newAnchorEl[key] = event.currentTarget
    setAnchorEl([...newAnchorEl])
    switch (id) {
      case 'tradeDetail':
        setPortfolioStatus(TRADE_DETAIL)
        break;
      case 'portfolio':
        setPortfolioStatus(PORTFOLIO)
        break;
      case 'shareLink':
        if (tabValue === '1' && !isSinglePageReady) {
          setMessageType('MISSING_INPUT')
          setMessageDialog(true)
          return
        }
        if (tabValue === '2' && !isPortfolioPageReady) {
          setMessageType('MISSING_INPUT')
          setMessageDialog(true)
          return
        }
        await commonStore.resetShareLinkId()
        setShareLinkDialogOpen(true)
        await commonStore.fetchShareLink(tabValue === '1' ? SINGLE_STOCK : PORTFOLIO)
      default:
        break;
    }
  }

  const handleClose = () => {
    setAnchorEl(Array(actionList.length))
    setActive('')
    setSaveDialogOpened(false)
    setExportPdfDialogOpened(false)
    setExportExcelDialogOpened(false)
  }

  return (
    <div className='action-bar-wrapper'>
      <div className='action-bar'>
        {
          actionList.map((item, key) => {
            return (
              <React.Fragment key={key}>
                {
                  item.showIn.indexOf(page) > -1 &&
                  <div
                    style={{ opacity: item.status === 'DISABLED' ? 0.5 : 1 }}
                    onMouseEnter={() => setActive(item.id)}
                    onMouseLeave={() => {
                      if (anchorEl[key] && item.menuItemList.length > 0) {
                        return
                      }
                      setActive('')
                    }}
                    aria-label="more"
                    aria-controls={Boolean(anchorEl[key]) ? 'long-menu' : undefined}
                    aria-expanded={Boolean(anchorEl[key]) ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={(event) => handleActionClick(item.id, event, key)}
                  >
                    <div className={active === item.id ? 'active' : ' '} >
                      <div style={{ width: item.icon.width }}><Image src={active === item.id ? item.activeImage : item.image} alt={item.name} /></div>
                    </div>
                    <div>{item.name}</div>
                  </div>
                }
                {
                  (item.menuItemList && item.menuItemList.length > 0) &&
                  < Popover
                    sx={{
                      '.MuiPaper-root': {
                        overflow: 'visible',
                      }
                    }}
                    disableScrollLock={false}
                    anchorEl={anchorEl[key]}
                    open={Boolean(anchorEl[key])}
                    onClose={handleClose}
                    TransitionComponent={Fade}
                    transformOrigin={{ horizontal: 'center', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
                  >
                    {
                      (item.id === 'widget' || item.id === 'save' || item.id === 'currency' || item.id === 'export') &&
                      item.menuItemList.map((menuItem, itemKey) => {
                        if (menuItem.showIn && menuItem.showIn.indexOf(page) === -1) {
                          return
                        }
                        return (
                          <div key={itemKey}>
                            {
                              menuItem.withToggleIcon ?
                                <CustomMenuitemWithIcon
                                  onClick={menuItem.onClickAction}
                                >
                                  {menuItem.label}
                                  <Observer>
                                    {
                                      () =>
                                        <>
                                          {
                                            tabValue === '1' &&
                                            <>
                                              {
                                                sinlgeStockViewVisble[menuItem.key] ?
                                                  <ToggleOnIcon color="primary" fontSize="large" />
                                                  : <ToggleOffIcon color="disabled" fontSize="large" />
                                              }
                                            </>
                                          }
                                          {
                                            tabValue === '2' &&
                                            <>
                                              {
                                                portfolioViewVisble[menuItem.key] ?
                                                  <ToggleOnIcon color="primary" fontSize="large" />
                                                  : <ToggleOffIcon color="disabled" fontSize="large" />
                                              }
                                            </>
                                          }
                                        </>
                                    }
                                  </Observer>

                                </CustomMenuitemWithIcon>
                                :
                                <CustomMenuitem
                                  onClick={menuItem.onClickAction}
                                >
                                  {menuItem.label}
                                </CustomMenuitem>
                            }
                          </div>
                        )
                      }
                      )
                    }
                    {
                      item.id === 'shareLink' &&
                      item.menuItemList.map((menuItem, itemKey) => {
                        if (menuItem.showIn && menuItem.showIn.indexOf(page) === -1) {
                          return
                        }
                        return (
                          <div key={itemKey}>
                            {
                              menuItem.withToggleIcon && tabValue === '1' &&
                              <Observer>
                                {
                                  () =>
                                    <CustomMenuitemWithIcon disableRipple>
                                      <div style={{ width: '400px' }}>
                                        {menuItem.label + `: ${commonStore.singleStockPageData.profilePermission === 'PUBLIC' ? 'Public' : 'Private'}`}
                                      </div>
                                      {
                                        commonStore.singleStockPageData.profilePermission === 'PUBLIC' &&
                                        <div style={{ width: '60px' }} >
                                          <Tooltip title={`${envConfig.profileHost}/share-link/${authStore.userId}/${commonStore.singleStockPageData.profileData.name}`}>
                                            <ContentCopyIcon
                                              onClick={() => { copyToClipboard(`${envConfig.profileHost}/share-link/${authStore.userId}/${commonStore.singleStockPageData.profileData.name}`) }}
                                            />
                                          </Tooltip>
                                        </div>
                                      }
                                      {
                                        <div>
                                          {
                                            commonStore.singleStockPageData.profilePermission === 'PUBLIC' ?
                                              <ToggleOnIcon color="primary" fontSize="large" onClick={() => menuItem.onClickAction({ tabValue, status: 'PRIVATE' })} />
                                              : <ToggleOffIcon color="disabled" fontSize="large" onClick={() => menuItem.onClickAction({ tabValue, status: 'PUBLIC' })} />
                                          }
                                        </div>

                                      }
                                    </CustomMenuitemWithIcon>
                                }
                              </Observer>
                            }
                            {
                              menuItem.withToggleIcon && tabValue === '2' &&
                              <Observer>
                                {
                                  () =>
                                    <CustomMenuitemWithIcon disableRipple>
                                      <div style={{ width: '400px' }}>
                                        {menuItem.label + `: ${commonStore.portfolioPageData.profilePermission === 'PUBLIC' ? 'Public' : 'Private'}`}
                                      </div>
                                      {
                                        commonStore.portfolioPageData.profilePermission === 'PUBLIC' &&
                                        <div style={{ width: '60px' }}>
                                          <Tooltip title={`${envConfig.profileHost}/share-link/${authStore.userId}/${commonStore.portfolioPageData.profileData.name}`}>
                                            <ContentCopyIcon
                                              onClick={() => { copyToClipboard(`${envConfig.profileHost}/share-link/${authStore.userId}/${commonStore.portfolioPageData.profileData.name}`) }}
                                            />
                                          </Tooltip>
                                        </div>
                                      }
                                      {
                                        <div>
                                          {
                                            commonStore.portfolioPageData.profilePermission === 'PUBLIC' ?
                                              <ToggleOnIcon color="primary" fontSize="large" onClick={() => menuItem.onClickAction({ tabValue, status: 'PRIVATE' })} />
                                              : <ToggleOffIcon color="disabled" fontSize="large" onClick={() => menuItem.onClickAction({ tabValue, status: 'PUBLIC' })} />
                                          }
                                        </div>
                                      }
                                    </CustomMenuitemWithIcon>
                                }
                              </Observer>
                            }
                          </div>
                        )
                      })
                    }
                    {
                      item.id === 'save' && saveDialogOpened &&
                      tabValue === '1' &&
                      <SaveLayoutDialog
                        saveLayoutOptionList={saveLayoutOptionList}
                        setSaveDialogOpened={setSaveDialogOpened}
                        saveLayout={handleSaveSingleStockClick}
                        handleClose={handleClose}
                        saveMode={saveMode}
                        setSaveMode={setSaveMode}
                      />
                    }
                    {
                      item.id === 'save' && saveDialogOpened &&
                      tabValue === '2' &&
                      <SaveLayoutDialog
                        saveLayoutOptionList={saveLayoutOptionList}
                        setSaveDialogOpened={setSaveDialogOpened}
                        saveLayout={handleSavePortfolioClick}
                        handleClose={handleClose}
                        saveMode={saveMode}
                        setSaveMode={setSaveMode}
                      />
                    }
                    {
                      item.id === 'export'
                      && exportPdfDialogOpened
                      && tabValue === '2' &&
                      <ExportPortfolioFileDialog
                        saveLayoutOptionList={[
                          { label: 'Portfolio', value: PORTFOLIO },
                          { label: 'Trade Detail', value: TRADE_DETAIL },
                          { label: 'Portfolio and Trade Detail', value: ALL_PORTFOLIO },
                        ]}
                        setSaveDialogOpened={setExportPdfDialogOpened}
                        saveLayout={handleExportPortfolioPdfClick}
                        handleClose={handleClose}
                        saveMode={exportFileMode}
                        setSaveMode={setExportFileMode}
                      />
                    }
                    {
                      item.id === 'export'
                      && exportExcelDialogOpened
                      && tabValue === '2' &&
                      <ExportPortfolioFileDialog
                        saveLayoutOptionList={[
                          { label: 'Portfolio', value: PORTFOLIO },
                          { label: 'Trade Detail', value: TRADE_DETAIL },
                          { label: 'Portfolio and Trade Detail', value: ALL_PORTFOLIO },
                        ]}
                        setSaveDialogOpened={setExportExcelDialogOpened}
                        saveLayout={handleExportPortfolioExcelClick}
                        handleClose={handleClose}
                        saveMode={exportFileMode}
                        setSaveMode={setExportFileMode}
                      />
                    }
                  </Popover>
                }
              </React.Fragment>
            )
          })
        }
      </div>
      <Observer>
        {
          () =>
            <ShareLinkDialog
              setMessageDialog={setShareLinkDialogOpen}
              isMessageDialogOpened={isShareLinkDialogOpen}
              message={commonStore.sharedLinkId ? `${envConfig.profileHost}/share-link/${commonStore.sharedLinkId}` : 'Loading...'}
              isloading={commonStore.sharedLinkId ? false : true}
            />
        }
      </Observer>

    </div >
  );
};
export default ResponsiveAppBar;
