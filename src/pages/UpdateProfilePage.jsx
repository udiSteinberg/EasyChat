import React, { useState, useContext } from 'react';
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from '../Firebase';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../cotext/AuthContext';
import Add from '../img/addAvatar.png';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


export const UpdateProfilePage = () => {
    const { currentUser, updateDisplayNameInContext, updateProfilePhotoInContext } = useContext(AuthContext);
    const [newPhoto, setNewPhoto] = useState(null);
    const [newDisplayName, setNewDisplayName] = useState('');
    const navigate = useNavigate();

    const updateDisplayName = async () => {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, { displayName: newDisplayName });
        updateDisplayNameInContext(newDisplayName); // Update context display name
    };

    const updateProfilePhoto = async () => {
        const date = new Date().getTime();
        const storageRef = ref(storage, `${currentUser.uid + date}`);
        const userRef = doc(db, 'users', currentUser.uid);

        try {
            await uploadBytes(storageRef, newPhoto);
            const downloadUrl = await getDownloadURL(storageRef);
            console.log('Profile photo uploaded successfully:', downloadUrl);

            await updateDoc(userRef, { photoURL: downloadUrl });

            updateProfilePhotoInContext(downloadUrl);
            setNewPhoto(null);
        } catch (error) {
            console.error('Error uploading profile photo:', error);
        }
    };

    return (
        <div className='home'>
            <div className="update-profile-container">
                <div className='update-profile'>
                    <div className='img-side'>
                        <img className='profile-img' src={currentUser.photoURL} alt="" />
                        {newPhoto && <img className='profile-img' src={newPhoto ? URL.createObjectURL(newPhoto) : currentUser.photoURL} alt="" />}
                        <div className="input-wrapper">
                            <input type='file' id='file' style={{ display: "none" }}
                                onChange={(e) => setNewPhoto(e.target.files[0])}
                            />
                            <label htmlFor="file">
                                <img className='img-add' src={Add} alt='avatar' />
                                <span>Add an avatar</span>
                            </label>
                            {newPhoto && <button onClick={()=>{updateProfilePhoto()}}>Update profile picture</button>}
                        </div>
                    </div>
                    <div className="name-side">
                        <div className="input-wrapper">
                            <label>Display Name:</label>
                            <span>{currentUser.displayName}</span>
                        </div>
                        <div className="input-wrapper">
                            <input
                                className='name-input'
                                type="text"
                                placeholder="New Display Name"
                                value={newDisplayName}
                                onChange={(e) => setNewDisplayName(e.target.value)}
                            />
                            {newDisplayName && <button onClick={() => { updateDisplayName() }}>Update display name</button>}
                        </div>
                    </div>
                    <button className='center-button' onClick={() => navigate('/')}>HomePage</button>
                </div>
            </div>
        </div>
    );
};
