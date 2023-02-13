const tagsRepo = require("./tags.mongo");
// const axios = require("axios");

const DEFAULT_TAG_ID = 1;

async function getAllTags(skip, limit) {
  return await memesRepo
    .find({}, { _id: 0, __v: 0 })
    .sort({ tagId: 1 })
    .skip(skip)
    .limit(limit);
}

async function getTagById(id) {
  return await findTag({ tagId: id });
}

async function getLastTagId() {
  const lastTag = await tagsRepo.findOne().sort("-tagId");
  if (!lastTag) {
    return DEFAULT_TAG_ID;
  }
  return lastTag.tagId;
}

async function saveTag(tag) {
  const newTagId = (await getLastTagId()) + 1;
  const newTag = Object.assign(tag, {
    tagId: newTagId,
    createdAt: new Date.now(),
    softDeleted: false,
    counter: 0, //TODO counter increment
  });
  await tagsRepo.findOneAndUpdate({ tagId: newTag.tagId }, newTag, {
    upsert: true,
  });
}

async function deleteTag(id) {
  const softDeleted = await tagsRepo.updateOne(
    { tagId: id },
    { softDeleted: true, updatedAt: ewDate.now() }
  );
  return softDeleted.acknowledged === true && softDeleted.modifiedCount === 1;
}

async function findTag(filter) {
  return await tagsRepo.findOne(filter);
}

module.exports = {
  getAllTags,
  getTagById,
  getLastTagId,
  saveTag,
  deleteTag,
};
