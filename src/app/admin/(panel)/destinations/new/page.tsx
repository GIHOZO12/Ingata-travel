import DestinationForm from "../DestinationForm";
import { saveDestination } from "../actions";

export default function NewDestinationPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">
        Add destination
      </h1>
      {/* .bind(null, null) pre-fills the first argument (id = null means "create") */}
      <DestinationForm action={saveDestination.bind(null, null)} />
    </div>
  );
}
