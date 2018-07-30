<template>
  <div class="field">
    <label class="label">{{ label }}</label>
    <croppa
      @file-size-exceed="onImageSizeExceeded"
      @file-choose="onNewFileChosen"
      v-model="imageCropper"
      :width="200"
      :height="200"
      :replace-drop="true"
      :prevent-white-space="true"
      :show-remove-button="false"
      :initial-image="imageData.oldImage"
      :file-size-limit="sizeLimitInBytes"
      accept="image/jpeg,image/png"
      data-vv-delay="1000">
    <span
      @click="removeImage()"
      v-if="imageCropper.imageSet"
      class="image-remove icon is-medium mdi mdi-24px mdi-close"/>
    <span
      @click="imageCropper.zoom(true, 5)"
      v-if="imageCropper.imageSet"
      class="zoom zoom-in icon is-medium mdi mdi-36px mdi-magnify-plus-outline"/>       
    <span
      @click="imageCropper.zoom(false, 5)"
      v-if="imageCropper.imageSet"
      class="zoom zoom-out icon is-medium mdi mdi-36px mdi-magnify-minus-outline"/>  
    </croppa>
    <p v-visible="showError" class="help is-danger">
      {{ vErrors.first(name) || '&nbsp;' }}
    </p>
  </div>
</template>

<script>
import humanize from 'humanize-string';

export default {
  name: 'v-image',
  model: {
    prop: 'imageData',
    event: 'imageDataChanged'
  },
  props: {
    name: { type: String, required: true },
    sizeLimitKb: { type: Number, default: 0 },
    fileOutputType: { type: String, default: 'image/jpeg' },
    imageData: {}
  },
  data() {
    return {
      imageCropper: {},
      sizeLimitInBytes: this.sizeLimitKb * 1024
    };
  },
  computed: {
    label() {
      return humanize(this.name);
    },
    showError() {
      return this.vErrors.has(this.name);
    }
  },
  methods: {
    hasImage() {
      return this.imageCropper.imageSet;
    },
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
    imageDataChanged() {
      this.$emit('input', this.imageData);
    },
    removeImage() {
      this.imageCropper.remove();
      this.imageData.oldImage = '';
      this.imageData.hasNewImage = false;
    },
    onNewFileChosen() {
      this.imageData.hasNewImage = true;
    },
    onImageSizeExceeded() {
      this.vErrors.add({
        field: this.name,
        msg: `The image is too large. Maximum image size is ${this.sizeLimitKb} kilobytes.`
      });
    }
  },
  inject: ['$validator']
};
</script>

<style lang="scss" scoped>
.croppa-container {
  border: #000 2px solid;
}

.image-remove {
  position: absolute;
  top: -10px;
  right: -10px;
  padding: 5px;
  color: #fff;
  font-weight: bold;
  background: #e96437;
  border-radius: 20px;
  text-align: center;
  cursor: pointer;
}

.zoom {
  position: absolute;
  right: 1px;
  color: #222;
  text-shadow: 1px 1px 10px #fff, 2px 2px 10px #fff, -1px -1px 10px #fff;
  cursor: pointer;

  &-in {
    bottom: 30px;
  }

  &-out {
    bottom: 1px;
  }
}
</style>
