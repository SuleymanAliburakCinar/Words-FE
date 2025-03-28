import axiosClient from "./axiosClient";

export const getWordsByGroupId = (groupId) => {
  return axiosClient.get(`/words/getByGroupId/${groupId}`);
};

export const saveWord = (word) => {
  return axiosClient.post('/words', word)
};

export const updateWord = (id, updatedWord) => {
  return axiosClient.put(`/words/${id}`, updatedWord);
}

export const deleteWord = (wordName) => {
  return axiosClient.delete(`/words/${wordName}`);
}

export const getConclusion = (requestBody) => {
  return axiosClient.post('/words/getConclusion', requestBody);
}

export const getByRate = (requestBody) => {
  return axiosClient.post('/words/getByRate', requestBody);
}

export const getByRateAndGroup = (requestBody) => {
  return axiosClient.post('/words/getByRateAndGroup', requestBody);
}