import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { getGroups, saveGroup, deleteGroup, bulkDeleteGroups, updateGroup, exportGroups, importGroups, importDecision } from '../services/groupApi';
import { getGroupInfo } from '../services/wordApi';
import "./HomePage.css";
import "./Popup.css";
import TextDisplayer from '../component/TextDisplayer';
import ConflictResolver from '../component/ConflictResolver';
import InteractiveList from '../component/InteractiveList';
import InfoModal from '../component/InfoModal';

function HomePage() {

  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [group, setGroup] = useState("");
  const [groupInfoList, setGroupInfoList] = useState([]);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('');
  const [selectedGroup, setSelectedGroup] = useState([]);
  const [showTextDisplay, setShowTextDisplay] = useState(false);
  const [showConflictResolver, setShowConflictResolver] = useState(false);
  const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [blur, setBlur] = useState(false);
  const [exportText, setExportText] = useState('');
  const [isExport, setIsExport] = useState(true);
  const [conflictResponse, setConflictResponse] = useState({ groupNameList: [] });
  const [conflictResolution, setConflictResolution] = useState({});

  useEffect(() => {
    fetchGetGroups();
  }, []);

  useEffect(() => {
    if (Object.keys(conflictResolution).length <= 0) return;
    if (Object.keys(conflictResolution).length === conflictResponse.groupNameList.length) fetchDecision();
  }, [conflictResolution]);

  useEffect(() => {
    if (selectedGroup.length === 1) {
      setShowInfoModal(true);
      const groupId = selectedGroup[0].id;
      if (!groupInfoList.find(info => info.id === groupId)) {
        fetchGroupInfo(groupId)
          .then(data => {
            setGroupInfoList(prev => [...prev, { id: groupId, info: data }]);
          })
          .catch(err => {
            console.error('Error fetching group info', err);
          });
      }
    }
    else {
      setShowInfoModal(false);
    }
  }, [selectedGroup]);

  const fetchGetGroups = async () => {
    try {
      const { data } = await getGroups();
      setGroups(data);
    } catch (error) {
      console.error('Error occurred while taking group information', error);
    }
  }

  const fetchAddGroups = async () => {
    try {
      const response = await saveGroup({ "name": group });

      if (response.status === 200) {
        setPopupMessage('Group Added');
        setPopupType('success');
        fetchGetGroups();
      } else {
        setPopupMessage('Error occurred while adding new group');
        setPopupType('error');
      }
    } catch (error) {
      setPopupMessage('Connection Error');
      setPopupType('error');
    }
  }

  const fetchDeleteGroup = async (selected) => {
    try {
      let response;
      if (!selected) return;
      else if (Array.isArray(selected)) response = await bulkDeleteGroups(selected.map(g => g.id));
      else response = await deleteGroup(selected.label);

      if (response.status === 204) {
        setPopupMessage('Group Deleted');
        setPopupType('success');
        setSelectedGroup([]);
        setGroup('');
        fetchGetGroups();
      } else {
        setPopupMessage('Error was occurred while deleting new group');
        setPopupType('error');
      }
    } catch (error) {
      setPopupMessage('Connection Error');
      setPopupType('error');
    }
  }

  const fetchUpdateGroups = async () => {
    try {
      const response = await updateGroup(selectedGroup[0].label, group);

      if (response.status === 200) {
        setPopupMessage('Group Added');
        setPopupType('success');
        setGroup('');
        fetchGetGroups();
      } else {
        setPopupMessage('Error was occurred while adding new group');
        setPopupType('error');
      }
    } catch (error) {
      setPopupMessage('Connection Error');
      setPopupType('error');
    }
  }

  const addOrUpdateGroup = () => {
    if (isUpdate) fetchUpdateGroups();
    else fetchAddGroups();

    setIsUpdate(false);
  }

  const fetchGroupInfo = async (groupId) => {
    try {
      const response = await getGroupInfo(groupId);
      if (response.status === 200) {
        return response.data;
      } else {
        setPopupMessage('Error occurred while taking group information');
        setPopupType('error');
      }
    } catch (error) {
      console.error('Error occurred while taking group information', error);
    }
  }

  const exportSelectedGroup = async (selected) => {
    try {
      const response = await exportGroups(selected.map(group => group.id));
      if (response.status === 200) {
        setExportText(response.data);
        toggleTextDisplay(true);
      } else {
        setPopupMessage('Error occurred while exporting group');
        setPopupType('error');
      }
    } catch (error) {
      setPopupMessage('Connection Error');
      setPopupType('error');
    }
  }

  const toggleTextDisplay = (isExport) => {
    setShowTextDisplay(!showTextDisplay);
    setIsExport(isExport);
    toggleBlur();
  }

  const onImport = async (importText) => {
    try {
      const response = await importGroups(importText);
      if (response.status === 200) {
        setShowTextDisplay(!showTextDisplay);
        setShowConflictResolver(!showConflictResolver);
        setConflictResponse(response.data);
      } else {
        setPopupMessage('Error occurred while importing group');
        setPopupType('error');
      }
    } catch (error) {
      setPopupMessage('Connection Error');
      setPopupType('error');
    }
  }

  const fetchDecision = async () => {
    try {
      const body = { "data": conflictResponse.json, "conflictResolution": conflictResolution };
      const response = await importDecision(body);
      if (response.status === 200) {
        fetchGetGroups();
      }
    } catch (error) {
      setPopupMessage('Connection Error');
      setPopupType('error');
    }
    setShowConflictResolver(!showConflictResolver);
    setConflictResponse({ groupNameList: [] });
    setConflictResolution({});
  }

  const onDecision = (group, decision) => {
    setConflictResolution(prev => ({ ...prev, [group]: decision }));
  }

  const makeDecisionForAll = (index, items, decision) => {
    items.forEach((item, idx) => {
      if (idx >= index) onDecision(item, decision);
    });
  }

  const toggleBlur = () => {
    setBlur(!blur);
  }

  const getDeleteButton = (selected) => {
    return <button onClick={() => fetchDeleteGroup(selected)}>🗑️</button>
  }

  const getAddButton = () => {
    return <button onClick={() => toggleAddUpdateModal()}>➕</button>
  }

  const getUpdateButton = (selected) => {
    return (
      <button onClick={() => {
        toggleAddUpdateModal();
        setSelectedGroup(selected);
        setIsUpdate(true);
      }
      }>✏️</button>
    );
  }

  const handleSelectionChange = (selected) => {
    setSelectedGroup(selected ? selected : []);
  }

  const toggleAddUpdateModal = () => {
    toggleBlur();
    setShowAddUpdateModal(!showAddUpdateModal);
    setGroup('');
  }

  return (
    <>
      <div className={`home-page-container ${blur ? 'blur' : ''}`}>
        {showInfoModal && selectedGroup.length > 0 && (
          <InfoModal
            group={selectedGroup[0]}
            info={groupInfoList.find(g => g.id === selectedGroup[0].id)?.info}
            onActionClick={() => navigate(`/add-word/${selectedGroup[0].id}`)}
          />
        )}
        <div></div>
        <InteractiveList
          items={groups}
          multiple={true}
          onSelectionChange={handleSelectionChange}
          listActions={[
            {
              render: () => getAddButton(),
              shouldShow: () => true,
              position: 'left-top',
            },
            {
              render: (selected) => getDeleteButton(selected),
              shouldShow: (selected) => selected.length > 0,
              position: 'left-top',
            },
            {
              render: (selected) => getUpdateButton(selected),
              shouldShow: (selected) => selected.length === 1,
              position: 'left-top',
            },
            {
              render: () => <button onClick={() => toggleTextDisplay(false)}>Import</button>,
              shouldShow: () => true,
              position: 'right-bottom',
            },
            {
              render: (selected) => <button onClick={() => exportSelectedGroup(selected)}>Export</button>,
              shouldShow: (selected) => selected.length > 0,
              position: 'right-bottom',
            },
          ]}
        />
        {popupMessage && <div className={`popup ${popupType} top-right`}>{popupMessage}</div>}
      </div>
      {showTextDisplay && (
        <TextDisplayer
          isExport={isExport}
          encodedString={exportText}
          onClose={() => toggleTextDisplay()}
          onImport={onImport}
        />
      )}
      {showConflictResolver && (
        <div>
          <ConflictResolver
            items={conflictResponse.groupNameList}
            options={[{ "label": "MERGE", exclusive: true }, { "label": "RENAME", exclusive: true }, { "label": "IGNORE", exclusive: true }, { "label": "For All", exclusive: false, ifSelected: makeDecisionForAll }]}
            onDecision={onDecision}
            msg={conflictResponse.msg}
          />
        </div>
      )}
      {showAddUpdateModal && (
        <div className="modal">
          <input
            type="text"
            placeholder="Group Name"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          />
          <div padding="10px">
            <button onClick={() => {
              addOrUpdateGroup();
              toggleAddUpdateModal();
            }}>
              Save
            </button>
            <button background-color="red" onClick={() => {
              toggleAddUpdateModal();
              setIsUpdate(false);
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default HomePage;