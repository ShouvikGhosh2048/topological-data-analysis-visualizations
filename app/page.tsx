import Link from "next/link";

export default function Home() {
  return (
    <div className="p-5 space-y-5">
      <h1 className="text-center text-xl p-3">A website for topological data analysis visualizations.</h1>
      <div className="space-y-2">
        <h2 className="text-xl">Explanations</h2>
        <ul className="list-disc pl-5">
          <li><Link href='/explanation/homology' className="underline">Homology</Link></li>
        </ul>
      </div>
    </div>
  );
}
