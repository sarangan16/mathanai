import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import Layout from "../components/Layout";

export default function EditPerson() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [people, setPeople] = useState([]);

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [fatherId, setFatherId] = useState("");
  const [motherId, setMotherId] = useState("");
  const [spouseId, setSpouseId] = useState("");
  const [previousSpouseId, setPreviousSpouseId] = useState("");

  useEffect(() => {
    const loadPeople = async () => {
      const q = await getDocs(collection(db, "people"));
      setPeople(q.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    loadPeople();
  }, []);

  useEffect(() => {
    const loadPerson = async () => {
      if (!id) return;
      const docSnap = await getDoc(doc(db, "people", id));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name || "");
        setDob(data.dob || "");
        setGender(data.gender || "");
        setFatherId(data.fatherId || "");
        setMotherId(data.motherId || "");
        setSpouseId(data.spouseId || "");
        setPreviousSpouseId(data.spouseId || "");
      }
    };
    loadPerson();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Update main person
    await updateDoc(doc(db, "people", id), {
      name,
      dob,
      gender,
      fatherId: fatherId || null,
      motherId: motherId || null,
      spouseId: spouseId || null,
    });

    // Handle previous spouse unlink
    if (previousSpouseId && previousSpouseId !== spouseId) {
      await updateDoc(doc(db, "people", previousSpouseId), { spouseId: null });
    }

    // Handle new spouse link
    if (spouseId) {
      await updateDoc(doc(db, "people", spouseId), { spouseId: id });
    }

    navigate("/people");
  };

  return (
    <Layout>
      <h1 className="text-xl font-bold mb-4">Edit Person</h1>
      <form
        onSubmit={handleUpdate}
        className="bg-white p-4 rounded shadow max-w-md"
      >
        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-2 mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="date"
          className="w-full border p-2 mb-3"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
        <select
          className="w-full border p-2 mb-3"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <select
          className="w-full border p-2 mb-3"
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
        <select
          className="w-full border p-2 mb-3"
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
        <select
          className="w-full border p-2 mb-3"
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
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Update
        </button>
      </form>
    </Layout>
  );
}
