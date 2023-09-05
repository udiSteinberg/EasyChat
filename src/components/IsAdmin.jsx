import { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from '../Firebase'; // Import your Firebase app instance

const IsAdmin = (currentUserId) => {
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminRole = async () => {
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);
    const usersData = usersSnapshot.docs.map(doc => doc.data());
    const currentUserFromDb = usersData.find(user => user.uid === currentUserId);
    setIsAdmin(currentUserFromDb?.role === "admin");
  };

  checkAdminRole();

  return isAdmin;
};

export default IsAdmin;
