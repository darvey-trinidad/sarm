import { FacilityIssueReportEmail } from '@/emails/facility-issue-report'
import React from 'react'

const page = () => {
  return (
    <div>
      <FacilityIssueReportEmail description="Broken Ceiling fan" dateReported={new Date()} />
    </div>
  )
}

export default page