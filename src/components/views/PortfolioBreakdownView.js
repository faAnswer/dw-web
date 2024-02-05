import React, { useState, useEffect, memo, useRef } from 'react'
import CustomPicker from '@src/components/inputs/CustomPicker'
import { groupOptionList, groupDefaultValue } from '@src/configs/portfolioBreakdown'
import dynamic from 'next/dynamic'
import useStores from '@src/utils/hooks/useStores'
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false })
import { breakdownCurveTitleMapping } from '@src/configs/portfolioBreakdown'
import { Observer } from 'mobx-react'

const ResponsiveAppBar = ({ info, params = {} }) => {
  const [group, setGroup] = useState(params.group ? params.group : groupDefaultValue)
  const { commonStore } = useStores()

  useEffect(() => {
    commonStore.setPorfolioBreakdownGroup(group)
    commonStore.setPortfolioBreakdownGridParams({ group })
  }, [group])

  const chartData2 = {
    series: Object.values(info[group]),
    options: {
      colors: ['#d8a500', '#BDCCD4', '#19706E', '#C7B299', '#99414C', '#999999', '#194174'],
      chart: {
        width: commonStore.portfolioBreakdownPieChatSize,
        type: 'pie',
      },
      states: {
        hover: {
          filter: {
            type: 'none',
          }
        },
        active: {
          filter: {
            type: 'none',
          }
        },
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: (value) => {
            return `${(value * 100).toPrecision(3)}%`
          },
        },
      },
      labels: Object.keys(info[group]),
      yaxis: {
        labels: {
          formatter: (value) => {
            return value.toPrecision(2)
          },
        }
      },
      legend: {
        position: 'bottom',
        markers: {
          width: 100,
          height: 20,
          radius: 0,
          offsetX: 0,
          offsetY: 0
        },
        itemMargin: {
          // horizontal: 5,
        },
      }
    },
  }
  return (
    <>
      <div className='portfolio-breakdown'>
        <div className='selector-container'>
          <CustomPicker
            optionList={groupOptionList}
            setFieldValue={setGroup}
            value={group}
          />
        </div>
        <Observer>
          {
            () => (
              <div className='grid-chart'>
                <div className='chart-title'>{`Value Traded by ${breakdownCurveTitleMapping[group]}`}</div>
                <ApexCharts
                  options={chartData2.options}
                  series={chartData2.series}
                  type='pie'
                  height={commonStore.portfolioBreakdownPieChatSize}
                />
              </div>
            )
          }
        </Observer>
      </div>
    </>
  )
}
export default memo(ResponsiveAppBar)

