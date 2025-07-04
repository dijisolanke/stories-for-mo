// app/admin/page.tsx
'use client'

import config from '../../../sanity/sanity.config'
import { NextStudio } from 'next-sanity/studio'

export default function AdminPage() {
  // @ts-ignore 
  return <NextStudio config={config} />
}
