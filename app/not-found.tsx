import ErrorPageShell from "@/app/_components/error-page-shell"

export default function NotFound() {
  return (
    <ErrorPageShell
      code="404"
      title="Page not found"
      description="The page you are looking for doesn't exist or may have been moved. Check the URL or return to the homepage."
    />
  )
}
