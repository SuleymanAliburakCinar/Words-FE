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

export const deleteWord = (wordId) => {
  return axiosClient.delete(`/words/${wordId}`);
}

export const getQuiz = (requestBody) => {
  return axiosClient.post('/words/quiz', requestBody);
}

export const getByRateAndGroup = (requestBody) => {
  return axiosClient.post('/words/getByRateAndGroup', requestBody);
}

export const getGroupInfo = (groupId) => {
  return axiosClient.get(`/words/groupInfo/${groupId}`);
}

export const processResult = (answers) => {
  return axiosClient.post(`/words/quiz/answer`, answers);
}