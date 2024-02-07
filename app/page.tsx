import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import homologyInF2 from "./images/HomologyInF2.png";
import peristentHomology from "./images/PersistentHomology.png";
import homology from "./images/Homology.png";
import vietorisRips from "./images/VietorisRips.png";
import persistenceDiagram from "./images/PersistenceDiagram.png";

interface LinkCardProps {
  img: StaticImageData,
  title: string,
  href: string,
}

function LinkCard({ img, title, href }: LinkCardProps) {
  return (
    <Link href={href}>
      <div className="w-72 h-72 border border-black rounded p-2 hover:bg-slate-50 hover:border-2 flex flex-col items-center">
        <div className="w-64 h-64 flex justify-center items-center">
          <Image src={img} alt={title} width="250"/>
        </div>
        <p className="text-xl font-bold text-center">{title}</p>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="p-5 space-y-5">
      <h1 className="text-center text-3xl font-bold p-3">A website for topological data analysis visualizations.</h1>
      <div className="space-y-2">
        <h2 className="text-xl">Explanations</h2>
        <div className="flex gap-3 flex-wrap py-2">
          <LinkCard img={homologyInF2} title='Homology in F2' href="/explanation/homology-in-f2"/>
          <LinkCard img={peristentHomology} title='Persistent homology' href="/explanation/persistent-homology"/>
        </div>
        <h2 className="text-xl">Visualizations</h2>
        <div className="flex gap-3 flex-wrap py-2">
          <LinkCard img={homology} title='Homology' href="/visualization/homology"/>
          <LinkCard img={vietorisRips} title='Vietoris Rips' href="/visualization/vietoris-rips"/>
          <LinkCard img={persistenceDiagram} title='Persistence Diagram' href="/visualization/persistence-diagram"/>
        </div>
      </div>
    </div>
  );
}
