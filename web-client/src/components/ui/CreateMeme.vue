<template lang="">
  <div class="container mx-auto my-auto flex w-auto flex-col bg-white px-5">
    <h1 class="mt-2 text-center text-2xl font-bold text-slate-600">
      Crear meme
    </h1>

    <form @submit.prevent="generateMeme" class="flex flex-col">
      <div class="flex flex-col md:flex-row">
        <div class="flex flex-col">
          <div class="container flex h-auto w-auto flex-col bg-gray-100 p-5">
            <div class="flex w-auto items-center justify-center">
              <label
                for="dropzone-file"
                class="dark:hover:bg-bray-800 flex h-auto w-auto cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div
                  class="container relative mx-auto flex h-auto w-auto flex-col items-center justify-center overflow-hidden"
                  id="elToConvert"
                >
                  <textarea
                    type="text"
                    class="draggable"
                    rows="1"
                    ref="topInput"
                    :style="{
                      top: topTextTop + 'px',
                      left: topTextLeft + 'px',
                    }"
                    :placeholder="topText"
                    v-model="topText"
                    @input="resizeInput($event.target)"
                    @keydown="deleteDefaultTextField($event.target, $event)"
                  />

                  <textarea
                    type="text"
                    class="draggable mx-auto"
                    ref="bottomInput"
                    rows="1"
                    v-model="bottomText"
                    :style="{
                      top: bottomTextTop + 'px',
                      left: bottomTextLeft + 'px',
                    }"
                    :placeholder="bottomText"
                    @input="resizeInput($event.target)"
                    @keydownt="deleteDefaultTextField($event.target, $event)"
                  />

                  <textarea
                    type="text"
                    class="draggable mx-auto"
                    ref="textField"
                    rows="1"
                    v-model="textField.text"
                    @keydown="deleteTextField(textField.id, $event)"
                    v-for="textField in textFields"
                    :key="textField.id"
                    :style="{
                      top: textField.top + 'px',
                      left: textField.left + 'px',
                    }"
                    :placeholder="textField.text"
                    @input="resizeInput($event.target)"
                  />

                  <img
                    :src="memeUrl"
                    v-if="memeUrl"
                    ref="memeImage"
                    class="img object-contain"
                  />

                  <div
                    class="square flex flex-col items-center justify-center bg-gray-300 pb-6 pt-5"
                    v-if="!memeUrl"
                  >
                    <svg
                      aria-hidden="true"
                      class="mb-3 h-10 w-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span class="font-semibold"
                        >Click para elegir una imagen</span
                      >
                    </p>
                  </div>
                </div>

                <input
                  id="dropzone-file"
                  type="file"
                  class="hidden"
                  ref="fileInput"
                  @change="handleFileInputChange"
                />
              </label>
            </div>
            <span
              v-if="state.errors.fileToUpload"
              class="mx-auto text-center font-bold text-red-500"
              >{{ state.errors.fileToUpload }}</span
            >
          </div>

          <div
            v-if="selectedTags"
            class="flew-row my-4 flex w-96 flex-wrap justify-evenly"
          >
            <span class="h-7 pb-2"></span>
            <BaseTag
              v-for="tag in selectedTags"
              :key="tag.tagId"
              class="mb-0.5 mt-0.5"
              :class="tag.class"
              :clickeable="true"
              >{{ tag.name }}</BaseTag
            >
          </div>
        </div>

        <div class="my-auto flex h-40 flex-col justify-center gap-0">
          <h2 class="mb-0.5 ml-10 mt-2 text-base font-bold lg:text-lg">
            Elige los tags del meme:
          </h2>
          <div class="flex w-fit flex-col items-center justify-center">
            <SelectTagNav />
            <div class="h-32">
              <div
                class="flew-row flex w-96 flex-wrap justify-evenly px-5 py-2 md:w-96"
              >
                <BaseTag
                  v-for="tag in tags"
                  :key="tag.tagId"
                  class="mb-1"
                  :class="tag.class"
                  :clickeable="true"
                  @click="selecTag(tag)"
                  v-if="state.activeTab == 'basic'"
                  >{{ tag.name }}</BaseTag
                >
              </div>
              <CustomTag
                class="mx-5 pb-10"
                v-if="state.activeTab == 'custom'"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="my-4 flex flex-row justify-around">
        <BaseButton :class="btnClasses.green" @click.prevent="addTextField"
          >Add Textfield</BaseButton
        >
        <BaseButton :class="btnClasses.orange" @click.prevent="generateMeme"
          >Generate Meme</BaseButton
        >

        <BaseSpinner class="absolute right-28" v-if="isUploading" />
        <font-awesome-icon
          icon="fa-solid fa-circle-check"
          class="absolute right-28 rounded-full bg-green-600 p-1 text-2xl text-white"
          v-show="uploadComplete"
        />
        <font-awesome-icon
          icon="fa-solid fa-circle-xmark"
          class="absolute right-28 rounded-full bg-red-600 p-1 text-2xl text-white"
          v-show="uploadFailed"
        />
      </div>
      <!-- <div
        class="flex flex-row items-center justify-evenly pt-14 md:pt-2 lg:pt-2"
      ></div> -->
    </form>
  </div>
</template>

<script setup lang="ts">
  import {
    ref,
    nextTick,
    onMounted,
    PropType,
    reactive,
    computed,
    onBeforeMount,
  } from "vue";
  import BaseSpinner from "../common/BaseSpinner.vue";
  import BaseTag from "../common/BaseTag.vue";
  import CustomTag from "./CustomTagUI.vue";
  import SelectTagNav from "./SelectTagNav.vue";
  import axios from "axios";
  import interact from "interactjs";
  import BaseButton from "../common/BaseButton.vue";
  import { btnClasses } from "../../utils/models";
  import domToImage from "dom-to-image";
  import { useTagStore } from "@/store/tags";
  import { useUserStore } from "@/store";
  import { useMemesStore } from "@/store/memes";
  import { API_URL } from "@/main";
  import { Meme } from "@/utils/models";
  import { useRoute } from "vue-router";
  import { useField } from "vee-validate";
  import { required } from "@vee-validate/rules";
  import EventBus from "@/utils/EventBus";

  const tagStore = useTagStore();
  const userStore = useUserStore();
  const memeStore = useMemesStore();

  const route = useRoute();

  const emits = defineEmits({
    closeModal: () => true,
  });

  interface TextField {
    id: number;
    top: number;
    left: number;
    text: string;
  }

  const props = {
    showModal: Boolean as PropType<boolean>,
    required: true,
  };

  const topInput: any = ref(null);
  const bottomInput: any = ref(null);

  const topText = ref("Top text");
  const bottomText = ref("Bottom text");

  const memeUrl = ref(); //variable a la que se le asigna la imagen de fondo

  const textFields = ref<TextField[]>([]);
  const textFieldsCount = ref(0); //necesaria para asignar ids

  const topTextTop = ref(15); //15 70 300 70
  const topTextLeft = ref();
  const bottomTextTop = ref(250);
  const bottomTextLeft = ref();

  const elDOM = ref(); //elemento del DOM a convertir en imagen

  //prepara la guia visual del generador -uploading, exito, fail-
  //ademas recupera los tags y define si el nuevo meme es hijo o no
  onBeforeMount(async () => {
    uploadComplete.value = false;
    uploadFailed.value = false;
    isUploading.value = false;

    await tagStore.fetchTags();
    tags.value = tagStore.tags;

    let parentMeme = memeStore.parentMeme as Meme;
    if (parentMeme.memeId !== undefined) {
      isComment.value = true;
      parentMemeId.value = parentMeme.memeId;
    }
    if (route.query.id) {
      let parentId = parseInt(route.query.id as string);
      isComment.value = true;
      parentMemeId.value = parentId;
    }
  });

  //hace que los textfield sean draggables, marca el elemento del dom que sera importado como imagen
  //evisa el ancho de la pantalla para estilo de pantallas pequeñas
  onMounted(() => {
    makeTextFieldsDraggable();
    elDOM.value = document.getElementById("elToConvert");
    const width = window.innerWidth;
    if (width < 768) {
      topTextTop.value = 15;
      bottomTextTop.value = 200;
    }
  });

  //variables usadas para escalar la imagen generada desde el dom
  const imageWidth = ref();
  const imageHeight = ref();

  //handler del archivo añadido por el usuario
  //primero chequea que sea un archivo de imagen
  function handleFileInputChange(event: any) {
    memeUrl.value = null;
    state.fileToUpload = "";
    state.errors.fileToUpload = "";
    const file = event.target.files[0];
    if (!/\.(jpeg|png|jpg|jfif|webp|gif)$/i.test(file.name)) {
      state.errors.fileToUpload = "El archivo debe ser de imagen";
      state.fileToUpload = "";
      return;
    }

    state.errors.fileToUpload = "";
    // state.fileToUpload = file;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        memeUrl.value = event.target.result;
        //necesario para escalar imagen luego
        const img = new Image();
        img.onload = () => {
          imageWidth.value = img.naturalWidth;
          imageHeight.value = img.naturalHeight;
        };
        //convierte el string en un blog para el envio del meme a la api
        const blobUrl = URL.createObjectURL(new Blob([event.target.result]));
        img.src = blobUrl;
      } else {
        console.error("Select a file!");
        return;
      }
    };
    reader.readAsDataURL(file);
  }

  //textfields handlers

  //escala los textarea segun el texto
  function resizeInput(input: any) {
    input.style.width = "auto";
    input.style.height = "auto";

    const scrollWidth = input.scrollWidth;
    const scrollHeight = input.scrollHeight;

    input.style.width = scrollWidth + "px";
    input.style.height = scrollHeight + "px";
  }

  //añade textfield extra
  function addTextField() {
    textFieldsCount.value++;
    const txtField: TextField = {
      id: textFieldsCount.value,
      top: 160,
      left: 70,
      text: "Ingrese texto",
    };
    textFields.value.push(txtField);

    nextTick(() => {
      makeTextFieldsDraggable();
    });
  }

  function deleteTextField(id: number, event: any) {
    if (event.key === "Delete") {
      textFields.value = textFields.value.filter(
        (field: TextField) => field.id != id
      );
    }
  }

  function deleteDefaultTextField(textfield: any, event: any) {
    if (event.key === "Delete") {
      textfield.style.display = "none";
    }
  }

  //variable que recibe la imagen convertida desde el dom
  const convertedImage = ref();

  async function generateImageFromDom() {
    //remueve borders
    const inputs = document.querySelectorAll(".draggable");
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].classList.remove("draggable");
      inputs[i].classList.add("postdraggable");
    }
    //usa el tamaño de la imagen original de referencia para el escalado

    const scaleWidth = imageWidth.value;
    const scaleHeight = imageHeight.value;

    //convierte el dom en imagen
    await domToImage
      .toPng(elDOM.value, { width: scaleWidth, height: scaleHeight })
      .then(async function (dataUrl) {
        console.log(dataUrl);
        const imagen = new Image();
        imagen.src = dataUrl;
        state.fileToUpload = imagen.src;

        //genera el blob para ser subido luego
        const response = await fetch(dataUrl);
        const buffer = await response.arrayBuffer();
        const blob = new Blob([buffer], { type: "image/png" });
        convertedImage.value = blob;
      })
      .catch(function (error) {
        console.error("Error a convertir dom a imagen", error);
      });
  }

  //variables y eventbus necesarias para tratar con comentarios
  let isComment = ref(false);
  let parentMemeId = ref();

  //variables usadas para señalar si el meme se está subiendo, si la operación fue un éxito o un fracaso
  const isUploading = ref(false);
  const uploadComplete = ref(false);
  const uploadFailed = ref(false);

  EventBus.on("newComment", () => {
    isComment.value = true;
  });

  //main method
  async function generateMeme() {
    isUploading.value = true;
    uploadFailed.value = false;
    state.errors.fileToUpload = "";
    await generateImageFromDom();
    console.log(convertedImage.value);
    if (state.fileToUpload == "") {
      state.errors.fileToUpload = "Se requiere una imagen";
      state.fileToUpload = "";
      isUploading.value = false;
      uploadFailed.value = true;
      setTimeout(() => {
        uploadFailed.value = false;
      }, 1500);
      return;
    }
    const formData = new FormData();
    formData.append("file", convertedImage.value, "newmeme.png");
    const response = await axios.post(`${API_URL}utils/uploadImg`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    const selTags = selectedTagsToStringArray();

    let memeData = {
      uploader: userStore.userId,
      imgUrl: response.data.url,
      tags: selTags,
      isComment: false,
      parentMeme: null,
    };

    if (isComment.value == true) {
      memeData.isComment = true;
      memeData.parentMeme = parentMemeId.value;
      const res = await axios.post(
        `${API_URL}meme/comment?id=${parentMemeId.value}`,
        memeData,
        { withCredentials: true }
      );
      if (res.status == 201) {
        isUploading.value = false;
        uploadComplete.value = true;
        await memeStore.fetchCommentsById(parentMemeId.value);
        setTimeout(() => {
          EventBus.emit("reloadComments", { id: parentMemeId.value });
          emits("closeModal");
        }, 1000);
      } else {
        isUploading.value = false;
        uploadFailed.value = true;
        console.log("error al subir la imagen");
      }
    } else {
      const res = await axios.post(`${API_URL}meme/new`, memeData, {
        withCredentials: true,
      });
      if (res.status == 201) {
        isUploading.value = false;
        uploadComplete.value = true;
        await memeStore.fetchMemesWoC(0, 10);
        setTimeout(() => {
          EventBus.emit("reloadMemes");
          emits("closeModal");
        }, 1000);
      } else {
        isUploading.value = false;
        uploadFailed.value = true;
        console.log("error al subir la imagen");
      }
    }
  }

  function makeTextFieldsDraggable() {
    const position = { x: 0, y: 0 };
    interact(".draggable").draggable({
      listeners: {
        start(event) {
          console.log(event.type, event.target);
        },
        move(event) {
          const target = event.target;
          position.x =
            (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
          position.y =
            (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

          event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
          target.setAttribute("data-x", position.x);
          target.setAttribute("data-y", position.y);
        },
      },
    });
  }

  //tags

  const tags = ref(tagStore.tags);
  let selectedTags = ref<any[]>([]);
  selectedTags.value = [];

  function selecTag(tag: any) {
    if (selectedTags.value.length < 4 && !selectedTags.value.includes(tag)) {
      if (!selectedTags.value.includes(tag)) {
        selectedTags.value.push(tag);
      } else {
        selectedTags.value = selectedTags.value.filter(
          (selTag: any) => selTag.tagId != tag.tagId
        );
      }
    } else {
      errors.value = "Máximo cuatro tags ";
    }
  }

  function selectedTagsToStringArray() {
    const names: Array<string> = [];
    selectedTags.value.forEach((selTag: any) => {
      names.push(selTag.name);
    });

    return names;
  }

  // TAG NAVIGATION
  const state = reactive({
    activeTab: "basic",
    fileToUpload: "",
    errors: {
      fileToUpload: "",
    },
  });

  EventBus.on("basicTags", () => {
    state.activeTab = "basic";
  });

  EventBus.on("customTags", () => {
    state.activeTab = "custom";
  });

  //CUSTOM TAG

  EventBus.on("createdCustom", (tag: any) => {
    if (selectedTags.value.length < 4 && !selectedTags.value.includes(tag)) {
      selectedTags.value.push(tag);
    }
  });

  //validations

  const { value: errors } = useField("fileToUpload", required);

  const isFormValid = computed(() => {
    return !Object.values(state.errors).some((error) => error !== null);
  });
</script>
<style scoped>
  .draggable {
    position: absolute;
    text-align: center;
    font-size: 2.5rem;
    font-family: Impact, sans-serif;
    justify-content: center;
    color: white;
    text-shadow: 2px 2px black;
    cursor: move;
    /*  user-select: none;*/
    border: 3px dotted gray;
    background: transparent;
    width: 15rem;
    height: auto;
    /* max-width: fit-content;*/
    overflow: hidden;
    line-height: normal;
    resize: none;
  }

  .postdraggable {
    position: absolute;
    text-align: center;
    font-size: 2.5rem;
    font-family: Impact, sans-serif;
    justify-content: center;
    color: white;
    text-shadow: 2px 2px black;
    cursor: move;
    /*  user-select: none;*/
    border: 0;
    background: transparent;
    width: max-content;
    height: auto;
    /* max-width: fit-content;*/
    overflow: hidden;
    line-height: normal;
    resize: none;
  }

  .draggable:focus {
    border: 2x solid black;
  }

  ::placeholder {
    color: white;
  }

  .square {
    width: 500px;
    height: 375px;
  }

  .img {
    width: auto;
    height: 375px;
  }

  @media (max-width: 600px) {
    .square {
      width: 400px;
      height: 300px;
    }

    .img {
      width: auto;
      height: 300px;
    }
  }
</style>
