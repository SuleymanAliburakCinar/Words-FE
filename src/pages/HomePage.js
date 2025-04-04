import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { getGroups, saveGroup, deleteGroup, updateGroup } from '../services/groupApi';
import "./HomePage.css";
import "./Popup.css";

function HomePage(){

  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [group, setGroup] = useState("");
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
      fetchGetGroups();
  }, []);

  const fetchGetGroups = async () => {
    try{
      const {data} = await getGroups();
      setGroups(data);
    } catch(error){
      console.error('Error occurred while taking group information', error);
    }
  }
  
  const fetchAddGroups = async () => {
    try{
      const response = await saveGroup({"name": group});
      
      if (response.status === 200) {
        setPopupMessage('Group Added');
        setPopupType('success');
        setGroup('');
        fetchGetGroups();
      } else {
        setPopupMessage('Error occurred while adding new group');
        setPopupType('error');
      }
    } catch(error){
      setPopupMessage('Connection Error');
      setPopupType('error');
    }
  }

  const fetchDeleteGroup = async () => {
    try{
      const response = await deleteGroup(group);

      if (response.status === 204) {
        setPopupMessage('Group Deleted');
        setPopupType('success');
        setGroup('');
        fetchGetGroups();
      } else {
        setPopupMessage('Error was occurred while deleting new group');
        setPopupType('error');
      }
    } catch(error){
      setPopupMessage('Connection Error');
      setPopupType('error');
    }
  }

  const fetchUpdateGroups = async () => {
    try {
      const response = await updateGroup(selectedGroup.name, group);

      if (response.status === 200) {
        setPopupMessage('Group Added');
        setPopupType('success');
        setGroup('');
        fetchGetGroups();
      } else {
        setPopupMessage('Error was occurred while adding new group');
        setPopupType('error');
      }
    } catch(error){
      setPopupMessage('Connection Error');
      setPopupType('error');
    }
  }

  const handleSelectWord = (selected) => {
    if(selected == selectedGroup) {
      setSelectedGroup(null);
      setGroup("");
    }
    else {
      setSelectedGroup(selected);
      setGroup(selected.name);
    }
  }

  return(
    <div className="home-page-container">
      <div className="input-section">
        <input
          type="text"
          placeholder="Group Name"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
        />
        <button
          className={`button ${selectedGroup ? "update" : "save"}`}
          onClick={selectedGroup ? fetchUpdateGroups :fetchAddGroups}
        >
          {selectedGroup ? 'Update' : 'Save'}</button>
        <button className='button delete' onClick={fetchDeleteGroup}>Delete</button>
      </div>
      <div className="group-list">
        {groups.map((w, index) => (
          <div
            key={index}
            className={`group-item ${selectedGroup === w ? 'selected' : ''}`}
            onClick={() => handleSelectWord(w)}
            onDoubleClick={() => navigate(`/add-word/${w.id}`)}
          >
            <strong>{w.name}</strong>
          </div>
        ))}
      </div>
      {popupMessage && <div className={`popup ${popupType} top-right`}>{popupMessage}</div>}
    </div>
  );
}

export default HomePage;