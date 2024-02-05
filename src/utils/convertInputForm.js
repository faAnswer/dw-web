const moment = require('moment')

export class ConvertInputForm {

  loggingObject = {}

  constructor (inputFieldForm) {

    this.loggingObject['inputField'] = {

      symbol: inputFieldForm.stock,
      quantity: inputFieldForm.quantity

    }
  }

  setOptimizedInputParamsForm(optimizedInputParamsForm){

    if(optimizedInputParamsForm.orderType === 'MARKET'){

      optimizedInputParamsForm.price = undefined
    }

    if(optimizedInputParamsForm && optimizedInputParamsForm.orderType !== undefined && optimizedInputParamsForm.orderType !== ''){

      Object.entries(optimizedInputParamsForm).forEach(ele => {

        if(!this.loggingObject['optimizedInputParams']){

          this.loggingObject['optimizedInputParams'] = {}

        }

        this.loggingObject['optimizedInputParams'][ele[0]] = ele[1]

      })
    }
  }

  setClientConfigSettingsForm(clientConfigSettingsForm){

    if(clientConfigSettingsForm && clientConfigSettingsForm.CustomerId !== undefined && clientConfigSettingsForm.CustomerId !== ''){

      Object.entries(clientConfigSettingsForm).forEach(ele => {

        if(!this.loggingObject['clientConfigSettings']){

          this.loggingObject['clientConfigSettings'] = {}

        }

        this.loggingObject['clientConfigSettings'][ele[0]] = ele[1]
      })
    }
  }

  setAdditionalParamsForm(additionalParamsForm){

    if(additionalParamsForm){

      Object.entries(additionalParamsForm).forEach(ele => {

        if(!this.loggingObject['additionalParams']){

          this.loggingObject['additionalParams'] = {}

        }

        if(ele[0] === 'ExpireTime' || ele[0] === 'EffectiveTime'){

          this.loggingObject['additionalParams'][ele[0]] = moment(ele[1]).format('HH:mm:ss')

        } else {

          this.loggingObject['additionalParams'][ele[0]] = ele[1]

        }
      })
    }
  }

  getLogger(){

    return JSON.stringify(this.loggingObject)
  }
}
