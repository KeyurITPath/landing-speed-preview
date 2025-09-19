import React from 'react'
import CommonLandingUIOneAndTwo from '../common-landing-UI'

const Landing1 = ({ vimeoSource, landingData }: any) => {
  return (
    <CommonLandingUIOneAndTwo {...{ vimeoSource }} {...{ landingData }} />
  )
}

export default Landing1
