import axiosClient from "./axiosClient";

export const getGroups = () => {
  return axiosClient.get('/groups')
};

export const saveGroup = (group) => {
  return axiosClient.post('/groups', group)
};

export const deleteGroup = (groupName) => {
  return axiosClient.delete(`/groups/${groupName}`)
};

export const updateGroup = (selectedGroupName, newGroupName) => {
  return axiosClient.put(`/groups/${selectedGroupName}/${newGroupName}`)
};