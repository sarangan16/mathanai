import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Layout from "../components/Layout";

export default function Dashboard() {
  const [peopleCount, setPeopleCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // Count people
      const peopleSnapshot = await getDocs(collection(db, "people"));
      setPeopleCount(peopleSnapshot.size);

      // Count events
      const eventsSnapshot = await getDocs(collection(db, "events"));
      setEventsCount(eventsSnapshot.size);
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold mb-2">Total People</h2>
          <p className="text-2xl font-bold text-gray-700">{peopleCount}</p>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold mb-2">Events</h2>
          <p className="text-2xl font-bold text-gray-700">{eventsCount}</p>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold mb-2">Family Tree</h2>
          <a href="/tree" className="text-blue-600 font-bold hover:underline">
            View Tree
          </a>
        </div>
      </div>
    </Layout>
  );
}
