import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import Layout from "../components/Layout";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../contexts/AuthContext";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const { currentUser } = useAuth();

  const loadEvents = async () => {
    const q = await getDocs(collection(db, "events"));
    setEvents(q.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    // Upload image to Firebase Storage
    const fileRef = ref(storage, `events/${file.name}-${Date.now()}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);

    // Add event to Firestore
    await addDoc(collection(db, "events"), {
      caption,
      imageUrl: url,
      approved: false,
      createdBy: currentUser.uid,
      createdAt: new Date(),
    });

    setCaption("");
    setFile(null);
    loadEvents();
  };

  const handleApprove = async (id) => {
    await updateDoc(doc(db, "events", id), { approved: true });
    loadEvents();
  };

  return (
    <Layout>
      <h1 className="text-xl font-bold mb-4">Village Events</h1>

      {/* Add Event Form */}
      <form
        className="mb-6 bg-white p-4 rounded shadow"
        onSubmit={handleSubmit}
      >
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-3"
        />
        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Submit Event
        </button>
      </form>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className={`p-4 rounded shadow ${
              event.approved ? "bg-white" : "bg-yellow-50"
            }`}
          >
            <img
              src={event.imageUrl}
              alt="Event"
              className="mb-2 w-full rounded"
            />
            <p className="mb-2">{event.caption}</p>
            {!event.approved && (
              <button
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                onClick={() => handleApprove(event.id)}
              >
                Approve
              </button>
            )}
            {event.approved && (
              <span className="text-green-600 font-semibold">Approved</span>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
}
