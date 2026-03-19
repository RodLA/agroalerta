"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert } from "@/lib/mock-data"

const PeruMap = dynamic(() => import("./PeruMap"), {
  ssr: false,
  loading: () => <Skeleton className="h-[500px] w-full rounded-xl" />
})

const MiniMap = dynamic(() => import("./PeruMap"), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px] w-full rounded-xl" />
})

export function DynamicMap({ alerts }: { alerts: Alert[] }) {
  return <PeruMap alerts={alerts} />
}

export function DynamicMiniMap({ alerts }: { alerts: Alert[] }) {
  return <MiniMap alerts={alerts} />
}
