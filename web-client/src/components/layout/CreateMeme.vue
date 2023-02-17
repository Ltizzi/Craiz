<template lang="">
  <div
    classes=" top-0 left-0 w-screen h-screen z-0 flex items-center justify-center"
  >
    <!-- Background -->
    <div
      class="fixed top-0 left-0 z-20 h-full w-full bg-black/50 backdrop-blur-lg"
      @click="$emit('closeModal')"
    ></div>
    <!-- <div
      class="fixed top-0 left-0 z-10 h-full w-full bg-gray-600/60 blur-2xl"
    ></div> -->
    <!-- Dialog -->
    <dialog
      class="fixed z-50 mt-32 flex w-1/3 flex-col rounded-md border-2 bg-white px-5 shadow-xl"
    >
      <h1 class="mt-2 text-center text-4xl font-bold text-slate-600">
        Create meme
      </h1>
      <div
        class="flex h-auto flex-col items-center justify-center bg-gray-100 p-5"
      >
        <img
          :src="memeUrl"
          v-if="memeUrl"
          ref="memeImage"
          class="object-cover"
        />
        <div class="h-96 w-full bg-gray-300" v-else></div>
      </div>
      <form @submit.prevent="generateMeme">
        <input
          type="text"
          class="draggable"
          :style="{ top: topTextTop + 'px', left: topTextLeft + 'px' }"
          :placeholder="topText"
        />

        <input
          type="text"
          class="draggable"
          :style="{
            top: bottomTextTop + 'px',
            left: bottomTextLeft + 'px',
          }"
          :placeholder="bottomText"
        />

        <input
          type="text"
          class="draggable"
          v-for="textField in textFields"
          :key="textField.id"
          :style="{
            top: textField.top + 'px',
            left: textField.left + 'px',
          }"
          :placeholder="textField.text"
        />
        <div class="my-4 flex flex-row justify-around">
          <BaseButton :class="btnClasses.green" @click.prevent="addTextField"
            >Add Textfield</BaseButton
          >
          <BaseButton :class="btnClasses.orange" @click.prevent="generateMeme"
            >Generate Meme</BaseButton
          >
          <BaseButton :class="btnClasses.red" @click="$emit('closeModal')"
            >Close Dialog</BaseButton
          >
        </div>
      </form>

      <input
        class="ml-32 mb-5"
        type="file"
        ref="fileInput"
        @change="handleFileInputChange"
      />
    </dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, nextTick, onMounted, PropType } from "vue";
  import axios from "axios";
  import interact from "interactjs";
  import BaseButton from "../common/BaseButton.vue";
  import { btnClasses } from "../../utils/models";

  interface TextField {
    id: Number;
    top: Number;
    left: Number;
    text: string;
  }

  const props = {
    showModal: Boolean as PropType<boolean>,
    required: true,
  };

  const topText = ref("Top text");
  const bottomText = ref("Bottom text");
  const memeUrl = ref();
  // const textFields = reactive([]);
  const textFields = ref<TextField[]>([]);
  const textFieldsCount = ref(0);
  const topTextTop = ref(100);
  const topTextLeft = ref(120);
  const bottomTextTop = ref(380);
  const bottomTextLeft = ref(120);

  onMounted(() => {
    makeTextFieldsDraggable();
  });

  function handleFileInputChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target) {
        memeUrl.value = event.target.result;
      } else {
        console.error("Select a file!");
        return;
      }
    };
    reader.readAsDataURL(file);
  }

  function addTextField() {
    textFieldsCount.value++;
    const txtField: TextField = {
      id: textFieldsCount.value,
      top: 220,
      left: 120,
      text: "Placeholder",
    };
    textFields.value.push(txtField);
    console.log(textFields);
    nextTick(() => {
      makeTextFieldsDraggable();
    });
  }
  async function generateMeme() {
    const fields = textFields.value.map((field: any) => {
      // const element = ref(["textField" + field.id]);
      // console.log(element);
      //  const element = document.getElementById("textField" + field.id);
      return {
        top: parseFloat(field.value.top),
        left: parseFloat(field.value.left),
        text: field.text,
      };
    });

    const formData = new FormData();
    formData.append("image", memeUrl.value);
    formData.append("fields", JSON.stringify(fields));
    console.log(formData);
    const response = await axios.post("", formData);

    memeUrl.value = response.data.url;

    await axios.post("", {
      url: response.data.url,
    });
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
    user-select: none;
    border: 5px dotted gray;
    background: transparent;
  }

  .draggable:focus {
    border: 2x solid black;
  }

  ::placeholder {
    color: white;
  }
</style>
