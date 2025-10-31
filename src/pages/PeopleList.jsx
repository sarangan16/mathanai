import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

// Helper to get siblings
const getSiblings = (person, allPeople) => {
  return allPeople.filter(
    (p) =>
      p.id !== person.id &&
      ((p.fatherId && person.fatherId && p.fatherId === person.fatherId) ||
        (p.motherId && person.motherId && p.motherId === person.motherId))
  );
};

export default function PeopleList() {
  const [people, setPeople] = useState([]);

  const loadPeople = async () => {
    const q = await getDocs(collection(db, "people"));
    setPeople(q.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    loadPeople();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this person?")) {
      await deleteDoc(doc(db, "people", id));
      loadPeople();
    }
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">People List</h1>
        <Link
          to="/people/add"
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium transition"
        >
          + Add Person
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Name",
                "Gender",
                "Father",
                "Mother",
                "Spouse",
                "Siblings",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="py-3 px-4 text-left text-gray-700 font-semibold"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {people.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                <td className="py-2 px-4 font-medium">{p.name}</td>
                <td className="py-2 px-4 capitalize">{p.gender}</td>
                <td className="py-2 px-4">
                  {people.find((x) => x.id === p.fatherId)?.name || "-"}
                </td>
                <td className="py-2 px-4">
                  {people.find((x) => x.id === p.motherId)?.name || "-"}
                </td>
                <td className="py-2 px-4">
                  {people.find((x) => x.id === p.spouseId)?.name || "-"}
                </td>
                <td className="py-2 px-4">
                  {getSiblings(p, people)
                    .map((s) => s.name)
                    .join(", ") || "-"}
                </td>
                <td className="py-2 px-4 flex gap-2">
                  <Link
                    to={`/people/edit/${p.id}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
