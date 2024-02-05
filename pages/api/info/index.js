// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import infoDataList from '@data/info.json'

export default function handler (req, res) {
  const stockIdList = req.body
  const infoData = stockIdList.length === 1 ? [infoDataList[0]] : infoDataList
  res.status(200).json(infoData)
}
