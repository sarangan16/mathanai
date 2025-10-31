import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

export default function AddPerson() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [fatherId, setFatherId] = useState("");
  const [motherId, setMotherId] = useState("");
  const [spouseId, setSpouseId] = useState("");
  const [people, setPeople] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPeople = async () => {
      const q = await getDocs(collection(db, "people"));
      setPeople(q.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    loadPeople();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    const docRef = await addDoc(collection(db, "people"), {
      name,
      dob,
      gender,
      fatherId: fatherId || null,
      motherId: motherId || null,
      spouseId: spouseId || null,
    });

    if (spouseId) {
      await updateDoc(doc(db, "people", spouseId), { spouseId: docRef.id });
    }

    navigate("/people");
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Add New Person
        </h1>
        <form
          onSubmit={handleSave}
          className="bg-white shadow-lg rounded-lg p-6 space-y-4"
        >
          <div className="space-y-1">
            <label className="text-gray-700 font-medium">Full Name</label>
            <input
              type="text"
              placeholder="Enter full name"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-gray-700 font-medium">Date of Birth</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-gray-700 font-medium">Gender</label>
            <select
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-gray-700 font-medium">Father</label>
              <select
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={fatherId}
                onChange={(e) => setFatherId(e.target.value)}
              >
                <option value="">Select Father</option>
                {people.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-gray-700 font-medium">Mother</label>
              <select
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={motherId}
                onChange={(e) => setMotherId(e.target.value)}
              >
                <option value="">Select Mother</option>
                {people.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-gray-700 font-medium">Spouse</label>
            <select
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={spouseId}
              onChange={(e) => setSpouseId(e.target.value)}
            >
              <option value="">Select Spouse</option>
              {people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Save Person
          </button>
        </form>
      </div>
    </Layout>
  );
}
