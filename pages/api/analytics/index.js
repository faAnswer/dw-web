// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import analyticsDataList from '@data/analytics.json'

export default function handler (req, res) {
  const stockIdList = req.body
  const analyticsData = stockIdList.length === 1 ? [analyticsDataList[3]] : analyticsDataList
  res.status(200).json(analyticsData)
}
