"use client"

export default function Page() {
  return (
    <>
      <div className="@container/main flex flex-1 flex-col gap-2 px-4">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex flex-col gap-4">
            <p className="text-2xl font-semibold">Posts</p>
            <p className="text-muted-foreground">Posts are the content you post on your social accounts.</p>
          </div>
        </div>
      </div>
    </>
  )
}
