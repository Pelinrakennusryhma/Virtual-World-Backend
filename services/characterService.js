const CharacterData = require('../models/character_data')
const { createError } = require('../utils/errors')

const getCharacterData = async (id) => {
  const characterData = await CharacterData.findOne({ user: id }).populate("inventory").populate("user").populate("quests")
  return characterData;
}

const addActiveQuestData = async ({ userId, questId, step, stepProgress }) => {
  const characterData = await CharacterData.findOne({ user: userId }).populate("quests")

  const questExists = characterData.quests.activeQuests.find((quest) => quest.id === questId);

  // quest isn't already saved as an active quest, add it
  if (!questExists) {
    const newQuest = { id: questId, step, stepProgress }
    characterData.quests.activeQuests.push(newQuest)
    await characterData.save()
    return newQuest;
    // quest is already saved, update it with new step data
  } else {
    const questIndex = characterData.quests.activeQuests.findIndex((quest) => quest.id === questId)
    console.log(questIndex)
    characterData.quests.activeQuests[questIndex].step = step
    characterData.quests.activeQuests[questIndex].stepProgress = stepProgress
    await characterData.save()
    return characterData.quests.activeQuests[questIndex]
  }
}

const deleteActiveQuestData = async ({ userId, questId }) => {
  const characterData = await CharacterData.findOne({ user: userId }).populate("quests")

  characterData.quests.activeQuests = characterData.quests.activeQuests.filter((quest) => quest.id !== questId);
  await characterData.save()
}

const deleteAllActiveQuestData = async (userId) => {
  const characterData = await CharacterData.findOne({ user: userId }).populate("quests")

  characterData.quests.activeQuests = []
  await characterData.save()
}

const addCompletedQuestData = async ({ userId, questId, deleteFromActives, resetFocused }) => {
  const characterData = await CharacterData.findOne({ user: userId }).populate("quests")

  const questExists = characterData.quests.completedQuests.find((quest) => quest.id === questId);

  // quest isn't already saved as a completed quest, add it
  if (!questExists) {
    const newQuest = { id: questId }
    characterData.quests.completedQuests.push(newQuest)

    if (deleteFromActives === true) {
      characterData.quests.activeQuests = characterData.quests.activeQuests.filter((quest) => quest.id !== questId);
    }

    if (resetFocused === true) {
      characterData.quests.focusedQuest = { id: "" }
    }

    await characterData.save()
    return newQuest;
    // quest is already saved and shouldn't be added to the list again
  } else {
    throw createError('QuestError', `Quest of ID ${questId} is already in completed quests list`)
  }
}

const deleteAllCompletedQuestData = async (userId) => {
  const characterData = await CharacterData.findOne({ user: userId }).populate("quests")

  characterData.quests.completedQuests = []
  await characterData.save()
}

const setFocusedQuest = async ({ userId, questId }) => {
  const characterData = await CharacterData.findOne({ user: userId }).populate("quests")

  const newFocusedQuest = { id: questId }
  characterData.quests.focusedQuest = newFocusedQuest
  await characterData.save()
  return newFocusedQuest
}

const clearAllQuestData = async (userId) => {
  const clearedQuests = {
    activeQuests: [],
    completedQuests: [],
    focusedQuest: {
      id: ""
    }
  }
  const characterData = await CharacterData.findOneAndUpdate({ user: userId }, { quests: clearedQuests });
}

module.exports = {
  getCharacterData,
  addActiveQuestData,
  deleteActiveQuestData,
  deleteAllActiveQuestData,
  addCompletedQuestData,
  deleteAllCompletedQuestData,
  setFocusedQuest,
  clearAllQuestData
}