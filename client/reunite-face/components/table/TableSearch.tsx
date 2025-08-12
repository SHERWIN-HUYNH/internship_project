import React, { useState } from 'react'

type TableSearchProps = {
  onSearch: (searchTerm: string) => void
}

const TableSearch: React.FC<TableSearchProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  return (
    <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search..."
        className="p-2 border rounded-xl border-primary"
      />
      <button type="submit" className="btn-primary">
        Search
      </button>
    </form>
  )
}

export default TableSearch
