// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import tradeScheduleDataList from '@data/tradeSchedule.json'

export default function handler (req, res) {
  const stockIdList = req.body
  const tradeScheduleData = stockIdList.length === 1 ? [tradeScheduleDataList[0]] : tradeScheduleDataList
  res.status(200).json(tradeScheduleData)
}
