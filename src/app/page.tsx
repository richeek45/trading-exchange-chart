// import ChartSwitcher from '../components/ChartSwitcher';

import dynamic from 'next/dynamic';

const ChartSwitcher = dynamic(() => import('../components/ChartSwitcher'), {ssr: false})

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <ChartSwitcher />
      </main>
    </div>
  );
}
