<template lang="">
  <teleport to="body">
    <!-- Background -->
    <div
      class="pin fixed top-0 z-50 flex h-screen w-screen overflow-auto bg-gray-900/75"
    >
      <!-- Dialog -->
      <div
        class="my-auto mx-auto flex w-1/3 flex-col justify-center border-2 bg-white px-5 shadow-md"
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
            :style="{ top: bottomTextTop + 'px', left: bottomTextLeft + 'px' }"
            :placeholder="bottomText"
          />

          <input
            type="text"
            class="draggable"
            v-for="textField in textFields"
            :key="textField.id"
            :style="{ top: textField.top + 'px', left: textField.left + 'px' }"
            :placeholder="textField.text"
          />
          <div class="my-4 flex flex-row justify-around">
            <button
              class="rounded-md bg-green-200 py-1 px-3 text-lg font-bold text-gray-600"
              @click.prevent="addTextField"
            >
              Add Text Field
            </button>
            <button
              class="rounded-md bg-orange-200 py-1 px-3 text-lg font-bold text-gray-600"
              @click="generateMeme"
            >
              Generate Meme
            </button>
            <button
              class="rounded-md bg-red-200 py-1 px-3 text-lg font-bold text-gray-600"
              @click=""
            >
              Close dialog
            </button>
          </div>
        </form>

        <input
          class="ml-32 mb-5"
          type="file"
          ref="fileInput"
          @change="handleFileInputChange"
        />
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
  import { ref, nextTick, onMounted } from "vue";
  import axios from "axios";
  import interact from "interactjs";

  interface TextField {
    id: Number;
    top: Number;
    left: Number;
    text: string;
  }

  const topText = ref("Top text");
  const bottomText = ref("Bottom text");
  const memeUrl = ref();
  // const textFields = reactive([]);
  const textFields = ref<TextField[]>([]);
  const textFieldsCount = ref(0);
  const topTextTop = ref(265);
  const topTextLeft = ref(785);
  const bottomTextTop = ref(550);
  const bottomTextLeft = ref(785);

  onMounted(() => {
    makeTextFieldsDraggable();
  });

  function handleFileInputChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      memeUrl.value = event.target.result || "";
    };
    reader.readAsDataURL(file);
  }

  function addTextField() {
    textFieldsCount.value++;
    const txtField: TextField = {
      id: textFieldsCount.value,
      top: 450,
      left: 785,
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
    font-size: 32px;
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
