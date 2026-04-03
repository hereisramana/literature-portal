import LiteraturePortal from "./components/LiteraturePortal";
import data from "./data.json";

export default function Home() {
  return <LiteraturePortal data={data} />;
}