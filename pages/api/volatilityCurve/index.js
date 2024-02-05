// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import volatilityCurveDataList from '@data/volatilityCurve.json'

export default function handler (req, res) {
  const stockIdList = req.body
  const volumeCurveData = stockIdList.length === 1 ? [volatilityCurveDataList[0]] : volatilityCurveDataList
  res.status(200).json(volumeCurveData)
}