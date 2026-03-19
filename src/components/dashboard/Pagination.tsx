import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { useSearchStore } from "@/store/useSearchStore"

export function Pagination() {
  const { currentPage, pagination, setPage } = useSearchStore()
  const { totalPages, hasNextPage, hasPrevPage } = pagination

  if (totalPages <= 1) return null

  // Helper to generate page numbers
  const getPageNumbers = () => {
    const pages = []
    const showMax = 5
    
    if (totalPages <= showMax) {
      for (let i = 0; i < totalPages; i++) pages.push(i)
    } else {
      pages.push(0)
      if (currentPage > 2) pages.push('ellipsis')
      
      const start = Math.max(1, currentPage - 1)
      const end = Math.min(totalPages - 2, currentPage + 1)
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i)
      }
      
      if (currentPage < totalPages - 3) pages.push('ellipsis')
      if (!pages.includes(totalPages - 1)) pages.push(totalPages - 1)
    }
    return pages
  }

  return (
    <div className="flex items-center justify-center space-x-2 py-8">
      <Button 
        variant="outline" 
        size="icon" 
        className="h-8 w-8"
        onClick={() => setPage(currentPage - 1)}
        disabled={!hasPrevPage}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Anterior</span>
      </Button>

      <div className="flex items-center space-x-1">
        {getPageNumbers().map((page, i) => (
          page === 'ellipsis' ? (
            <div key={`ellipsis-${i}`} className="flex h-8 w-8 items-center justify-center">
              <MoreHorizontal className="h-4 w-4" />
            </div>
          ) : (
            <Button
              key={`page-${page}`}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setPage(page as number)}
            >
              {(page as number) + 1}
            </Button>
          )
        ))}
      </div>

      <Button 
        variant="outline" 
        size="icon" 
        className="h-8 w-8"
        onClick={() => setPage(currentPage + 1)}
        disabled={!hasNextPage}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Siguiente</span>
      </Button>
    </div>
  )
}
