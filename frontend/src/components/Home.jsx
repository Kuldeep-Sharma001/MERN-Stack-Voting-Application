export default function Home() {
  return (
    <div className="bg-slate-500 flex h-[calc(100vh-4rem)]">
      <h1 className="text-orange-400 font-bold text-6xl lg:text-8xl text-center mx-auto lg:w-[50vw] py-10 max-w-[600px]">
        Your One Vote Can Change The Nation's Destiny
      </h1>
      <img
        src="/vote4.avif"
        alt="Voting illustration"
        className="h-[95%] w-[50vw] hidden lg:block"
      />
    </div>
  );
}
