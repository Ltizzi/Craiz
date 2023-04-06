const tagsRepo = require("./tags.mongo");
// const axios = require("axios");

const DEFAULT_TAG_ID = 0;

async function getAllTags(skip, limit) {
  return await tagsRepo
    .find({ softDeleted: false, isCustom: false }, { _id: 0, __v: 0 })
    .sort({ counter: -1 })
    .skip(skip)
    .limit(limit);
}

async function getAllCustomTags(skip, limit) {
  return await tagsRepo
    .find({ softDeleted: false, isCustom: true }, { _id: 0, __v: 0 })
    .sort({ tagId: 1 })
    .skip(skip)
    .limit(limit);
}

async function getTagById(id) {
  return await findTag({ tagId: id, softDeleted: false });
}

async function getTagsByName(name) {
  return await findTags({
    name: { $regex: name },
    isCustom: true,
    softDeleted: false,
  });
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

  const alreadyMaked = await findTag({ name: tag.name });
  if (alreadyMaked) {
    throw new Error("Duplicated tag name");
  }
  const newTag = Object.assign(tag, {
    tagId: newTagId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    softDeleted: false,
    counter: 0, //TODO counter increment
  });
  return await tagsRepo.findOneAndUpdate({ tagId: newTag.tagId }, newTag, {
    upsert: true,
  });
}

async function createCustomTag(tag) {
  const newTagId = (await getLastTagId()) + 1;

  const alreadyMaked = await findTag({ name: tag.name });
  if (alreadyMaked) {
    throw new Error("Duplicated tag name");
  }
  const newTag = Object.assign(tag, {
    tagId: newTagId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isCustom: true,
    softDeleted: false,
    counter: 0,
  });
  await tagsRepo.findOneAndUpdate({ tagId: newTag.tagId }, newTag, {
    upsert: true,
  });
  return newTag;
}

async function updateTag(tag) {
  tag.updatedAt = Date.now();
  return await tagsRepo.findOneAndUpdate({ tagId: tag.tagId }, tag, {
    upsert: true,
  });
}

async function deleteTag(id) {
  const softDeleted = await tagsRepo.updateOne(
    { tagId: id },
    { softDeleted: true, updatedAt: Date.now() }
  );
  return softDeleted.acknowledged === true && softDeleted.modifiedCount === 1;
}

async function findTag(filter) {
  return await tagsRepo.findOne(filter, { _id: 0, __v: 0 });
}

async function findTags(filter) {
  return await tagsRepo.find(filter, { _id: 0, __v: 0 });
}

async function tagIncrementalCounter(tagName) {
  const tag = await findTag({ name: tagName });
  tag.counter += 1;
  return await updateTag(tag);
}

async function tagDecrementalCounter(tagName) {
  const tag = await findTag({ name: tagName });
  tag.counter -= 1;
  return await updateTag(tag);
}

module.exports = {
  getAllTags,
  getAllCustomTags,
  getTagById,
  getTagsByName,
  getLastTagId,
  saveTag,
  createCustomTag,
  deleteTag,
  updateTag,
  tagIncrementalCounter,
  tagDecrementalCounter,
};
