// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import spreadCurveDataList from '@data/spreadCurve.json'

export default function handler (req, res) {
  const stockIdList = req.body
  const spreadCurveData = stockIdList.length === 1 ? [spreadCurveDataList[0]] : spreadCurveDataList
  res.status(200).json(spreadCurveData)
}
