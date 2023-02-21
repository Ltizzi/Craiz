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
      class="container fixed z-50 mt-32 flex w-2/5 flex-col rounded-md border-2 bg-white px-5 shadow-xl"
    >
      <h1 class="mt-2 text-center text-4xl font-bold text-slate-600">
        Create meme
      </h1>

      <form @submit.prevent="generateMeme">
        <div class="container flex h-auto bg-gray-100 p-5">
          <div
            class="container relative mx-auto flex h-auto w-auto flex-col items-center justify-center overflow-hidden"
          >
            <input
              type="text"
              class="draggable"
              ref="topInput"
              :style="{ top: topTextTop + 'px', left: topTextLeft + 'px' }"
              :placeholder="topText"
              v-model="topText"
            />

            <input
              type="text"
              class="draggable mx-auto"
              ref="bottomInput"
              v-model="bottomText"
              :style="{
                top: bottomTextTop + 'px',
                left: bottomTextLeft + 'px',
              }"
              :placeholder="bottomText"
            />

            <input
              type="text"
              class="draggable"
              ref="textField"
              v-model="textField.text"
              @keydown.delete="deleteTextField(textField.id)"
              v-for="textField in textFields"
              :key="textField.id"
              :style="{
                top: textField.top + 'px',
                left: textField.left + 'px',
              }"
              :placeholder="textField.text"
            />
            <img
              :src="memeUrl"
              v-if="memeUrl"
              ref="memeImage"
              class="h-96 max-h-fit w-96 object-contain"
            />
            <div class="h-96 w-96 bg-gray-300" v-else></div>
          </div>
        </div>

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
  import { ref, nextTick, onMounted, PropType, reactive } from "vue";
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

  const topInput = ref(null);
  const bottomInput = ref(null);
  const topText = ref("Top text");
  const bottomText = ref("Bottom text");
  const memeUrl = ref();
  // const textFields = reactive([]);
  let textFields = reactive<TextField[]>([]);
  const textFieldsCount = ref(0);
  const topTextTop = ref(15);
  const topTextLeft = ref(70);
  const bottomTextTop = ref(300);
  const bottomTextLeft = ref(70);

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
      top: 160,
      left: 70,
      text: "Placeholder",
    };
    textFields.push(txtField);

    nextTick(() => {
      makeTextFieldsDraggable();
    });
  }

  function deleteTextField(id: number) {
    textFields = textFields.filter((field: TextField) => field.id != id);
  }

  async function generateMeme() {
    const fields = textFields.map((field: TextField) => {
      //const element = ref(["textField" + field.id]);
      //console.log(element);
      //const element = document.getElementById("textField" + field.id);

      return {
        top: field.top,
        left: field.left,
        text: field.text,
      };
    });

    const memeData = {
      image: memeUrl.value,
      fields: JSON.stringify(fields),
      topText: {
        text: topText.value,
        top: parseFloat(topInput.value.dataset.y || topTextTop.value),
        left: parseFloat(topInput.value.dataset.x || topTextLeft.value),
      },
      bottomText: {
        text: bottomText.value,
        top: parseFloat(bottomInput.value.dataset.y || bottomTextTop.value),
        left: parseFloat(bottomInput.value.dataset.x || bottomTextLeft.value),
      },
    };

    console.log(memeData);
    // const response = await axios.post("", formData);

    // memeUrl.value = response.data.url;

    // await axios.post("", {
    //   url: response.data.url,
    // });
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
    border: 3px dotted gray;
    background: transparent;
    width: 15rem;
  }

  .draggable:focus {
    border: 2x solid black;
  }

  ::placeholder {
    color: white;
  }
</style>
