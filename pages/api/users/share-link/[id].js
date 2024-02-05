// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import shareLinkData from '@data/share-link.json'

export default function handler (req, res) {
  const { id } = req.query
  res.status(200).json(
    {
      "code": "OK",
      "status": 200,
      "message": "success",
      "data": shareLinkData,
      "meta": {}
    })
}