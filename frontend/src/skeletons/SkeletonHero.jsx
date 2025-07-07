const SkeletonHero = () => (
  <div className="relative w-full h-[50vh] md:h-[72vh] bg-gray-200 animate-pulse flex flex-col items-center justify-center">
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
    <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 mt-32 md:mt-64 w-full">
      <div className="h-10 md:h-16 w-2/3 md:w-1/3 bg-gray-300 rounded mb-4 mx-auto"></div>
      <div className="h-6 md:h-8 w-1/2 md:w-1/4 bg-gray-300 rounded mb-6 mx-auto"></div>
      <div className="h-12 w-full max-w-3xl bg-gray-300 rounded mx-auto"></div>
    </div>
  </div>
);

export default SkeletonHero;