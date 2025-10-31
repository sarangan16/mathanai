import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Layout from "../components/Layout";
import Tree from "react-d3-tree";

export default function FamilyTree() {
  const [people, setPeople] = useState([]);
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    const loadPeople = async () => {
      const q = await getDocs(collection(db, "people"));
      const data = q.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPeople(data);
    };
    loadPeople();
  }, []);

  useEffect(() => {
    if (!people.length) return;

    // Map for quick lookup
    const peopleMap = {};
    people.forEach((p) => (peopleMap[p.id] = p));

    // Helper to build tree recursively
    const buildNode = (person) => {
      if (!person) return null;

      // Find children
      const children = people
        .filter(
          (c) =>
            (c.fatherId === person.id || c.motherId === person.id) &&
            c.id !== person.id
        )
        .map(buildNode)
        .filter(Boolean);

      // Spouse node displayed as sibling (not child)
      const spouseNode = person.spouseId
        ? {
            name: peopleMap[person.spouseId]?.name || "Spouse",
            attributes: { type: "spouse" },
          }
        : null;

      const combinedChildren = spouseNode
        ? [...children, spouseNode]
        : children;

      return {
        name: person.name,
        attributes: {
          dob: person.dob || "-",
          gender: person.gender || "-",
          spouse: person.spouseId ? peopleMap[person.spouseId]?.name : "-",
        },
        children: combinedChildren.length ? combinedChildren : undefined,
      };
    };

    // Determine roots: people who are not anyone's child
    const childIds = new Set(
      people.flatMap((p) => [p.fatherId, p.motherId].filter(Boolean))
    );
    const roots = people.filter((p) => !childIds.has(p.id));

    // Build tree for all roots
    const data = roots.map(buildNode).filter(Boolean);

    setTreeData(data);
  }, [people]);

  return (
    <Layout>
      <h1 className="text-xl font-bold mb-4">Family Tree</h1>
      {treeData.length > 0 ? (
        <div
          id="treeWrapper"
          style={{
            width: "100%",
            height: "800px",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "16px",
          }}
        >
          <Tree
            data={treeData}
            orientation="vertical"
            pathFunc="elbow"
            translate={{ x: 400, y: 50 }}
            zoomable
          />
        </div>
      ) : (
        <p>Loading tree...</p>
      )}
    </Layout>
  );
}
