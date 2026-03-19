"use server"

import { ApiResponse, PaginatedResponse } from "@/types/api"
import { SummaryData, Department, Province, Alert } from "@/types/metrics"
import { AlertDetail } from "@/types/alerts"
import { Filter } from "@/schemas/filterSchema"
import { ReportData } from "@/types/report"

export async function getSummaryData(): Promise<SummaryData> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  try {
    const response = await fetch(`${apiUrl}/getSummary`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: { 'spring.cloud.function.definition': 'getSummary' }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch summary data: ${response.statusText}`)
    }

    const result: ApiResponse<SummaryData> = await response.json()
    return result.data
  } catch (error) {
    console.error("Error fetching summary data:", error)
    // Fallback data if API is down
    return {
      lastUpdate: new Date().toISOString(),
      totalAlerts: 0,
      totalCritical: 0,
      totalDepts: 0
    }
  }
}

export async function getDepartments(): Promise<Department[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  try {
    const response = await fetch(`${apiUrl}/getDepartments`, {
      cache: 'force-cache', // Cache indefinitely (or until manual revalidation)
      headers: { 'spring.cloud.function.definition': 'getDepartments' }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch departments: ${response.statusText}`)
    }

    const result: ApiResponse<Department[]> = await response.json()

    return result.data
  } catch (error) {
    console.error("Error fetching departments:", error)
    return []
  }
}

export async function getProvinces(departmentId: string): Promise<Province[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  try {
    const response = await fetch(`${apiUrl}/getProvinces/${departmentId}`, {
      method: 'POST',
      cache: 'force-cache',
      headers: { 'spring.cloud.function.definition': 'getProvinces', 'Content-Type': 'text/plain' },
      body: departmentId
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch provinces: ${response.statusText}`)
    }

    const result: ApiResponse<Province[]> = await response.json()
    return result.data
  } catch (error) {
    console.error("Error fetching provinces:", error)
    return []
  }
}

export async function getAlerts(
  filters: Partial<Filter>,
  page: number = 0,
  size: number = 6
): Promise<PaginatedResponse<Alert>> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  const params = new URLSearchParams()
  params.append('page', page.toString())
  params.append('size', size.toString())

  if (filters.risk) params.append('risk', filters.risk)
  if (filters.event) params.append('event', filters.event)
  if (filters.department) params.append('department', filters.department)
  if (filters.province) params.append('province', filters.province)

  if (filters.range?.start) {
    params.append('start', filters.range.start.toISOString().split('T')[0])
  }
  if (filters.range?.end) {
    params.append('end', filters.range.end.toISOString().split('T')[0])
  }

  try {
    const response = await fetch(`${apiUrl}/searchAlerts?${params.toString()}`, {
      method: 'GET',
      headers: { 'spring.cloud.function.definition': 'searchAlerts' }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch alerts: ${response.statusText}`)
    }

    const result: PaginatedResponse<Alert> = await response.json()
    return result
  } catch (error) {
    console.error("Error fetching alerts:", error)
    return {
      success: false,
      message: "Error fetching alerts",
      data: [],
      meta: {
        totalElements: 0,
        totalItems: 0,
        totalPages: 0,
        page: 0,
        size: 6,
        hasNextPage: false,
        hasPrevPage: false
      },
      timestamp: new Date().toISOString()
    }
  }
}

export async function findAlertById(id: string): Promise<AlertDetail | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  try {
    const response = await fetch(`${apiUrl}/findAlertById/${id}`, {
      method: 'POST',
      headers: { 'spring.cloud.function.definition': 'findAlertById', 'Content-Type': 'text/plain' },
      body: id
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch alert detail: ${response.statusText}`)
    }

    const result: ApiResponse<AlertDetail> = await response.json()
    return result.data
  } catch (error) {
    console.error(`Error fetching alert detail for ID ${id}:`, error)
    return null
  }
}

export async function getReportAction(filters: Partial<Filter>): Promise<ReportData | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  const params = new URLSearchParams()

  if (filters.department) params.append('department', filters.department)

  if (filters.range?.start) {
    params.append('start', filters.range.start.toISOString().split('T')[0])
  }
  if (filters.range?.end) {
    params.append('end', filters.range.end.toISOString().split('T')[0])
  }

  try {
    const response = await fetch(`${apiUrl}/getReport?${params.toString()}`, {
      method: 'GET',
      headers: { 'spring.cloud.function.definition': 'getReport' }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch report: ${response.statusText}`)
    }

    const result: ApiResponse<ReportData> = await response.json()
    return result.data
  } catch (error) {
    console.error("Error fetching report:", error)
    return null
  }
}

