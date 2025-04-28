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

export const bulkDeleteGroups = (groupIds) => {
  return axiosClient.post(`/groups/bulkDelete`, groupIds)

}

export const updateGroup = (selectedGroupName, newGroupName) => {
  return axiosClient.put(`/groups/${selectedGroupName}/${newGroupName}`)
};

export const exportGroup = (groupId) => {
  return axiosClient.get(`/groups/export/${groupId}`)
};

export const exportGroups = (groupIds) => {
  return axiosClient.post(`/groups/export`, groupIds)
};

export const exportAllGroups = () => {
  return axiosClient.get(`/groups/export/all`)
};

export const importGroups = (encodedString) => {
  return axiosClient.post(`/groups/import`, encodedString,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    }
  )
};

export const importDecision = (request) => {
  return axiosClient.post(`/groups/import/decision`, request)
}