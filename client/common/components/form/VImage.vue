<template>
  <div class="field">
    <div class="image-container">
      <label class="label">{{ label }}</label>
      <img
        v-if="placeholder"
        :src="placeholder"
        :width="imageWidth"
        :height="imageHeight"
        class="placeholder-image"/>
      <croppa
        v-if="!placeholder"
        @file-choose="onImageReady"
        @file-size-exceed="onImageSizeExceeded"
        v-model="imageCropper"
        :width="imageWidth"
        :height="imageHeight"
        :replace-drop="true"
        :prevent-white-space="true"
        :show-remove-button="false"
        :file-size-limit="sizeLimitInBytes"
        :accept="imageInputType"
        data-vv-delay="1000">
        <div
          v-if="hasImage"
          class="zoom-controls">
          <button
            type="button"
            @click="imageCropper.zoom(true, 5)"
            class="zoom">
            <span
              class="icon is-medium mdi mdi-36px mdi-magnify-plus-outline">
            </span>
          </button>       
          <button
            type="button"
            @click="imageCropper.zoom(false, 5)"
            class="zoom">
            <span
              class="icon is-medium mdi mdi-36px mdi-magnify-minus-outline">
            </span>
            </button>
        </div>
      </croppa>
    </div>
    <p v-visible="showError" class="help is-danger">
      {{ vErrors.first(name) || '&nbsp;' }}
    </p>
  </div>
</template>

<script>
import humanize from 'humanize-string';
import humanFormat from 'human-format';

const imageDimension = {
  type: Number,
  default: 200,
  validator: value => value && value <= 500
};

export default {
  name: 'v-image',
  props: {
    name: { type: String, required: true },
    sizeLimit: { type: String, validator: value => humanFormat.parse(value) },
    fileInputTypes: { type: Array, default: () => ['image/jpeg', 'image/png'] },
    fileOutputType: { type: String, default: 'image/jpeg' },
    imageWidth: imageDimension,
    imageHeight: imageDimension,
    placeholder: { type: String, default: '' }
  },
  data() {
    return { imageCropper: {} };
  },
  computed: {
    hasImage() {
      return this.imageCropper.imageSet;
    },
    imageInputType() {
      return this.fileInputTypes.join();
    },
    sizeLimitInBytes() {
      return humanFormat.parse(this.sizeLimit);
    },
    label() {
      return humanize(this.name);
    },
    showError() {
      return this.vErrors.has(this.name);
    }
  },
  methods: {
    toBlob() {
      return new Promise((resolve, reject) => {
        if (!this.imageCropper.imageSet) resolve(null);
        this.imageCropper.getCanvas().toBlob(
          blob => resolve(blob),
          this.fileOutputType,
          0.8
        );
      });
    },
    openFileSelectionWindow() {
      this.imageCropper.chooseFile(); // TODO: The file chooser never opens; fix
    },
    onImageSizeExceeded() {
      this.vErrors.add({
        field: this.name,
        msg: `The image is too large. Maximum image size: ${this.sizeLimit}`
      });
    },
    onImageReady() { this.$emit('imageReady'); }
  },
  inject: ['$validator']
};
</script>

<style lang="scss" scoped>
.image-container {
  display: inline-grid;

  .label {
    text-align: left;
  }
}

.croppa-container, .placeholder-image {
  box-sizing: content-box;
  border: 2px solid #aaa;
}

.field {
  text-align: center;
}

.zoom {
  display: block;
  color: #222;
  text-shadow: 1px 1px 10px #fff, 2px 2px 10px #fff, -1px -1px 10px #fff;
  background: transparent;
  border: none;
  cursor: pointer;

  &-controls {
    display: table;
    position: absolute;
    right: 1px;
    bottom: 1px;
    flex-direction: column;
  }
}
</style>
