// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import spreadCurveData from '@data/spreadCurve.json'
import volatilityCurve from '@data/volatilityCurve.json'
import volumeCurve from '@data/volumeCurve.json'

export default function handler (req, res) {
  const { curve } = req.query

  let response = {}
  switch (curve) {
    case 'VOLUME':
      response = {
        "data": volumeCurve['data'],
        "times": volumeCurve["times"]
      }
      break;
    case 'SPREAD':
      response = {
        "data": spreadCurveData['AVERAGE_SPREAD_60']['data'],
        "times": spreadCurveData['AVERAGE_SPREAD_60']['times']
      }
      break;
    case 'VOLATILITY':
      response = {
        "data": volatilityCurve['AVERAGE_VOLATILITY_60']['data'],
        "times": volatilityCurve['AVERAGE_VOLATILITY_60']['times']
      }
      break;
    default:
      break;
  }
  res.status(200).json(response)
  // res.status(200).json({
  //   "data": [
  //     {
  //       "filteredMean": 0.024847755710539144
  //     },
  //     {
  //       "filteredMean": 0.012764164339075647
  //     },
  //     {
  //       "filteredMean": 0.021852129033349453
  //     },
  //     {
  //       "filteredMean": 0.011181137062786197
  //     },
  //     {
  //       "filteredMean": 0.009621551651267424
  //     },
  //     {
  //       "filteredMean": 0.04250369585723553
  //     },
  //     {
  //       "filteredMean": 0.038396122731203824
  //     },
  //     {
  //       "filteredMean": 0.03433873103235959
  //     },
  //     {
  //       "filteredMean": 0.021506352597007505
  //     },
  //     {
  //       "filteredMean": 0.021740641046035725
  //     },
  //     {
  //       "filteredMean": 0.021239862411207643
  //     },
  //     {
  //       "filteredMean": 0.02222963429646341
  //     },
  //     {
  //       "filteredMean": 0.018758063381229734
  //     },
  //     {
  //       "filteredMean": 0.020181978712041866
  //     },
  //     {
  //       "filteredMean": 0.020082159775685317
  //     },
  //     {
  //       "filteredMean": 0.020201279546392094
  //     },
  //     {
  //       "filteredMean": 0.015440085353982266
  //     },
  //     {
  //       "filteredMean": 0.015719536673090742
  //     },
  //     {
  //       "filteredMean": 0.0029006857881649696
  //     },
  //     {
  //       "filteredMean": 0.002523529456706252
  //     },
  //     {
  //       "filteredMean": 0.00298783537286226
  //     },
  //     {
  //       "filteredMean": 0.0023800288231666626
  //     },
  //     {
  //       "filteredMean": 0.0020602664892880023
  //     },
  //     {
  //       "filteredMean": 0.009225967585532933
  //     },
  //     {
  //       "filteredMean": 0.004735639188559423
  //     },
  //     {
  //       "filteredMean": 0.003580716281597193
  //     },
  //     {
  //       "filteredMean": 0.005999289174541985
  //     },
  //     {
  //       "filteredMean": 0.0039417730092436536
  //     },
  //     {
  //       "filteredMean": 0.01982607321114646
  //     },
  //     {
  //       "filteredMean": 0.01705471399237734
  //     },
  //     {
  //       "filteredMean": 0.01674230404000501
  //     },
  //     {
  //       "filteredMean": 0.01986096036859199
  //     },
  //     {
  //       "filteredMean": 0.02104345169734165
  //     },
  //     {
  //       "filteredMean": 0.019445013141094113
  //     },
  //     {
  //       "filteredMean": 0.016853225861894975
  //     },
  //     {
  //       "filteredMean": 0.0170611587275101
  //     },
  //     {
  //       "filteredMean": 0.01716342953141843
  //     },
  //     {
  //       "filteredMean": 0.020882449236101275
  //     },
  //     {
  //       "filteredMean": 0.023762010489715983
  //     },
  //     {
  //       "filteredMean": 0.049785449110797526
  //     },
  //     {
  //       "filteredMean": 0.041751215515591855
  //     },
  //     {
  //       "filteredMean": 0.04626437538055465
  //     },
  //     {
  //       "filteredMean": 0.03745832167718917
  //     },
  //     {
  //       "filteredMean": 0.043101920902971574
  //     },
  //     {
  //       "filteredMean": 0.01241106756099559
  //     },
  //     {
  //       "filteredMean": 0.010158392956917407
  //     },
  //     {
  //       "filteredMean": 0.009706543091157233
  //     },
  //     {
  //       "filteredMean": 0.012049798847783063
  //     },
  //     {
  //       "filteredMean": 0.012617435296838696
  //     }
  //   ],
  //   "times": [
  //     "Tue, 21 Jun 2022 01:32:00 GMT",
  //     "Tue, 21 Jun 2022 01:34:00 GMT",
  //     "Tue, 21 Jun 2022 01:36:00 GMT",
  //     "Tue, 21 Jun 2022 01:38:00 GMT",
  //     "Tue, 21 Jun 2022 01:40:00 GMT",
  //     "Tue, 21 Jun 2022 01:50:00 GMT",
  //     "Tue, 21 Jun 2022 02:00:00 GMT",
  //     "Tue, 21 Jun 2022 02:10:00 GMT",
  //     "Tue, 21 Jun 2022 02:20:00 GMT",
  //     "Tue, 21 Jun 2022 02:30:00 GMT",
  //     "Tue, 21 Jun 2022 02:40:00 GMT",
  //     "Tue, 21 Jun 2022 02:50:00 GMT",
  //     "Tue, 21 Jun 2022 03:00:00 GMT",
  //     "Tue, 21 Jun 2022 03:10:00 GMT",
  //     "Tue, 21 Jun 2022 03:20:00 GMT",
  //     "Tue, 21 Jun 2022 03:30:00 GMT",
  //     "Tue, 21 Jun 2022 03:40:00 GMT",
  //     "Tue, 21 Jun 2022 03:50:00 GMT",
  //     "Tue, 21 Jun 2022 03:52:00 GMT",
  //     "Tue, 21 Jun 2022 03:54:00 GMT",
  //     "Tue, 21 Jun 2022 03:56:00 GMT",
  //     "Tue, 21 Jun 2022 03:58:00 GMT",
  //     "Tue, 21 Jun 2022 04:00:00 GMT",
  //     "Tue, 21 Jun 2022 05:02:00 GMT",
  //     "Tue, 21 Jun 2022 05:04:00 GMT",
  //     "Tue, 21 Jun 2022 05:06:00 GMT",
  //     "Tue, 21 Jun 2022 05:08:00 GMT",
  //     "Tue, 21 Jun 2022 05:10:00 GMT",
  //     "Tue, 21 Jun 2022 05:20:00 GMT",
  //     "Tue, 21 Jun 2022 05:30:00 GMT",
  //     "Tue, 21 Jun 2022 05:40:00 GMT",
  //     "Tue, 21 Jun 2022 05:50:00 GMT",
  //     "Tue, 21 Jun 2022 06:00:00 GMT",
  //     "Tue, 21 Jun 2022 06:10:00 GMT",
  //     "Tue, 21 Jun 2022 06:20:00 GMT",
  //     "Tue, 21 Jun 2022 06:30:00 GMT",
  //     "Tue, 21 Jun 2022 06:40:00 GMT",
  //     "Tue, 21 Jun 2022 06:50:00 GMT",
  //     "Tue, 21 Jun 2022 07:00:00 GMT",
  //     "Tue, 21 Jun 2022 07:10:00 GMT",
  //     "Tue, 21 Jun 2022 07:20:00 GMT",
  //     "Tue, 21 Jun 2022 07:30:00 GMT",
  //     "Tue, 21 Jun 2022 07:40:00 GMT",
  //     "Tue, 21 Jun 2022 07:50:00 GMT",
  //     "Tue, 21 Jun 2022 07:52:00 GMT",
  //     "Tue, 21 Jun 2022 07:54:00 GMT",
  //     "Tue, 21 Jun 2022 07:56:00 GMT",
  //     "Tue, 21 Jun 2022 07:58:00 GMT",
  //     "Tue, 21 Jun 2022 08:00:00 GMT"
  //   ]
  // })
}
