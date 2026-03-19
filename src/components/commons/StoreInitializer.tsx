"use client"

import { useRef } from "react"
import { useSearchStore } from "@/store/useSearchStore"
import { Department } from "@/types/metrics"

interface StoreInitializerProps {
  departments: Department[]
}

export default function StoreInitializer({ departments }: StoreInitializerProps) {
  const initialized = useRef(false)
  if (!initialized.current) {
    useSearchStore.getState().setDepartments(departments)
    initialized.current = true
  }
  return null
}
