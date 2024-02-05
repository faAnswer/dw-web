export class ExcelDataComparer{

  constructor (uploadedExcelDataList) {

    const current = uploadedExcelDataList.find(ele => {

      return ele.isActive

    })

    if(current){

      this.uploadedExcelData = current.params[0]
      this.excelFileName = current.excel_filename

    } else {

      this.uploadedExcelData = null
      this.excelFileName = null
    }
  }

  compareInputField(inputFieldForm){


    if(!this.uploadedExcelData){

      return false
    }

    if(inputFieldForm.stock !== this.uploadedExcelData['Symbol']){

      return false
    }

    if(inputFieldForm.quantity !== this.uploadedExcelData['OrderQty']){

      return false
    }


    return true
  }

  compareClientConfigSettings(clientConfigSettingsForm){

    if(!this.uploadedExcelData){

      return false
    }

    if(clientConfigSettingsForm['Text'] !== this.uploadedExcelData['Text']){

      return false
    }

    if(clientConfigSettingsForm['SpectrumUrgency'] !== this.uploadedExcelData['SpectrumUrgency']){

      return false
    }

    if(clientConfigSettingsForm['CustomerId'] !== this.uploadedExcelData['CustomerId']){

      return false
    }

    return true
  }

  compareOptimizedInputParams(optimizedInputParams){

    if(!this.uploadedExcelData){

      return false
    }

    if(optimizedInputParams['side'] !== this.uploadedExcelData['Side']){

      return false
    }

    if(optimizedInputParams['orderType'] !== this.uploadedExcelData['OrdType']){

      return false
    }

    if(optimizedInputParams['strategy'] !== this.uploadedExcelData['Strategy']){

      return false
    }

    if(optimizedInputParams['price'] !== this.uploadedExcelData['Price']){

      return false
    }

    return true
  }

  compareAdditionalParams(additionalParamsForm){

    if(!this.uploadedExcelData){

      return false
    }

    let result = true

    Object.entries(additionalParamsForm).forEach(ele => {

      if(!this.uploadedExcelData[ele[0]] || this.uploadedExcelData[ele[0]] !== ele[1]){

        result = false
      }
    })

    return result
  }

}
