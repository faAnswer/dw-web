// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import ccyRateData from '@data/ccyRate.json'

export default function handler (req, res) {
  res.status(200).json(ccyRateData)
}
