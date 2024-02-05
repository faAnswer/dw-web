// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import optimizedParamsData from '@data/optimizedParams.json'
import optimizedParamsDataMockA from '@data/optimizedParamsMockA.json'

export default async function handler (req, res) {
  const stockIdList = req.body
  // const { stock, quantity, side, order } = req.query
  await new Promise(resolve => setTimeout(resolve, 3000));
  if(stockIdList[0]['Symbol'] === 'MockA'){
    let response = optimizedParamsDataMockA
    res.status(200).json(response)
  } else {
    let response = optimizedParamsData
    res.status(200).json(response)
  }
}
