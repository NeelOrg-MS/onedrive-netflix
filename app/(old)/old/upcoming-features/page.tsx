const Page = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center mt-20">
      <h1 className="text-xl font-bold">Upcoming Features✨️</h1>
      <ul className="flex flex-col mt-4 space-y-4 list-disc">
        <li className="font-medium">
          Netflix like UI with better cards <br />
          and plot summaryy and all of that...
        </li>
        <li className="font-medium">Better Video Player</li>
      </ul>
      <div className="mt-8 font-bold">Coming Jan 22, 2024. Stay Tuned!</div>
    </div>
  )
}

export default Page
