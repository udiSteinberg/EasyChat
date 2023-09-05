import React, { useState } from 'react';
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from '../Firebase';
import { useNavigate } from 'react-router-dom';

export const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [showUsers, setShowUsers] = useState(false);
    const navigate = useNavigate();


    const getUsersFromDb = async () => {
        try {
            const usersRef = collection(db, "users");
            const usersSnapshot = await getDocs(usersRef);
            const usersData = usersSnapshot.docs.map(doc => doc.data());
            const sortedUsers = usersData
                .filter(obj => obj.displayName)
                .sort((a, b) => a.displayName.localeCompare(b.displayName));
            console.log(usersData);
            console.log(sortedUsers);
            setUsers(sortedUsers);
            console.log(users);
        } catch (error) {
            // Handle the error
        }
    };

    const renderAndShowUsers = () => {
        getUsersFromDb();
        setShowUsers(true);
    }

    const upgradeToAdmin = async (userId) => {
        console.log(userId);
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, { role: 'admin' }, { merge: true });

        // Fetch updated user data from the database and update the state
        await getUsersFromDb();

        console.log(users);
    };

    return (
        <div className='home'>
            <div className='container container-table'>
                {showUsers || <button className='center-button' onClick={() => renderAndShowUsers()}>Show all users</button>}
                {showUsers && <div className="table-container">
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Is Admin</th>
                                <th>Upgrade to Admin</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{user.displayName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role === 'admin' ? "Yes" : "No"}</td>
                                    <td>
                                        {!(user.role === 'admin') && (
                                            <button onClick={() => upgradeToAdmin(user.uid)}>
                                                Upgrade
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>}
                <button className='center-button' onClick={() => navigate('/')}>HomePage</button>
            </div>
        </div>
    );
};
