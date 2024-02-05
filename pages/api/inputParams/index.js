// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import additionalParamsData from '@data/additionalParams.json'

export default function handler(req, res) {
  res.status(200).json(additionalParamsData)
}
