import Link from 'next/link'
interface BreadcrumbProps {
  pageName: string[][]
}
const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  return (
    <div className="mb-6 mt-3 mx-3 text-xl flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-primary dark:text-white">
        {pageName[pageName.length - 1][0]}
      </h2>
    </div>
  )
}

export default Breadcrumb
