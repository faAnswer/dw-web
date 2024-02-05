// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import marketCondition from '@data/marketCondition.json'

export default function handler (req, res) {
  // const stockIdList = req.body
  // const { stock, quantity, side, order } = req.query
  let response = marketCondition
  res.status(200).json(response)
}
