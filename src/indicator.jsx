import React from 'react'

const Indicator = () => {
  if(import.meta.env.PROD){
    return null;
  }
  return (
    <div className='fixed bottom-4 right-4 bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 px-3 py-1 rounded text-sm z-50 shadow-md'>
      <span className='sm:hidden'>default</span>
      <span className='hidden sm:block md:hidden'>sm</span>
      <span className='hidden md:block lg:hidden'>md</span>
      <span className='hidden lg:block xl:hidden'>lg</span>
      <span className='hidden xl:block 2xl:hidden'>xl</span>
      <span className='hidden 2xl:block'>2xl</span>
    </div>
  )
}

export default Indicator