<template lang="">
  <div
    class="mt-4 mb-44 flex h-2/3 w-1/3 flex-col justify-center border-2 bg-white shadow-md"
  >
    <input
      class=""
      type="file"
      ref="fileInput"
      @change="handleFileInputChange"
    />
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
      </div>
    </form>
    <div class="h-auto bg-gray-100 p-5">
      <img :src="memeUrl" v-if="memeUrl" ref="memeImage" class="object-cover" />
      <div class="h-72 w-96 bg-gray-300" v-else></div>
    </div>
  </div>
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
  const topTextTop = ref(150);
  const topTextLeft = ref(515);
  const bottomTextTop = ref(350);
  const bottomTextLeft = ref(515);

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
      top: 225,
      left: 515,
      text: "",
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
    border: 2px solid orangered;
    background: transparent;
  }
</style>
