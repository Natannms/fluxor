import { getAllProcesses } from "@/actions/process";
import ProcessTabs from "./ProcessTabs";

export default async function ProcessPage() {
  const processes = await getAllProcesses();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Processos</h1>
      <ProcessTabs processes={processes} />
    </div>
  );
}