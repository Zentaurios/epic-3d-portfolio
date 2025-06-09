import { Metadata } from 'next'
import BrainSystemDemo from '@/components/3d/BrainSystemDemo'

export const metadata: Metadata = {
  title: 'Layered Brain System Demo | Webb3Fitty',
  description: 'Interactive demonstration of the anatomical 3D brain system with z-index layering',
}

export default function BrainDemoPage() {
  return <BrainSystemDemo />
}
