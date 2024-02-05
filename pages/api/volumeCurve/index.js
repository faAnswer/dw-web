// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import volumeCurveDataList from '@data/volumeCurve.json'

export default function handler (req, res) {
  const stockIdList = req.body
  const volumeCurveData = stockIdList.length === 1 ? [volumeCurveDataList[3]] : volumeCurveDataList
  res.status(200).json(volumeCurveData)
}
